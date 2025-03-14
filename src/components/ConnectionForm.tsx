
import React, { useState, useEffect } from 'react';
import { useDatabase } from '@/contexts/DatabaseContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DatabaseConnection } from '@/types';
import { getSavedConnection } from '@/services/mysqlService';

export function ConnectionForm() {
  const { isConnected, connectionDetails, setConnectionDetails, connectToDatabase, disconnectFromDatabase } = useDatabase();
  
  const [connection, setConnection] = useState<DatabaseConnection>({
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: '',
    database: '',
  });

  // Cargar configuración guardada si existe
  useEffect(() => {
    const savedConnection = getSavedConnection();
    if (savedConnection) {
      setConnection(savedConnection);
    } else if (connectionDetails) {
      setConnection(connectionDetails);
    }
  }, [connectionDetails]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setConnection({
      ...connection,
      [name]: name === 'port' ? parseInt(value, 10) || 3306 : value,
    });
  };

  const handleConnect = () => {
    setConnectionDetails(connection);
    connectToDatabase();
  };

  const handleDisconnect = () => {
    disconnectFromDatabase();
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white rounded-md shadow-sm">
      <h2 className="text-xl font-semibold mb-6">Conexión a MySQL</h2>
      
      <div className="space-y-4">
        <div className="grid gap-2">
          <Label htmlFor="host">Host</Label>
          <Input
            id="host"
            name="host"
            value={connection.host}
            onChange={handleInputChange}
            disabled={isConnected}
          />
        </div>
        
        <div className="grid gap-2">
          <Label htmlFor="port">Puerto</Label>
          <Input
            id="port"
            name="port"
            type="number"
            value={connection.port}
            onChange={handleInputChange}
            disabled={isConnected}
          />
        </div>
        
        <div className="grid gap-2">
          <Label htmlFor="username">Usuario</Label>
          <Input
            id="username"
            name="username"
            value={connection.username}
            onChange={handleInputChange}
            disabled={isConnected}
          />
        </div>
        
        <div className="grid gap-2">
          <Label htmlFor="password">Contraseña</Label>
          <Input
            id="password"
            name="password"
            type="password"
            value={connection.password}
            onChange={handleInputChange}
            disabled={isConnected}
          />
        </div>
        
        <div className="grid gap-2">
          <Label htmlFor="database">Base de datos (opcional)</Label>
          <Input
            id="database"
            name="database"
            value={connection.database || ''}
            onChange={handleInputChange}
            disabled={isConnected}
            placeholder="Dejar vacío para mostrar todas"
          />
        </div>
        
        <div className="pt-4">
          {isConnected ? (
            <Button onClick={handleDisconnect} variant="outline" className="w-full">
              Desconectar
            </Button>
          ) : (
            <Button onClick={handleConnect} className="w-full">
              Conectar
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
