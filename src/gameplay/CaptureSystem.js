import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.165.0/build/three.module.js";

export class CaptureSystem {

    constructor(
        camera,
        scene,
        piggyManager,
        saveManager
    ) {

        this.camera = camera;

        this.scene = scene;

        this.piggyManager =
            piggyManager;

        this.saveManager =
            saveManager;

        this.raycaster =
            new THREE.Raycaster();

        this.targetPiggy =
            null;

        this.captureDistance =
            25;

        this.crosshair =
            document.getElementById(
                "crosshair"
            );

        this.captureButton =
            document.getElementById(
                "captureBtn"
            );

        this.coinLabel =
            document.getElementById(
                "coinCount"
            );

        this.xpLabel =
            document.getElementById(
                "xpCount"
            );
    }

    /* =====================================================
       INIT
    ===================================================== */

    init() {

        this.bindUI();

        this.refreshHUD();

        console.log(
            "Capture System Ready"
        );
    }

    /* =====================================================
       UI
    ===================================================== */

    bindUI() {

        if(
            this.captureButton
        ) {

            this.captureButton
            .addEventListener(
                "click",
                () => {

                    this.capture();
                }
            );
        }
    }

    /* =====================================================
       UPDATE
    ===================================================== */

    update() {

        this.findTarget();

        this.updateCrosshair();
    }

    /* =====================================================
       RAYCAST
    ===================================================== */

    findTarget() {

        this.targetPiggy = null;

        const direction =
            new THREE.Vector3();

        this.camera
        .getWorldDirection(
            direction
        );

        this.raycaster.set(
            this.camera.position,
            direction
        );

        const piggies =
            this.piggyManager
            .getPiggies();

        const intersects =
            this.raycaster
            .intersectObjects(
                piggies,
                true
            );

        if(
            intersects.length === 0
        )
            return;

        const hit =
            intersects[0];

        if(
            hit.distance >
            this.captureDistance
        )
            return;

        let root =
            hit.object;

        while(
            root.parent &&
            root.parent.type !==
            "Scene"
        ){

            root =
                root.parent;
        }

        this.targetPiggy =
            root;
    }

    /* =====================================================
       CROSSHAIR
    ===================================================== */

    updateCrosshair() {

        if(
            !this.crosshair
        )
            return;

        if(
            this.targetPiggy
        ){

            this.crosshair
            .style.borderColor =
                "#00ff00";

            this.crosshair
            .style.boxShadow =
                "0 0 20px #00ff00";
        }
        else{

            this.crosshair
            .style.borderColor =
                "#ffffff";

            this.crosshair
            .style.boxShadow =
                "none";
        }
    }

    /* =====================================================
       CAPTURE
    ===================================================== */

    capture() {

        if(
            !this.targetPiggy
        )
            return;

        const points =
            this.piggyManager
            .capturePiggy(
                this.targetPiggy
            );

        if(points <= 0)
            return;

        this.rewardPlayer(
            points
        );

        this.spawnCaptureEffect(
            this.targetPiggy
            .position
        );

        this.refreshHUD();

        this.saveManager.save();

        console.log(
            "Captured:",
            points
        );
    }

    /* =====================================================
       REWARDS
    ===================================================== */

    rewardPlayer(points) {

        const coins =
            Math.floor(
                points / 2
            );

        const xp =
            points;

        this.saveManager
        .addCoins(coins);

        this.saveManager
        .addXP(xp);

        this.saveManager
        .incrementCaptures();
    }

    /* =====================================================
       HUD
    ===================================================== */

    refreshHUD() {

        const player =
            this.saveManager
            .getPlayer();

        if(
            this.coinLabel
        ){

            this.coinLabel
            .innerText =
                player.coins;
        }

        if(
            this.xpLabel
        ){

            this.xpLabel
            .innerText =
                player.xp;
        }
    }

    /* =====================================================
       FX
    ===================================================== */

    spawnCaptureEffect(
        position
    ) {

        const geometry =
            new THREE.SphereGeometry(
                0.4,
                8,
                8
            );

        const material =
            new THREE.MeshBasicMaterial({

                color:
                    0xffff00
            });

        const flash =
            new THREE.Mesh(

                geometry,
                material
            );

        flash.position.copy(
            position
        );

        this.scene.add(
            flash
        );

        setTimeout(() => {

            this.scene.remove(
                flash
            );

        }, 300);
    }

    /* =====================================================
       HELPERS
    ===================================================== */

    getCurrentTarget() {

        return this.targetPiggy;
    }
}
