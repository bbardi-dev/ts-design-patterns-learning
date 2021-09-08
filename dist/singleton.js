"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function createDBS() {
    class InMemoryDBS {
        constructor() {
            this.db = {};
        }
        set(newVal) {
            this.db[newVal.id] = newVal;
        }
        get(id) {
            return this.db[id];
        }
    }
    const db = new InMemoryDBS();
    return db;
}
const humanDBS = createDBS();
exports.default = humanDBS;
//# sourceMappingURL=singleton.js.map