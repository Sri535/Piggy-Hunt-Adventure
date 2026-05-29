
/* =====================================================
   SAVE MANAGER
   Piggy Hunt Adventure
===================================================== */

export class SaveManager {

    static SAVE_KEY =
        "piggy-hunt-save";

    static SAVE_VERSION =
        "1.0.0";

    constructor() {

        this.data =
            this.createDefaultSave();

        this.autoSaveTimer = null;
    }

    /* =====================================================
       DEFAULT SAVE
    ===================================================== */

    createDefaultSave() {

        return {

            version:
                SaveManager.SAVE_VERSION,

            player: {

                level: 1,

                xp: 0,

                coins: 0,

                gems: 0,

                totalCaptures: 0
            },

            settings: {

                quality: "high",

                bloom: true,

                gyro: true,

                soundVolume: 1,

                musicVolume: 1
            },

            worlds: {

                forest: true,

                island: false,

                snow: false,

                volcano: false,

                space: false
            },

            collection: {},

            achievements: [],

            stats: {

                playTime: 0,

                piggiesCaptured: 0,

                sessionsPlayed: 0
            },

            lastPlayed:
                Date.now()
        };
    }

    /* =====================================================
       INIT
    ===================================================== */

    init() {

        this.load();

        this.startAutoSave();

        return this;
    }

    /* =====================================================
       LOAD
    ===================================================== */

    load() {

        try {

            const raw =
                localStorage.getItem(
                    SaveManager.SAVE_KEY
                );

            if(!raw) {

                this.save();

                return;
            }

            const parsed =
                JSON.parse(raw);

            if(
                !parsed.version
            ) {

                throw new Error(
                    "Invalid Save"
                );
            }

            this.data = parsed;

            this.migrate();

            console.log(
                "Save Loaded"
            );

        }
        catch(error) {

            console.warn(
                "Save Corrupted",
                error
            );

            this.data =
                this.createDefaultSave();

            this.save();
        }
    }

    /* =====================================================
       SAVE
    ===================================================== */

    save() {

        try {

            this.data.lastPlayed =
                Date.now();

            localStorage.setItem(

                SaveManager.SAVE_KEY,

                JSON.stringify(
                    this.data
                )
            );

            this.showSaveIndicator();

            console.log(
                "Game Saved"
            );

        }
        catch(error) {

            console.error(
                "Save Failed",
                error
            );
        }
    }

    /* =====================================================
       VERSION MIGRATION
    ===================================================== */

    migrate() {

        const current =
            SaveManager.SAVE_VERSION;

        if(
            this.data.version ===
            current
        )
            return;

        console.log(
            "Migrating Save"
        );

        this.data.version =
            current;

        this.save();
    }

    /* =====================================================
       RESET
    ===================================================== */

    reset() {

        this.data =
            this.createDefaultSave();

        this.save();
    }

    /* =====================================================
       PLAYER
    ===================================================== */

    getPlayer() {

        return this.data.player;
    }

    addCoins(amount) {

        this.data.player.coins +=
            amount;
    }

    removeCoins(amount) {

        this.data.player.coins =
            Math.max(
                0,
                this.data.player.coins
                - amount
            );
    }

    addGems(amount) {

        this.data.player.gems +=
            amount;
    }

    addXP(amount) {

        const player =
            this.data.player;

        player.xp += amount;

        while(

            player.xp >=
            this.getXPRequired(
                player.level
            )

        ) {

            player.xp -=
                this.getXPRequired(
                    player.level
                );

            player.level++;
        }
    }

    getXPRequired(level) {

        return level * 100;
    }

    /* =====================================================
       SETTINGS
    ===================================================== */

    getSettings() {

        return this.data.settings;
    }

    setSetting(key,value) {

        this.data.settings[key] =
            value;
    }

    /* =====================================================
       WORLDS
    ===================================================== */

    unlockWorld(world) {

        this.data.worlds[world] =
            true;
    }

    isWorldUnlocked(world) {

        return !!this.data
            .worlds[world];
    }

    /* =====================================================
       COLLECTION
    ===================================================== */

    addCollection(type) {

        if(
            !this.data.collection[type]
        ) {

            this.data.collection[type] = 0;
        }

        this.data.collection[type]++;
    }

    getCollection() {

        return this.data.collection;
    }

    /* =====================================================
       ACHIEVEMENTS
    ===================================================== */

    unlockAchievement(name) {

        if(
            this.data.achievements
            .includes(name)
        )
            return;

        this.data.achievements
            .push(name);
    }

    getAchievements() {

        return this.data
            .achievements;
    }

    /* =====================================================
       STATS
    ===================================================== */

    addPlayTime(seconds) {

        this.data.stats.playTime +=
            seconds;
    }

    incrementCaptures() {

        this.data.stats
            .piggiesCaptured++;
    }

    incrementSessions() {

        this.data.stats
            .sessionsPlayed++;
    }

    getStats() {

        return this.data.stats;
    }

    /* =====================================================
       EXPORT SAVE
    ===================================================== */

    exportSave() {

        return JSON.stringify(
            this.data,
            null,
            2
        );
    }

    /* =====================================================
       IMPORT SAVE
    ===================================================== */

    importSave(json) {

        try {

            const save =
                JSON.parse(json);

            if(
                !save.version
            ) {

                throw new Error(
                    "Invalid Save"
                );
            }

            this.data = save;

            this.save();

            return true;

        }
        catch(error) {

            console.error(
                error
            );

            return false;
        }
    }

    /* =====================================================
       AUTO SAVE
    ===================================================== */

    startAutoSave() {

        if(
            this.autoSaveTimer
        ) {

            clearInterval(
                this.autoSaveTimer
            );
        }

        this.autoSaveTimer =
            setInterval(
                () => {

                    this.save();

                },
                30000
            );
    }

    stopAutoSave() {

        clearInterval(
            this.autoSaveTimer
        );
    }

    /* =====================================================
       SAVE INDICATOR
    ===================================================== */

    showSaveIndicator() {

        const indicator =
            document.getElementById(
                "saveIndicator"
            );

        if(!indicator)
            return;

        indicator.style.opacity =
            "1";

        clearTimeout(
            this.saveTimeout
        );

        this.saveTimeout =
            setTimeout(
                () => {

                    indicator.style.opacity =
                        "0";

                },
                1500
            );
    }

    /* =====================================================
       BEFORE UNLOAD
    ===================================================== */

    bindUnload() {

        window.addEventListener(
            "beforeunload",
            () => {

                this.save();
            }
        );
    }
}
