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

	async function fetchData() {
		let data = [];
		const n = 20; // le nombre d'entreprises récupérées
		const rawData = await fetch("http://localhost:5555/data");
		const rawDataJSON = await rawData.text();
		const dataJSON = JSON.parse(rawDataJSON);
		for (let cpt = 0; cpt < columnCount * n; cpt += columnCount) {
			const rawGeoData = await fetch("http://localhost:5555/api?search=" + rawData[cpt + 1]);
			const rawGeoDataJSON = await rawGeoData.json();
			const geoDataJSON = JSON.parse(rawGeoDataJSON);
			let currentLine = {
				index: dataJSON[cpt + 0],
				company: dataJSON[cpt + 1],
				symbol: dataJSON[cpt + 2],
				weight: dataJSON[cpt + 3],
				price: dataJSON[cpt + 4],
				change: dataJSON[cpt + 5],
				"%change": dataJSON[cpt + 6],
				lat: geoDataJSON.features[0].geometry.coordinates[0],
				long: geoDataJSON.features[0].geometry.coordinates[1],
			};
			data.push(currentLine);
		}
		return data;
	}

	const response = fetchData();

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
		max-width: 34%;
		margin-top: 50vh;
		transform: translateY(-50%);
	}
	span {
		display: block;
		text-align: right;
		text-align: right;
		height: 1.8em;
		cursor: pointer;
		margin-right: 0px;
		transition: margin-right 0.05s;
	}
	span:hover {
		margin-right: 15px;
	}
</style>
