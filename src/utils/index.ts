/**
 * 函数防抖
 * @param {function} 需要防抖的函数
 * @param {number} 防抖时间
 * @param {immediate}
 */
export function debounce(func: Function, wait: number, immediate = false) {
  let timeout: any;
  let result: Function;
  let args: IArguments | null;
  let context: void | null;
  let timeStamp: number;

  function later() {
    const last = Date.now() - timeStamp;
    if (last < wait && last >= 0) {
      timeout = setTimeout(later, wait - last);
    } else {
      timeout = null;
      if (!immediate) {
        result = func.apply(context, args);
        context = args = null;
      }
    }
  }

  interface Debounced {
    clear: Function;
    flush: Function;
    (o?: any, p?: any): () => void | undefined;
  }

  const debounced = function (this: void) {
    context = this;
    // eslint-disable-next-line prefer-rest-params
    args = arguments;
    const callNow = immediate && !timeout;
    timeStamp = Date.now();
    if (!timeout) timeout = setTimeout(later, wait);
    if (callNow) {
      result = func.apply(context, args);
      context = args = null;
    }
    return result;
  } as unknown as Debounced;

  debounced.clear = function () {
    if (!timeout) {
      clearTimeout(timeout);
      timeout = null;
    }
  };

  debounced.flush = function () {
    if (timeout) {
      result = func.apply(context, args);
      context = args = null;
      clearTimeout(timeout);
      timeout = null;
    }
  };

  return debounced;
}
