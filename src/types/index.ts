
export interface Database {
  id: string;
  name: string;
  tables: Table[];
}

export interface Table {
  id: string;
  name: string;
  columns: Column[];
  rows: Row[];
}

export interface Column {
  id: string;
  name: string;
  type: ColumnType;
  options?: any;
}

export interface Row {
  id: string;
  [key: string]: any;
}

export type ColumnType = 
  | 'text'
  | 'number'
  | 'date'
  | 'boolean'
  | 'select'
  | 'multiselect';

export interface DatabaseConnection {
  host: string;
  port: number;
  username: string;
  password: string;
  database?: string;
}
