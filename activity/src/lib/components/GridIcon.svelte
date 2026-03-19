<script lang="ts">
	let { columns, rows }: { columns: number; rows: number } = $props();

	// svelte-ignore state_referenced_locally
	const cells = Array.from({ length: columns * rows }, () => Math.random() < 0.2);
</script>

<div class="grid w-full aspect-square" style={`grid-template-columns: repeat(${columns}, 1fr);`}>
	{#each cells as active}
		<div class="border" class:bg-base-content={active}></div>
	{/each}
</div>