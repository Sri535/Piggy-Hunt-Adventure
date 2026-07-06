import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.165.0/build/three.module.js";

import { PalmTreeGenerator }
from "./generators/PalmTreeGenerator.js";

/* =========================================
   Palm Tree Generator
========================================= */

constructor(config = {}, terrain = null) {

    this.group = new THREE.Group();

    this.config = config;

    this.terrain = terrain;

}
    /* =========================================
 create
========================================= */

    create() {

        for (let i = 0; i < this.config.count; i++) {

            const tree = new THREE.Group();

            const trunk = new THREE.Mesh(

                new THREE.CylinderGeometry(
                    0.3,
                    0.5,
                    8,
                    8
                ),

                new THREE.MeshStandardMaterial({

                    color: this.config.trunkColor

                })

            );

            trunk.position.y = 4;

            tree.add(trunk);

            for (let j = 0; j < 5; j++) {

                const leaf = new THREE.Mesh(

                    new THREE.BoxGeometry(
                        6,
                        0.2,
                        1
                    ),

                    new THREE.MeshStandardMaterial({

                        color: this.config.leafColor

                    })

                );

                leaf.position.y = 8;

                leaf.rotation.y =
                    (Math.PI * 2 / 5) * j;

                tree.add(leaf);

            }

            const x =
                (Math.random() - 0.5) *
                this.config.spawnRadius;

            const z =
                (Math.random() - 0.5) *
                this.config.spawnRadius;

            const y =
                this.terrain.getHeight(x, z);

            tree.position.set(x, y, z);

            this.group.add(tree);

        }

        return this.group;

    }

/* =========================================
 update
========================================= */

    update() {

    }

/* =========================================
     dispose() {

========================================= */    

    dispose() {

        this.group.clear();

    }

}