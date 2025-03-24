import { __DEV__ } from '@/config';

class Logger {
  public log(...args: any[]) {
    if (__DEV__) {
      console.log(...args);
    }
  }
}

export default new Logger();
