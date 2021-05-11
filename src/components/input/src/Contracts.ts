export type InputType =
    | 'hidden'
    | "text"
    | "currency"
    | "password"
    | "email"
    | "number"
    | "search"
    | "select"
    | "file"
    | "decimal"
    | "html";
export interface Option {
    label: string,
    value: any
}