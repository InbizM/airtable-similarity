
import React from 'react';
import { DatabaseProvider } from '@/contexts/DatabaseContext';
import { DatabaseList } from '@/components/DatabaseList';
import { TableList } from '@/components/TableList';
import { ColumnEditor } from '@/components/ColumnEditor';
import { DataTable } from '@/components/DataTable';
import { ConnectionForm } from '@/components/ConnectionForm';
import { useDatabase } from '@/contexts/DatabaseContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Componente para mostrar el contenido principal basado en la conexión
function MainContent() {
  const { isConnected } = useDatabase();

  if (!isConnected) {
    return <ConnectionForm />;
  }

  return (
    <div className="flex h-full">
      <div className="flex">
        <DatabaseList />
        <TableList />
      </div>
      <div className="flex-1 flex flex-col">
        <ColumnEditor />
        <div className="flex-1">
          <DataTable />
        </div>
      </div>
    </div>
  );
}

const Index = () => {
  return (
    <DatabaseProvider>
      <div className="min-h-screen flex flex-col">
        <header className="bg-primary text-primary-foreground p-4 shadow-sm">
          <div className="container mx-auto">
            <h1 className="text-2xl font-bold">AirDB</h1>
            <p className="text-sm opacity-90">Gestor de bases de datos MySQL similar a Airtable</p>
          </div>
        </header>
        
        <main className="flex-1 container mx-auto py-6">
          <Tabs defaultValue="database" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="database">Base de datos</TabsTrigger>
              <TabsTrigger value="about">Acerca de</TabsTrigger>
            </TabsList>
            
            <TabsContent value="database" className="h-[calc(100vh-200px)]">
              <MainContent />
            </TabsContent>
            
            <TabsContent value="about">
              <div className="prose max-w-none">
                <h2>Acerca de AirDB</h2>
                <p>
                  AirDB es una aplicación que te permite gestionar bases de datos MySQL de manera visual, 
                  similar a Airtable. Puedes crear, eliminar y duplicar bases de datos, tablas y columnas 
                  con facilidad.
                </p>
                <h3>Características principales:</h3>
                <ul>
                  <li>Interfaz visual para gestionar bases de datos MySQL</li>
                  <li>Crear, eliminar y duplicar bases de datos, tablas y columnas</li>
                  <li>Soporte para diferentes tipos de datos</li>
                  <li>Compatible con Termux en dispositivos Android</li>
                  <li>Diseño responsive para dispositivos móviles y de escritorio</li>
                </ul>
                <h3>Cómo usar:</h3>
                <ol>
                  <li>Conecta a tu servidor MySQL</li>
                  <li>Crea o selecciona una base de datos</li>
                  <li>Crea tablas y define sus columnas</li>
                  <li>¡Comienza a gestionar tus datos!</li>
                </ol>
              </div>
            </TabsContent>
          </Tabs>
        </main>
        
        <footer className="border-t p-4 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} AirDB - Todos los derechos reservados
        </footer>
      </div>
    </DatabaseProvider>
  );
};

export default Index;
