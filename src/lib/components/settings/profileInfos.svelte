<script lang="ts">
	import * as Avatar from '$lib/components/ui/avatar';
	import { getPublicSbUrl } from '$lib/utils/fileUtils';
	import { cn } from '$lib/utils/utils';
	import type { HTMLAttributes } from 'svelte/elements';

	type Props = HTMLAttributes<HTMLDivElement> & {
		title: string;
		className?: string;
		avatarUrl?: string | null;
		showAvatar?: boolean;
	};
	let { title, className, avatarUrl, showAvatar = false, children }: Props = $props();
</script>

<div class={cn('flex items-start justify-between gap-x-4', className)}>
	<div>
		<p class="font-bold">{title}</p>
		{@render children?.()}
	</div>
	{#key avatarUrl}
		{#if showAvatar}
			<Avatar.Root class="border border-secondary">
				{#if avatarUrl}
					<Avatar.Image
						class="object-cover"
						src={getPublicSbUrl('avatar', avatarUrl, { height: 100, width: 100 })}
						alt="Profile picture of"
					/>
				{/if}
				<!-- <Avatar.Fallback>{text.slice(0, 2).toUpperCase()}</Avatar.Fallback> -->
				<Avatar.Fallback>QN</Avatar.Fallback>
			</Avatar.Root>
		{/if}
	{/key}
</div>
