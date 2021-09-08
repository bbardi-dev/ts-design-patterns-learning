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
function createDBObs() {
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
    }
    const db = new InMemoryDB();
    return db;
}
//# sourceMappingURL=observer.js.map