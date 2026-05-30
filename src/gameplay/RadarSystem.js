import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.165.0/build/three.module.js";

export class RadarSystem {

   constructor(
      camera,
      piggyManager
   ) {

      this.camera =
         camera;

      this.piggyManager =
         piggyManager;

      this.nearestPiggy =
         null;

      this.distance = 0;

      this.radarArrow =
         null;

      this.distanceLabel =
         null;

      this.typeLabel =
         null;
   }

   /* ==========================
      INIT
   ========================== */

   init() {

      this.createUI();

      return this;
   }

   /* ==========================
      UI
   ========================== */

  createUI() {

   const playerStats =
      document.getElementById(
         "playerStats"
      );

   if (!playerStats) {

      console.warn(
         "playerStats not found"
      );

      return;
   }

   const radar =
      document.createElement(
         "div"
      );

   radar.id =
      "radarContainer";

 radar.innerHTML =

`
   <div id="radarArrowContainer">

      <div id="radarArrow">
         🧭
      </div>

   </div>

   <div id="piggyType">
      No Piggy
   </div>

   <div id="piggyDistance">
      --
   </div>
`;
   playerStats.appendChild(
      radar
   );

   this.radarArrow =
      document.getElementById(
         "radarArrow"
      );

   this.distanceLabel =
      document.getElementById(
         "piggyDistance"
      );

   this.typeLabel =
      document.getElementById(
         "piggyType"
      );
}

   /* ==========================
      UPDATE
   ========================== */

   update() {

      this.findNearestPiggy();

      console.log(
         "Nearest Piggy:",
         this.nearestPiggy
      );

      console.log(
         "Distance:",
         this.distance
      );

      this.updateUI();
   }

   /* ==========================
      FIND NEAREST
   ========================== */

   findNearestPiggy() {

      let nearest =
         null;

      let nearestDistance =
         Infinity;

      const piggies =
         this.piggyManager
         .getPiggies();

      for (
         const piggy of piggies
      ) {

         if (
            piggy.userData.captured
         ) {
            continue;
         }

         const piggyPos =
            new THREE.Vector3();

         piggy.getWorldPosition(
            piggyPos
         );

         const distance =
            piggyPos.distanceTo(
               this.camera.position
            );

         if (
            distance <
            nearestDistance
         ) {

            nearestDistance =
               distance;

            nearest =
               piggy;
         }
      }

      this.nearestPiggy =
         nearest;

      this.distance =
         nearestDistance;
   }

   /* ==========================
      UPDATE HUD
   ========================== */

   updateUI() {

      if (
         !this.nearestPiggy
      ) {

         this.typeLabel.textContent =
            "All Piggies Captured";

         this.distanceLabel.textContent =
            "--";

         return;
      }

      const type =
         this.nearestPiggy
         .userData?.type ||
         "Piggy";

      const icons = {

         common: "🐷",

         golden: "👑",

         rainbow: "🌈",

         ghost: "👻"
      };

this.typeLabel.textContent =
   `${icons[type] || "🐷"} ${type.toUpperCase()}`;

this.distanceLabel.textContent =
   `📏 ${Math.floor(this.distance)}m`;

      this.updateArrow();
   }

   /* ==========================
      DIRECTION ARROW
   ========================== */

   updateArrow() {

      if (
         !this.nearestPiggy
      ) {
         return;
      }

      const cameraForward =
         new THREE.Vector3();

      this.camera
         .getWorldDirection(
            cameraForward
         );

      const piggyPos =
         new THREE.Vector3();

      this.nearestPiggy.getWorldPosition(
         piggyPos
      );

      const toPiggy =
         piggyPos
         .clone()
         .sub(
            this.camera.position
         )
         .normalize();

      const angle =

         Math.atan2(
            toPiggy.x,
            toPiggy.z
         ) -

         Math.atan2(
            cameraForward.x,
            cameraForward.z
         );

      this.radarArrow.style.transform =

         `rotate(${
                angle * 180 /
                Math.PI
            }deg)`;
   }
}
