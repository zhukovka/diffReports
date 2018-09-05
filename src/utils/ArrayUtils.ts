export function flatten (array: any[]) {
    return array.reduce((acc, val) => acc.concat(val), []);
}