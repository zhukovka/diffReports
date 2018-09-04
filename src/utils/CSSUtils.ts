export function classNameFrom (prop: any, prefix?: string): string {
    return (prop || "") && `${prefix || ""}${prop}`;
}