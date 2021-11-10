<script>
import { parseISO, lightFormat } from 'date-fns';

const formatTime = (val) => {
	const date = parseISO(val);
	return lightFormat(date, 'HH:mm');
}

export let post;

</script>

<div class="post-card">
  <div class="meta">
    <div class="time">{formatTime(post.published_at)}</div>
    <ul class="cats">
      {#each post.categories as category}
        <li>{ category.name }</li>
      {/each}
    </ul>
  </div>
  <div class="content">
    {@html post.excerpt}
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
		font-size: 0.8em;
		font-weight: 700;
		.time {
			margin-right: 10px;
			margin-bottom: 10px;
		}
		.cats {
			display: flex;
      flex-wrap: wrap;
			list-style: none;
			padding-left: 0;
			margin: 0 0 10px;
			color: #ccc;
			li {
				margin-right: 10px;
			}
		}
	}
	.content {
		color: #3a3a3a;
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
