import { afterEach, vi } from 'vitest';
import * as zustand from 'zustand';

const { create: actualCreate } =
  await vi.importActual<typeof zustand>('zustand');

// hold reset functions for all stores declared in the app
const storeResetFns = new Set<() => void>();

const createUncurried = <T>(stateCreator: zustand.StateCreator<T>) => {
  const store = actualCreate(stateCreator); // create an actual store

  storeResetFns.add(() => {
    store.setState(store.getInitialState(), true);
  });

  return store;
};

// when creating a store, we get its initial state, create a reset function and add it in the set
const create = (<T>(stateCreator: zustand.StateCreator<T>) => {
  console.log('zustand create mock');

  // to support curried version of create
  return typeof stateCreator === 'function'
    ? createUncurried(stateCreator)
    : createUncurried;
}) as typeof zustand.create;

// reset all stores after each test run - important - this is why you need to mock
afterEach(() => {
  storeResetFns.forEach((fn) => fn());
});

export { create, storeResetFns };
