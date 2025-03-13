
import React, { useState } from 'react';
import { useDatabase } from '@/contexts/DatabaseContext';
import { PlusCircle, Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';

export function DataTable() {
  const { currentTable, addRow, updateRow, deleteRow } = useDatabase();
  const [editingCell, setEditingCell] = useState<{rowId: string, columnId: string} | null>(null);
  const [cellValue, setCellValue] = useState<string>('');

  if (!currentTable) {
    return (
      <div className="p-4 flex items-center justify-center h-full">
        <p className="text-muted-foreground">Selecciona una tabla para ver sus datos</p>
      </div>
    );
  }

  if (currentTable.columns.length === 0) {
    return (
      <div className="p-4 flex items-center justify-center h-full">
        <p className="text-muted-foreground">Agrega columnas a la tabla para empezar</p>
      </div>
    );
  }

  const handleAddRow = () => {
    const newRowData: {[key: string]: any} = {};
    currentTable.columns.forEach(column => {
      // Valores por defecto según el tipo
      switch(column.type) {
        case 'text':
          newRowData[column.id] = '';
          break;
        case 'number':
          newRowData[column.id] = 0;
          break;
        case 'date':
          newRowData[column.id] = new Date().toISOString();
          break;
        case 'boolean':
          newRowData[column.id] = false;
          break;
        default:
          newRowData[column.id] = null;
      }
    });
    addRow(currentTable.id, newRowData);
    toast({
      title: "Fila agregada",
      description: "Se ha agregado una nueva fila a la tabla",
    });
  };

  const startEditing = (rowId: string, columnId: string, value: any) => {
    setEditingCell({ rowId, columnId });
    setCellValue(value?.toString() || '');
  };

  const finishEditing = () => {
    if (editingCell) {
      const { rowId, columnId } = editingCell;
      const column = currentTable.columns.find(col => col.id === columnId);
      
      let parsedValue: any = cellValue;
      
      // Convertir el valor según el tipo de columna
      if (column) {
        switch(column.type) {
          case 'number':
            parsedValue = parseFloat(cellValue) || 0;
            break;
          case 'boolean':
            parsedValue = cellValue === 'true';
            break;
          // Otros tipos se mantienen como string
        }
      }
      
      updateRow(currentTable.id, rowId, { [columnId]: parsedValue });
    }
    setEditingCell(null);
  };

  const handleCellClick = (rowId: string, columnId: string, value: any) => {
    const column = currentTable.columns.find(col => col.id === columnId);
    if (column?.type === 'boolean') {
      // Para booleanos, toggle directamente
      updateRow(currentTable.id, rowId, { [columnId]: !value });
    } else {
      startEditing(rowId, columnId, value);
    }
  };

  const renderCellContent = (rowId: string, columnId: string, value: any, columnType: string) => {
    if (editingCell && editingCell.rowId === rowId && editingCell.columnId === columnId) {
      return (
        <Input
          value={cellValue}
          onChange={(e) => setCellValue(e.target.value)}
          onBlur={finishEditing}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              finishEditing();
            }
          }}
          autoFocus
          className="h-8"
        />
      );
    }

    switch (columnType) {
      case 'boolean':
        return (
          <Checkbox 
            checked={!!value} 
            onCheckedChange={() => {
              updateRow(currentTable.id, rowId, { [columnId]: !value });
            }}
          />
        );
      case 'date':
        return value ? new Date(value).toLocaleDateString() : '';
      default:
        return value?.toString() || '';
    }
  };

  return (
    <div className="p-4 h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium">{currentTable.name}</h2>
        <Button onClick={handleAddRow} size="sm" className="gap-1">
          <PlusCircle className="h-4 w-4" />
          <span>Agregar fila</span>
        </Button>
      </div>

      <div className="flex-1 overflow-auto border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12"></TableHead>
              {currentTable.columns.map((column) => (
                <TableHead key={column.id}>{column.name}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentTable.rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={currentTable.columns.length + 1} className="text-center h-24 text-muted-foreground">
                  No hay datos. Haz clic en "Agregar fila" para empezar.
                </TableCell>
              </TableRow>
            ) : (
              currentTable.rows.map((row, index) => (
                <TableRow key={row.id}>
                  <TableCell className="w-12">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteRow(currentTable.id, row.id)}
                      className="h-6 w-6 text-muted-foreground hover:text-destructive"
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </TableCell>
                  {currentTable.columns.map((column) => (
                    <TableCell 
                      key={column.id}
                      onClick={() => handleCellClick(row.id, column.id, row[column.id])}
                      className="cursor-pointer"
                    >
                      {renderCellContent(row.id, column.id, row[column.id], column.type)}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
