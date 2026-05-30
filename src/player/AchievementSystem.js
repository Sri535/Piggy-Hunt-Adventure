export class AchievementSystem {

    constructor(saveManager) {

        this.saveManager =
            saveManager;

        this.achievements = {

            firstCapture: {
                name: "First Capture",
                description: "Capture your first piggy",
                reward: 25
            },

            piggyHunter: {
                name: "Piggy Hunter",
                description: "Capture 10 piggies",
                reward: 50
            },

            goldenHunter: {
                name: "Golden Hunter",
                description: "Capture a Golden Piggy",
                reward: 100
            },

            rainbowFinder: {
                name: "Rainbow Finder",
                description: "Capture a Rainbow Piggy",
                reward: 150
            },

            ghostbuster: {
                name: "Ghostbuster",
                description: "Capture a Ghost Piggy",
                reward: 200
            },

            piggyMaster: {
                name: "Piggy Master",
                description: "Capture 100 piggies",
                reward: 500
            }
        };
    }

    init() {



        return this;
    }

    /* ==========================
       CHECK ACHIEVEMENTS
    ========================== */

    checkCapture(
        piggyType
    ) {

        const player =
            this.saveManager
            .getPlayer();

        const captures =
            player.totalCaptures || 0;

        if (
            captures >= 1
        ) {

            this.unlock(
                "firstCapture"
            );
        }

        if (
            captures >= 10
        ) {

            this.unlock(
                "piggyHunter"
            );
        }

        if (
            captures >= 100
        ) {

            this.unlock(
                "piggyMaster"
            );
        }

        if (
            piggyType ===
            "golden"
        ) {

            this.unlock(
                "goldenHunter"
            );
        }

        if (
            piggyType ===
            "rainbow"
        ) {

            this.unlock(
                "rainbowFinder"
            );
        }

        if (
            piggyType ===
            "ghost"
        ) {

            this.unlock(
                "ghostbuster"
            );
        }
    }

    /* ==========================
       UNLOCK
    ========================== */
    unlock(id) {

        if (

            this.saveManager
            .getAchievements()
            .includes(id)

        ) {

            return;
        }

        const achievement =
            this.achievements[id];

        if (
            !achievement
        ) {

            return;
        }

        this.saveManager
            .unlockAchievement(
                id
            );

        this.saveManager
            .addCoins(
                achievement.reward
            );

        this.showPopup(
            achievement
        );

        this.saveManager
            .save();

        console.log(
            "Achievement:",
            achievement.name
        );
    }

    /* ==========================
       POPUP
    ========================== */

    showPopup(
        achievement
    ) {

        const popup =
            document.createElement(
                "div"
            );

        popup.className =
            "achievementPopup";

        popup.innerHTML =

            `
        <div>
            🏆 ACHIEVEMENT
        </div>

        <div>
            ${achievement.name}
        </div>

        <div>
            +${achievement.reward} Coins
        </div>
        `;

        document.body
            .appendChild(
                popup
            );

        setTimeout(
            () => {

                popup.remove();

            },
            3000
        );
    }

    /* ==========================
       HELPER
    ========================== */

    isUnlocked(id) {

        return this
            .saveManager
            .getAchievements()
            .includes(id);
    }
