function createObserver() {
    let listeners = [];
    return {
        subscribe: (listener) => {
            listeners.push(listener);
            return () => {
                listeners.filter((l) => l !== listener);
            };
        },
        publish: (event) => {
            listeners.forEach((l) => l(event));
        },
    };
}
function createDBVis() {
    class InMemoryDB {
        constructor() {
            this.db = {};
            this.beforeAddListeners = createObserver();
            this.afterAddListeners = createObserver();
        }
        set(newVal) {
            this.beforeAddListeners.publish({
                value: this.db[newVal.id],
                newVal,
            });
            this.db[newVal.id] = newVal;
            this.afterAddListeners.publish({
                value: newVal,
            });
        }
        get(id) {
            return this.db[id];
        }
        onBeforeAdd(listener) {
            return this.beforeAddListeners.subscribe(listener);
        }
        onAfterAdd(listener) {
            return this.afterAddListeners.subscribe(listener);
        }
        visit(visitor) {
            Object.values(this.db).forEach(visitor);
        }
        selectBest(scoreStrat) {
            const found = {
                max: 0,
                item: undefined,
            };
            Object.values(this.db).reduce((f, item) => {
                const score = scoreStrat(item);
                if (score > f.max) {
                    f.max = score;
                    f.item = item;
                }
                return f;
            }, found);
            return found.item;
        }
    }
    const db = new InMemoryDB();
    return db;
}
const PersonnageDB = createDBVis();
PersonnageDB.set({
    id: "asd",
    name: "joe",
    alive: true,
    age: 21,
});
PersonnageDB.set({
    id: "666",
    name: "Mama",
    alive: false,
    age: 69,
});
PersonnageDB.visit((person) => console.log(person.id));
console.log(PersonnageDB.selectBest(({ age }) => age));
//# sourceMappingURL=visitor.js.map