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

        this.geometry = null;

        this.material = null;

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

        this.geometry =
            new THREE.PlaneGeometry(

                this.size,

                this.size,

                this.segments,

                this.segments

            );

        this.geometry.rotateX(
            -Math.PI / 2
        );

        vertices =
            this.geometry.attributes.position;

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

            const height =

                this.getHeight(

                    x,

                    z

                );

            vertices.setY(

                i,

                height

            );
        }

        this.geometry.computeVertexNormals();

        const material =
            new THREE.MeshStandardMaterial({

                color: 0xf2d48b,

                roughness: 1
            });

        this.mesh =
            new THREE.Mesh(
                this.geometry,
                this.material
            );

        this.mesh.receiveShadow =
            true;

        this.group.add(
            this.mesh
        );

        return this.group;
    }

    /*
==========================================
UPDATE
==========================================
*/

    update(delta) {

        // Reserved for future:
        // wind
        // terrain animation
        // lava
        // snow deformation

    }
    /*
==========================================
GET HEIGHT
==========================================
*/

    getHeight(x, z) {

        const distance = Math.sqrt(

            x * x +

            z * z

        );

        if (distance >= this.radius) {

            return 0;

        }

        const normalized =

            distance /

            this.radius;

        let height =

            (1 - normalized) *

            this.maxHeight;

        height = Math.pow(

            height,

            0.85

        );

        return height;

    }
    /*
==========================================
DISPOSE
==========================================
*/

    dispose() {

        this.geometry?.dispose();

        this.material?.dispose();

        this.group.clear();

    }

}