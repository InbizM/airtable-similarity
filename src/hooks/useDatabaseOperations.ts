
import { useCallback } from 'react';
import { Database } from '@/types';
import { generateId } from '@/lib/utils';

export function useDatabaseOperations(
  databases: Database[],
  setDatabases: React.Dispatch<React.SetStateAction<Database[]>>,
  setCurrentDatabaseId: React.Dispatch<React.SetStateAction<string | null>>,
  setCurrentTableId: React.Dispatch<React.SetStateAction<string | null>>
) {
  const addDatabase = useCallback((name: string) => {
    const newDatabase: Database = {
      id: generateId(),
      name,
      tables: [],
    };
    setDatabases([...databases, newDatabase]);
    setCurrentDatabaseId(newDatabase.id);
  }, [databases, setDatabases, setCurrentDatabaseId]);

  const deleteDatabase = useCallback((id: string) => {
    setDatabases(databases.filter(db => db.id !== id));
    setCurrentDatabaseId(prev => prev === id ? null : prev);
    setCurrentTableId(null);
  }, [databases, setDatabases, setCurrentDatabaseId, setCurrentTableId]);

  const duplicateDatabase = useCallback((id: string) => {
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
          rows: table.rows.map(row => {
            const newRow = { id: generateId() };
            // Preserve all properties except id, which we've just created
            Object.keys(row).forEach(key => {
              if (key !== 'id') {
                newRow[key] = row[key];
              }
            });
            return newRow;
          }),
        })),
      };
      setDatabases([...databases, duplicatedDB]);
    }
  }, [databases, setDatabases]);

  const selectDatabase = useCallback((id: string) => {
    setCurrentDatabaseId(id);
    setCurrentTableId(null);
  }, [setCurrentDatabaseId, setCurrentTableId]);

  return {
    addDatabase,
    deleteDatabase,
    duplicateDatabase,
    selectDatabase
  };
}
