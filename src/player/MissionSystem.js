export class MissionSystem {

    constructor(saveManager) {

        this.saveManager =
            saveManager;

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

    getMissions() {

        return this.missions;
    }
}
