interface DatabaseVis<T extends BaseRecord> {
  set(newVal: T): void;
  get(id: string): T | undefined;

  onBeforeAdd(listener: Listener<BeforeSetEvent<T>>): () => void;
  onAfterAdd(listener: Listener<AfterSetEvent<T>>): () => void;

  visit(visitor: (item: T) => void): void;
}

function createObserverVis<E>(): {
  subscribe: subscribe<E>;
  publish: publish<E>;
} {
  let listeners: Listener<E>[] = [];
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

function createDBVis<T extends BaseRecord>() {
  class InMemoryDB implements DatabaseObs<T> {
    private db: Record<string, T> = {};

    private beforeAddListeners = createObserverVis<BeforeSetEvent<T>>();
    private afterAddListeners = createObserverVis<AfterSetEvent<T>>();

    public set(newVal: T) {
      this.beforeAddListeners.publish({
        value: this.db[newVal.id],
        newVal,
      });
      this.db[newVal.id] = newVal;

      this.afterAddListeners.publish({
        value: newVal,
      });
    }

    public get(id: string) {
      return this.db[id];
    }

    onBeforeAdd(listener: Listener<BeforeSetEvent<T>>) {
      return this.beforeAddListeners.subscribe(listener);
    }
    onAfterAdd(listener: Listener<AfterSetEvent<T>>) {
      return this.afterAddListeners.subscribe(listener);
    }

    //Visitor
    visit(visitor: (item: T) => void): void {
      Object.values(this.db).forEach(visitor);
    }

    //Strategy
    selectBest(scoreStrat: (item: T) => number): T | undefined {
      const found: {
        max: number;
        item: T | undefined;
      } = {
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

const PersonnageDB = createDBVis<Person>();

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
