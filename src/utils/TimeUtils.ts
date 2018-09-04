export function formatTime (sec: number): string {
    const s = sec % 60;
    const min = (sec / 60) | 0;
    const h = (min / 60) | 0;
    // @ts-ignore
    return `${String(h).padStart(2, '0')}:${String(min % 60).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}