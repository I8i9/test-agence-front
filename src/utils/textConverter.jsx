export function capitalizeWords(str) {
    try {
        if (typeof str !== 'string') return '';
        return str
            .split(' ')
            .map(word =>
                word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
            )
            .join(' ');
    // eslint-disable-next-line no-unused-vars
    } catch (e) {
        return str;
    }
}