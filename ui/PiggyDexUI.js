export class PiggyDexUI {

    constructor(saveManager) {
        this.saveManager = saveManager;
    }

    render() {

        const collection =
            this.saveManager.getCollection();

        return `
            Common: ${collection.common || 0}
            Golden: ${collection.golden || 0}
            Rainbow: ${collection.rainbow || 0}
            Ghost: ${collection.ghost || 0}
        `;
    }
}
