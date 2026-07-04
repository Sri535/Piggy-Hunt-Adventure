import * as THREE from
"https://cdn.jsdelivr.net/npm/three@0.165.0/build/three.module.js";

export class TerrainSystem {

    constructor() {

        this.group = new THREE.Group();

        this.mesh = null;

        this.size = 900;

        this.segments = 180;

        this.maxHeight = 18;

        this.radius = 360;
    }

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
            let i = 0;
            i < vertices.count;
            i++
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
