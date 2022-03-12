import * as THREE from "three";
// import * as CANNON from "cannon-es";
// import CannonDebugRenderer from '../lib/cannonDebugRenderer'
// import CannonUtils from "../lib/cannonUtils";


class Scene extends THREE.Scene {

    constructor(fogColor = new THREE.Color(0xDDE0E3), fogNear = 0, fogFar = 1000) {
        super();
        // propriétés du brouillard
        this.fogColor = fogColor;
        this.fogNear = fogNear;
        this.fogFar = fogFar;
        // pour la durée d'une step de simulation physique
        this.clock = new THREE.Clock();
    }

    setSky(renderer, url) {
        const loader = new THREE.TextureLoader();
        const texture = loader.load(
            url,
            () => {
                const rt = new THREE.WebGLCubeRenderTarget(texture.image.height);
                rt.fromEquirectangularTexture(renderer, texture);
                this.background = rt.texture;
            });
    }

    setBackgroundColor(color) {
        this.background = new THREE.Color(color)
    }

    setLight() {
        const light = new THREE.AmbientLight(0xFFFFFF, 1);
        this.add(light);
    }

    setFog() {
        this.fog = new THREE.Fog(this.fogColor, this.fogNear, this.fogFar)
    }

    getFogColor() {
        return this.fogColor;
    }

    getFogNear() {
        return this.fogNear;
    }

    getFogFar() {
        return this.fogFar;
    }

}

export default Scene;