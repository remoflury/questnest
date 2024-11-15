<script lang="ts">
	import * as Avatar from '$lib/components/ui/avatar';
	import { getPublicSbUrl } from '$lib/utils/fileUtils';
	import { cn } from '$lib/utils/utils';

	type Props = {
		title: string;
		text: string;
		className?: string;
		avatarUrl?: string | null;
		showAvatar?: boolean;
	};
	let { title, text, className, avatarUrl, showAvatar = false }: Props = $props();
</script>

<div class={cn('flex items-start justify-between gap-x-4', className)}>
	<p>
		<strong>{title}</strong><br />
		{text}
	</p>
	{#key avatarUrl}
		{#if showAvatar}
			<Avatar.Root class="border border-secondary">
				{#if avatarUrl}
					<Avatar.Image
						class="object-cover"
						src={getPublicSbUrl('avatar', avatarUrl, { height: 100, width: 100 })}
						alt="Profile picture of {text}"
					/>
				{/if}
				<Avatar.Fallback>{text.slice(0, 2).toUpperCase()}</Avatar.Fallback>
			</Avatar.Root>
		{/if}
	{/key}
</div>
