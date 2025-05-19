import {
	ACCEPTED_IMAGE_TYPES,
	MAX_IMG_FILE_SIZE_IN_BYTES,
	QUESTS_PER_BOARD
} from '$lib/utils/constants';
import { z } from 'zod';

export const imageSchema = z.object({
	type: z.enum(ACCEPTED_IMAGE_TYPES, {
		message: `Only these image types are accepted: ${ACCEPTED_IMAGE_TYPES.join(', ').replaceAll('image/', '')}`
	}),
	name: z.string().min(1, { message: 'A file is required.' }),
	fileBase64: z.string().refine(
		(base64) => {
			const base64WithoutPrefix = base64.split(',')[1] || base64;
			const sizeInBytes = (base64WithoutPrefix.replace(/=+$/, '').length * 3) / 4;
			// const sizeInBytes = Buffer.from(base64WithoutPrefix, 'base64').length;
			return sizeInBytes < MAX_IMG_FILE_SIZE_IN_BYTES; // Ensuring the size is less than xMB
		},
		`File can't exceed a size of ${MAX_IMG_FILE_SIZE_IN_BYTES / 1024 / 1024} MB.`
	)
});

export const emailSchema = z
	.string({ required_error: 'Email is required.' })
	.email({ message: 'Invalid Email format.' })
	.trim();

export const passwordSchema = z
	.string({ required_error: 'Password is required.' })
	.min(6, { message: 'Password must contain at least 6 characters.' });

export const passwordConfirmSchema = z
	.string({ required_error: 'Password confirm is required.' })
	.min(6, { message: 'Password confirm must contain at least 6 characters.' });

export const groupIdSchema = z
	.number({ required_error: 'A Group ID is required' })
	.int()
	.positive();

export const usernameSchema = z
	.string({ required_error: 'Username is required.' })
	.min(2, { message: 'Username must consist of at least two characters.' })
	.max(50, { message: 'Username can not contain more than 50 characters.' })
	.trim();

export const questboardNameSchema = z
	.string({ required_error: 'A name is required' })
	.min(2, { message: 'Name must contain at least 2 characters.' })
	.max(30, { message: 'Name can not contain more than 30 characters.' })
	.trim();

export const questboardDescriptionSchema = z
	.string()
	.min(5, { message: 'Description must contain at least 5 characters.' })
	.max(100, { message: 'Description can not contain more than 100 characters.' })
	.trim()
	.optional();

export const questsSchema = z
	.object({
		id: z.number({ required_error: 'ID is required' }).int().positive().optional(),
		text: z
			.string({ required_error: 'Text is required.' })
			.min(2, { message: 'Text must contain at least 2 characters.' })
			.max(50, { message: 'Text can not contain more than 50 characters.' })
			.trim()
	})
	.array()
	.min(QUESTS_PER_BOARD, { message: `Must have ${QUESTS_PER_BOARD} quests.` });
