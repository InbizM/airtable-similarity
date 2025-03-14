
import { useState, useEffect } from 'react';
import { Database, DatabaseConnection } from '@/types';
import { loadDatabases, saveDatabases, connectToMySQL, getSavedConnection, hasActiveConnection } from '@/services/mysqlService';
import { toast } from '@/components/ui/use-toast';

export function useDatabaseState() {
  const [databases, setDatabases] = useState<Database[]>([]);
  const [currentDatabaseId, setCurrentDatabaseId] = useState<string | null>(null);
  const [currentTableId, setCurrentTableId] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionDetails, setConnectionDetails] = useState<DatabaseConnection | null>(null);

  // Efecto para inicializar la conexión si ya existe una guardada
  useEffect(() => {
    const checkConnection = async () => {
      if (hasActiveConnection()) {
        const savedConnection = getSavedConnection();
        if (savedConnection) {
          setConnectionDetails(savedConnection);
          setIsConnected(true);
          
          // Cargar bases de datos guardadas
          const savedDatabases = await loadDatabases();
          if (savedDatabases.length > 0) {
            setDatabases(savedDatabases);
          }
        }
      }
    };
    
    checkConnection();
  }, []);

  // Efecto para guardar las bases de datos cuando cambien
  useEffect(() => {
    if (isConnected && databases.length > 0) {
      saveDatabases(databases);
    }
  }, [databases, isConnected]);

  const currentDatabase = databases.find(db => db.id === currentDatabaseId) || null;
  const currentTable = currentDatabase?.tables.find(table => table.id === currentTableId) || null;

  const connectToDatabase = async () => {
    if (connectionDetails) {
      const connected = await connectToMySQL(connectionDetails);
      if (connected) {
        setIsConnected(true);
        
        // Cargar bases de datos existentes
        const savedDatabases = await loadDatabases();
        if (savedDatabases.length > 0) {
          setDatabases(savedDatabases);
        }
        
        toast({
          title: "Conexión exitosa",
          description: `Conectado a ${connectionDetails.host}:${connectionDetails.port}`,
        });
      } else {
        toast({
          title: "Error de conexión",
          description: "No se pudo conectar a la base de datos",
          variant: "destructive"
        });
      }
    }
  };

  const disconnectFromDatabase = () => {
    localStorage.removeItem('dbConnection');
    setIsConnected(false);
    toast({
      title: "Desconectado",
      description: "Se ha cerrado la conexión a la base de datos",
    });
  };

  return {
    databases,
    setDatabases,
    currentDatabaseId,
    setCurrentDatabaseId,
    currentTableId,
    setCurrentTableId,
    isConnected,
    connectionDetails,
    setConnectionDetails,
    currentDatabase,
    currentTable,
    connectToDatabase,
    disconnectFromDatabase
  };
}
