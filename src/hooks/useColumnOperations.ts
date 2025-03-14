
import { useCallback } from 'react';
import { Database, Column, ColumnType } from '@/types';
import { generateId } from '@/lib/utils';

export function useColumnOperations(
  databases: Database[],
  setDatabases: React.Dispatch<React.SetStateAction<Database[]>>
) {
  const addColumn = useCallback((tableId: string, name: string, type: ColumnType) => {
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
                rows: table.rows.map(row => {
                  // Ensure we preserve the row id and add the new column with a default value
                  return {
                    ...row,
                    [newColumn.id]: null
                  };
                })
              } 
            : table
        )
      }))
    );
  }, [databases, setDatabases]);

  const deleteColumn = useCallback((tableId: string, columnId: string) => {
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
  }, [databases, setDatabases]);

  const duplicateColumn = useCallback((tableId: string, columnId: string) => {
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
              rows: table.rows.map(row => {
                // Make sure we preserve the id and copy the value from the duplicated column
                return {
                  ...row,
                  [newColumn.id]: row[columnId]
                };
              })
            };
          })
        };
      })
    );
  }, [databases, setDatabases]);

  const updateColumn = useCallback((tableId: string, columnId: string, updates: Partial<Column>) => {
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
  }, [databases, setDatabases]);

  return {
    addColumn,
    deleteColumn,
    duplicateColumn,
    updateColumn
  };
}
