function createDBF() {
    class InMemoryDBF {
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
    return InMemoryDBF;
}
const HumanDBF = createDBF();
const humanDBF = new HumanDBF();
humanDBF.set({
    id: "2",
    name: "Bruh",
    age: 7,
    alive: true,
});
const humanDBF2 = new HumanDBF();
console.log("?", humanDBF2.get("2"));
//# sourceMappingURL=factory.js.map