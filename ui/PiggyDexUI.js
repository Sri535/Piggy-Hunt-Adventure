export class PiggyDexUI {

    constructor(saveManager) {
        this.saveManager = saveManager;
    }

    render() {

        const collection =
            this.saveManager
            .getCollection();

        return `

      <div>
         🐷 Common:
         ${collection.common || 0}
      </div>

      <div>
         👑 Golden:
         ${collection.golden || 0}
      </div>

      <div>
         🌈 Rainbow:
         ${collection.rainbow || 0}
      </div>

      <div>
         👻 Ghost:
         ${collection.ghost || 0}
      </div>

   `;
    }
}
