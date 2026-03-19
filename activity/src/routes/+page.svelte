<script lang="ts">
	import { resolve } from '$app/paths';
	import GridIcon from '$lib/components/GridIcon.svelte';

	let { data } = $props();
</script>

<div class="flex flex-col gap-4">
	<h1 class="text-4xl font-bold">Games</h1>

	<section>
		<h2 class="text-2xl font-bold">Originals</h2>
		<p>Meowcorp original games.</p>
		<div class="mt-2 card flex w-56 flex-col gap-2 border bg-base-200 p-4 shadow-lg">
			<h3 class="text-center text-xl font-bold">Coming Soon</h3>
		</div>
	</section>

	<section>
		<h2 class="text-2xl font-bold">Web Games</h2>
		<p>Popular web games adapted for Discord.</p>
		<div class="mt-2 card flex w-56 flex-col gap-2 border bg-base-200 p-4 shadow-lg">
			<h3 class="text-center text-xl font-bold">Coming Soon</h3>
		</div>
	</section>

	<section>
		<h2 class="text-2xl font-bold">New York City</h2>
		<p>Daily puzzles, served fresh from New York City.</p>

		<ul class="mt-2 flex flex-wrap gap-2">
			<li>
				<div class="card flex w-56 flex-col gap-2 border bg-base-200 p-4 shadow-lg">
					<figure class="px-4">
						<GridIcon columns={15} rows={15} />
					</figure>
					<h3 class="text-center text-xl font-bold">Daily Crossword</h3>
					<a href={resolve('/nyc/large')} class="btn btn-primary">Play</a>
					<a href={resolve('/nyc/large')} class="btn btn-outline">Archives</a>
				</div>
			</li>
			<li>
				<div class="card flex w-56 flex-col gap-2 border bg-base-200 p-4 shadow-lg">
					<figure class="px-4">
						<GridIcon columns={9} rows={9} />
					</figure>
					<h3 class="text-center text-xl font-bold">The Midi</h3>
					<a href={resolve('/nyc/medium')} class="btn btn-primary">Play</a>
					<a href={resolve('/nyc/medium')} class="btn btn-outline">Archives</a>
				</div>
			</li>
			<li>
				<div class="card flex w-56 flex-col gap-2 border bg-base-200 p-4 shadow-lg">
					<figure class="px-4">
						<GridIcon columns={5} rows={5} />
					</figure>
					<h3 class="text-center text-xl font-bold">The Mini</h3>
					<a href={resolve('/nyc/small')} class="btn btn-primary">Play</a>
					<a href={resolve('/nyc/small')} class="btn btn-outline">Archives</a>
				</div>
			</li>
		</ul>
	</section>

	<section>
		<h2 class="text-2xl font-bold">Jakarta</h2>
		<p>Teka teki harian dari Jakarta.</p>
		<ul class="mt-2 flex flex-wrap gap-2">
			<li>
				<div class="card flex w-56 flex-col gap-2 border bg-base-200 p-4 shadow-lg">
					<figure class="px-4">
						<GridIcon columns={10} rows={10} />
					</figure>
					<h3 class="text-center text-xl font-bold">TTS Sedang</h3>
					<button disabled class="btn btn-primary">Coming Soon</button>
				</div>
			</li>
			<li>
				<div class="card flex w-56 flex-col gap-2 border bg-base-200 p-4 shadow-lg">
					<figure class="px-4">
						<GridIcon columns={5} rows={5} />
					</figure>
					<h3 class="text-center text-xl font-bold">TTS Kecil</h3>
					<button disabled class="btn btn-primary">Coming Soon</button>
				</div>
			</li>
		</ul>
	</section>
</div>
