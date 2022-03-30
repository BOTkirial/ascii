<script>
	import "./global.css";
	import Canvas from "./components/canvas/Canvas.svelte";
	import AnimatedText from "./components/animatedText/AnimatedText.svelte";
	import { onMount } from "svelte";

	let canvas, data;

	function gameloop() {
		canvas.update();
		window.requestAnimationFrame(gameloop);
	}

	onMount(() => {
		
		fetch("http://localhost:5555/data").then((resp) => {
			resp.text().then((body) => {
				data = JSON.parse(body);
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
