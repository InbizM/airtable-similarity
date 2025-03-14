
import React from 'react';
import { DatabaseProvider } from '@/contexts/DatabaseContext';
import { DatabaseList } from '@/components/DatabaseList';
import { TableList } from '@/components/TableList';
import { ColumnEditor } from '@/components/ColumnEditor';
import { DataTable } from '@/components/DataTable';
import { ConnectionForm } from '@/components/ConnectionForm';
import { useDatabase } from '@/contexts/DatabaseContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Database, Server, Table2, Settings, Info } from 'lucide-react';

// Componente para mostrar el contenido principal basado en la conexión
function MainContent() {
  const { isConnected } = useDatabase();

  if (!isConnected) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <div className="w-full max-w-md glass-card p-8 rounded-xl">
          <ConnectionForm />
        </div>
      </div>
    );
  }

  return (
    <div className="grid h-[70vh] grid-cols-1 lg:grid-cols-12 gap-4">
      <div className="lg:col-span-3 flex flex-col gap-4 h-full">
        <div className="glass-card rounded-xl p-4 flex flex-col h-1/2 overflow-hidden">
          <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
            <Database className="h-5 w-5" />
            Bases de datos
          </h2>
          <div className="flex-1 overflow-y-auto scrollbar-none pr-2">
            <DatabaseList />
          </div>
        </div>
        <div className="glass-card rounded-xl p-4 flex flex-col h-1/2 overflow-hidden">
          <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
            <Table2 className="h-5 w-5" />
            Tablas
          </h2>
          <div className="flex-1 overflow-y-auto scrollbar-none pr-2">
            <TableList />
          </div>
        </div>
      </div>
      
      <div className="lg:col-span-9 flex flex-col gap-4 h-full">
        <div className="glass-card rounded-xl p-4 h-1/3 overflow-hidden">
          <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Editor de columnas
          </h2>
          <div className="h-[calc(100%-2.5rem)] overflow-y-auto scrollbar-none pr-2">
            <ColumnEditor />
          </div>
        </div>
        <div className="glass-card rounded-xl p-4 flex-1 overflow-hidden">
          <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
            <Server className="h-5 w-5" />
            Datos
          </h2>
          <div className="h-[calc(100%-2.5rem)] overflow-y-auto pr-2">
            <DataTable />
          </div>
        </div>
      </div>
    </div>
  );
}

const Index = () => {
  return (
    <DatabaseProvider>
      <div className="min-h-screen flex flex-col bg-background">
        <header className="bg-primary/85 backdrop-blur-md text-primary-foreground p-6 shadow-md border-b border-white/10">
          <div className="container mx-auto">
            <div className="flex items-center gap-3">
              <Database className="h-8 w-8" />
              <div>
                <h1 className="text-3xl font-bold text-gradient">AirDB</h1>
                <p className="text-sm opacity-80">Gestor de bases de datos MySQL similar a Airtable</p>
              </div>
            </div>
          </div>
        </header>
        
        <main className="flex-1 container mx-auto py-8 px-4">
          <Tabs defaultValue="database" className="w-full">
            <TabsList className="mb-8 w-full justify-start bg-secondary/50 p-1 backdrop-blur-md">
              <TabsTrigger value="database" className="flex gap-2 items-center">
                <Database className="h-4 w-4" />
                Base de datos
              </TabsTrigger>
              <TabsTrigger value="about" className="flex gap-2 items-center">
                <Info className="h-4 w-4" />
                Acerca de
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="database" className="h-full focus-visible:outline-none focus-visible:ring-0">
              <MainContent />
            </TabsContent>
            
            <TabsContent value="about" className="focus-visible:outline-none focus-visible:ring-0">
              <div className="glass-card rounded-xl p-8 prose max-w-none text-foreground">
                <h2 className="text-2xl font-bold mb-4 text-gradient">Acerca de AirDB</h2>
                <p className="mb-4">
                  AirDB es una aplicación que te permite gestionar bases de datos MySQL de manera visual, 
                  similar a Airtable. Puedes crear, eliminar y duplicar bases de datos, tablas y columnas 
                  con facilidad.
                </p>
                <h3 className="text-xl font-semibold mb-2 text-gradient">Características principales:</h3>
                <ul className="list-disc pl-6 mb-4 space-y-1">
                  <li>Interfaz visual para gestionar bases de datos MySQL</li>
                  <li>Crear, eliminar y duplicar bases de datos, tablas y columnas</li>
                  <li>Soporte para diferentes tipos de datos</li>
                  <li>Compatible con Termux en dispositivos Android</li>
                  <li>Diseño responsive para dispositivos móviles y de escritorio</li>
                </ul>
                <h3 className="text-xl font-semibold mb-2 text-gradient">Cómo usar:</h3>
                <ol className="list-decimal pl-6 mb-4 space-y-1">
                  <li>Conecta a tu servidor MySQL</li>
                  <li>Crea o selecciona una base de datos</li>
                  <li>Crea tablas y define sus columnas</li>
                  <li>¡Comienza a gestionar tus datos!</li>
                </ol>
              </div>
            </TabsContent>
          </Tabs>
        </main>
        
        <footer className="border-t border-white/10 p-6 text-center text-sm text-muted-foreground bg-background">
          <div className="container mx-auto">
            © {new Date().getFullYear()} AirDB - Todos los derechos reservados
          </div>
        </footer>
      </div>
    </DatabaseProvider>
  );
};

export default Index;
