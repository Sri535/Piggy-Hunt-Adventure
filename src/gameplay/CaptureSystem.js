import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.165.0/build/three.module.js";


export class CaptureSystem {

    constructor(
        camera,
        scene,
        piggyManager,
        saveManager,
        achievementSystem
    ) {

        this.camera = camera;

        this.scene = scene;

        this.piggyManager =
            piggyManager;

        this.saveManager =
            saveManager;
        this.achievementSystem =
            achievementSystem;

        this.raycaster =
            new THREE.Raycaster();

        this.targetPiggy =
            null;

        this.captureDistance =
            40;

        this.crosshair =
            document.getElementById(
                "crosshair"
            );

        this.captureButton =
            document.getElementById(
                "captureBtn"
            );

        /* OLD HUD */

        this.coinLabel =
            document.getElementById(
                "coinCount"
            );

        this.xpLabel =
            document.getElementById(
                "xpCount"
            );

        /* TOP BAR */

        this.coinValue =
            document.getElementById(
                "coinValue"
            );

        this.gemValue =
            document.getElementById(
                "gemValue"
            );

        this.levelValue =
            document.getElementById(
                "levelValue"
            );
        /*XPFill */
        this.xpFill =
            document.getElementById(
                "xpFill"
            );
        /*XPTEXT*/
        this.xpText =
            document.getElementById(
                "xpText"
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

        if (
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

        const intersects =
            this.raycaster.intersectObjects(
                this.piggyManager.getPiggies(),
                true
            );

        for (const hit of intersects) {

            if (
                hit.distance >
                this.captureDistance
            ) {
                continue;
            }

            let root =
                hit.object;

            while (
                root &&
                !root.userData?.isPiggy
            ) {

                root =
                    root.parent;
            }

            if (
                !root
            ) {
                continue;
            }

            if (
                root.userData.captured
            ) {
                continue;
            }

            this.targetPiggy =
                root;

            return;
        }
    }

    /* =====================================================
       CROSSHAIR
    ===================================================== */

    updateCrosshair() {

        if (
            !this.crosshair
        ) {
            return;
        }

        if (
            this.targetPiggy
        ) {

            this.crosshair
                .style.borderColor =
                "#00ff00";

            this.crosshair
                .style.boxShadow =
                "0 0 20px #00ff00";

        } else {

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

        if (!this.targetPiggy) {

            console.log("NO TARGET");

            return;
        }

        if (
            this.targetPiggy.userData.captured
        ) {

            console.log(
                "Already Captured"
            );

            return;
        }

        const distance =
            this.camera.position.distanceTo(
                this.targetPiggy.position
            );

        if (
            distance >
            this.captureDistance
        ) {

            console.log(
                "TOO FAR:",
                distance
            );

            return;
        }

        const effectPosition =
            this.targetPiggy.position.clone();

        const points =
            this.piggyManager.capturePiggy(
                this.targetPiggy
            );

        const piggyType =
            this.targetPiggy.userData.type;

        if (
            points <= 0
        ) {

            console.log(
                "Invalid Capture"
            );

            return;
        }

        /* Rewards */

        this.rewardPlayer(
            piggyType
        );

        const collection =
            this.saveManager
            .getCollection();

        const firstDiscovery =

            !collection[
                piggyType
            ];

        this.saveManager
            .addCollection(
                piggyType
            );

        const dexContent =
            document.getElementById(
                "piggyDexContent"
            );
        /* ==========================
   MASTER HUNTER
========================== */

this.checkDexCompletion();

        if (
            dexContent &&
            window.game?.piggyDex
        ) {

            dexContent.innerHTML =

                window.game
                .piggyDex
                .render();
        }

        if (
            firstDiscovery
        ) {

            this.showDiscoveryPopup(
                piggyType
            );
        }
        this.achievementSystem?.checkCapture(
            this.targetPiggy.userData.type
        );



        /* FX */

        this.spawnCaptureEffect(
            effectPosition
        );

        /* Clear Target */

        this.targetPiggy =
            null;

        /* HUD */

        this.refreshHUD();

        /* Save */

        this.saveManager.save();

        console.log(
            "Captured",
            points
        );
    }
    /* =====================================================
       REWARDS
    ===================================================== */

    rewardPlayer(type, points) {

        let coins = 0;
        let xp = 0;

        switch (type) {

            case "common":
                coins = 5;
                xp = 10;
                break;

            case "golden":
                coins = 50;
                xp = 50;
                break;

            case "rainbow":
                coins = 100;
                xp = 100;
                break;

            case "ghost":
                coins = 250;
                xp = 250;
                break;
        }

        this.saveManager
            .addCoins(
                coins
            );

        this.saveManager
            .addXP(
                xp
            );

        this.saveManager
            .incrementCaptures();

        console.log(
            "XP +",
            xp,
            "Coins +",
            coins
        );
    }

    /* =====================================================
       HUD
    ===================================================== */

    refreshHUD() {

        const player =
            this.saveManager
            .getPlayer();

        const xpRequired =
            this.saveManager
            .getXPRequired(
                player.level
            );


        if (
            this.xpText
        ) {

            this.xpText.textContent =

                `${player.xp} / ${xpRequired} XP`;
        }

        /* XP BAR */

        if (
            this.xpFill
        ) {

            const percent =

                (
                    player.xp /
                    xpRequired
                ) * 100;

            this.xpFill.style.width =

                `${Math.min(
            percent,
            100
         )}%`;
        }

        /* TOP BAR */

        if (
            this.coinValue
        ) {

            this.coinValue.innerText =
                player.coins;
        }

        if (
            this.gemValue
        ) {

            this.gemValue.innerText =
                player.gems || 0;
        }

        if (
            this.levelValue
        ) {

            this.levelValue.innerText =
                player.level;
        }

        /* LEGACY HUD */

        if (
            this.coinLabel
        ) {

            this.coinLabel.innerText =
                player.coins;
        }

        if (
            this.xpLabel
        ) {

            this.xpLabel.innerText =
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

                color: 0xffff00
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
      DexCompletion
    ===================================================== */

    checkDexCompletion() {

    const collection =
        this.saveManager
        .getCollection();

    const complete =

        (collection.common || 0) > 0 &&

        (collection.golden || 0) > 0 &&

        (collection.rainbow || 0) > 0 &&

        (collection.ghost || 0) > 0;

    if (!complete) {

        return;
    }

    const achievements =

        this.saveManager
        .getAchievements();

    if (
        achievements.includes(
            "masterHunter"
        )
    ) {

        return;
    }

    this.saveManager
        .unlockAchievement(
            "masterHunter"
        );

    this.saveManager
        .addCoins(
            500
        );

    this.showMasterHunterPopup();

    this.saveManager.save();
}

    showMasterHunterPopup() {

    const popup =
        document.createElement(
            "div"
        );

    popup.className =
        "achievementPopup";

    popup.innerHTML = `

        <div>
            🏆 MASTER HUNTER
        </div>

        <div>
            PiggyDex Complete
        </div>

        <div>
            +500 Coins
        </div>

    `;

    document.body.appendChild(
        popup
    );

    setTimeout(
        () => {

            popup.remove();

        },
        4000
    );
}

    /* =====================================================
       HELPERS
    ===================================================== */

    getCurrentTarget() {

        return this.targetPiggy;
    }

    

    /* =====================================================
       DiscoveryPopup
    ===================================================== */

    showDiscoveryPopup(
        type
    ) {

        const icons = {

            common: "🐷",

            golden: "👑",

            rainbow: "🌈",

            ghost: "👻"
        };

        const popup =
            document.createElement(
                "div"
            );

        popup.className =
            "achievementPopup";

        popup.innerHTML = `

        <div>
            🎉 NEW DISCOVERY
        </div>

        <div>
            ${
                icons[type]
            }

            ${type.toUpperCase()}
        </div>

        <div>
            Added To PiggyDex
        </div>

    `;

        document.body.appendChild(
            popup
        );

        setTimeout(
            () => {

                popup.remove();

            },
            3500
        );
    }
}
