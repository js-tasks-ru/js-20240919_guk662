/**
 * createGetter - creates function getter which allows select value from object
 * @param {string} path - the strings path separated by dot
 * @returns {function} - function-getter which allow get value from object by set path
 */
export function createGetter(path) {
  return (obj) => {
    let currentObj = obj;

    for (const prop of path.split('.')) {
      if (currentObj.hasOwnProperty(prop)) {
        currentObj = currentObj[prop];
      }
      else { return; }
    }

    return currentObj;
  };
}