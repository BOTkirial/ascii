import * as THREE from "three";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";

const loader = new FBXLoader();
// const loader = new OBJLoader();

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
                console.log("loaded")
                model.scale.set(this.scale, this.scale, this.scale);
                // model.children[0].material = new THREE.MeshBasicMaterial({color: 0x0000FF})
                // console.log(model)
                scene.add(model)
            }.bind(this)
        );
    }

}

export default Model;