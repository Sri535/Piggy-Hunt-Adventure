import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.165.0/build/three.module.js";

/* =========================================
   Grass Generator
========================================= */

export class GrassGenerator {

    constructor(config = {}, terrain = null) {

        this.group = new THREE.Group();

        this.config = config;

        this.terrain = terrain;

    }

    create() {

        return this.group;

    }

    update(delta) {

    }

    dispose() {

        this.group.clear();

    }

}