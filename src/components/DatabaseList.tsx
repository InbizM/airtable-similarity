
import React from 'react';
import { 
  PlusCircle, 
  Database, 
  Copy, 
  Trash, 
  MoreHorizontal 
} from 'lucide-react';
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
import { useState } from 'react';

export function DatabaseList() {
  const { 
    databases, 
    currentDatabase, 
    addDatabase, 
    deleteDatabase, 
    duplicateDatabase, 
    selectDatabase 
  } = useDatabase();
  
  const [newDbName, setNewDbName] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleAddDatabase = () => {
    if (newDbName.trim()) {
      addDatabase(newDbName.trim());
      setNewDbName('');
      setIsDialogOpen(false);
    }
  };

  return (
    <div className="p-4 border-r border-gray-200 min-h-screen w-64 bg-sidebar">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-sidebar-foreground">Bases de datos</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="ghost" size="icon">
              <PlusCircle className="h-5 w-5" />
              <span className="sr-only">Agregar base de datos</span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nueva base de datos</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Nombre</Label>
                <Input 
                  id="name" 
                  value={newDbName} 
                  onChange={(e) => setNewDbName(e.target.value)} 
                  placeholder="Nombre de la base de datos"
                  autoFocus
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleAddDatabase}>Crear</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-1">
        {databases.length === 0 ? (
          <p className="text-sm text-sidebar-foreground/60 text-center py-4">
            No hay bases de datos. <br />Crea una para empezar.
          </p>
        ) : (
          databases.map((db) => (
            <div
              key={db.id}
              className={`flex items-center justify-between p-2 rounded-md ${
                currentDatabase?.id === db.id
                  ? 'bg-sidebar-accent'
                  : 'hover:bg-sidebar-accent/50'
              } transition-colors`}
            >
              <div 
                className="flex items-center gap-2 flex-1 cursor-pointer"
                onClick={() => selectDatabase(db.id)}
              >
                <Database className="h-4 w-4 text-sidebar-foreground/70" />
                <span className="text-sm truncate">{db.name}</span>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">Acciones</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => duplicateDatabase(db.id)}>
                    <Copy className="mr-2 h-4 w-4" />
                    <span>Duplicar</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => deleteDatabase(db.id)}
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
