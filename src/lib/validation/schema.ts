import { z } from "zod";
 
export const signupSchema = z.object({
email: z
  .string({ required_error: "Email is required." })
  .email({ message: "Invalid Email format."})
  .trim(),
username: z
  .string({ required_error: "Username is required."})
  .min(2, { message: "Username must consist of at least two characters."})
  .max(50, { message: "Username can not contain more than 50 characters."})
  .trim(),
password: z
  .string({ required_error: 'Password is required.' })
  .min(6, { message: 'Password must contain at least 6 characters.' }),
passwordConfirm: z
  .string({ required_error: 'Password confirm is required.' })
  .min(6, { message: 'Password confirm must contain at least 6 characters.' }),

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