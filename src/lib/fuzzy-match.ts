
// Enhanced fuzzy matching utility for dropdown suggestions
export const fuzzyMatch = (input: string, target: string): boolean => {
  // Early return for exact matches
  if (input === target) return true;
  
  // Clean and normalize strings
  const cleanInput = input.toLowerCase().replace(/[^a-zA-Z0-9]/g, '');
  const cleanTarget = target.toLowerCase().replace(/[^a-zA-Z0-9]/g, '');
  
  // Empty input should match everything
  if (cleanInput === '') return true;
  
  // Check for direct inclusion first
  if (cleanTarget.includes(cleanInput)) return true;
  
  // Calculate similarity for fuzzy matching
  let matches = 0;
  let inputIndex = 0;
  
  // Check for character matches in sequence
  for (let targetIndex = 0; targetIndex < cleanTarget.length && inputIndex < cleanInput.length; targetIndex++) {
    if (cleanInput[inputIndex] === cleanTarget[targetIndex]) {
      matches++;
      inputIndex++;
    }
  }
  
  // Consider it a match if 60% of characters match in sequence
  return matches / cleanInput.length > 0.6;
};
