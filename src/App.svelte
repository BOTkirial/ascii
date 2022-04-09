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
		const n = 15; // le nombre d'entreprises récupérées
		const rawData = await fetch("http://ascii.cedricmarinot.fr/data");
		const rawDataJSON = await rawData.text();
		const dataJSON = JSON.parse(rawDataJSON);
		for (let cpt = 0; cpt < columnCount * n; cpt += columnCount) {
			try {
				const rawGeoData = await fetch(
					"http://ascii.cedricmarinot.fr/api?search=" +
						encodeURI(dataJSON[cpt + 1])
				);
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
					lat: geoDataJSON.features[0].geometry.coordinates[1],
					long: geoDataJSON.features[0].geometry.coordinates[0],
				};
				data.push(currentLine);
			} catch (e) {
				// console.error(e);
			}
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
		<h2><span>Liste des entreprises ░░░</span></h2>
		{#await response}
			<p>chargement...</p>
		{:then data}
			{#each data as item, index}
				<span on:click={()=>{canvas.moveCamera(item.lat, item.long)}}>
					<AnimatedText text={item.company} delay={index * 100}/>
				</span>
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
	ul > h2 {
		color: #f6d365;
		text-align: right;
		margin-bottom: 1em;
	}
	ul > span {
		display: block;
		text-align: right;
		text-align: right;
		height: 1.8em;
		cursor: pointer;
		margin-right: 0px;
		transition: margin-right 0.05s;
	}
	ul > span:hover {
		margin-right: 15px;
	}
</style>
