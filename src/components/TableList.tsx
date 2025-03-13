
import React, { useState } from 'react';
import { PlusCircle, Table as TableIcon, Copy, Trash, MoreHorizontal } from 'lucide-react';
import { useDatabase } from '@/contexts/DatabaseContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function TableList() {
  const { 
    currentDatabase, 
    currentTable,
    addTable, 
    deleteTable, 
    duplicateTable, 
    selectTable 
  } = useDatabase();
  
  const [newTableName, setNewTableName] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleAddTable = () => {
    if (currentDatabase && newTableName.trim()) {
      addTable(currentDatabase.id, newTableName.trim());
      setNewTableName('');
      setIsDialogOpen(false);
    }
  };

  if (!currentDatabase) {
    return (
      <div className="p-4 border-r border-gray-200 min-h-screen w-64 bg-white">
        <p className="text-sm text-muted-foreground text-center py-4">
          Selecciona una base de datos
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 border-r border-gray-200 min-h-screen w-64 bg-white">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">{currentDatabase.name}</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="ghost" size="icon">
              <PlusCircle className="h-5 w-5" />
              <span className="sr-only">Agregar tabla</span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nueva tabla</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Nombre</Label>
                <Input 
                  id="name" 
                  value={newTableName} 
                  onChange={(e) => setNewTableName(e.target.value)} 
                  placeholder="Nombre de la tabla"
                  autoFocus
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleAddTable}>Crear</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-1">
        {currentDatabase.tables.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            No hay tablas. <br />Crea una para empezar.
          </p>
        ) : (
          currentDatabase.tables.map((table) => (
            <div
              key={table.id}
              className={`flex items-center justify-between p-2 rounded-md ${
                currentTable?.id === table.id
                  ? 'bg-accent'
                  : 'hover:bg-accent/50'
              } transition-colors`}
            >
              <div 
                className="flex items-center gap-2 flex-1 cursor-pointer"
                onClick={() => selectTable(table.id)}
              >
                <TableIcon className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm truncate">{table.name}</span>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">Acciones</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => duplicateTable(currentDatabase.id, table.id)}>
                    <Copy className="mr-2 h-4 w-4" />
                    <span>Duplicar</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => deleteTable(currentDatabase.id, table.id)}
                    className="text-red-600 focus:text-red-600"
                  >
                    <Trash className="mr-2 h-4 w-4" />
                    <span>Eliminar</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
