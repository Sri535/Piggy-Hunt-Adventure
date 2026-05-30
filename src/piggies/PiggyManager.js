import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.165.0/build/three.module.js";

import {
   GLTFLoader
}
from "https://cdn.jsdelivr.net/npm/three@0.165.0/examples/jsm/loaders/GLTFLoader.js";

export class PiggyManager {

   constructor(scene, world) {

      this.loader =
         new GLTFLoader();

      this.piggyTemplate =
         null;
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
     LoadModel
   ===================================================== */
   async loadModel() {

      return new Promise(
         (resolve, reject) => {

            this.loader.load(

               "./assets/models/piggy.glb",

               (gltf) => {

                  this.piggyTemplate =
                     gltf.scene;

                  console.log(
                     "Piggy Model Loaded"
                  );

                  resolve();
               },

               undefined,

               reject
            );
         }
      );
   }

   /* =====================================================
      AsyncINIT
   ===================================================== */

   async init() {
      await this.loadModel();
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

      const config =
         this.types[typeName];

      const piggy =
         this.piggyTemplate.clone(true);

      piggy.scale.set(
         2,
         2,
         2
      );

      piggy.traverse(obj => {

         if (!obj.isMesh)
            return;

         obj.castShadow = true;

         obj.receiveShadow = true;

         if (obj.material) {

            obj.material =
               obj.material.clone();

            /* Base Color */

            obj.material.color.set(
               config.color
            );

            /* Golden */

            if (
               typeName === "golden"
            ) {
               obj.material.metalness =
                  1.0;

               obj.material.roughness =
                  0.1;

               obj.material.emissive.set(
                  0x443300
               );

               obj.material.emissiveIntensity =
                  0.5;
            }

            /* Ghost */

            if (
               typeName === "ghost"
            ) {

               obj.material.transparent =
                  true;

               obj.material.opacity =
                  0.25;

               obj.material.emissive.set(
                  0x88ccff
               );

               obj.material.emissiveIntensity =
                  1;
            }

            /* Rainbow */

            if (
               typeName === "rainbow"
            ) {

               obj.material.emissive.set(
                  0x00ffff
               );

               obj.material.emissiveIntensity =
                  1.5;
            }
         }
      });

      piggy.userData = {

         isPiggy: true,

         type: typeName,

         points: config.points,

         captured: false,

         bobOffset: Math.random() * 100
      };
      if (
         typeName !== "common"
      ) {

         const ring =
            new THREE.Mesh(

               new THREE.TorusGeometry(
                  1.5,
                  0.05,
                  8,
                  32
               ),

               new THREE.MeshBasicMaterial({

                  color: config.color
               })
            );

         ring.rotation.x =
            Math.PI / 2;

         ring.position.y =
            3;

         piggy.add(
            ring
         );
      }

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

         const amplitude =

            piggy.userData.type ===
            "ghost"

            ?
            0.5

            :
            0.2;

         const speed =

            piggy.userData.type ===
            "ghost"

            ?
            4

            :
            2;

         piggy.position.y =

            1 +

            Math.sin(

               time * speed +

               piggy.userData.bobOffset

            ) * amplitude;

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

                        0.5
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
         !piggy
      ) {
         return 0;
      }

      if (
         piggy.userData.captured
      ) {
         return 0;
      }

      piggy.userData.captured =
         true;

      piggy.visible =
         false;

      piggy.traverse(
         child => {

            child.layers.disable(
               0
            );
         }
      );

      return (
         piggy.userData.points || 0
      );
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
