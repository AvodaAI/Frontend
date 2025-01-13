//src/types/index.ts
// Central type exports
export * from "./user";
export * from "./invitation";
export * from "./organization";

export interface Status {
  label: string;
  value: string;
}
export interface FilterableColumns {
  id: string;
  title: string;
  options: Status[];
}
