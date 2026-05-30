import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.165.0/build/three.module.js";

import {
   Renderer
} from "./Renderer.js";
import {
   CameraController
} from "./CameraController.js";
import {
   InputManager
} from "./InputManager.js";
import {
   SaveManager
} from "./SaveManager.js";
import {
   AssetManager
} from "./AssetManager.js";
import {
   ForestWorld
} from "./worlds/ForestWorld.js";
import {
   PiggyManager
} from "./piggies/PiggyManager.js";
import {
   CaptureSystem
} from "./gameplay/CaptureSystem.js";
import {
   RadarSystem
}
from "./gameplay/RadarSystem.js";
import { AchievementSystem }
from "./player/AchievementSystem.js";

export class Game {

   constructor() {

      this.scene = null;
      this.camera = null;

      this.renderer = null;

      this.cameraController = null;

      this.input = null;

      this.save = null;

      this.assets = null;

      this.clock =
         new THREE.Clock();

      this.running = false;

      this.delta = 0;

      this.elapsedTime = 0;
   }

   /* =====================================================
      INITIALIZE
   ===================================================== */

   async init() {

      this.createScene();

      this.createCamera();

      this.createManagers();
      // SAVE TEST
      this.save.addCoins(100);
      this.save.save();

      this.createLights();

      this.createGround();

      /* Forest World */

      this.world =
         new ForestWorld(
            this.scene
         );

      this.world.init();

      /* Piggies */

      this.piggyManager =
         new PiggyManager(
            this.scene,
            this.world
         );

      await this.piggyManager.init();
            /*AchievementSystem*/
      this.achievementSystem =
    new AchievementSystem(
        this.save
    ).init();
      /* Capture System */

this.captureSystem =
   new CaptureSystem(
      this.camera,
      this.scene,
      this.piggyManager,
      this.save,
      this.achievementSystem
   );

      this.captureSystem.init();

      /* Radar System */
      this.radarSystem =
         new RadarSystem(

            this.camera,

            this.piggyManager
         );

      this.radarSystem.init();
      this.bindEvents();

      console.log(
         "Game Initialized"
      );



      return this;
   }

   /* =====================================================
      SCENE
   ===================================================== */

   createScene() {

      this.scene =
         new THREE.Scene();

      this.scene.background =
         new THREE.Color(
            0x87ceeb
         );

      this.scene.fog =
         new THREE.Fog(
            0x87ceeb,
            50,
            500
         );
   }

   /* =====================================================
      CAMERA
   ===================================================== */

   createCamera() {

      this.camera =
         new THREE.PerspectiveCamera(

            75,

            window.innerWidth /
            window.innerHeight,

            0.1,

            2000
         );

      this.camera.position.set(
         0,
         2,
         10
      );
   }

   /* =====================================================
      MANAGERS
   ===================================================== */

   createManagers() {

      const canvas =
         document.getElementById(
            "gameCanvas"
         );

      this.renderer =
         new Renderer(canvas)
         .init(
            this.scene,
            this.camera
         );

      this.cameraController =
         new CameraController(
            this.camera,
            canvas
         ).init();

      this.input =
         new InputManager()
         .init();
      /* =========================
   MOBILE JOYSTICK
========================= */

this.input.on(
   "joystickMove",
   data => {

      this.cameraController.joystickX =
         data.x;

      this.cameraController.joystickY =
         data.y;

      console.log(
         "JOYSTICK:",
         data.x,
         data.y
      );
   }
);

this.input.on(
   "touchend",
   () => {

      this.cameraController.joystickX = 0;

      this.cameraController.joystickY = 0;
   }
);

      this.save =
         new SaveManager()
         .init();

      this.save.bindUnload();

      this.assets =
         new AssetManager()
         .init();
   }

   /* =====================================================
      LIGHTING
   ===================================================== */

