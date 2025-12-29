
function convertNumberToK(num) {
    if (!num) return '0'; // Handles null, undefined, and 0
    // Check for Millions
    if (num >= 1000000) {
        return parseFloat((num / 1000000).toFixed(2)) + 'M';
    }

    // Check for Thousands
    if (num >= 1000) {
        return parseFloat((num / 1000).toFixed(1)) + 'k';
    }

    return num.toString();
}

export default convertNumberToK;