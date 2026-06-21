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
        this.allMissionsComplete = false;

        this.loadMissionData();
    }


    /*==================================================
    GET CURRENT MISSION
    ===================================================*/
    getCurrentMission() {

        return this.missions[
            this.currentMissionIndex
            ];
    }
    /*==================================================
    SAVE MISSION DATA
    ===================================================*/
    saveMissionData() {

        this.saveManager.data.missions = {

            progress: this.progress,

            completed: this.completed,

            currentMissionIndex: this.currentMissionIndex,

            allMissionsComplete: this.allMissionsComplete
        };

        this.saveManager.save();
    }
    /*==================================================
    LOAD MISSION DATA
    ===================================================*/
    loadMissionData() {

        const missionData =

            this.saveManager
                .data
                .missions;

        if (
            !missionData
        ) {

            return;
        }

        this.progress =

            missionData.progress ||

            this.progress;

        this.completed =

            missionData.completed ||

            {};

        this.currentMissionIndex =

            missionData.currentMissionIndex ||

            0;

        this.allMissionsComplete =

            missionData.allMissionsComplete ||

            false;
    }

    /*==================================================
    RESTORE MISSION UI
    ===================================================*/

    restoreMissionUI() {

        if (
            !this.allMissionsComplete
        ) {

            this.updateUI();

            return;
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
                "🏆 All Missions Complete";
        }

        if (progressLabel) {

            progressLabel.textContent =
                "🌴 Chapter 9 Ready";
        }
    }

    /*==================================================
    recordCapture
    ===================================================*/

    recordCapture(piggyType) {
        if (
            this.allMissionsComplete
        ) {

            return;
        }

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
        this.saveMissionData();

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
        if (
            this.allMissionsComplete
        ) {

            return;
        }
        const mission =
            this.getCurrentMission();

        if (!mission) {

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
        if (
            this.allMissionsComplete
        ) {

            return;
        }
        const mission =
            this.getCurrentMission();
        if (!mission) {

            return;
        }

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
        this.saveMissionData();
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
                this.saveMissionData();
                if (
                    this.currentMissionIndex >=
                    this.missions.length
                ) {

                    this.currentMissionIndex =
                        this.missions.length;

                    this.allMissionsComplete =
                        true;

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
                            "🏆 All Missions Complete";
                    }

                    if (progressLabel) {

                        progressLabel.textContent =
                            "🌴 Chapter 9 Ready";
                    }

                    this.saveMissionData();

                    return;
                }

                this.updateUI();
                this.checkMissionCompletion();

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