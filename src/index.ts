interface Person {
  id: string;
  name: string;
  age: number;
  alive: boolean;
}

interface BaseRecord {
  id: string;
}

interface Database<T extends BaseRecord> {
  set(newVal: T): void;
  get(id: string): T | undefined;
}

class InMemoryDB<T extends BaseRecord> implements Database<T> {
  private db: Record<string, T> = {};

  public set(newVal: T) {
    this.db[newVal.id] = newVal;
  }

  get(id: string) {
    return this.db[id];
  }
}

const humanDB = new InMemoryDB<Person>();

humanDB.set({
  id: "1",
  name: "Joe",
  age: 25,
  alive: true,
});

console.log(humanDB.get("1"));
