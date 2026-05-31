export class PiggyDexUI {

    constructor(saveManager) {
        this.saveManager = saveManager;
    }
    render() {

        const collection =
            this.saveManager
            .getCollection();

        const discovered = {

            common: (collection.common || 0) > 0,

            golden: (collection.golden || 0) > 0,

            rainbow: (collection.rainbow || 0) > 0,

            ghost: (collection.ghost || 0) > 0
        };

        const found =

            Object.values(
                discovered
            ).filter(Boolean)
            .length;

        return `

        <div class="dexEntry">

            🐷 Common

            ${
                discovered.common
                ? "✅"
                : "❌"
            }

        </div>

        <div class="dexEntry">

            👑 Golden

            ${
                discovered.golden
                ? "✅"
                : "❌"
            }

        </div>

        <div class="dexEntry">

            🌈 Rainbow

            ${
                discovered.rainbow
                ? "✅"
                : "❌"
            }

        </div>

        <div class="dexEntry">

            👻 Ghost

            ${
                discovered.ghost
                ? "✅"
                : "❌"
            }

        </div>

        <hr>

        <div class="dexProgress">

            ${found} / 4 Discovered

        </div>

    `;
    }
}
