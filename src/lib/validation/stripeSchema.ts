import { z } from 'zod';

export const selectPricingPlanSchema = z.object({
	id: z.number({ required_error: 'Id is required' }).int().positive()
});

export type SelectPricingPlanSchema = typeof selectPricingPlanSchema;
