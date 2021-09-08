function createDBS<T extends BaseRecord>() {
  class InMemoryDBS implements Database<T> {
    private db: Record<string, T> = {};

    public set(newVal: T) {
      this.db[newVal.id] = newVal;
    }

    get(id: string) {
      return this.db[id];
    }
  }

  const db = new InMemoryDBS();
  return db;
}

const humanDBS = createDBS<Person>();

//exported const becomes Singleton if imported elsewhere
export default humanDBS;
