<script>
import { onDestroy, onMount } from 'svelte';
import normalizeString from './util/normalizeString';
import APPEARANCE from './util/appearanceEnum';

import HeaderSettings from './components/HeaderSettings.svelte';
import PostCard from './components/PostCard.svelte';

// Variables
const ENDPOINT = 'https://projects.mravcak.com/mpm-lite-proxy/';
const DARK_MODE_QUERRY = '(prefers-color-scheme: dark)';
const darkModeQuery = window.matchMedia && window.matchMedia(DARK_MODE_QUERRY);
const MAX_POSTS = 100;
let intervalId = null;
let postsRaw = [];
let posts = [];
let hasError = false;

let includeSport = true;
let excludedKeywords;
let excludedKeywordsInput = '';
let appearance = APPEARANCE.SYSTEM;
let systemAppearance = darkModeQuery.matches
	? APPEARANCE.DARK
	: APPEARANCE.LIGHT;

// Listeners
const appearanceChangeHandler = (e) => {
	systemAppearance = e.matches
		? APPEARANCE.DARK
		: APPEARANCE.LIGHT;
};

if (darkModeQuery?.addEventListener) {
    darkModeQuery.addEventListener('change', appearanceChangeHandler);
} else {
	// fallback for legacy browsers
    darkModeQuery.addListener(appearanceChangeHandler);
}

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
$: shouldRenderInDarkMode = appearance === APPEARANCE.DARK
	|| appearance === APPEARANCE.SYSTEM
		&& systemAppearance === APPEARANCE.DARK;
$: document.body.className = shouldRenderInDarkMode ? 'dark' : '';

// Methods
const addPosts = (newPosts) => {
	if (postsRaw.length === 0) {
		postsRaw = newPosts;
		return;
	}

	const existingLastId = postsRaw[0].id;
	const newLastId = newPosts[0].id;

	if (existingLastId !== newLastId) {
		const existingIds = postsRaw.map(post => post.id);
		newPosts.forEach(post => {
			if (!existingIds.includes(post.id)) {
				postsRaw.unshift(post);
			}
		});

		postsRaw.splice(MAX_POSTS);
		postsRaw = [...postsRaw];
	}
}

const fetchData = async () => {
	try {
		const response = await fetch(ENDPOINT);
		const json = await response.json();
		addPosts(json.posts);
		hasError = false;
	} catch (e) {
		hasError = true;
	}
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

<main>
	<HeaderSettings
		bind:includeSport="{includeSport}"
		bind:excludedKeywordsInput="{excludedKeywordsInput}"
		bind:appearance="{appearance}"
	/>
	{#if hasError}
		<p style="text-align: center">
			Chyba pri načítavaní
		</p>
	{/if}
	{#each posts as post}
		<PostCard
			post="{post}"
		/>
	{/each}
</main>

<style lang="scss">
:global(body.dark) {
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
	color: unset;
	border-bottom: 1px solid #bd243d;
}

</style>
