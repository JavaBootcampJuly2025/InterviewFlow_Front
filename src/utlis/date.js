export function formatDateTimeLocal(isoString) {
    if (!isoString) return '';

    const date = new Date(isoString); // UTC or local ISO string
    const tzOffset = date.getTimezoneOffset() * 60000; // in milliseconds
    const localISOTime = new Date(date.getTime() - tzOffset).toISOString().slice(0, 16);

    return localISOTime;
}

export function toUTCISOString(localString) {
    const localDate = new Date(localString);
    return new Date(localDate.getTime() - localDate.getTimezoneOffset() * 60000).toISOString();
}