import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.165.0/build/three.module.js";

export class CameraController {

   constructor(camera, canvas) {

      this.camera = camera;
      this.canvas = canvas;

      this.isMobile =
         /Android|iPhone|iPad|iPod/i.test(
            navigator.userAgent
         );

      /* =========================
         MOVEMENT
      ========================= */

      this.moveSpeed = 8;
      this.sprintMultiplier = 2;
      this.jumpForce = 8;
      this.gravity = 20;

      this.velocityY = 0;
      this.isGrounded = true;

      /* =========================
         ROTATION
      ========================= */

      this.pitch = 0;
      this.yaw = 0;

      this.sensitivity = 0.002;

      this.targetPitch = 0;
      this.targetYaw = 0;

      /* =========================
         INPUT
      ========================= */

      this.keys = {};

      /* =========================
         TOUCH
      ========================= */

      this.touchActive = false;

      this.lastTouchX = 0;
      this.lastTouchY = 0;

      /* =========================
         GYRO
      ========================= */

      this.gyroEnabled = true;

      this.gyroPitch = 0;
      this.gyroYaw = 0;
   }

   /* =====================================================
      INIT
   ===================================================== */

   init() {

      this.registerKeyboard();

      this.registerMouse();

      this.registerTouch();

      this.registerGyroscope();

      return this;
   }

   /* =====================================================
      UPDATE
   ===================================================== */

   update(delta) {

      this.updateMovement(delta);

      this.updateRotation(delta);

      this.updateGravity(delta);
   }

   /* =====================================================
      MOVEMENT
   ===================================================== */

   updateMovement(delta) {

      const speed =
         this.keys["ShiftLeft"] ?
         this.moveSpeed *
         this.sprintMultiplier :
         this.moveSpeed;

      const forward =
         new THREE.Vector3();

      this.camera.getWorldDirection(
         forward
      );

      forward.y = 0;
      forward.normalize();

      const right =
         new THREE.Vector3();

      right.crossVectors(
         forward,
         new THREE.Vector3(0, 1, 0)
      );

      if (this.keys["KeyW"]) {

         this.camera.position.add(
            forward.clone()
            .multiplyScalar(
               speed * delta
            )
         );
      }

      if (this.keys["KeyS"]) {

         this.camera.position.add(
            forward.clone()
            .multiplyScalar(
               -speed * delta
            )
         );
      }

      if (this.keys["KeyA"]) {

         this.camera.position.add(
            right.clone()
            .multiplyScalar(
               speed * delta
            )
         );
      }

      if (this.keys["KeyD"]) {

         this.camera.position.add(
            right.clone()
            .multiplyScalar(
               -speed * delta
            )
         );
      }
   }

   /* =====================================================
      GRAVITY
   ===================================================== */

   updateGravity(delta) {

      this.velocityY -=
         this.gravity * delta;

      this.camera.position.y +=
         this.velocityY * delta;

      if (
         this.camera.position.y <= 2
      ) {

         this.camera.position.y = 2;

         this.velocityY = 0;

         this.isGrounded = true;
      }
   }

   jump() {

      if (!this.isGrounded)
         return;

      this.isGrounded = false;

      this.velocityY =
         this.jumpForce;
   }

   /* =====================================================
      ROTATION
   ===================================================== */

   updateRotation(delta) {

      if (this.isMobile) {

         this.targetPitch =
            this.gyroPitch;

         this.targetYaw =
            this.gyroYaw;
      }

      const smooth = 8;

      this.pitch +=
         (
            this.targetPitch -
            this.pitch
         ) *
         smooth *
         delta;

      this.yaw +=
         (
            this.targetYaw -
            this.yaw
         ) *
         smooth *
         delta;

      this.pitch =
         Math.max(
            -Math.PI / 2,
            Math.min(
               Math.PI / 2,
               this.pitch
            )
         );

      this.camera.rotation.order =
         "YXZ";

      this.camera.rotation.y =
         this.yaw;

      this.camera.rotation.x =
         this.pitch;
   }

   /* =====================================================
      KEYBOARD
   ===================================================== */

   registerKeyboard() {

    window.addEventListener(
        "keydown",
        e => {

            console.log(
                "CAMERA KEY:",
                e.code
            );

            this.keys[e.code] = true;

            if (
                e.code === "Space"
            ) {
                this.jump();
            }
        }
    );

    window.addEventListener(
        "keyup",
        e => {

            this.keys[e.code] = false;
        }
    );
}

   /* =====================================================
      POINTER LOCK
   ===================================================== */

   registerMouse() {

      if (this.isMobile)
         return;

      this.canvas.addEventListener(
         "click",
         () => {

            if (
               document.pointerLockElement !==
               this.canvas
            ) {

               this.canvas.requestPointerLock();
            }
         }
      );

      document.addEventListener(
         "mousemove",
         e => {

            if (
               document.pointerLockElement !==
               this.canvas
            )
               return;

            this.targetYaw -=
               e.movementX *
               this.sensitivity;

            this.targetPitch -=
               e.movementY *
               this.sensitivity;
         }
      );
   }

   /* =====================================================
      TOUCH LOOK
   ===================================================== */

   registerTouch() {

      if (!this.isMobile)
         return;

      window.addEventListener(
         "touchstart",
         e => {

            this.touchActive = true;

            this.lastTouchX =
               e.touches[0].clientX;

            this.lastTouchY =
               e.touches[0].clientY;
         }
      );

      window.addEventListener(
         "touchmove",
         e => {

            if (!this.touchActive)
               return;

            const x =
               e.touches[0].clientX;

            const y =
               e.touches[0].clientY;

            const dx =
               x - this.lastTouchX;

            const dy =
               y - this.lastTouchY;

            this.targetYaw -=
               dx * 0.003;

            this.targetPitch -=
               dy * 0.003;

            this.lastTouchX = x;
            this.lastTouchY = y;
         }
      );

      window.addEventListener(
         "touchend",
         () => {

            this.touchActive = false;
         }
      );
   }

   /* =====================================================
      GYROSCOPE
   ===================================================== */

   registerGyroscope() {

      if (!this.isMobile)
         return;

      window.addEventListener(
         "deviceorientation",
         event => {

            if (
               !this.gyroEnabled
            )
               return;

            const beta =
               event.beta || 0;

            const gamma =
               event.gamma || 0;

            this.gyroPitch =
               THREE.MathUtils.degToRad(
                  beta * 0.5
               );

            this.gyroYaw =
               THREE.MathUtils.degToRad(
                  gamma * 0.5
               );
         }
      );
   }

   /* =====================================================
      POSITION HELPERS
   ===================================================== */

   setPosition(x, y, z) {

      this.camera.position.set(
         x, y, z
      );
   }

   getPosition() {

      return this.camera.position;
   }

   getForwardVector() {

      const dir =
         new THREE.Vector3();

      this.camera.getWorldDirection(
         dir
      );

      return dir;
   }

   /* =====================================================
      SETTINGS
   ===================================================== */

   setGyroEnabled(enabled) {

      this.gyroEnabled =
         enabled;
   }

   setSensitivity(value) {

      this.sensitivity =
         value;
   }
}
