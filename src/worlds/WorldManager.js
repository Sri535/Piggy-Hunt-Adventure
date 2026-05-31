import { ForestWorld }
from "./ForestWorld.js";

export class WorldManager {

   constructor(scene) {

      this.scene =
         scene;

      this.currentWorld =
         null;
   }

   loadWorld(name) {

      if (
         this.currentWorld
      ) {

         this.currentWorld.dispose();
      }

      switch(name) {

         case "forest":

            this.currentWorld =
               new ForestWorld(
                  this.scene
               );

            break;
      }

      this.currentWorld.init();
   }

   update(delta) {

      this.currentWorld?.update(
         delta
      );
   }
}
