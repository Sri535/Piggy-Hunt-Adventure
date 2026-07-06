import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.165.0/build/three.module.js";
import {
    BaseWorld
} from "./BaseWorld.js";

import {
    TerrainSystem
}
from "../environment/terrain/TerrainSystem.js";

import {
    WaterSystem
}
from "../environment/water/WaterSystem.js";
import {
    EnvironmentManager
} from "../environment/EnvironmentManager.js";

import {
    VegetationSystem
}
from "../environment/vegetation/VegetationSystem.js";

import {

    IslandConfig

} from "../configs/IslandConfig.js";




export class IslandWorld extends BaseWorld {

    constructor(scene) {

        super(scene);

        this.group =
            new THREE.Group();

        this.environment = null;

        this.spawnPoints = [];
        this.groundHeight = 4;
    }
    /*
    =======================================================
    INIT
    =======================================================
     */

    init() {



        this.environment =
            new EnvironmentManager();



        this.environment.setTerrain(new TerrainSystem(IslandConfig.terrain));

        this.environment.setWater(new WaterSystem(IslandConfig.water));
        this.environment.setVegetation(new VegetationSystem(IslandConfig.vegetation,this.environment.terrain));


        this.group.add(this.environment.terrain.create());
        this.group.add(this.environment.water.create());
        this.group.add(this.environment.vegetation.create());

        //this.createPalmTrees();
        this.createBeachGrass();
        this.createVolcanicRocks();
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

                this.groundHeight,

                (Math.random() - 0.5) * 400
            );

            this.group.add(
                tree
            );
        }
    }

    /*
 =======================================================
 CREATE BEACH GRASS
 =======================================================
 */

    createBeachGrass() {

        const material =
            new THREE.MeshStandardMaterial({

                color: 0x4CAF50,

                side: THREE.DoubleSide
            });

        for (let i = 0; i < 250; i++) {

            const blade =
                new THREE.Mesh(

                    new THREE.PlaneGeometry(
                        0.25,
                        0.9
                    ),

                    material
                );

            blade.position.set(

                (Math.random() - 0.5) * 380,

                this.groundHeight + 0.45,

                (Math.random() - 0.5) * 380
            );

            blade.rotation.y =
                Math.random() * Math.PI;

            blade.rotation.z =
                (Math.random() - 0.5) * 0.15;

            blade.scale.setScalar(

                0.7 + Math.random() * 0.8

            );

            blade.userData.windOffset =
                Math.random() * Math.PI * 2;

            this.group.add(blade);
        }
    }

    /*
=======================================================
CREATE VOLCANIC ROCKS
=======================================================
*/

    createVolcanicRocks() {

        const material =
            new THREE.MeshStandardMaterial({

                color: 0x555555,

                roughness: 1,

                metalness: 0.05
            });

        for (let i = 0; i < 70; i++) {

            const geometry =
                new THREE.DodecahedronGeometry(

                    1,

                    0

                );

            const rock =
                new THREE.Mesh(

                    geometry,

                    material
                );

            const scale =
                0.5 + Math.random() * 3;

            rock.scale.set(

                scale,

                scale * (0.8 + Math.random() * 0.5),

                scale
            );

            const clusterX =
                (Math.random() - 0.5) * 320;

            const clusterZ =
                (Math.random() - 0.5) * 320;

            rock.position.set(

                clusterX + (Math.random() - 0.5) * 15,

                this.groundHeight + scale * 0.35,

                clusterZ + (Math.random() - 0.5) * 15

            );
            const shade =
                0.7 + Math.random() * 0.3;

            rock.material =
                rock.material.clone();

            rock.material.color.multiplyScalar(
                shade
            );

            rock.rotation.set(

                Math.random() * Math.PI,

                Math.random() * Math.PI,

                Math.random() * Math.PI
            );

            rock.castShadow = true;

            rock.receiveShadow = true;

            this.group.add(rock);
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

    /*
=======================================================
ANIMATE GRASS
=======================================================
*/

    animateGrass(time) {

        for (const child of this.group.children) {

            if (
                child.geometry &&
                child.geometry.type === "PlaneGeometry"
            ) {

                child.rotation.z =

                    Math.sin(

                        time * 2 +

                        child.userData.windOffset

                    ) * 0.08;
            }
        }
    }
    /*
=======================================================
update
=======================================================
*/

    update(time) {

        this.environment?.update(time);

        this.animateGrass(time);
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


        this.environment?.dispose();


        this.group.clear();

        this.spawnPoints = [];
    }



}