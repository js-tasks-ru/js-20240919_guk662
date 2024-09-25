/**
 * createGetter - creates function getter which allows select value from object
 * @param {string} path - the strings path separated by dot
 * @returns {function} - function-getter which allow get value from object by set path
 */
export function createGetter(path) {
  const props = path.split('.');
  return (obj) => {
    if (Object.keys(obj).length === 0) {
      return;
    }

    let currentProp = obj;

    for (const prop of props) {
      if (currentProp === undefined) {
        return;
      }
      currentProp = currentProp[prop];
    }

    return currentProp;
  };
}
