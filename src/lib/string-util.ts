export const getInitials = (fullName: string): string => {
  if (!fullName || fullName.trim() === '') return '';

  // Remove extra spaces and split by space
  const nameParts = fullName.trim().split(/\s+/);

  // If there are multiple words (e.g., "Tran Phuoc Loc")
  if (nameParts.length > 1) {
    // Get first letter of first word and first letter of last word
    const firstPart = nameParts[0];
    const lastPart = nameParts[nameParts.length - 1];
    
    // Check if parts exist and have at least one character
    if (firstPart && lastPart && firstPart[0] && lastPart[0]) {
      const firstInitial = firstPart[0];
      const lastInitial = lastPart[0];
      return (lastInitial + firstInitial).toUpperCase();
    }
  }

  // If single word (e.g., "TranPhuocLoc")
  // Just return first letter
  const firstPart = nameParts[0];
  if (firstPart && firstPart[0]) {
    return firstPart[0].toUpperCase();
  }

  return '';
};

 export const formatDate = (date: Date | null) => {
                if (!date) return '';
                // Use Intl.DateTimeFormat with explicit locale and timezone to ensure consistency
                // between server and client rendering (prevents hydration mismatch)
                const formatter = new Intl.DateTimeFormat('en-US', {
                        day: 'numeric',
                        month: 'long',
                        timeZone: 'UTC' // Use UTC to ensure consistent formatting
                });
                return formatter.format(new Date(date));
        };