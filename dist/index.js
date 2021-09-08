class InMemoryDB {
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
const humanDB = new InMemoryDB();
humanDB.set({
    id: "1",
    name: "Joe",
    age: 25,
    alive: true,
});
console.log(humanDB.get("1"));
//# sourceMappingURL=index.js.map