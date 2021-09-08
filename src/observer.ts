type Listener<EventType> = (ev: EventType) => void;

type subscribe<EventType> = (listener: Listener<EventType>) => () => void;
type publish<EventType> = (event: EventType) => void;

function createObserver<E>(): {
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

interface BeforeSetEvent<T> {
  value: T;
  newVal: T;
}
interface AfterSetEvent<T> {
  value: T;
}

interface DatabaseObs<T extends BaseRecord> {
  set(newVal: T): void;
  get(id: string): T | undefined;

  onBeforeAdd(listener: Listener<BeforeSetEvent<T>>): () => void;
  onAfterAdd(listener: Listener<AfterSetEvent<T>>): () => void;
}

function createDBObs<T extends BaseRecord>() {
  class InMemoryDB implements DatabaseObs<T> {
    private db: Record<string, T> = {};

    private beforeAddListeners = createObserver<BeforeSetEvent<T>>();
    private afterAddListeners = createObserver<AfterSetEvent<T>>();

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
  }

  const db = new InMemoryDB();
  return db;
}
