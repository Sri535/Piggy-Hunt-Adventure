import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.165.0/build/three.module.js";

export class PiggyManager {

    constructor(scene, world) {

        this.scene = scene;
        this.world = world;

        this.piggies = [];

        this.group =
            new THREE.Group();

        this.types = {

            common: {
                color: 0xffb6c1,
                points: 10,
                count: 20
            },

            golden: {
                color: 0xffd700,
                points: 50,
                count: 5
            },

            rainbow: {
                color: 0xffffff,
                points: 100,
                count: 2
            },

            ghost: {
                color: 0xaaddff,
                points: 200,
                count: 1
            }
        };
    }

    /* =====================================================
       INIT
    ===================================================== */

    init() {

        this.spawnCommonPiggies();

        this.spawnGoldenPiggies();

        this.spawnRainbowPiggies();

        this.spawnGhostPiggy();

        this.scene.add(
            this.group
        );

        console.log(
            "Piggies Spawned:",
            this.piggies.length
        );
    }

    /* =====================================================
       PIGGY CREATOR
    ===================================================== */

    createPiggy(typeName) {

        console.log(
            "capturePiggy received:",
            piggy
        );

        console.log(
            "capturePiggy userdata:",
            piggy?.userData
        );
        const config =
            this.types[typeName];

        const piggy =
            new THREE.Group();

        /* Body */

        const body =
            new THREE.Mesh(

                new THREE.SphereGeometry(
                    1,
                    16,
                    16
                ),

                new THREE.MeshStandardMaterial({

                    color: config.color,

                    metalness: typeName ===
                        "golden" ?
                        0.8 : 0.1,

                    roughness: 0.3
                })
            );

        piggy.add(body);

        /* Head */

        const head =
            new THREE.Mesh(

                new THREE.SphereGeometry(
                    0.6,
                    16,
                    16
                ),

                body.material
            );

        head.position.set(
            0,
            0.5,
            1
        );

        piggy.add(head);

        /* Nose */

        const nose =
            new THREE.Mesh(

                new THREE.SphereGeometry(
                    0.2,
                    8,
                    8
                ),

                new THREE.MeshStandardMaterial({

                    color: 0xff8888
                })
            );

        nose.position.set(
            0,
            0.45,
            1.55
        );

        piggy.add(nose);
        piggy.userData.isPiggy = true;
        piggy.userData = {

            isPiggy: true,

            type: typeName,

            points: config.points,

            captured: false,

            bobOffset: Math.random() * 100
        };
        piggy.castShadow =
            true;

        return piggy;
    }

    /* =====================================================
       SPAWNING
    ===================================================== */

    spawnType(typeName) {

        const config =
            this.types[typeName];

        for (
            let i = 0; i < config.count; i++
        ) {

            const piggy =
                this.createPiggy(
                    typeName
                );
            const spawn = {

                x: (Math.random() - 0.5) * 40,

                z: (Math.random() - 0.5) * 40
            };

            piggy.position.set(

                spawn.x,

                1,

                spawn.z
            );

            piggy.rotation.y =
                Math.random() *
                Math.PI * 2;

            this.piggies.push(
                piggy
            );

            this.group.add(
                piggy
            );
        }
    }

    spawnCommonPiggies() {

        this.spawnType(
            "common"
        );
    }

    spawnGoldenPiggies() {

        this.spawnType(
            "golden"
        );
    }

    spawnRainbowPiggies() {

        this.spawnType(
            "rainbow"
        );
    }

    spawnGhostPiggy() {

        this.spawnType(
            "ghost"
        );

        const ghost =
            this.piggies[
                this.piggies.length - 1
            ];

        ghost.traverse(obj => {

            if (obj.material) {

                obj.material.transparent =
                    true;

                obj.material.opacity =
                    0.45;
            }
        });
    }

    /* =====================================================
       UPDATE
    ===================================================== */

    update(time) {

        this.animatePiggies(
            time
        );
    }

    /* =====================================================
       ANIMATION
    ===================================================== */

    animatePiggies(time) {

        for (
            const piggy of
                this.piggies
        ) {

            if (
                piggy.userData.captured
            )
                continue;

            piggy.position.y =

                1 +

                Math.sin(

                    time * 2 +

                    piggy.userData
                    .bobOffset

                ) * 0.2;

            piggy.rotation.y +=
                0.003;

            if (
                piggy.userData.type ===
                "rainbow"
            ) {

                piggy.traverse(obj => {

                    if (
                        obj.material
                    ) {

                        obj.material.color
                            .setHSL(

                                (
                                    time * 0.2
                                ) % 1,

                                1,

                                0.6
                            );
                    }
                });
            }
        }
    }

    /* =====================================================
       CAPTURE
    ===================================================== */

    capturePiggy(piggy) {

        if (
            piggy.userData.captured
        )
            return 0;

        piggy.userData.captured =
            true;

        piggy.visible =
            false;

        return piggy.userData.points;
    }

    /* =====================================================
       DETECTION
    ===================================================== */

    getNearestPiggy(position) {

        let nearest =
            null;

        let distance =
            Infinity;

        for (
            const piggy of
                this.piggies
        ) {

            if (
                piggy.userData.captured
            )
                continue;

            const d =
                piggy.position
                .distanceTo(
                    position
                );

            if (
                d < distance
            ) {

                distance = d;

                nearest = piggy;
            }
        }

        return nearest;
    }

    getPiggies() {

        return this.piggies;
    }

    getRemainingCount() {

        return this.piggies
            .filter(

                p =>
                !p.userData
                .captured

            ).length;
    }
}
