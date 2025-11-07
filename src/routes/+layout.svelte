<script lang="ts">
	import '../app.css';

	import { jwtToken } from '$lib/functions/AuthStore';
	import { afterNavigate } from '$app/navigation';

	let { children } = $props();

	if (import.meta.env.BROWSER) {
		jwtToken.syncFromUrl();
	}

	afterNavigate (() => {
		jwtToken.syncFromUrl();
	});

	export const prerender = true;
</script>

{@render children()}
