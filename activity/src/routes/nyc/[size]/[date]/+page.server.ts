import { NYC_COOKIES, NYC_GAME_BASE_URL } from '$env/static/private';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { mapValue } from '$lib';

export const load: PageServerLoad = async ({ params }) => {
	const { size, date } = params;
	const sizeMap = mapValue(
		{
			small: 'mini',
			medium: 'midi',
			large: 'daily'
		},
		size
	);

	const url = new URL(`${NYC_GAME_BASE_URL}/${sizeMap}/${date}.json`);
	console.log(url.toString());
	const response = await fetch(url, {
		headers: {
			Cookie: NYC_COOKIES
		}
	});

	if (!response.ok) error(500, `Failed to fetch puzzle: ${response.statusText}`);
	const data = await response.json();
	if (!data) error(404, 'Puzzle not found');

	const puzzle = {
		authors: data.constructors as string[],
		editor: undefined as string | undefined,
		date: data.publicationDate as string,
		size: {
			columns: data.body[0].dimensions.width as number,
			rows: data.body[0].dimensions.height as number
		},
	}

	if (data.editor) puzzle.editor = data.editor;

	return {
		puzzle
	};
};
