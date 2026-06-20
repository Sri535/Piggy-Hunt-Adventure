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
            this.completed = {};
            this.currentMissionIndex = 0;
        }

        /*==================================================
        GET MISSIONS
        ===================================================*/

        getMissions() {

            return this.missions;
        }
        /*==================================================
        getCurrentMission
        ===================================================*/
        getCurrentMission() {

            return this.missions[
                this.currentMissionIndex
            ];
        }

        /*==================================================
        recordCapture
        ===================================================*/

        recordCapture(piggyType) {

            const mission =
                this.getCurrentMission();

            if (this.completed[mission.id]) {
                return;
            }

            this.progress.capture5++;

            if (piggyType === "ghost") {
                this.progress.ghost1++;
            }

            this.updateUI();

            this.checkMissionCompletion();

            console.log(
                "Mission:",
                mission.id,
                this.progress
            );
        }

        /*==================================================
        updateUI
        ===================================================*/
        updateUI() {

            const mission =
                this.getCurrentMission();

            let progress = 0;

            switch (mission.id) {

                case "capture5":

                    progress =
                        this.progress.capture5;
                    break;

                case "ghost1":

                    progress =
                        this.progress.ghost1;
                    break;

                case "level5":

                    progress =
                        this.saveManager
                        .getPlayer()
                        .level;
                    break;
            }

            const missionText =
                document.getElementById(
                    "missionText"
                );

            const progressLabel =
                document.getElementById(
                    "missionProgress"
                );

            if (missionText) {

                missionText.textContent =
                    mission.name;
            }

            if (progressLabel) {

                progressLabel.textContent =
                    `${progress} / ${mission.target}`;
            }
        }
        /*==================================================
        checkMissionCompletion
        ===================================================*/
        checkMissionCompletion() {

            const mission =
                this.getCurrentMission();

            if (
                this.completed[
                    mission.id
                ]
            ) {

                return;
            }

            let progress = 0;

            switch (mission.id) {

                case "capture5":

                    progress =
                        this.progress.capture5;
                    break;

                case "ghost1":

                    progress =
                        this.progress.ghost1;
                    break;

                case "level5":

                    progress =
                        this.saveManager
                        .getPlayer()
                        .level;
                    break;
            }

            if (
                progress <
                mission.target
            ) {

                return;
            }

            this.completed[
                mission.id
            ] = true;

            this.saveManager
                .addCoins(
                    mission.reward
                );

            this.showMissionComplete(
                mission
            );
            setTimeout(
                () => {

                    this.currentMissionIndex++;

                    if (
                        this.currentMissionIndex >=
                        this.missions.length
                    ) {

                        this.currentMissionIndex = 0;
                    }

                    this.updateUI();

                },
                2500
            );

            this.saveManager.save();
        }
        /*==================================================
        showMissionComplete
        ===================================================*/
        showMissionComplete(
            mission
        ) {

            const popup =
                document.createElement(
                    "div"
                );

            popup.className =
                "achievementPopup";

            popup.innerHTML = `

        <div>
            🎯 MISSION COMPLETE
        </div>

        <div>
            ${mission.name}
        </div>

        <div>
            +${mission.reward} Coins
        </div>

    `;

            document.body.appendChild(
                popup
            );

            setTimeout(
                () => {

                    popup.remove();

                },
                4000
            );
        }

    }