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
            this.keys["ShiftLeft"]
                ? this.moveSpeed *
                  this.sprintMultiplier
                : this.moveSpeed;

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
            new THREE.Vector3(0,1,0)
        );

        if(this.keys["KeyW"]) {

            this.camera.position.add(
                forward.clone()
                .multiplyScalar(
                    speed * delta
                )
            );
        }

        if(this.keys["KeyS"]) {

            this.camera.position.add(
                forward.clone()
