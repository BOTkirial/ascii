import * as THREE from "three";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

// const loader = new FBXLoader();
// const loader = new OBJLoader();
const loader = new GLTFLoader();

class Model {

    constructor(url, scale, position = new THREE.Vector3(0, 0, 0), rotation = new THREE.Vector3(0, 0, 0)) {
        this.url = url;
        this.scale = scale;
        this.position = position;
        this.rotation = rotation;
    }

    init(scene) {
        loader.load(
            // resource URL
            this.url,
            // called when the resource is loaded
            function (model) {
                model.scene.scale.set(this.scale, this.scale, this.scale);
                model.scene.rotation.setFromVector3(this.rotation);
                // model.scene.visible = false;
                scene.add(model.scene);
            }.bind(this)
        );
    }

}

export default Model;