<script>
	import "./global.css";
	import Canvas from "./components/canvas/Canvas.svelte";
	import AnimatedText from "./components/animatedText/AnimatedText.svelte";
	import { onMount } from "svelte";

	let canvas;
	const columnCount = 7;

	function gameloop() {
		canvas.update();
		window.requestAnimationFrame(gameloop);
	}

	let fetchAPI = async () => {
		return fetch("http://localhost:5555/data").then((resp) => {
			return resp.text().then((body) => {
				const rawData = JSON.parse(body);
				let data = [];
				// récupère les n premieres entreprise
				const n = 20;
				for (let cpt = 0; cpt < columnCount * n; cpt += columnCount) {
					let currentLine = {
						index: rawData[cpt + 0],
						company: rawData[cpt + 1],
						symbol: rawData[cpt + 2],
						weight: rawData[cpt + 3],
						price: rawData[cpt + 4],
						change: rawData[cpt + 5],
						"%change": rawData[cpt + 6],
					};
					data.push(currentLine);
				}
				return data;
			});
		});
	};

	const response = fetchAPI();

	onMount(() => {
		gameloop();
	});
</script>

<main>
	<ul>
		{#await response}
			<p>chargement...</p>
		{:then data}
			{#each data as item, index}
				<span
					><AnimatedText
						text={item.company}
						delay={index * 100}
					/></span
				>
			{/each}
		{/await}
	</ul>

	<Canvas bind:this={canvas} />
</main>

<style>
	ul {
		max-width: 35%;
		margin-top: 50vh;
		transform: translateY(-50%);
	}
	span {
		display: block;
		text-align: right;
		text-align: right;
		height: 1.8em;
		cursor: pointer;
	}
</style>
