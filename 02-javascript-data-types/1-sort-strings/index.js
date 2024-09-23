/**
 * sortStrings - sorts array of string by two criteria "asc" or "desc"
 * @param {string[]} arr - the array of strings
 * @param {string} [param="asc"] param - the sorting type "asc" or "desc"
 * @returns {string[]}
 */
export function sortStrings(arr, param = 'asc') {
  const cpArr = [...arr];
  const collator = new Intl.Collator(['ru', 'en'], {sensitivity: 'variant', caseFirst: 'upper'});

  if (param === 'asc') {
    cpArr.sort((a, b) => collator.compare(a, b));
  } else if ('desc') {
    cpArr.sort((a, b) => collator.compare(b, a));
  }

  return cpArr;
}
