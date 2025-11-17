export const getInitials = (fullName: string): string => {
        if (!fullName || fullName.trim() === '') return '';

        // Remove extra spaces and split by space
        const nameParts = fullName.trim().split(/\s+/);

        // If there are multiple words (e.g., "Tran Phuoc Loc")
        if (nameParts.length > 1) {
                // Get first letter of first word and first letter of last word
                const firstInitial = nameParts[0][0];
                const lastInitial = nameParts[nameParts.length - 1][0];
                return (lastInitial + firstInitial).toUpperCase();
        }

        // If single word (e.g., "TranPhuocLoc")
        // Just return first letter
        return nameParts[0][0].toUpperCase();
};

export const formatDate = (dateString: Date | null) => {
        if (!dateString) return '';
        return new Date(dateString).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
        });
};