<script lang="ts">
	import { AlertDialog as AlertDialogPrimitive } from 'bits-ui';
	import { buttonVariants, type ButtonVariant } from '$lib/components/ui/button/index.js';
	import { cn } from '$lib/utils/utils.js';

	let {
		ref = $bindable(null),
		class: className,
		variant = 'default',
		...restProps
	}: AlertDialogPrimitive.CancelProps & { variant?: ButtonVariant } = $props();
</script>

<AlertDialogPrimitive.Cancel
	bind:ref
	class={cn(buttonVariants({ variant }), 'mt-2 sm:mt-0', className)}
	{...restProps}
/>
