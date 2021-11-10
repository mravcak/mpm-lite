<script>
import { onDestroy, onMount } from 'svelte';

import PostCard from './components/PostCard.svelte';

const endpoint = 'https://dennikn.sk/api/v2/mpm/posts';
let intervalId = null;
let posts = [];

const fetchData = async () => {
	const response = await fetch(endpoint);
	const json = await response.json();
	posts = json.posts;
}

const startFetchData = () => {
	const time = 2 * 60 * 1000;
	fetchData();
	intervalId = setInterval(() => {
		fetchData();
	}, time);
}

onMount(() => {
	startFetchData();
});

onDestroy(() => {
	clearInterval(intervalId);
})

</script>

<main>
	{#each posts as post}
		<PostCard
		post="{post}"
		/>
	{/each}
</main>

<style lang="scss">
:global(.post-card .content p) {
	margin: 0;
}

:global(.post-card .content a) {
	color: #bd243d;
}
</style>
