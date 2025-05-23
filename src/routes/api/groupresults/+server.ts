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

	// get all quests id's of questboard
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
			.select('quest, user')
			.in('quest', allQuestIds)
			.neq('user', session.user.id)
			.returns<
				({ quest: number } & { user: Pick<Tables<'user'>, 'id' | 'username' | 'score'> })[]
			>();

	if (questsOtherUsersCompletedErr) {
		console.error({ questsOtherUsersCompletedErr });
		return genApiRes(null, questsOtherUsersCompletedErr.message, 500);
	}

	// select all other users of the questboard
	const { data: questboardOtherUsers, error: questboardOtherUsersErr } = await supabase
		.from('questboard_users')
		.select('user_id, username, score')
		.eq('questboard_id', questboardId)
		.neq('user_id', session.user.id);

	if (questboardOtherUsersErr) {
		console.error({ questboardOtherUsersErr });
		return genApiRes(null, questboardOtherUsersErr.message, 500);
	}
	// Grouping logic
	const groupedByUser = questboardOtherUsers.reduce(
		(acc, userInfo) => {
			const { user_id: id, username, score } = userInfo;

			// 		// Find user information in questboardOtherUsers
			// const totalScore = questsOtherUsersCompletedData.find(
			// 	(u) => u.user.id == id
			// );

			// Initialize the user record
			acc[id] = { id, username, totalScore: score, questIdsCompleted: [] };

			// Find quests completed by this user
			const completedQuests = questsOtherUsersCompletedData
				.filter((questData) => questData.user === id)
				.map((questData) => questData.quest);

			// Add quests to the user's questIdsCompleted array
			acc[id].questIdsCompleted = completedQuests;

			return acc;
		},
		{} as Record<
			string,
			{ id: string; username: string; totalScore: number; questIdsCompleted: number[] }
		>
	);

	// Convert the result to the desired array format
	const result = Object.values(groupedByUser);

	return genApiRes({ allQuestIds, resultsPerUser: result });
};
