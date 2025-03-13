
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Database, Table, Column, Row, ColumnType } from '@/types';
import { generateId } from '@/lib/utils';
import { toast } from '@/components/ui/use-toast';

interface DatabaseContextType {
  databases: Database[];
  currentDatabase: Database | null;
  currentTable: Table | null;
  isConnected: boolean;
  connectionDetails: {
    host: string;
    port: number;
    username: string;
    password: string;
    database?: string;
  } | null;
  setConnectionDetails: (details: any) => void;
  connectToDatabase: () => void;
  disconnectFromDatabase: () => void;
  addDatabase: (name: string) => void;
  deleteDatabase: (id: string) => void;
  duplicateDatabase: (id: string) => void;
  selectDatabase: (id: string) => void;
  addTable: (databaseId: string, name: string) => void;
  deleteTable: (databaseId: string, tableId: string) => void;
  duplicateTable: (databaseId: string, tableId: string) => void;
  selectTable: (tableId: string) => void;
  addColumn: (tableId: string, name: string, type: ColumnType) => void;
  deleteColumn: (tableId: string, columnId: string) => void;
  duplicateColumn: (tableId: string, columnId: string) => void;
  updateColumn: (tableId: string, columnId: string, updates: Partial<Column>) => void;
  addRow: (tableId: string, data: any) => void;
  updateRow: (tableId: string, rowId: string, data: any) => void;
  deleteRow: (tableId: string, rowId: string) => void;
}

const DatabaseContext = createContext<DatabaseContextType | undefined>(undefined);

