<script>
    import * as THREE from "three";
    import Renderer from "../../js/Renderer";
    import Scene from "../../js/Scene.js";
    import Model from "../../js/Model.js";
    import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
    import { onMount } from "svelte";
    import map from "../../js/utils.js";

    function setup() {
        const renderer = new Renderer();

        const scene = new Scene(new THREE.Color(0x000000), 65, 170);
        scene.setBackgroundColor(0x00000);
        scene.setLight();
        scene.setFog();

        const globe = new Model("models/earth.fbx", 0.0035);
        globe.init(scene);

        let rendererSize = new THREE.Vector2();
        renderer.getSize(rendererSize);
        const width = rendererSize.x;
        const height = rendererSize.y;

        const camera = new THREE.PerspectiveCamera(
            45,
            width / height,
            1,
            10000
        );
        camera.position.set(0, 0, 100);
        const controls = new OrbitControls(
            camera,
            document.querySelector("#ascii")
        );
        controls.enableZoom = false;

        const renderTarget = new THREE.WebGLRenderTarget(width, height, {
            format: THREE.RGBAFormat,
            type: THREE.FloatType,
        });

        let opacity = "Ñ@#W$9876543210?!abc;:+=-,._ ";

        function createASCII() {
            renderer.setRenderTarget(renderTarget);
            renderer.render(scene, camera);
            const read = new Float32Array(width * height * 4);
            renderer.readRenderTargetPixels(
                renderTarget,
                0,
                0,
                width,
                height,
                read
            );

            let div = document.createElement("div");
            div.setAttribute("id", "ascii");

            for (let j = height - 1; j > 0; j--) {
                let row = document.createElement("div");
                let string = "";
                for (let i = 0; i < width; i++) {
                    const pixelIndex = (i + j * width) * 4;
                    const r = read[pixelIndex + 0];
                    const g = read[pixelIndex + 1];
                    const b = read[pixelIndex + 2];
                    let brightness = r + g + b;
                    let opacityIndex = Math.floor(
                        map(brightness, 0, 3, opacity.length - 1, 0)
                    );
                    let symbol = opacity[opacityIndex];
                    if (symbol == " ") symbol = "&nbsp;";
                    // symbol = ".";
                    string += symbol;
                }
                row.innerHTML = string;
                div.appendChild(row);
            }

            if (document.querySelector("#ascii") === null) {
                document.body.appendChild(div);
            } else {
                document.querySelector("#ascii").innerHTML = div.innerHTML;
            }

            // console.log(rendererSize);
            // console.log(width)
            // console.log(height)
            // console.log(renderTarget)
            // console.log(read)

            renderer.setRenderTarget(null);
        }

        function gameloop() {
            // renderer.update(scene, camera);
            createASCII();
            controls.update();
            window.requestAnimationFrame(gameloop);
        }

        gameloop();
    }

    onMount(function () {
        setup();
    });
</script>

<div>
    coucou
    <div id="ascii" />
</div>

<style>
    #ascii {
        /* taille des charactères et de la ligne */
        font-size: 8pt;
        line-height: 6pt;
        font-weight: 900;
        /* cursor main */
        cursor: grab;
        /* text en dégradé */
        background-image: linear-gradient(
            106.1deg,
            rgba(69, 242, 143, 0.52) 10.2%,
            rgba(14, 228, 175, 0.61) 83.6%
        );
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        font-family: "Courier New", Courier, monospace;
    }
    #canvas {
        display: none;
    }
</style>
