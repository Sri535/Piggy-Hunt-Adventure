import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.165.0/build/three.module.js";

/* =========================================
   Vegetation System
========================================= */

export class VegetationSystem {

    constructor(config = {}, terrain = null) {

        this.group = new THREE.Group();

        this.config = config;

        this.terrain = terrain;

        this.generators = [];

    }

    /* =====================================
       REGISTER GENERATOR
    ===================================== */

addGenerator(generator) {

    this.generators.push(generator);

}
    /* =====================================
       CREATE
    ===================================== */

    create() {

        for (const generator of this.generators) {

            this.group.add(

                generator.create()

            );

        }

        return this.group;

    }

    /* =====================================
       UPDATE
    ===================================== */

    update(delta) {

        for (const generator of this.generators) {

            generator.update(delta);

        }

    }

    /* =====================================
       DISPOSE
    ===================================== */

    dispose() {

        for (const generator of this.generators) {

            generator.dispose();

        }

        this.group.clear();

    }

}