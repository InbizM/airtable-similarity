
import { useCallback } from 'react';
import { Database, Row } from '@/types';
import { generateId } from '@/lib/utils';

export function useRowOperations(
  databases: Database[],
  setDatabases: React.Dispatch<React.SetStateAction<Database[]>>
) {
  const addRow = useCallback((tableId: string, data: any) => {
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
  }, [databases, setDatabases]);

  const updateRow = useCallback((tableId: string, rowId: string, data: any) => {
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
  }, [databases, setDatabases]);

  const deleteRow = useCallback((tableId: string, rowId: string) => {
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
  }, [databases, setDatabases]);

  return {
    addRow,
    updateRow,
    deleteRow
  };
}
