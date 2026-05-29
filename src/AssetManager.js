import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.165.0/build/three.module.js";

import {
    GLTFLoader
} from "https://cdn.jsdelivr.net/npm/three@0.165.0/examples/jsm/loaders/GLTFLoader.js";

/* =====================================================
   ASSET MANAGER
===================================================== */

export class AssetManager {

    constructor() {

        this.assets = new Map();

        this.loadingManager = null;

        this.textureLoader = null;

        this.audioLoader = null;

        this.gltfLoader = null;

        this.totalLoaded = 0;

        this.totalAssets = 0;

        this.isReady = false;
    }

    /* =====================================================
       INIT
    ===================================================== */

    init() {

        this.createLoadingManager();

        this.textureLoader =
            new THREE.TextureLoader(
                this.loadingManager
            );

        this.audioLoader =
            new THREE.AudioLoader(
                this.loadingManager
            );

        this.gltfLoader =
            new GLTFLoader(
                this.loadingManager
            );

        return this;
    }

    /* =====================================================
       LOADING MANAGER
    ===================================================== */

    createLoadingManager() {

        this.loadingManager =
            new THREE.LoadingManager();

        this.loadingManager.onStart =
            (url, loaded, total) => {

                this.totalAssets = total;

                this.updateStatus(
                    "Loading Assets..."
                );

                console.log(
                    "Loading:",
                    url
                );
            };

        this.loadingManager.onProgress =
            (url, loaded, total) => {

                this.totalLoaded =
                    loaded;

                const percent =
                    Math.floor(
                        (loaded / total) * 100
                    );

                this.updateProgress(
                    percent
                );

                this.updateStatus(
                    `Loading ${loaded}/${total}`
                );
            };

        this.loadingManager.onLoad =
            () => {

                this.isReady = true;

                this.updateProgress(100);

                this.updateStatus(
                    "Loading Complete"
                );

                console.log(
                    "All Assets Loaded"
                );
            };

        this.loadingManager.onError =
            (url) => {

                console.error(
                    "Failed:",
                    url
                );
            };
    }

    /* =====================================================
       TEXTURES
    ===================================================== */

    loadTexture(name, url) {

        return new Promise(
            (resolve, reject) => {

                this.textureLoader.load(

                    url,

                    texture => {

                        texture.colorSpace =
                            THREE.SRGBColorSpace;

                        this.assets.set(
                            name,
                            texture
                        );

                        resolve(texture);
                    },

                    undefined,

                    reject
                );
            }
        );
    }

    /* =====================================================
       AUDIO
    ===================================================== */

    loadAudio(name, url) {

        return new Promise(
            (resolve, reject) => {

                this.audioLoader.load(

                    url,

                    buffer => {

                        this.assets.set(
                            name,
                            buffer
                        );

                        resolve(buffer);
                    },

                    undefined,

                    reject
                );
            }
        );
    }

    /* =====================================================
       GLTF
    ===================================================== */

    loadModel(name, url) {

        return new Promise(
            (resolve, reject) => {

                this.gltfLoader.load(

                    url,

                    gltf => {

                        this.assets.set(
                            name,
                            gltf
                        );

                        resolve(gltf);
                    },

                    undefined,

                    reject
                );
            }
        );
    }

    /* =====================================================
       BULK LOAD
    ===================================================== */

    async loadManifest(manifest) {

        const promises = [];

        /* -------------------------
           TEXTURES
        ------------------------- */

        if(manifest.textures) {

            for(const item of manifest.textures) {

                promises.push(

                    this.loadTexture(
                        item.name,
                        item.url
                    )
                );
            }
        }

        /* -------------------------
           MODELS
        ------------------------- */

        if(manifest.models) {

            for(const item of manifest.models) {

                promises.push(

                    this.loadModel(
                        item.name,
                        item.url
                    )
                );
            }
        }

        /* -------------------------
           AUDIO
        ------------------------- */

        if(manifest.audio) {

            for(const item of manifest.audio) {

                promises.push(

                    this.loadAudio(
                        item.name,
                        item.url
                    )
                );
            }
        }

        await Promise.all(
            promises
        );

        return this.assets;
    }

    /* =====================================================
       GETTERS
    ===================================================== */

    get(name) {

        return this.assets.get(
            name
        );
    }

    has(name) {

        return this.assets.has(
            name
        );
    }

    remove(name) {

        if(
            this.assets.has(name)
        ) {

            this.assets.delete(
                name
            );
        }
    }

    clear() {

        this.assets.clear();
    }

    /* =====================================================
       PRELOAD DEFAULTS
    ===================================================== */

    async loadDefaultAssets() {

        const manifest = {

            textures: [

                {
                    name: "grass",
                    url:
                    "./assets/textures/grass.jpg"
                },

                {
                    name: "ground",
                    url:
                    "./assets/textures/ground.jpg"
                }
            ],

            models: [

                {
                    name: "piggy",
                    url:
                    "./assets/models/piggy.glb"
                }
            ],

            audio: [

                {
                    name: "forest",
                    url:
                    "./assets/sounds/forest.mp3"
                },

                {
                    name: "capture",
                    url:
                    "./assets/sounds/capture.mp3"
                }
            ]
        };

        return this.loadManifest(
            manifest
        );
    }

    /* =====================================================
       UI HELPERS
    ===================================================== */

    updateProgress(percent) {

        const bar =
            document.getElementById(
                "loadingFill"
            );

        const label =
            document.getElementById(
                "loadingPercent"
            );

        if(bar) {

            bar.style.width =
                `${percent}%`;
        }

        if(label) {

            label.innerText =
                `${percent}%`;
        }
    }

    updateStatus(message) {

        const status =
            document.getElementById(
                "loadingStatus"
            );

        if(status) {

            status.textContent =
                message;
        }
    }

    /* =====================================================
       MEMORY INFO
    ===================================================== */

    getMemoryStats() {

        return {

            count:
                this.assets.size,

            loaded:
                this.totalLoaded,

            total:
                this.totalAssets,

            ready:
                this.isReady
        };
    }

    /* =====================================================
       DEBUG
    ===================================================== */

    printAssets() {

        console.table(

            [...this.assets.keys()]
        );
    }
}
