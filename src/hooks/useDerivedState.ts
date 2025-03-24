import { shallowEqual } from 'react-redux';
import { useEffect, useState } from 'react';
import usePrevious from './usePrevious';

const useDerivedState = <T>(initialState: T | (() => T)) => {
  const computedState = initialState instanceof Function ? initialState() : initialState;

  const [state, setState] = useState<T>(computedState);

  const prevState = usePrevious<T>(computedState);

  useEffect(() => {
    if (!shallowEqual(computedState, prevState)) {
      setState(computedState);
    }
  }, [computedState, prevState]);

  return [state, setState] as const;
};

export default useDerivedState;
