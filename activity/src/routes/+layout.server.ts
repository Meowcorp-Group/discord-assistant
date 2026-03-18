import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async () => {
	console.log('visit', new Date().toISOString());

	return {

	}
}