
import { Game } from "./Game.js";

let game = null;

/* =====================================================
   STARTUP
===================================================== */

window.addEventListener("DOMContentLoaded", init);

async function init() {

    console.log("MAIN.JS STARTED");

    try {

        game = new Game();

        showLoadingScreen();

        console.log("BEFORE INIT");

        await game.init();

        console.log("AFTER INIT");

        hideLoadingScreen();

        hideSplash();

        showMainMenu();

        wireUI();

        console.log("GAME READY");

    } catch (error) {

        console.error("BOOT ERROR:", error);

        alert(
            "Game startup failed.\n\nOpen F12 → Console and send the error."
        );
    }
}

/* =====================================================
   UI
===================================================== */

function wireUI() {

    const playBtn =
        document.getElementById("playBtn");

    if (playBtn) {

        playBtn.addEventListener(
            "click",
            startGame
        );
    }

    const continueBtn =
        document.getElementById(
            "continueBtn"
        );

    if (continueBtn) {

        continueBtn.addEventListener(
            "click",
            startGame
        );
    }

    const settingsBtn =
        document.getElementById(
            "settingsBtn"
        );

    const settingsMenu =
        document.getElementById(
            "settingsMenu"
        );

    const settingsBackBtn =
        document.getElementById(
            "settingsBackBtn"
        );

    settingsBtn?.addEventListener(
        "click",
        () => {

            settingsMenu?.classList.add(
                "active"
            );
        }
    );

    settingsBackBtn?.addEventListener(
        "click",
        () => {

            settingsMenu?.classList.remove(
                "active"
            );
        }
    );

    const fullscreenBtn =
        document.getElementById(
            "fullscreenBtn"
        );

    fullscreenBtn?.addEventListener(
        "click",
        toggleFullscreen
    );

    document
        .getElementById("resumeBtn")
        ?.addEventListener(
            "click",
            () => {

                document
                    .getElementById(
                        "pauseMenu"
                    )
                    ?.classList.remove(
                        "active"
                    );
            }
        );

    document
        .getElementById("saveBtn")
        ?.addEventListener(
            "click",
            () => {

                game?.save?.save();
            }
        );

    document
        .getElementById("quitBtn")
        ?.addEventListener(
            "click",
            () => {

                game?.stop();

                showMainMenu();

                document
                    .getElementById(
                        "pauseMenu"
                    )
                    ?.classList.remove(
                        "active"
                    );
            }
        );

    document
        .getElementById("captureBtn")
        ?.addEventListener(
            "click",
            () => {

                console.log(
                    "Capture Clicked"
                );
            }
        );
}

/* =====================================================
   PLAY
===================================================== */

function startGame() {

    hideMainMenu();

    requestGyroscopePermission();

    game?.start();

    console.log(
        "GAME STARTED"
    );
}

/* =====================================================
   SCREENS
===================================================== */

function hideSplash() {

    document
        .getElementById(
            "splashScreen"
        )
        ?.classList.remove(
            "active"
        );
}

function showMainMenu() {

    document
        .getElementById(
            "mainMenu"
        )
        ?.classList.add(
            "active"
        );
}

function hideMainMenu() {

    document
        .getElementById(
            "mainMenu"
        )
        ?.classList.remove(
            "active"
        );
}

function showLoadingScreen() {

    document
        .getElementById(
            "loadingScreen"
        )
        ?.classList.add(
            "active"
        );
}

function hideLoadingScreen() {

    document
        .getElementById(
            "loadingScreen"
        )
        ?.classList.remove(
            "active"
        );
}

/* =====================================================
   FULLSCREEN
===================================================== */

async function toggleFullscreen() {

    try {

        if (
            !document.fullscreenElement
        ) {

            await document
                .documentElement
                .requestFullscreen();

        } else {

            await document
                .exitFullscreen();
        }

    } catch (error) {

        console.warn(error);
    }
}

/* =====================================================
   IOS GYROSCOPE
===================================================== */

async function requestGyroscopePermission() {

    try {

        if (
            typeof DeviceOrientationEvent !==
            "undefined" &&
            typeof DeviceOrientationEvent
                .requestPermission ===
                "function"
        ) {

            const prompt =
                document.getElementById(
                    "gyroPrompt"
                );

            prompt.style.display =
                "flex";

            const button =
                document.getElementById(
                    "enableMotionBtn"
                );

            button.onclick =
                async () => {

                    const result =
                        await DeviceOrientationEvent
                            .requestPermission();

                    if (
                        result ===
                        "granted"
                    ) {

                        prompt.style.display =
                            "none";
                    }
                };
        }

    } catch (error) {

        console.warn(error);
    }
}

/* =====================================================
   DEBUG HELPERS
===================================================== */

window.showMenu = showMainMenu;
window.hideMenu = hideMainMenu;
window.getGame = () => game;

