import * as THREE from "three";
import {
    BaseWorld
} from "./BaseWorld.js";

export class IslandWorld extends BaseWorld {

    constructor(scene) {

        super(scene);

        this.group =
            new THREE.Group();

        this.spawnPoints = [];
    }
    /*
    =======================================================
    INIT
    =======================================================
     */

    init() {

        this.createIslandGround();

        this.createWater();

        this.createPalmTrees();

        this.createSpawnPoints();

        this.scene.add(
            this.group
        );

        console.log(
            "Island World Loaded"
        );
    }
    /*
=======================================================
CREATE ISLAND GROUND
=======================================================
 */
    createIslandGround() {

        const island =
            new THREE.Mesh(

                new THREE.CylinderGeometry(
                    250,
                    300,
                    10,
                    32
                ),

                new THREE.MeshStandardMaterial({

                    color: 0xf4d28c
                })
            );

        island.position.y = -5;

        island.receiveShadow = true;

        this.group.add(
            island
        );
    }

    /*
=======================================================
CREATE ISLAND OCEAN
=======================================================
*/
    createWater() {

        const water =
            new THREE.Mesh(

                new THREE.CylinderGeometry(
                    1200,
                    1200,
                    2,
                    64
                ),

                new THREE.MeshStandardMaterial({

                    color: 0x2196f3,

                    transparent: true,

                    opacity: 0.7
                })
            );

        water.position.y = -8;

        this.group.add(
            water
        );
    }
    /*
=======================================================
CREATE ISLAND PALM TREES
=======================================================
*/
    createPalmTrees() {

        for (let i = 0; i < 60; i++) {

            const tree =
                new THREE.Group();

            const trunk =
                new THREE.Mesh(

                    new THREE.CylinderGeometry(
                        0.3,
                        0.5,
                        8,
                        8
                    ),

                    new THREE.MeshStandardMaterial({

                        color: 0x8b5a2b
                    })
                );

            trunk.position.y = 4;

            tree.add(
                trunk
            );

            for (let j = 0; j < 5; j++) {

                const leaf =
                    new THREE.Mesh(

                        new THREE.BoxGeometry(
                            6,
                            0.2,
                            1
                        ),

                        new THREE.MeshStandardMaterial({

                            color: 0x00aa44
                        })
                    );

                leaf.position.y = 8;

                leaf.rotation.y =
                    (Math.PI * 2 / 5) * j;

                tree.add(
                    leaf
                );
            }

            tree.position.set(

                (Math.random() - 0.5) * 400,

                0,

                (Math.random() - 0.5) * 400
            );

            this.group.add(
                tree
            );
        }
    }
    /*
=======================================================
CREATE ISLAND SPAWN POINTS
=======================================================
*/

    createSpawnPoints() {

        for (let i = 0; i < 50; i++) {

            this.spawnPoints.push({

                x: (Math.random() - 0.5) * 300,

                z: (Math.random() - 0.5) * 300
            });
        }
    }
    /*
=======================================================
CREATE ISLAND RANDOM SPAWN POINTS
=======================================================
*/
    getRandomSpawnPoint() {

        return this.spawnPoints[
            Math.floor(
                Math.random() *
                this.spawnPoints.length
            )
            ];
    }

    /*
=======================================================
DISPOSE
=======================================================
*/

    dispose() {

        this.scene.remove(
            this.group
        );

        this.group.clear();

        this.spawnPoints = [];
    }



}