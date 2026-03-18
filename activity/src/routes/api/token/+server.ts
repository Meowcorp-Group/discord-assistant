import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { PUBLIC_DISCORD_CLIENT_ID } from '$env/static/public';
import { DISCORD_CLIENT_SECRET } from '$env/static/private';

export const POST: RequestHandler = async ({ request }) => {
	const body = await request.json();

	const response = await fetch('https://discord.com/api/oauth2/token', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded'
		},
		body: new URLSearchParams({
			client_id: PUBLIC_DISCORD_CLIENT_ID,
			client_secret: DISCORD_CLIENT_SECRET,
			grant_type: 'authorization_code',
			code: body.code
		})
	});

	if (!response.ok) {
		console.log('Failed to exchange code for token', await response.text());
		error(response.status, 'Failed to exchange code for token');
	}

	const data = await response.json();
	return json({
		access_token: data.access_token
	});
};
