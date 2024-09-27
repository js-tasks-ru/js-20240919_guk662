/**
 * trimSymbols - removes consecutive identical symbols if they quantity bigger that size
 * @param {string} string - the initial string
 * @param {number} size - the allowed size of consecutive identical symbols
 * @returns {string} - the new string without extra symbols according passed size
 */
export function trimSymbols(string, size) {
  let currentSize = 0;
  let trimString = '';

  if (size === undefined) { return string; }

  for (const sym of string) {
    if (sym !== trimString.at(-1)) { currentSize = 0; }
    
    if (currentSize < size) {
      trimString += sym;
      currentSize++;
    }
    else { continue; }
  }

  return trimString;
}
