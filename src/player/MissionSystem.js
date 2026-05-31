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

            const mission =
                this.missions[0];

            if (
                this.completed[
                    mission.id
                ]
            ) {

                return;
            }

            this.progress.capture5++;

            if (
                piggyType ===
                "ghost"
            ) {

                this.progress.ghost1++;
            }

            this.updateUI();

            this.checkMissionCompletion();
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
        /*==================================================
checkMissionCompletion
===================================================*/
        checkMissionCompletion() {

            const mission =
                this.missions[0];

            if (
                this.completed[
                    mission.id
                ]
            ) {

                return;
            }

            if (
                this.progress.capture5 <
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