   createLights() {

      const ambient =
         new THREE.AmbientLight(
            0xffffff,
            1.2
         );

      this.scene.add(
         ambient
      );

      this.sun =
         new THREE.DirectionalLight(
            0xffffff,
            2
         );

      this.sun.position.set(
         50,
         100,
         50
      );

      this.sun.castShadow =
         true;

      this.sun.shadow.mapSize.width =
         2048;

      this.sun.shadow.mapSize.height =
         2048;

      this.scene.add(
         this.sun
      );
   }

   /* =====================================================
      GROUND
   ===================================================== */

   createGround() {

      const geometry =
         new THREE.PlaneGeometry(
            1000,
            1000,
            50,
            50
         );

      const material =
         new THREE.MeshStandardMaterial({

            color: 0x3fa34d,

            roughness: 1
         });

      const ground =
         new THREE.Mesh(

            geometry,
            material
         );

      ground.rotation.x = -Math.PI / 2;

      ground.receiveShadow =
         true;

      this.scene.add(
         ground
      );
   }

   /* =====================================================
      EVENTS
   ===================================================== */

   bindEvents() {

      /* Pause */

      this.input.on(
         "pause",
         () => {

            const menu =
               document.getElementById(
                  "pauseMenu"
               );

            if (menu) {

               menu.classList.toggle(
                  "active"
               );
            }
         }
      );

      /* Capture */

      this.input.on(
         "capture",
         () => {

            console.log(
               "Capture Triggered"
            );
         }
      );
   }

   /* =====================================================
      START
   ===================================================== */

   start() {

      if (this.running)
         return;

      this.running = true;

      this.clock.start();

      this.animate();
   }

   /* =====================================================
      STOP
   ===================================================== */

   stop() {

      this.running = false;
   }

   /* =====================================================
      UPDATE
   ===================================================== */

   update() {

      this.delta =
         this.clock.getDelta();

      this.elapsedTime +=
         this.delta;

      this.input.update();

      this.cameraController.update(
         this.delta
      );
      this.world?.update(
         this.elapsedTime
      );
      this.piggyManager?.update(
         this.elapsedTime
      );
      this.captureSystem?.update();
      this.radarSystem?.update();
      this.updateEnvironment();

      this.updateSaveData();

   }

   /* =====================================================
      ENVIRONMENT
   ===================================================== */

   updateEnvironment() {

      const cycle =
         this.elapsedTime * 0.03;

      const sunHeight =
         Math.sin(cycle);

      this.sun.position.y =
         100 + sunHeight * 60;

      const exposure =
         THREE.MathUtils.lerp(
            0.5,
            1.6,
            (sunHeight + 1) / 2
         );

      this.renderer.setExposure(
         exposure
      );
   }

   /* =====================================================
      SAVE DATA
   ===================================================== */

   updateSaveData() {

      this.save.addPlayTime(
         this.delta
      );
   }

   /* =====================================================
      RENDER
   ===================================================== */

   render() {

      this.renderer.render();
   }

   /* =====================================================
      LOOP
   ===================================================== */

   animate() {

      if (!this.running)
         return;

      requestAnimationFrame(
         () => {

            this.animate();
         }
      );

      this.update();

      this.render();
   }

   /* =====================================================
      LOADING SCREEN
   ===================================================== */

   showLoading() {

      const screen =
         document.getElementById(
            "loadingScreen"
         );

      if (screen) {

         screen.classList.add(
            "active"
         );
      }
   }

   hideLoading() {

      const screen =
         document.getElementById(
            "loadingScreen"
         );

      if (screen) {

         screen.classList.remove(
            "active"
         );
      }
   }

   /* =====================================================
      SPLASH
   ===================================================== */

   hideSplash() {

      const splash =
         document.getElementById(
            "splashScreen"
         );

      if (splash) {

         splash.classList.remove(
            "active"
         );
      }
   }

   /* =====================================================
      MENU
   ===================================================== */

   showMainMenu() {

      const menu =
         document.getElementById(
            "mainMenu"
         );

      if (menu) {

         menu.classList.add(
            "active"
         );
      }
   }

   hideMainMenu() {

      const menu =
         document.getElementById(
            "mainMenu"
         );

      if (menu) {

         menu.classList.remove(
            "active"
         );
      }
   }
}
