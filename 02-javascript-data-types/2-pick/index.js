/**
 * pick - Creates an object composed of the picked object properties:
 * @param {object} obj - the source object
 * @param {...string} fields - the properties paths to pick
 * @returns {object} - returns the new object
 */
export const pick = (obj, ...fields) => {
  let entries = Object.entries(obj);
  let entriesMap = entries.filter(([key, _]) => fields.includes(key));
  return Object.fromEntries(entriesMap);
};