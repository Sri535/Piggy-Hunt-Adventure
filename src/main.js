import { Game } from "./Game.js";

/* =====================================================
   GLOBAL GAME INSTANCE
===================================================== */

let game = null;

/* =====================================================
   DOM READY
===================================================== */

window.addEventListener(
    "DOMContentLoaded",
    async () => {

        try {

            await bootGame();

        }
        catch(error) {

            console.error(
                "Boot Failed",
                error
            );

            alert(
                "Game failed to start. Check browser console."
            );
        }
    }
);

/* =====================================================
   BOOT
===================================================== */

async function bootGame() {

    game =
        new Game();

    game.showLoading();

    await game.init();

    await loadAssets();

    game.hideLoading();

    game.hideSplash();

    game.showMainMenu();

    connectUI();

    console.log(
        "Piggy Hunt Adventure Ready"
    );
}

/* =====================================================
   LOAD ASSETS
===================================================== */

async function loadAssets() {

    if(
        !game.assets
    )
        return;

    try {

        // Uncomment when files exist

        /*
        await game.assets.loadDefaultAssets();
        */

        fakeLoading();
    }
    catch(error) {

        console.warn(
            "Assets skipped",
            error
        );
    }
}

/* =====================================================
   DEMO LOADER
===================================================== */

async function fakeLoading() {

    const bar =
        document.getElementById(
            "loadingFill"
        );

    const label =
        document.getElementById(
            "loadingPercent"
        );

    const status =
        document.getElementById(
            "loadingStatus"
        );

    for(let i=0;i<=100;i+=5){

        await delay(40);

        if(bar)
            bar.style.width =
                `${i}%`;

        if(label)
            label.textContent =
                `${i}%`;

        if(status)
            status.textContent =
                `Loading ${i}%`;
    }
}

/* =====================================================
   UI
===================================================== */

function connectUI() {

    connectPlayButton();

    connectContinueButton();

    connectSettings();

    connectFullscreen();

    connectPauseButtons();

    connectCaptureButton();
}

/* =====================================================
   PLAY
===================================================== */

function connectPlayButton() {

    const button =
        document.getElementById(
            "playBtn"
        );

    if(!button)
        return;

    button.addEventListener(
        "click",
        () => {

            startGameplay();
        }
    );
}

/* =====================================================
   CONTINUE
===================================================== */

function connectContinueButton() {

    const button =
        document.getElementById(
            "continueBtn"
        );

    if(!button)
        return;

    button.addEventListener(
        "click",
        () => {

            startGameplay();
        }
    );
}

/* =====================================================
   START GAME
===================================================== */

function startGameplay() {

    game.hideMainMenu();

    requestMotionPermission();

    game.start();

    console.log(
        "Game Started"
    );
}

/* =====================================================
   SETTINGS
===================================================== */

function connectSettings() {

    const settingsBtn =
        document.getElementById(
            "settingsBtn"
        );

    const settingsMenu =
        document.getElementById(
            "settingsMenu"
        );

    const backBtn =
        document.getElementById(
            "settingsBackBtn"
        );

    if(settingsBtn){

        settingsBtn.addEventListener(
            "click",
            () => {

                settingsMenu
                ?.classList.add(
                    "active"
                );
            }
        );
    }

    if(backBtn){

        backBtn.addEventListener(
            "click",
            () => {

                settingsMenu
                ?.classList.remove(
                    "active"
                );
            }
        );
    }

    const bloomToggle =
        document.getElementById(
            "bloomToggle"
        );

    bloomToggle?.addEventListener(
        "change",
        e => {

            game.renderer
            ?.setBloom(
                e.target.checked
            );

            game.save
            ?.setSetting(
                "bloom",
                e.target.checked
            );
        }
    );

    const qualitySelect =
        document.getElementById(
            "qualitySelect"
        );

    qualitySelect?.addEventListener(
        "change",
        e => {

            game.renderer
            ?.setQuality(
                e.target.value
            );

            game.save
            ?.setSetting(
                "quality",
                e.target.value
            );
        }
    );
}

/* =====================================================
   FULLSCREEN
===================================================== */

function connectFullscreen() {

    const button =
        document.getElementById(
            "fullscreenBtn"
        );

    if(!button)
        return;

    button.addEventListener(
        "click",
        async () => {

            if(
                !document
                .fullscreenElement
            ){

                await document
                .documentElement
                .requestFullscreen();
            }
            else{

                document
                .exitFullscreen();
            }
        }
    );
}

/* =====================================================
   PAUSE MENU
===================================================== */

function connectPauseButtons() {

    const resume =
        document.getElementById(
            "resumeBtn"
        );

    const save =
        document.getElementById(
            "saveBtn"
        );

    const quit =
        document.getElementById(
            "quitBtn"
        );

    resume?.addEventListener(
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

    save?.addEventListener(
        "click",
        () => {

            game.save.save();
        }
    );

    quit?.addEventListener(
        "click",
        () => {

            game.stop();

            game.showMainMenu();

            document
            .getElementById(
                "pauseMenu"
            )
            ?.classList.remove(
                "active"
            );
        }
    );
}

/* =====================================================
   CAPTURE BUTTON
===================================================== */

function connectCaptureButton() {

    const capture =
        document.getElementById(
            "captureBtn"
        );

    if(!capture)
        return;

    capture.addEventListener(
        "click",
        () => {

            console.log(
                "Capture Pressed"
            );
        }
    );
}

/* =====================================================
   IOS MOTION
===================================================== */

async function requestMotionPermission() {

    const gyroPrompt =
        document.getElementById(
            "gyroPrompt"
        );

    const enableBtn =
        document.getElementById(
            "enableMotionBtn"
        );

    if(
        typeof
        DeviceOrientationEvent ===
        "undefined"
    ) {

        return;
    }

    if(
        typeof
        DeviceOrientationEvent
        .requestPermission ===
        "function"
    ){

        gyroPrompt.style.display =
            "flex";

        enableBtn.onclick =
        async () => {

            try {

                const result =

                    await
                    DeviceOrientationEvent
                    .requestPermission();

                if(
                    result ===
                    "granted"
                ){

                    gyroPrompt.style.display =
                        "none";
                }
            }
            catch(error){

                console.error(
                    error
                );
            }
        };
    }
}

/* =====================================================
   UTIL
===================================================== */

function delay(ms){

    return new Promise(
        resolve =>
            setTimeout(
                resolve,
                ms
            )
    );
}

/* =====================================================
   DEBUG
===================================================== */

window.GameInstance =
() => game;
