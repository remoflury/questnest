<script lang="ts">
	import * as Button from '$lib/components/ui/button/index.js';

	let {
		ref = $bindable(null),
		loading = $bindable(false),
		...restProps
	}: Button.Props & { loading: boolean } = $props();
</script>

<Button.Root bind:ref type="submit" {...restProps} {loading} />
