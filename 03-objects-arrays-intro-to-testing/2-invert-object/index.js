/**
 * invertObj - should swap object keys and values
 * @param {object} obj - the initial object
 * @returns {object | undefined} - returns new object or undefined if nothing did't pass
 */
export function invertObj(obj) {
  if (obj === undefined || Object.keys(obj).length === 0) {
    return obj;
  }
      
  const pairs = Object.entries(obj);
  const newObj = {};
      
  for (const [key, val] of pairs) {
    newObj[val] = key;
  }
      
  return newObj;
}
