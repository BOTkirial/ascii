<script>
	import "./global.css";
	import Canvas from "./components/canvas/Canvas.svelte";
	import AnimatedText from "./components/animatedText/AnimatedText.svelte";
	import { onMount } from "svelte";

	let canvas, data;
	const columnCount = 7;

	function gameloop() {
		canvas.update();
		window.requestAnimationFrame(gameloop);
	}

	onMount(() => {
		
		fetch("http://localhost:5555/data").then((resp) => {
			resp.text().then((body) => {
				const rawData = JSON.parse(body);
				data = [];
				// récupère les n premieres entreprise
				const n = 20;
				for(let cpt = 0; cpt < columnCount * n; cpt += columnCount) {
					let currentLine = {
						"index":rawData[cpt + 0],
						"company":rawData[cpt + 1],
						"symbol":rawData[cpt + 2],
						"weight":rawData[cpt + 3],
						"price":rawData[cpt + 4],
						"change":rawData[cpt + 5],
						"%change":rawData[cpt + 6]
					}
					data.push(currentLine);
				}
				console.log(data)
			});
		});
		
		gameloop();

	});
</script>

<main>

	<AnimatedText text="hello world" />

	<Canvas bind:this={canvas} />
</main>

<style>
</style>