export function DatabaseProvider({ children }: { children: ReactNode }) {
  const [databases, setDatabases] = useState<Database[]>([]);
  const [currentDatabaseId, setCurrentDatabaseId] = useState<string | null>(null);
  const [currentTableId, setCurrentTableId] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionDetails, setConnectionDetails] = useState<any>(null);

  const currentDatabase = databases.find(db => db.id === currentDatabaseId) || null;
  const currentTable = currentDatabase?.tables.find(table => table.id === currentTableId) || null;

  const connectToDatabase = () => {
    if (connectionDetails) {
      setIsConnected(true);
      toast({
        title: "Conexión exitosa",
        description: `Conectado a ${connectionDetails.host}:${connectionDetails.port}`,
      });
    }
  };

  const disconnectFromDatabase = () => {
    setIsConnected(false);
    toast({
      title: "Desconectado",
      description: "Se ha cerrado la conexión a la base de datos",
    });
  };

  const addDatabase = (name: string) => {
    const newDatabase: Database = {
      id: generateId(),
      name,
      tables: [],
    };
    setDatabases([...databases, newDatabase]);
    setCurrentDatabaseId(newDatabase.id);
  };

  const deleteDatabase = (id: string) => {
    setDatabases(databases.filter(db => db.id !== id));
    if (currentDatabaseId === id) {
      setCurrentDatabaseId(null);
      setCurrentTableId(null);
    }
  };

  const duplicateDatabase = (id: string) => {
    const dbToDuplicate = databases.find(db => db.id === id);
    if (dbToDuplicate) {
      const duplicatedDB: Database = {
        ...dbToDuplicate,
        id: generateId(),
        name: `${dbToDuplicate.name} (copia)`,
        tables: dbToDuplicate.tables.map(table => ({
          ...table,
          id: generateId(),
          columns: table.columns.map(col => ({ ...col, id: generateId() })),
          rows: table.rows.map(row => ({ ...row, id: generateId() })),
        })),
      };
      setDatabases([...databases, duplicatedDB]);
    }
  };

  const selectDatabase = (id: string) => {
    setCurrentDatabaseId(id);
    setCurrentTableId(null);
  };

  const addTable = (databaseId: string, name: string) => {
    const newTable: Table = {
      id: generateId(),
      name,
      columns: [],
      rows: [],
    };
    setDatabases(
      databases.map(db => 
        db.id === databaseId 
          ? { ...db, tables: [...db.tables, newTable] } 
          : db
      )
    );
    setCurrentTableId(newTable.id);
  };

  const deleteTable = (databaseId: string, tableId: string) => {
    setDatabases(
      databases.map(db => 
        db.id === databaseId 
          ? { ...db, tables: db.tables.filter(t => t.id !== tableId) } 
          : db
      )
    );
    if (currentTableId === tableId) {
      setCurrentTableId(null);
    }
  };

  const duplicateTable = (databaseId: string, tableId: string) => {
    const database = databases.find(db => db.id === databaseId);
    const tableToDuplicate = database?.tables.find(t => t.id === tableId);
    
    if (database && tableToDuplicate) {
      const duplicatedTable: Table = {
        ...tableToDuplicate,
        id: generateId(),
        name: `${tableToDuplicate.name} (copia)`,
        columns: tableToDuplicate.columns.map(col => ({ ...col, id: generateId() })),
        rows: tableToDuplicate.rows.map(row => ({ ...row, id: generateId() })),
      };
      
      setDatabases(
        databases.map(db => 
          db.id === databaseId 
            ? { ...db, tables: [...db.tables, duplicatedTable] } 
            : db
        )
      );
    }
  };

  const selectTable = (tableId: string) => {
    setCurrentTableId(tableId);
  };

  const addColumn = (tableId: string, name: string, type: ColumnType) => {
    const newColumn: Column = {
      id: generateId(),
      name,
      type,
    };
    
    setDatabases(
      databases.map(db => ({
        ...db,
        tables: db.tables.map(table => 
          table.id === tableId 
            ? { 
                ...table, 
                columns: [...table.columns, newColumn],
                rows: table.rows.map(row => ({ 
                  ...row, 
                  [newColumn.id]: null 
                }))
              } 
            : table
        )
      }))
    );
  };

  const deleteColumn = (tableId: string, columnId: string) => {
    setDatabases(
      databases.map(db => ({
        ...db,
        tables: db.tables.map(table => 
          table.id === tableId 
            ? { 
                ...table, 
                columns: table.columns.filter(col => col.id !== columnId),
                rows: table.rows.map(row => {
                  const { [columnId]: removed, ...rest } = row;
                  return rest;
                })
              } 
            : table
        )
      }))
    );
  };

  const duplicateColumn = (tableId: string, columnId: string) => {
    setDatabases(
      databases.map(db => {
        return {
          ...db,
          tables: db.tables.map(table => {
            if (table.id !== tableId) return table;
            
            const columnToDuplicate = table.columns.find(col => col.id === columnId);
            if (!columnToDuplicate) return table;
            
            const newColumn: Column = {
              ...columnToDuplicate,
              id: generateId(),
              name: `${columnToDuplicate.name} (copia)`,
            };
            
            return {
              ...table,
              columns: [...table.columns, newColumn],
              rows: table.rows.map(row => ({
                ...row,
                [newColumn.id]: row[columnId]
              }))
            };
          })
        };
      })
    );
  };

  const updateColumn = (tableId: string, columnId: string, updates: Partial<Column>) => {
    setDatabases(
      databases.map(db => ({
        ...db,
        tables: db.tables.map(table => 
          table.id === tableId 
            ? { 
                ...table, 
                columns: table.columns.map(col => 
                  col.id === columnId ? { ...col, ...updates } : col
                )
              } 
            : table
        )
      }))
    );
  };

  const addRow = (tableId: string, data: any) => {
    const newRow: Row = {
      id: generateId(),
      ...data
    };
    
    setDatabases(
      databases.map(db => ({
        ...db,
        tables: db.tables.map(table => 
          table.id === tableId 
            ? { ...table, rows: [...table.rows, newRow] } 
            : table
        )
      }))
    );
  };

  const updateRow = (tableId: string, rowId: string, data: any) => {
    setDatabases(
      databases.map(db => ({
        ...db,
        tables: db.tables.map(table => 
          table.id === tableId 
            ? { 
                ...table, 
                rows: table.rows.map(row => 
                  row.id === rowId ? { ...row, ...data } : row
                )
              } 
            : table
        )
      }))
    );
  };

  const deleteRow = (tableId: string, rowId: string) => {
    setDatabases(
      databases.map(db => ({
        ...db,
        tables: db.tables.map(table => 
          table.id === tableId 
            ? { ...table, rows: table.rows.filter(row => row.id !== rowId) } 
            : table
        )
      }))
    );
  };

  return (
    <DatabaseContext.Provider
      value={{
        databases,
        currentDatabase,
        currentTable,
        isConnected,
        connectionDetails,
        setConnectionDetails,
        connectToDatabase,
        disconnectFromDatabase,
        addDatabase,
        deleteDatabase,
        duplicateDatabase,
        selectDatabase,
        addTable,
        deleteTable,
        duplicateTable,
        selectTable,
        addColumn,
        deleteColumn,
        duplicateColumn,
        updateColumn,
        addRow,
        updateRow,
        deleteRow,
      }}
    >
      {children}
    </DatabaseContext.Provider>
  );
}

export const useDatabase = () => {
  const context = useContext(DatabaseContext);
  if (context === undefined) {
    throw new Error('useDatabase must be used within a DatabaseProvider');
  }
  return context;
};
