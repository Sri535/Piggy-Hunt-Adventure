import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.165.0/build/three.module.js";

import {
    EffectComposer
} from "https://cdn.jsdelivr.net/npm/three@0.165.0/examples/jsm/postprocessing/EffectComposer.js";

import {
    RenderPass
} from "https://cdn.jsdelivr.net/npm/three@0.165.0/examples/jsm/postprocessing/RenderPass.js";

import {
    UnrealBloomPass
} from "https://cdn.jsdelivr.net/npm/three@0.165.0/examples/jsm/postprocessing/UnrealBloomPass.js";

/* =====================================================
   RENDERER
===================================================== */

export class Renderer {

    constructor(canvas) {

        this.canvas = canvas;

        this.renderer = null;

        this.composer = null;

        this.bloomPass = null;

        this.width = window.innerWidth;

        this.height = window.innerHeight;

        this.isMobile =
            /Android|iPhone|iPad|iPod/i.test(
                navigator.userAgent
            );

        this.clock = new THREE.Clock();

        this.fps = 0;

        this.frameCount = 0;

        this.lastFPSUpdate = 0;
    }

    /* =====================================================
       INITIALIZE
    ===================================================== */

    init(scene, camera) {

        this.createRenderer();

        this.createComposer(
            scene,
            camera
        );

        this.registerResize(
            camera
        );

        return this;
    }

    /* =====================================================
       WEBGL RENDERER
    ===================================================== */

    createRenderer() {

        this.renderer =
            new THREE.WebGLRenderer({

                canvas: this.canvas,

                antialias: true,

                alpha: false,

                powerPreference: "high-performance"
            });

        this.renderer.setSize(
            this.width,
            this.height
        );

        this.renderer.setPixelRatio(
            this.getPixelRatio()
        );

        this.renderer.shadowMap.enabled =
            true;

        this.renderer.shadowMap.type =
            THREE.PCFSoftShadowMap;

        this.renderer.outputColorSpace =
            THREE.SRGBColorSpace;

        this.renderer.toneMapping =
            THREE.ACESFilmicToneMapping;

        this.renderer.toneMappingExposure =
            1.2;


        this.renderer.info.autoReset =
            true;
    }

    /* =====================================================
       POST PROCESSING
    ===================================================== */

    createComposer(scene, camera) {

        this.composer =
            new EffectComposer(
                this.renderer
            );

        const renderPass =
            new RenderPass(
                scene,
                camera
            );

        this.composer.addPass(
            renderPass
        );

        this.bloomPass =
            new UnrealBloomPass(

                new THREE.Vector2(
                    this.width,
                    this.height
                ),

                this.getBloomStrength(),

                0.5,

                0.85
            );

        this.composer.addPass(
            this.bloomPass
        );
    }

    /* =====================================================
       BLOOM SETTINGS
    ===================================================== */

    getBloomStrength() {

        if (this.isMobile)
            return 0.35;

        return 1.1;
    }

    setBloom(enabled) {

        if (!this.bloomPass)
            return;

        this.bloomPass.enabled =
            enabled;
    }

    setBloomStrength(value) {

        if (!this.bloomPass)
            return;

        this.bloomPass.strength =
            value;
    }

    /* =====================================================
       EXPOSURE
    ===================================================== */

    setExposure(value) {

        this.renderer
            .toneMappingExposure =
            value;
    }

    /* =====================================================
       QUALITY PRESETS
    ===================================================== */

    setQuality(level) {

        switch (level) {

            case "low":

                this.renderer.setPixelRatio(
                    1
                );

                this.setBloom(false);

                break;

            case "medium":

                this.renderer.setPixelRatio(
                    Math.min(
                        window.devicePixelRatio,
                        1.5
                    )
                );

                this.setBloom(true);

                this.setBloomStrength(
                    0.5
                );

                break;

            case "high":

                this.renderer.setPixelRatio(
                    this.getPixelRatio()
                );

                this.setBloom(true);

                this.setBloomStrength(
                    1.1
                );

                break;
        }
    }

    /* =====================================================
       PIXEL RATIO
    ===================================================== */

    getPixelRatio() {

        if (this.isMobile) {

            return Math.min(
                window.devicePixelRatio,
                1.5
            );
        }

        return Math.min(
            window.devicePixelRatio,
            2
        );
    }

    /* =====================================================
       RENDER LOOP
    ===================================================== */

    render() {

        this.composer.render();

        this.updateFPS();
    }

    /* =====================================================
       FPS COUNTER
    ===================================================== */

    updateFPS() {

        this.frameCount++;

        const elapsed =
            performance.now();

        if (
            elapsed -
            this.lastFPSUpdate >
            1000
        ) {

            this.fps =
                this.frameCount;

            this.frameCount = 0;

            this.lastFPSUpdate =
                elapsed;

            const fpsElement =
                document.getElementById(
                    "fpsCounter"
                );

            if (fpsElement) {

                fpsElement.textContent =
                    this.fps;
            }
        }
    }

    /* =====================================================
       ADAPTIVE PERFORMANCE
    ===================================================== */

    adaptiveQuality() {

        if (
            this.fps > 0 &&
            this.fps < 25
        ) {

            this.renderer.setPixelRatio(
                1
            );
        }
    }

    /* =====================================================
       RESIZE
    ===================================================== */

    registerResize(camera) {

        window.addEventListener(
            "resize",
            () => {

                this.width =
                    window.innerWidth;

                this.height =
                    window.innerHeight;

                camera.aspect =
                    this.width /
                    this.height;

                camera.updateProjectionMatrix();

                this.renderer.setSize(
                    this.width,
                    this.height
                );

                this.composer.setSize(
                    this.width,
                    this.height
                );
            }
        );
    }

    /* =====================================================
       DISPOSE
    ===================================================== */

    dispose() {

        this.composer?.dispose();

        this.renderer?.dispose();
    }
}
