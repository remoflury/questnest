import { QUESTS_PER_BOARD } from '$lib/utils/constants';
import { z } from 'zod';

const emailSchema = z
	.string({ required_error: 'Email is required.' })
	.email({ message: 'Invalid Email format.' })
	.trim();

const passwordSchema = z
	.string({ required_error: 'Password is required.' })
	.min(6, { message: 'Password must contain at least 6 characters.' });

const passwordConfirmSchema = z
	.string({ required_error: 'Password confirm is required.' })
	.min(6, { message: 'Password confirm must contain at least 6 characters.' });

const groupIdSchema = z.number({ required_error: 'A Group ID is required' }).int().positive();

const usernameSchema = z
	.string({ required_error: 'Username is required.' })
	.min(2, { message: 'Username must consist of at least two characters.' })
	.max(50, { message: 'Username can not contain more than 50 characters.' })
	.trim();

export const signupSchema = z
	.object({
		email: emailSchema,
		username: usernameSchema,
		password: passwordSchema,
		passwordConfirm: passwordConfirmSchema
	})
	.superRefine((data, context) => {
		if (data.password !== data.passwordConfirm) {
			context.addIssue({
				code: z.ZodIssueCode.custom,
				message: 'Passwords do not match.',
				path: ['password']
			});
			context.addIssue({
				code: z.ZodIssueCode.custom,
				message: 'Passwords do not match.',
				path: ['passwordConfirm']
			});
		}
	});

export type SignupSchema = typeof signupSchema;

export const signinSchema = z.object({
	email: emailSchema,
	password: passwordSchema
});

export type SigninSchema = typeof signinSchema;

export const addGroupSchema = z.object({
	name: z
		.string({ required_error: 'A group name is required' })
		.min(2, { message: 'Group name must contain at least 2 characters.' })
		.max(30, { message: 'Group name can not contain more than 30 characters.' })
		.trim()
});

export type AddGroupSchema = typeof addGroupSchema;

export const addUserToGroupSchema = z.object({
	group: z.number({ required_error: 'A Group ID is required' }).int().positive(),
	user: z.string({ required_error: 'A user is required' }).uuid()
});
export type AddUserToGroupSchema = typeof addUserToGroupSchema;

export const removeUserFromGroupSchema = z.object({
	group: groupIdSchema,
	user: z.string({ required_error: 'A user is required' }).uuid()
});

export type RemoveUserFromGroupSchema = typeof removeUserFromGroupSchema;

export const addQuestboardSchema = z.object({
	name: z
		.string({ required_error: 'A name is required' })
		.min(2, { message: 'Name must contain at least 2 characters.' })
		.max(30, { message: 'Name can not contain more than 30 characters.' })
		.trim(),
	description: z
		.string()
		.min(5, { message: 'Description must contain at least 5 characters.' })
		.max(100, { message: 'Description can not contain more than 100 characters.' })
		.trim()
		.optional(),
	group: z
		.string({ required_error: 'A Group is required' })
		.min(1, { message: 'A Group is required' })
		.trim()
});

export type AddQuestboardSchema = typeof addQuestboardSchema;

export const createQuestsSchema = z.object({
	questboard: z.number({ required_error: 'Questboard ID is required' }).int().positive(),
	quests: z
		.object({
			id: z.number({ required_error: 'ID is required' }).int().positive().optional(),
			text: z
				.string({ required_error: 'Text is required.' })
				.min(2, { message: 'Text must contain at least 2 characters.' })
				.max(50, { message: 'Text can not contain more than 50 characters.' })
				.trim()
		})
		.array()
		.min(QUESTS_PER_BOARD, { message: `Must have ${QUESTS_PER_BOARD} quests.` })
});

export type CreateQuestsSchema = typeof createQuestsSchema;

export const toggleQuestSchema = z.object({
	id: z.number({ required_error: 'ID is required' }).int().positive()
});

export type ToggleQuestSchema = typeof toggleQuestSchema;

export const editProfileSchema = z.object({
	email: emailSchema,
	username: usernameSchema
});

export type EditProfileSchema = typeof editProfileSchema;

export const changePwSchema = z
	.object({
		currentPassword: passwordSchema,
		newPassword: passwordSchema,
		newPasswordConfirm: passwordSchema
	})
	.superRefine((data, context) => {
		if (data.newPassword !== data.newPasswordConfirm) {
			context.addIssue({
				code: z.ZodIssueCode.custom,
				message: 'Passwords do not match.',
				path: ['newPassword']
			});
			context.addIssue({
				code: z.ZodIssueCode.custom,
				message: 'Passwords do not match.',
				path: ['newPasswordConfirm']
			});
		}
		if (
			data.currentPassword == data.newPassword ||
			data.currentPassword == data.newPasswordConfirm
		) {
			context.addIssue({
				code: z.ZodIssueCode.custom,
				message: "New Password can't be equal to current password.",
				path: ['newPassword']
			});
			context.addIssue({
				code: z.ZodIssueCode.custom,
				message: "New Password can't be equal to current password.",
				path: ['newPasswordConfirm']
			});
		}
	});

export type ChangePwSchema = typeof changePwSchema;
