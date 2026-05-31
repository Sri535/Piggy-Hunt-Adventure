import { ForestWorld } from "./ForestWorld.js";
import { IslandWorld } from "./IslandWorld.js";

export class WorldManager {

    constructor(scene) {

        this.scene = scene;

        this.currentWorld = null;
    }

    loadWorld(name) {

        if(this.currentWorld){

            this.currentWorld.destroy();
        }

        switch(name){

            case "forest":
                this.currentWorld =
                    new ForestWorld(
                        this.scene
                    );
                break;

            case "island":
                this.currentWorld =
                    new IslandWorld(
                        this.scene
                    );
                break;
        }

        this.currentWorld.init();
    }

    update(time){

        this.currentWorld?.update(time);
    }
}
