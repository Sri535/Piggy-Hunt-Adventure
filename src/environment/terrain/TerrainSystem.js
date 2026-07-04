import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.165.0/build/three.module.js";

export class TerrainSystem {

       /*
    =======================================================
    Constructor
    =======================================================
     */

    constructor(config = {}) {

        this.group = new THREE.Group();

        this.mesh = null;

        this.type =
            config.type || "generic";

        this.size =
            config.size || 900;

        this.segments =
            config.segments || 180;

        this.radius =
            config.radius || 360;

        this.maxHeight =
            config.maxHeight || 18;

    }
           /*
    =======================================================
    create
    =======================================================
     */

    create() {

        const geometry =
            new THREE.PlaneGeometry(

                this.size,

                this.size,

                this.segments,

                this.segments

            );

        geometry.rotateX(
            -Math.PI / 2
        );

        const vertices =
            geometry.attributes.position;

        for (
            let i = 0; i < vertices.count; i++
        ) {

            const x =
                vertices.getX(i);

            const z =
                vertices.getZ(i);

            const distance =
                Math.sqrt(
                    x * x +
                    z * z
                );

            let height = 0;

            if (
                distance <
                this.radius
            ) {

                const normalized =
                    distance /
                    this.radius;

                height =
                    (1 - normalized) *
                    this.maxHeight;

                height =
                    Math.pow(
                        height,
                        0.85
                    );

            }

            vertices.setY(
                i,
                height
            );
        }

        geometry.computeVertexNormals();

        const material =
            new THREE.MeshStandardMaterial({

                color: 0xf2d48b,

                roughness: 1
            });

        this.mesh =
            new THREE.Mesh(
                geometry,
                material
            );

        this.mesh.receiveShadow =
            true;

        this.group.add(
            this.mesh
        );

        return this.group;
    }

}