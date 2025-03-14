
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
  const [isLoading, setIsLoading] = useState(false);

  // Initialize connection if one is saved
  useEffect(() => {
    const checkConnection = async () => {
      if (hasActiveConnection()) {
        const savedConnection = getSavedConnection();
        if (savedConnection) {
          setConnectionDetails(savedConnection);
          setIsConnected(true);
          
          // Load saved databases
          setIsLoading(true);
          try {
            const savedDatabases = await loadDatabases();
            if (savedDatabases.length > 0) {
              console.log('Loaded databases from storage:', savedDatabases);
              setDatabases(savedDatabases);
            }
          } catch (error) {
            console.error('Error loading databases:', error);
            toast({
              title: "Error al cargar datos",
              description: "No se pudieron cargar las bases de datos guardadas",
              variant: "destructive"
            });
          } finally {
            setIsLoading(false);
          }
        }
      }
    };
    
    checkConnection();
  }, []);

  // Save databases when they change
  useEffect(() => {
    const saveData = async () => {
      if (isConnected && databases.length > 0) {
        console.log('Saving databases:', databases);
        await saveDatabases(databases);
      }
    };
    
    saveData();
  }, [databases, isConnected]);

  const currentDatabase = databases.find(db => db.id === currentDatabaseId) || null;
  const currentTable = currentDatabase?.tables.find(table => table.id === currentTableId) || null;

  const connectToDatabase = async () => {
    if (connectionDetails) {
      setIsLoading(true);
      try {
        const connected = await connectToMySQL(connectionDetails);
        if (connected) {
          setIsConnected(true);
          
          // Load existing databases
          const savedDatabases = await loadDatabases();
          if (savedDatabases.length > 0) {
            console.log('Loaded databases after connection:', savedDatabases);
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
      } catch (error) {
        console.error('Connection error:', error);
        toast({
          title: "Error de conexión",
          description: "Ocurrió un error al conectar a la base de datos",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const disconnectFromDatabase = () => {
    localStorage.removeItem('dbConnection');
    setIsConnected(false);
    setDatabases([]);
    setCurrentDatabaseId(null);
    setCurrentTableId(null);
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
    isLoading,
    connectionDetails,
    setConnectionDetails,
    currentDatabase,
    currentTable,
    connectToDatabase,
    disconnectFromDatabase
  };
}
