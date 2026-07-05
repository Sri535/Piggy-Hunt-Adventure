/* =========================================
   Environment Manager
========================================= */

export class EnvironmentManager {

    constructor() {

        this.terrain = null;

        this.water = null;

        this.vegetation = null;

        this.rocks = null;

        this.decorations = null;

        this.weather = null;

        this.ambientLife = null;

    }
    /* =====================================
   	SET TERRAIN
	===================================== */

    setTerrain(terrainSystem) {

        this.terrain = terrainSystem;

    }

    /* =====================================
       UPDATE
    ===================================== */

    update(delta) {

        this.terrain?.update(delta);

        this.water?.update(delta);

        this.vegetation?.update(delta);

        this.rocks?.update(delta);

        this.decorations?.update(delta);

        this.weather?.update(delta);

        this.ambientLife?.update(delta);

    }

    /* =====================================
       DISPOSE
    ===================================== */

    dispose() {

        this.terrain?.dispose();

        this.water?.dispose();

        this.vegetation?.dispose();

        this.rocks?.dispose();

        this.decorations?.dispose();

        this.weather?.dispose();

        this.ambientLife?.dispose();

    }

}