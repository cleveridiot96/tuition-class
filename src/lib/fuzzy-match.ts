
// Simple fuzzy matching function
export function fuzzyMatch(needle: string, haystack: string): boolean {
  if (!needle || !haystack) return false;
  
  needle = needle.toLowerCase();
  haystack = haystack.toLowerCase();
  
  // Direct match
  if (haystack.includes(needle)) return true;
  
  // Fuzzy match
  let hIdx = 0;
  let nIdx = 0;
  
  while (hIdx < haystack.length && nIdx < needle.length) {
    if (needle[nIdx] === haystack[hIdx]) {
      nIdx++;
    }
    hIdx++;
  }
  
  return nIdx === needle.length;
}
