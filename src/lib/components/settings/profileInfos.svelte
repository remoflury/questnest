<script lang="ts">
	type Props = {
		title: string;
		text: string;
		className?: string;
	};
	let { title, text, className }: Props = $props();
</script>

<p class={className}>
	<strong>{title}</strong><br />
	{text}
</p>
