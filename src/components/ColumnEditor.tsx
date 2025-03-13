
import React, { useState } from 'react';
import { PlusCircle, Copy, Trash, MoreHorizontal, Edit } from 'lucide-react';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ColumnType } from '@/types';

export function ColumnEditor() {
  const { 
    currentTable,
    addColumn, 
    deleteColumn, 
    duplicateColumn,
    updateColumn
  } = useDatabase();
  
  const [newColumnName, setNewColumnName] = useState('');
  const [newColumnType, setNewColumnType] = useState<ColumnType>('text');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingColumn, setEditingColumn] = useState<{ id: string; name: string; type: ColumnType } | null>(null);

  const handleAddColumn = () => {
    if (currentTable && newColumnName.trim()) {
      addColumn(currentTable.id, newColumnName.trim(), newColumnType);
      setNewColumnName('');
      setNewColumnType('text');
      setIsAddDialogOpen(false);
    }
  };

  const handleEditColumn = () => {
    if (currentTable && editingColumn) {
      updateColumn(currentTable.id, editingColumn.id, {
        name: editingColumn.name,
        type: editingColumn.type
      });
      setEditingColumn(null);
      setIsEditDialogOpen(false);
    }
  };

  const openEditDialog = (column: { id: string; name: string; type: ColumnType }) => {
    setEditingColumn(column);
    setIsEditDialogOpen(true);
  };

  if (!currentTable) {
    return (
      <div className="p-4 border-b border-gray-200 bg-white">
        <p className="text-sm text-muted-foreground text-center py-2">
          Selecciona una tabla
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 border-b border-gray-200 bg-white">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-semibold">{currentTable.name}</h2>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="gap-1">
              <PlusCircle className="h-4 w-4" />
              <span>Agregar columna</span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nueva columna</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="column-name">Nombre</Label>
                <Input 
                  id="column-name" 
                  value={newColumnName} 
                  onChange={(e) => setNewColumnName(e.target.value)} 
                  placeholder="Nombre de la columna"
                  autoFocus
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="column-type">Tipo</Label>
                <Select 
                  value={newColumnType} 
                  onValueChange={(value) => setNewColumnType(value as ColumnType)}
                >
                  <SelectTrigger id="column-type">
                    <SelectValue placeholder="Selecciona un tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="text">Texto</SelectItem>
                    <SelectItem value="number">Número</SelectItem>
                    <SelectItem value="date">Fecha</SelectItem>
                    <SelectItem value="boolean">Booleano</SelectItem>
                    <SelectItem value="select">Selección</SelectItem>
                    <SelectItem value="multiselect">Selección múltiple</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleAddColumn}>Crear</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Editar columna</DialogTitle>
            </DialogHeader>
            {editingColumn && (
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-column-name">Nombre</Label>
                  <Input 
                    id="edit-column-name" 
                    value={editingColumn.name} 
                    onChange={(e) => setEditingColumn({...editingColumn, name: e.target.value})} 
                    placeholder="Nombre de la columna"
                    autoFocus
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-column-type">Tipo</Label>
                  <Select 
                    value={editingColumn.type} 
                    onValueChange={(value) => setEditingColumn({...editingColumn, type: value as ColumnType})}
                  >
                    <SelectTrigger id="edit-column-type">
                      <SelectValue placeholder="Selecciona un tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="text">Texto</SelectItem>
                      <SelectItem value="number">Número</SelectItem>
                      <SelectItem value="date">Fecha</SelectItem>
                      <SelectItem value="boolean">Booleano</SelectItem>
                      <SelectItem value="select">Selección</SelectItem>
                      <SelectItem value="multiselect">Selección múltiple</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button onClick={handleEditColumn}>Guardar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-wrap gap-2 mt-4">
        {currentTable.columns.length === 0 ? (
          <p className="text-sm text-muted-foreground p-2">
            No hay columnas. Haz clic en "Agregar columna" para empezar.
          </p>
        ) : (
          currentTable.columns.map((column) => (
            <div
              key={column.id}
              className="flex items-center gap-2 bg-muted/40 px-3 py-1 rounded-md text-sm"
            >
              <span className="truncate max-w-40">{column.name}</span>
              <small className="text-xs text-muted-foreground">{column.type}</small>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-6 w-6">
                    <MoreHorizontal className="h-3 w-3" />
                    <span className="sr-only">Acciones</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => openEditDialog({
                    id: column.id,
                    name: column.name,
                    type: column.type
                  })}>
                    <Edit className="mr-2 h-4 w-4" />
                    <span>Editar</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => duplicateColumn(currentTable.id, column.id)}>
                    <Copy className="mr-2 h-4 w-4" />
                    <span>Duplicar</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => deleteColumn(currentTable.id, column.id)}
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
