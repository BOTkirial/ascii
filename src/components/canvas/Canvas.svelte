<script>
    import * as THREE from "three";
    import Renderer from "../../js/Renderer";
    import Scene from "../../js/Scene.js";
    import Model from "../../js/Model.js";
    import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
    import { onMount } from "svelte";
    import { map, LLAtoXYZ } from "../../js/utils.js";

    function setup() {
        // détermine la hauteur du renderer
        const ratio = window.innerWidth / window.innerHeight;
        const height = Math.floor((window.innerHeight / 8) * 0.9);
        const width = Math.ceil(height * ratio);

        const renderer = new Renderer(width, height, true);

        // créé la scène
        const scene = new Scene(new THREE.Color(0x000000), 65, 170);
        scene.setLight();

        // instancie le globe terrestre
        const globe = new Model(
            "models/earth.glb",
            0.005,
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(0, -Math.PI * 0.5, 0)
        );
        globe.init(scene);

        // créé et positionne une caméra
        const camera = new THREE.PerspectiveCamera(
            45,
            width / height,
            0.1,
            10000
        );
        camera.position.set(0, 0, 7);

        // créé un orbit control pour la caméra
        const controls = new OrbitControls(
            camera,
            document.querySelector("#ascii")
            // renderer.domElement
        );
        controls.enableZoom = true;
        controls.minDistance = 2.7;
        controls.maxDistance = 12;

        // créé un render target sur lequel on peut render la scene et lire les pixels
        const renderTarget = new THREE.WebGLRenderTarget(width, height, {
            format: THREE.RGBAFormat,
            type: THREE.FloatType,
        });

        // tableau de charactere du plus au moins opaque
        let opacity = "#$9876543210?!abc;:+=-,. ";

        function createASCII() {
            // render la scene sur la rendertarget
            renderer.setRenderTarget(renderTarget);
            renderer.render(scene, camera);

            // prépare le tableau pour stocker les pixels de la rendertarget la hauteur * la largeur * 4 (Rouge, Vert, Bleu et Alpha)
            const read = new Float32Array(width * height * 4);
            renderer.readRenderTargetPixels(
                renderTarget,
                0,
                0,
                width,
                height,
                read
            );

            // créé le container pour toute les lignes
            let div = document.createElement("div");
            div.setAttribute("id", "ascii");

            // pour chaque ligne dans l'image
            for (let j = height - 1; j > 0; j--) {
                // prépare une div pour cette ligne
                let row = document.createElement("div");
                // prépare le contenu de la ligne
                let string = "";
                // pour chaque colonne dans cette ligne
                for (let i = 0; i < width; i++) {
                    // récupère l'index 1 dimension a partir des indexs d'un tableau 2 dimensions
                    const pixelIndex = (i + j * width) * 4;
                    // récupere les valeurs r v b du pixel depuis le tableau
                    const r = read[pixelIndex + 0];
                    const g = read[pixelIndex + 1];
                    const b = read[pixelIndex + 2];
                    // dédui la luminosité du pixel en fonction des valeurs de r v b
                    let brightness = (r + g + b) / 3;

                    if (b > r && b > g) brightness *= 0.5;
                    if (g > r && g > b) brightness *= 35;
                    if (r > b && r > g) brightness *= 5;

                    // récupère l'index d'opacité en fonction de la luminosité du pixel
                    let opacityIndex = Math.floor(
                        map(brightness, 0, 1, opacity.length - 1, 0, true)
                    );

                    // récupère le symbole correspondant
                    let symbol = opacity[opacityIndex];

                    // si il n'y a pas de symbol s'assure qu'un espace sera render
                    if (symbol == " ") symbol = "&nbsp;";

                    // ajoute le symbol à la ligne
                    string += symbol;
                }
                // ajoute la ligne au container
                row.innerHTML = string;
                div.appendChild(row);
            }

            // ajoute le container à la page
            if (document.querySelector("#ascii") === null) {
                document.body.appendChild(div);
            } else {
                document.querySelector("#ascii").innerHTML = div.innerHTML;
            }

            renderer.setRenderTarget(null);
        }

        addSphereForTown(
            47.32347095714749,
            5.033590423150636,
            0xff0000,
            "Dijon"
        ); // rouge
        addSphereForTown(
            35.66111758604039,
            139.68181496805573,
            0xffff00,
            "Tokyo"
        ); // jaune
        addSphereForTown(
            40.74502664241826,
            -74.10056576562587,
            0xffffff,
            "New York"
        ); // blanc
        addSphereForTown(
            -22.946953375673605,
            -43.23175948656159,
            0xff00ff,
            "Rio"
        ); // violet
        addSphereForTown(
            39.926963179659495,
            116.33562520556683,
            0x00ffff,
            "Pékin"
        ); // cyan
        addSphereForTown(
            55.76969529421493,
            37.55571513171817,
            0x303030,
            "Moscou"
        ); // gris

        function addSphereForTown(lat, long, color, name) {
            let sphereGeometry = new THREE.SphereBufferGeometry(0.02);
            let sphereMaterial = new THREE.MeshBasicMaterial({ color: color });
            let sphereMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
            sphereMesh.name = name;
            let positions = LLAtoXYZ(lat, long, 2.5);
            sphereMesh.position.set(positions[0], positions[1], positions[2]);
            scene.add(sphereMesh);
        }

        function gameloop() {
            renderer.update(scene, camera);
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
    <div id="ascii" />
</div>

<style>
    #ascii {
        /* taille des charactères et de la ligne */
        font-size: 9pt;
        line-height: 6pt;
        font-weight: 900;
        /* cursor main */
        cursor: grab;
        /* text en dégradé */
        background-color: #ff3cac;
        background-image: linear-gradient(
            225deg,
            #ff3cac 0%,
            #784ba0 50%,
            #2b86c5 100%
        );
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        /* positionne le text */
        white-space: nowrap;
        text-align: center;
        /* centre le dans la fenetre */
        position: absolute;
        left: 50vw;
        top: 50vh;
        transform: translateX(-50%) translateY(-50%);
    }
</style>
