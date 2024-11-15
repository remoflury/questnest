import type { Tables } from '$lib/types/SupabaseTypes';
import { genApiRes } from '$lib/utils/utils';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ locals: { safeGetSession, supabase }, url }) => {
	const { session } = await safeGetSession();
	if (!session) {
		return genApiRes(undefined, undefined, 401);
	}

	const questboardId = url.searchParams.get('questboard-id');

	if (!questboardId) {
		return genApiRes(null, 'Invalid params.', 403);
	}

	// get all quests id's of group
	const { data: allQuests, error: allQuestsErr } = await supabase
		.from('quest')
		.select('id')
		.eq('questboard', questboardId);

	if (allQuestsErr) {
		console.error({ allQuests });
		return genApiRes(null, allQuestsErr.message, 500);
	}

	const allQuestIds = allQuests.flatMap((q) => {
		return q.id;
	});

	// get completed quests of all users in current group, except current user
	const { data: questsOtherUsersCompletedData, error: questsOtherUsersCompletedErr } =
		await supabase
			.from('quest_done')
			.select('quest, user(id, username, score)')
			.in('quest', allQuestIds)
			.neq('user', session.user.id)
			.returns<({ quest: number } & { user: Pick<Tables<'user'>, 'id' | 'username' | 'score'> })[]>();

	if (questsOtherUsersCompletedErr) {
		console.error({ questsOtherUsersCompletedErr });
		return genApiRes(null, questsOtherUsersCompletedErr.message, 500);
	}

	// Grouping logic
	const groupedByUser = questsOtherUsersCompletedData.reduce(
		(acc, item) => {
			const { id, username, score } = item.user;
			const { quest } = item;

			// Check if the user already exists in the accumulator
			if (!acc[id]) {
				acc[id] = { id, username, score, questIdsCompleted: [] };
			}
			if (quest !== null && quest !== undefined) {
				acc[id].questIdsCompleted.push(quest);
			}

			return acc;
		},
		{} as Record<string, { id: string; username: string; score: number; questIdsCompleted: number[] }>
	);

	// Convert the result to the desired array format
	const result = Object.values(groupedByUser);

	return genApiRes({ allQuestIds, resultsPerUser: result });
};
