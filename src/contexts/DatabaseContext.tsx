
import React, { createContext, useContext, ReactNode } from 'react';
import { Database, Table, Column, Row, ColumnType, DatabaseConnection } from '@/types';
import { useDatabaseState } from '@/hooks/useDatabaseState';
import { useDatabaseOperations } from '@/hooks/useDatabaseOperations';
import { useTableOperations } from '@/hooks/useTableOperations';
import { useColumnOperations } from '@/hooks/useColumnOperations';
import { useRowOperations } from '@/hooks/useRowOperations';

interface DatabaseContextType {
  databases: Database[];
  currentDatabase: Database | null;
  currentTable: Table | null;
  isConnected: boolean;
  isLoading: boolean;
  connectionDetails: DatabaseConnection | null;
  setConnectionDetails: (details: DatabaseConnection) => void;
  connectToDatabase: () => Promise<void>;
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
  const {
    databases,
    setDatabases,
    currentDatabaseId,
    setCurrentDatabaseId,
    currentTableId,
    setCurrentTableId,
    isConnected,
    isLoading,
    connectionDetails,
    setConnectionDetails,
    currentDatabase,
    currentTable,
    connectToDatabase,
    disconnectFromDatabase
  } = useDatabaseState();

  const {
    addDatabase,
    deleteDatabase,
    duplicateDatabase,
    selectDatabase
  } = useDatabaseOperations(databases, setDatabases, setCurrentDatabaseId, setCurrentTableId);

  const {
    addTable,
    deleteTable,
    duplicateTable,
    selectTable
  } = useTableOperations(databases, setDatabases, setCurrentTableId);

  const {
    addColumn,
    deleteColumn,
    duplicateColumn,
    updateColumn
  } = useColumnOperations(databases, setDatabases);

  const {
    addRow,
    updateRow,
    deleteRow
  } = useRowOperations(databases, setDatabases);

  return (
    <DatabaseContext.Provider
      value={{
        databases,
        currentDatabase,
        currentTable,
        isConnected,
        isLoading,
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
