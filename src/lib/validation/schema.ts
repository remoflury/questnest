import { z } from 'zod';

const emailSchema = z
	.string({ required_error: 'Email is required.' })
	.email({ message: 'Invalid Email format.' })
	.trim()

const passwordSchema = z
.string({ required_error: 'Password is required.' })
.min(6, { message: 'Password must contain at least 6 characters.' })

export const signupSchema = z
	.object({
		email: emailSchema,
		username: z
			.string({ required_error: 'Username is required.' })
			.min(2, { message: 'Username must consist of at least two characters.' })
			.max(50, { message: 'Username can not contain more than 50 characters.' })
			.trim(),
		password: passwordSchema,
		passwordConfirm: z
			.string({ required_error: 'Password confirm is required.' })
			.min(6, { message: 'Password confirm must contain at least 6 characters.' })
	})
	.superRefine((data, context) => {
		if (data.password !== data.passwordConfirm) {
			context.addIssue({
				code: z.ZodIssueCode.custom,
				message: 'Passwords do not match.',
				path: ['password'] // Error related to password field
			});
			context.addIssue({
				code: z.ZodIssueCode.custom,
				message: 'Passwords do not match.',
				path: ['passwordConfirm'] // Error related to confirmPassword field
			});
		}
	});

export type SignupSchema = typeof signupSchema;

export const signinSchema = z.object({
	email: emailSchema,
	password: passwordSchema
})

export type SigninSchema = typeof signinSchema

// const groupUsersSchema = z.object({
// 	user: z
// 		.string({ required_error: "A user is required"})
// 		.uuid()
// })

export const addGroupSchema = z.object({
	name: z
		.string({ required_error: "A group name is required"})
		.min(2, { message: 'Group name must contain at least 2 characters.' })
		.max(30, { message: 'Group name can not contain more than 30 characters.' })
		.trim(),
	// users: z
	// 	.array(groupUsersSchema)
	// 	.min(1)
})

export type AddGroupSchema = typeof addGroupSchema
