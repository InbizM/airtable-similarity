
import { useCallback } from 'react';
import { Database, Table } from '@/types';
import { generateId } from '@/lib/utils';

export function useTableOperations(
  databases: Database[],
  setDatabases: React.Dispatch<React.SetStateAction<Database[]>>,
  setCurrentTableId: React.Dispatch<React.SetStateAction<string | null>>
) {
  const addTable = useCallback((databaseId: string, name: string) => {
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
  }, [databases, setDatabases, setCurrentTableId]);

  const deleteTable = useCallback((databaseId: string, tableId: string) => {
    setDatabases(
      databases.map(db => 
        db.id === databaseId 
          ? { ...db, tables: db.tables.filter(t => t.id !== tableId) } 
          : db
      )
    );
    setCurrentTableId(prev => prev === tableId ? null : prev);
  }, [databases, setDatabases, setCurrentTableId]);

  const duplicateTable = useCallback((databaseId: string, tableId: string) => {
    const database = databases.find(db => db.id === databaseId);
    const tableToDuplicate = database?.tables.find(t => t.id === tableId);
    
    if (database && tableToDuplicate) {
      const duplicatedTable: Table = {
        ...tableToDuplicate,
        id: generateId(),
        name: `${tableToDuplicate.name} (copia)`,
        columns: tableToDuplicate.columns.map(col => ({ ...col, id: generateId() })),
        rows: tableToDuplicate.rows.map(row => {
          const newRow = { id: generateId() };
          Object.keys(row).forEach(key => {
            if (key !== 'id') {
              newRow[key] = row[key];
            }
          });
          return newRow;
        }),
      };
      
      setDatabases(
        databases.map(db => 
          db.id === databaseId 
            ? { ...db, tables: [...db.tables, duplicatedTable] } 
            : db
        )
      );
    }
  }, [databases, setDatabases]);

  const selectTable = useCallback((tableId: string) => {
    setCurrentTableId(tableId);
  }, [setCurrentTableId]);

  return {
    addTable,
    deleteTable,
    duplicateTable,
    selectTable
  };
}
