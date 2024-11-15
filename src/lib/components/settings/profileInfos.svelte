<script lang="ts">
	import * as Avatar from '$lib/components/ui/avatar';
	import { page } from '$app/stores';
	import { getPublicSbUrl } from '$lib/utils/fileUtils';

	type Props = {
		title: string;
		text: string;
		className?: string;
		avatarUrl?: string | null;
	};
	let { title, text, className, avatarUrl }: Props = $props();
</script>

<div class={className} class:avatar={avatarUrl}>
	<p>
		<strong>{title}</strong><br />
		{text}
	</p>

	{#if avatarUrl}
		<Avatar.Root class="border border-secondary">
			<Avatar.Image
				src={getPublicSbUrl($page.data.supabase, 'avatar', avatarUrl, { width: 100, height: 100 })}
				alt="@shadcn"
			/>
			<Avatar.Fallback>{text.slice(0, 2).toUpperCase()}</Avatar.Fallback>
		</Avatar.Root>
	{/if}
</div>

<style lang="postcss">
	.avatar {
		@apply flex items-start justify-between gap-x-4;
	}
</style>
