<script>
export let includeSport;
export let excludedKeywordsInput;
</script>

<header class="header-settings">
  <div class="field">
    <input id="includeSport" type="checkbox" bind:checked="{includeSport}">
    <label for="includeSport">Zobraz šport</label>
  </div>
  <div class="field">
    <label for="excludedKeywords">Vynechaj (oddeľ čiarkou):</label>
    <input id="excludedKeywords" type="text" bind:value="{excludedKeywordsInput}">
  </div>
</header>

<style lang="scss">
.header-settings {
	padding: 1em;
	.field {
		display: flex;
		align-items: center;
		margin-bottom: 1em;
		label {
			margin-right: 0.5em;
		}
		input {
			margin-bottom: 0;
			margin-right: 0.5em;
		}
	}
	@media screen and (min-width: 768px) {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		.field {
			margin-bottom: 0;
			margin-right: 2em;
		}
	}
}
</style>
