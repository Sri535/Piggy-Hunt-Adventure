// BaseWorld.js

export class BaseWorld {

    constructor(scene) {
        this.scene = scene;

        this.group =
            new THREE.Group();

        this.spawnPoints = [];
    }

    init() {}

    update() {}

    destroy() {

        this.scene.remove(
            this.group
        );
    }

    getRandomSpawnPoint() {

        return this.spawnPoints[
            Math.floor(
                Math.random() *
                this.spawnPoints.length
            )
        ];
    }
}
