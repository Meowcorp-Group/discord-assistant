<script lang="ts">
	import { resolve } from '$app/paths';
	import GridIcon from '$lib/components/GridIcon.svelte';

	let { data, params } = $props();
</script>

<ul class="mt-2 flex flex-wrap gap-2">
	{#each data.puzzles as puzzle}
		<li>
			<div class="card flex h-full w-56 flex-col gap-2 border bg-base-200 p-4 shadow-lg justify-between">
				<div>
					<figure class="px-4 pb-2">
						<GridIcon columns={data.size} rows={data.size} />
					</figure>
					<div class="text-center">
						<h2 class="text-xl font-bold">{puzzle.print_date}</h2>
						<p>by {puzzle.byline}</p>
						{#if puzzle.editor}
							<p>edited by {puzzle.editor}</p>
						{/if}
					</div>
				</div>
				<a
					href={resolve('/nyc/[size]/[date]', { size: params.size, date: puzzle.print_date })}
					class="btn btn-primary">Play</a
				>
			</div>
		</li>
	{/each}
</ul>
