<script lang="ts">
	import {
		selectPricingPlanSchema,
		type SelectPricingPlanSchema
	} from '$lib/validation/stripeSchema';
	import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { toast } from 'svelte-sonner';
	import * as Form from '$lib/components/ui/form/index.js';

	type Props = {
		data: SuperValidated<Infer<SelectPricingPlanSchema>>;
		action: string;
		planId: number;
	};

	let { data, action, planId }: Props = $props();

	let form = superForm(data, {
		// validators: zodClient(selectPricingPlanSchema),
		id: crypto.randomUUID(),
		onSubmit: ({ formData }) => {
			formData.set('id', planId.toString());
		},
		onUpdate: async ({ result }) => {
			if (result.type == 'failure') return toast.error(result.data.form.message);
			toast.success(result.data.form.message);
		}
	});

	let { enhance, delayed } = form;
</script>

<form method="POST" use:enhance {action}>
	<Form.Button loading={$delayed} disabled={$delayed} aria-label="Purchase plan">
		Select Plan
	</Form.Button>
</form>
