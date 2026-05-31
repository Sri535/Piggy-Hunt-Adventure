
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.165.0/build/three.module.js";

export class ForestWorld extends BaseWorld {

    constructor(scene) {

        this.scene = scene;

        this.trees = [];

        this.fireflies = [];

        this.spawnPoints = [];

        this.group =
            new THREE.Group();
    }

    /* =====================================================
       INIT
    ===================================================== */

    init() {

        this.createFog();

        this.createTrees();

        this.createBushes();

        this.createRocks();

        this.createGrass();

        this.createFireflies();

        this.createSpawnPoints();

        this.scene.add(
            this.group
        );

        console.log(
            "Forest World Loaded"
        );
    }

    /* =====================================================
       FOG
    ===================================================== */

    createFog() {

        this.scene.fog =
            new THREE.FogExp2(
                0x9fd3a8,
                0.003
            );
    }

    /* =====================================================
       TREES
    ===================================================== */

    createTrees() {

        for(let i=0;i<100;i++){

            const tree =
                new THREE.Group();

            const trunk =
                new THREE.Mesh(

                    new THREE.CylinderGeometry(
                        0.4,
                        0.6,
                        5,
                        8
                    ),

                    new THREE.MeshStandardMaterial({

                        color:
                            0x5b3a29
                    })
                );

            trunk.position.y = 2.5;

            tree.add(trunk);

            const leaves =
                new THREE.Mesh(

                    new THREE.SphereGeometry(
                        2.5,
                        12,
                        12
                    ),

                    new THREE.MeshStandardMaterial({

                        color:
                            0x2f8f2f
                    })
                );

            leaves.position.y = 6;

            tree.add(leaves);

            tree.position.set(

                (Math.random()-0.5)*800,

                0,

                (Math.random()-0.5)*800
            );

            tree.rotation.y =
                Math.random()*
                Math.PI;

            this.trees.push(tree);

            this.group.add(tree);
        }
    }

    /* =====================================================
       BUSHES
    ===================================================== */

    createBushes() {

        const material =
            new THREE.MeshStandardMaterial({

                color:
                    0x3ea23e
            });

        for(let i=0;i<50;i++){

            const bush =
                new THREE.Mesh(

                    new THREE.SphereGeometry(
                        1,
                        8,
                        8
                    ),

                    material
                );

            bush.position.set(

                (Math.random()-0.5)*700,

                0.8,

                (Math.random()-0.5)*700
            );

            bush.scale.setScalar(
                0.5 +
                Math.random()*2
            );

            this.group.add(bush);
        }
    }

    /* =====================================================
       ROCKS
    ===================================================== */

    createRocks() {

        const material =
            new THREE.MeshStandardMaterial({

                color:
                    0x777777
            });

        for(let i=0;i<25;i++){

            const rock =
                new THREE.Mesh(

                    new THREE.DodecahedronGeometry(
                        1
                    ),

                    material
                );

            rock.position.set(

                (Math.random()-0.5)*700,

                0.8,

                (Math.random()-0.5)*700
            );

            rock.rotation.set(

                Math.random()*3,

                Math.random()*3,

                Math.random()*3
            );

            this.group.add(rock);
        }
    }

    /* =====================================================
       GRASS
    ===================================================== */

    createGrass() {

        const material =
            new THREE.MeshStandardMaterial({

                color:
                    0x33aa33,

                side:
                    THREE.DoubleSide
            });

        for(let i=0;i<200;i++){

            const grass =
                new THREE.Mesh(

                    new THREE.PlaneGeometry(
                        0.6,
                        1.2
                    ),

                    material
                );

            grass.position.set(

                (Math.random()-0.5)*750,

                0.6,

                (Math.random()-0.5)*750
            );

            grass.rotation.y =
                Math.random()*
                Math.PI;

            this.group.add(grass);
        }
    }

    /* =====================================================
       FIREFLIES
    ===================================================== */

    createFireflies() {

        const geometry =
            new THREE.SphereGeometry(
                0.08,
                6,
                6
            );

        const material =
            new THREE.MeshBasicMaterial({

                color:
                    0xffff88
            });

        for(let i=0;i<100;i++){

            const fly =
                new THREE.Mesh(

                    geometry,
                    material
                );

            fly.position.set(

                (Math.random()-0.5)*300,

                2 +
                Math.random()*10,

                (Math.random()-0.5)*300
            );

            fly.userData.offset =
                Math.random()*100;

            this.fireflies.push(
                fly
            );

            this.group.add(
                fly
            );
        }
    }

    /* =====================================================
       SPAWN POINTS
    ===================================================== */

    createSpawnPoints() {

        for(let i=0;i<50;i++){

            this.spawnPoints.push({

                x:
                (Math.random()-0.5)*600,

                z:
                (Math.random()-0.5)*600
            });
        }

        console.log(

            "Spawn Points:",

            this.spawnPoints.length
        );
    }

    /* =====================================================
       UPDATE
    ===================================================== */

    update(time) {

        this.animateFireflies(
            time
        );
    }

    /* =====================================================
       FIREFLY MOTION
    ===================================================== */

    animateFireflies(time) {

        for(const fly of this.fireflies){

            fly.position.y +=

                Math.sin(

                    time +

                    fly.userData.offset

                ) * 0.01;

            fly.position.x +=

                Math.cos(

                    time * 0.3 +

                    fly.userData.offset

                ) * 0.005;
        }
    }

    /* =====================================================
       HELPERS
    ===================================================== */

    getRandomSpawnPoint() {

        return this.spawnPoints[
            Math.floor(
                Math.random()*
                this.spawnPoints.length
            )
        ];
    }
}
