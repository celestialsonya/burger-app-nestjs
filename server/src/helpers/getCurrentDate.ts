export function getCurrentDate(): string {
    let date: any = new Date(Date.now());
    const time = date.toLocaleTimeString().slice(0, 5);
    date = `date: ${date.toLocaleDateString()}, time: ${time}`;

    return date;
}
