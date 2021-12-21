<script>
import { onDestroy, onMount } from 'svelte';
import { parseISO, lightFormat } from 'date-fns';

const formatTime = (val) => {
	const date = parseISO(val);
	return lightFormat(date, 'HH:mm');
}

export let post;
let content;

$: categories = post.categories.filter(v => v.slug !== 'hlavna');

const setNoreferrerLinks = () => {
	const contentLinks = content.querySelectorAll('a');
	contentLinks.forEach(
		anchor => anchor.setAttribute( 'rel', 'noreferrer noopener'),
	);
};

onMount(() => {
	setNoreferrerLinks();
});

</script>

<div class="post-card">
	<div class="meta">
		<div class="time">{formatTime(post.published_at)}</div>
		<ul class="cats">
			{#each categories as category}
				<li class="cat {category.slug}">{category.name}</li>
			{/each}
		</ul>
	</div>
	<div class="body">
		<div class="content" bind:this={content}>
			{@html post.excerpt}
		</div>
		{#if post.tags.length}
			<ul class="tags">
				{#each post.tags as tag}
					<li>
						<a href="{tag.url}" rel="noreferrer noopener">
							{tag.name}
						</a>
					</li>
				{/each}
			</ul>
		{/if}
	</div>
</div>

<style lang="scss">
.post-card {
	font-size: 16px;
	padding: 1em;
	border-top: 1px dashed #eaeaea;
	.meta {
		display: flex;
		flex: 0 0 140px;
		font-family: sans-serif;
		font-weight: 700;
		.time {
			margin-right: 10px;
			margin-bottom: 10px;
			font-size: 0.8em;
		}
		.cats {
			font-size: 0.7em;
			display: flex;
			flex-wrap: wrap;
			list-style: none;
			padding-left: 0;
			margin: 0 0 10px;
			color: #ccc;
			.cat {
				margin-right: 10px;
			}
			.cat.slovensko {
				color: #298dbd;
			}
			.cat.ekonomika {
				color: #6f4d80;
			}
			.cat.svet {
				color: #c46f0d;
			}
			.cat.sport {
				color: #00a349;
			}
			.cat.kultura {
				color: #07618d;
			}
			.cat.veda {
				color: #e91d96;
			}
		}
	}
	.tags {
		display: flex;
		flex-wrap: wrap;
		list-style: none;
		padding-left: 0;
		margin: 0.5em 0 0 0;
		li {
			margin-right: 0.5em;
		}
		li a {
			display: block;
			font-family: sans-serif;
			font-size: 0.5em;
			padding: 0.2em 0.4em 0;
			border: 1px solid currentColor;
			text-transform: uppercase;
			color: currentColor;
			opacity: 0.5;
		}
}
	@media screen and (min-width: 768px) {
		display: flex;
		font-size: 20px;
		.meta {
			flex: 0 0 140px;
			display: block;
			.cats {
				display: block;
			}
		}
	}
}
</style>
