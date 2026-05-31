export class MissionSystem {

    constructor(saveManager) {

        this.saveManager =
            saveManager;
        this.progress = {

            capture5: 0,

            ghost1: 0
        };

        this.missions = [

            {
                id: "capture5",
                name: "Capture 5 Piggies",
                target: 5,
                reward: 100,
                type: "captures"
            },

            {
                id: "ghost1",
                name: "Capture 1 Ghost",
                target: 1,
                reward: 250,
                type: "ghost"
            },

            {
                id: "level5",
                name: "Reach Level 5",
                target: 5,
                reward: 500,
                type: "level"
            }
        ];
    }

    /*==================================================
    GET MISSIONS
    ===================================================*/

    getMissions() {

        return this.missions;
    }

    /*==================================================
recordCapture
===================================================*/

    recordCapture(
        piggyType
    ) {

        this.progress.capture5++;

        if (
            piggyType ===
            "ghost"
        ) {

            this.progress.ghost1++;
        }

        this.updateUI();
    }

    /*==================================================
updateUI
===================================================*/
    updateUI() {

        const mission =
            this.missions[0];

        const progress =

            this.progress
            .capture5;

        const progressLabel =

            document.getElementById(
                "missionProgress"
            );

        if (
            progressLabel
        ) {

            progressLabel.textContent =

                `${progress} / ${mission.target}`;
        }
    }


}
