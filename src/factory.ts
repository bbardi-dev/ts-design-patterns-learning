function createDBF<T extends BaseRecord>() {
  class InMemoryDBF implements Database<T> {
    private db: Record<string, T> = {};

    public set(newVal: T) {
      this.db[newVal.id] = newVal;
    }

    get(id: string) {
      return this.db[id];
    }
  }

  return InMemoryDBF;
}

const HumanDBF = createDBF<Person>();
const humanDBF = new HumanDBF();

humanDBF.set({
  id: "2",
  name: "Bruh",
  age: 7,
  alive: true,
});

const humanDBF2 = new HumanDBF();

console.log("?", humanDBF2.get("2")); //undefined
