import * as THREE from
"https://cdn.jsdelivr.net/npm/three@0.165.0/build/three.module.js";

/* =========================================
   WaterSystem
========================================= */

export class WaterSystem {

    constructor(config = {}) {
        this.systemType = "water";

        this.group =
            new THREE.Group();

        this.mesh = null;

        this.geometry = null;

        this.material = null;

        this.radius =
            config.radius || 1400;

        this.level =
            config.level || -4.8;

        this.color =
            config.color || 0x1ea5ff;

        this.opacity =
            config.opacity || 0.82;

    }

    /* =====================================
       CREATE
    ===================================== */

    create() {

        this.geometry =
            new THREE.CircleGeometry(

                this.radius,

                128

            );

        this.material =
            new THREE.MeshStandardMaterial({

                color: this.color,

                transparent: true,

                opacity: this.opacity,

                roughness: 0.15,

                metalness: 0.25

            });

        this.mesh =
            new THREE.Mesh(

                this.geometry,

                this.material

            );

        this.mesh.rotation.x =
            -Math.PI / 2;

        this.mesh.position.y =
            this.level;

        this.mesh.receiveShadow =
            true;

        this.group.add(
            this.mesh
        );

        return this.group;

    }

    /* =====================================
       UPDATE
    ===================================== */

    update(time) {

        if (!this.mesh) return;

        this.mesh.rotation.z =
            Math.sin(time * 0.08) * 0.01;
const waveOpacity =

    this.opacity +

    Math.sin(time * 1.8) * 0.04;

this.material.opacity = waveOpacity;

    /* =====================================
       GET WATER LEVEL
    ===================================== */

    getWaterLevel() {

        return this.level;

    }

    /* =====================================
       DISPOSE
    ===================================== */

    dispose() {

        this.geometry?.dispose();

        this.material?.dispose();

        this.group.clear();

    }

}