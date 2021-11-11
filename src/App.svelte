<script>
import { onDestroy, onMount } from 'svelte';
import normalizeString from './util/normalizeString';

import HeaderSettings from './components/HeaderSettings.svelte';
import PostCard from './components/PostCard.svelte';

// Variables
const endpoint = 'https://dennikn.sk/api/v2/mpm/posts';
let intervalId = null;
let postsRaw = [];
let posts = [];

let includeSport = true;
let excludedKeywords;
let excludedKeywordsInput = '';
let userDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

// Listeners
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
	userDarkMode = e.matches;
});

// Reactive statements
$: excludedKeywords = excludedKeywordsInput
	? excludedKeywordsInput.split(',').map(v => normalizeString(v.trim()))
	: null;
$: posts = postsRaw.filter(post => {
	if (!includeSport && post.categories.some(cat => cat.slug === 'sport')) {
		return false;
	}
	if (excludedKeywords) {
		const containsExcludedKeyword = excludedKeywords.some(
			excludedKeyword => normalizeString(post.excerpt).includes(excludedKeyword)
		);
		if (containsExcludedKeyword) {
			return false;
		}
	}
	return true;
})

// Methods
const fetchData = async () => {
	const response = await fetch(endpoint);
	const json = await response.json();
	postsRaw = json.posts;
}

const startFetchData = () => {
	const time = 2 * 60 * 1000;
	fetchData();
	intervalId = setInterval(() => {
		fetchData();
	}, time);
}

// Lifecycle
onMount(() => {
	startFetchData();
});

onDestroy(() => {
	clearInterval(intervalId);
});

</script>

<main class:dark="{userDarkMode}">
	<HeaderSettings
		bind:includeSport="{includeSport}"
		bind:excludedKeywordsInput="{excludedKeywordsInput}"
		bind:userDarkMode="{userDarkMode}"
	/>
	{#each posts as post}
		<PostCard
			post="{post}"
		/>
	{/each}
</main>

<style lang="scss">
main.dark {
	background-color: #111;
	color: #ccc;
}

:global(main.dark .post-card) {
	border-top-color: #444 !important;
}

:global(.post-card .content p) {
	margin: 0;
}

:global(.post-card .content a) {
	color: #bd243d;
}
</style>
