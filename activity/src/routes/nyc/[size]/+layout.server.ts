import type { LayoutServerLoad } from './$types';
import { NYC_LIST_BASE_URL } from '$env/static/private';
import { error } from '@sveltejs/kit';
import { getDaysAgoDate, mapValue } from '$lib';

export const load: LayoutServerLoad = async ({ params }) => {
	const { size } = params;
	const sizeMap = mapValue(
		{
			small: 'mini',
			medium: 'midi',
			large: 'daily'
		},
		size
	);
	const start = getDaysAgoDate('America/New_York', 1);
	const end = getDaysAgoDate('America/New_York', 0);
	const url = new URL(`${NYC_LIST_BASE_URL}${sizeMap}/${start}/${end}`);
	console.log(url.toString());

	const response = await fetch(url);

	if (!response.ok)
		error(response.status, 'Failed to fetch the latest ' + size + ' crossword puzzle');
	const data = await response.json();
	if (!data) error(404, 'No puzzles found');
	// console.log('Fetched latest ' + size + ' crossword puzzle:', data);

	data.reverse();

	const sizeNumberMap = mapValue(
		{
			small: 5,
			medium: 9,
			large: 15
		},
		size
	);

	return {
		puzzles: data,
		size: sizeNumberMap
	};
};
