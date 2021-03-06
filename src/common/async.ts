export enum AsyncValueTag {
  INIT = "INIT",
  LOADING = "LOADING",
  SUCCESS = "SUCCESS",
  ERROR = "ERROR",
}

export type AsyncValue<T> =
  | { state: AsyncValueTag.INIT }
  | { state: AsyncValueTag.LOADING; results: T | null }
  | { state: AsyncValueTag.SUCCESS; results: T }
  // Normally we would also want to have some kind of payload here, such as
  // `error: string`, but since we don't use that in this demo we omit it here.
  | { state: AsyncValueTag.ERROR };

export interface CaseHandlers<T, R> {
  init: () => R;
  loading: (results: T | null) => R;
  success: (results: T) => R;
  error: () => R;
}

// Convenience functions for constructing the above types, since TypeScript
// doesn't make working with tagged unions as easy as say, Haskell or Elm
export const init = <T>(): AsyncValue<T> => ({ state: AsyncValueTag.INIT });
export const loading = <T>(previousResults: T | null): AsyncValue<T> => ({
  results: previousResults,
  state: AsyncValueTag.LOADING,
});
export const success = <T>(results: T): AsyncValue<T> => ({
  results,
  state: AsyncValueTag.SUCCESS,
});
export const error = <T>(): AsyncValue<T> => ({
  state: AsyncValueTag.ERROR,
});

export const caseOf = <T, R>(
  asyncValue: AsyncValue<T>,
  handlers: CaseHandlers<T, R>,
) => {
  switch (asyncValue.state) {
    case AsyncValueTag.INIT:
      return handlers.init();
    case AsyncValueTag.LOADING:
      return handlers.loading(asyncValue.results);
    case AsyncValueTag.SUCCESS:
      return handlers.success(asyncValue.results);
    case AsyncValueTag.ERROR:
      return handlers.error();
  }
};
