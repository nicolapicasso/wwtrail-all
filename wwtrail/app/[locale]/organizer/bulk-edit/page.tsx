'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  PenSquare,
  Filter,
  Search,
  CheckCircle,
  AlertCircle,
  Loader2,
  ChevronRight,
  Eye,
  Play,
  X,
  Plus,
  Trash2,
} from 'lucide-react';
import {
  adminService,
  BulkEditEntityType,
  BulkEditFilters,
  BulkEditOperation,
  EntityMetadata,
  FieldMetadata,
  FilterCondition,
  FilterOperator,
  BulkEditPreview,
} from '@/lib/api/admin.service';

// Filter operator labels
const OPERATOR_LABELS: Record<FilterOperator, string> = {
  equals: 'es igual a',
  not_equals: 'no es igual a',
  contains: 'contiene',
  starts_with: 'empieza por',
  ends_with: 'termina en',
  greater_than: 'mayor que',
  less_than: 'menor que',
  in: 'esta en',
  is_null: 'esta vacio',
  is_not_null: 'no esta vacio',
};

// Get operators available for field type
function getOperatorsForType(type: FieldMetadata['type']): FilterOperator[] {
  switch (type) {
    case 'string':
      return ['equals', 'not_equals', 'contains', 'starts_with', 'ends_with', 'is_null', 'is_not_null'];
    case 'number':
      return ['equals', 'not_equals', 'greater_than', 'less_than', 'is_null', 'is_not_null'];
    case 'boolean':
      return ['equals'];
    case 'enum':
      return ['equals', 'not_equals', 'in'];
    case 'relation':
      return ['equals', 'is_null', 'is_not_null'];
    case 'date':
      return ['equals', 'greater_than', 'less_than', 'is_null', 'is_not_null'];
    default:
      return ['equals'];
  }
}

// Filter Row Component
function FilterRow({
  condition,
  fields,
  relationOptions,
  onUpdate,
  onRemove,
  onLoadRelationOptions,
}: {
  condition: FilterCondition;
  fields: FieldMetadata[];
  relationOptions: Record<string, { id: string; name: string }[]>;
  onUpdate: (condition: FilterCondition) => void;
  onRemove: () => void;
  onLoadRelationOptions: (relationEntity: string) => void;
}) {
  const selectedField = fields.find((f) => f.name === condition.field);
  const operators = selectedField ? getOperatorsForType(selectedField.type) : [];
  const needsValue = !['is_null', 'is_not_null'].includes(condition.operator);

  // Load relation options when field changes
  useEffect(() => {
    if (selectedField?.type === 'relation' && selectedField.relationEntity) {
      onLoadRelationOptions(selectedField.relationEntity);
    }
  }, [selectedField, onLoadRelationOptions]);

  return (
    <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
      {/* Field selector */}
      <select
        value={condition.field}
        onChange={(e) => onUpdate({ ...condition, field: e.target.value, value: '' })}
        className="px-3 py-2 border rounded-md text-sm min-w-[150px]"
      >
        <option value="">Seleccionar campo...</option>
        {fields.filter((f) => f.filterable).map((field) => (
          <option key={field.name} value={field.name}>
            {field.label}
          </option>
        ))}
      </select>

      {/* Operator selector */}
      <select
        value={condition.operator}
        onChange={(e) => onUpdate({ ...condition, operator: e.target.value as FilterOperator })}
        className="px-3 py-2 border rounded-md text-sm min-w-[140px]"
        disabled={!condition.field}
      >
        {operators.map((op) => (
          <option key={op} value={op}>
            {OPERATOR_LABELS[op]}
          </option>
        ))}
      </select>

      {/* Value input */}
      {needsValue && selectedField && (
        <>
          {selectedField.type === 'boolean' ? (
            <select
              value={condition.value?.toString() || ''}
              onChange={(e) => onUpdate({ ...condition, value: e.target.value === 'true' })}
              className="px-3 py-2 border rounded-md text-sm min-w-[100px]"
            >
              <option value="true">Si</option>
              <option value="false">No</option>
            </select>
          ) : selectedField.type === 'enum' && selectedField.enumValues ? (
            <select
              value={condition.value || ''}
              onChange={(e) => onUpdate({ ...condition, value: e.target.value })}
              className="px-3 py-2 border rounded-md text-sm min-w-[150px]"
            >
              <option value="">Seleccionar...</option>
              {selectedField.enumValues.map((val) => (
                <option key={val} value={val}>
                  {val}
                </option>
              ))}
            </select>
          ) : selectedField.type === 'relation' && selectedField.relationEntity ? (
            <select
              value={condition.value || ''}
              onChange={(e) => onUpdate({ ...condition, value: e.target.value })}
              className="px-3 py-2 border rounded-md text-sm min-w-[200px]"
            >
              <option value="">Seleccionar...</option>
              {(relationOptions[selectedField.relationEntity] || []).map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.name}
                </option>
              ))}
            </select>
          ) : selectedField.type === 'number' ? (
            <input
              type="number"
              value={condition.value || ''}
              onChange={(e) => onUpdate({ ...condition, value: parseFloat(e.target.value) || 0 })}
              className="px-3 py-2 border rounded-md text-sm w-[120px]"
              placeholder="Valor..."
            />
          ) : (
            <input
              type="text"
              value={condition.value || ''}
              onChange={(e) => onUpdate({ ...condition, value: e.target.value })}
              className="px-3 py-2 border rounded-md text-sm flex-1 min-w-[150px]"
              placeholder="Valor..."
            />
          )}
        </>
      )}

      {/* Remove button */}
      <Button variant="ghost" size="sm" onClick={onRemove} className="text-red-500 hover:text-red-700">
        <X className="w-4 h-4" />
      </Button>
    </div>
  );
}

// Results Table Component
function ResultsTable({
  records,
  selectedIds,
  onToggleSelection,
  onToggleAll,
}: {
  records: any[];
  selectedIds: Set<string>;
  onToggleSelection: (id: string) => void;
  onToggleAll: () => void;
}) {
  if (records.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No se encontraron registros con los filtros aplicados
      </div>
    );
  }

  const allSelected = records.length > 0 && records.every((r) => selectedIds.has(r.id));

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left">
              <input
                type="checkbox"
                checked={allSelected}
                onChange={onToggleAll}
                className="rounded"
              />
            </th>
            <th className="px-4 py-3 text-left">Nombre</th>
            <th className="px-4 py-3 text-left">Estado</th>
            <th className="px-4 py-3 text-left">ID</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {records.map((record) => (
            <tr key={record.id} className={selectedIds.has(record.id) ? 'bg-blue-50' : ''}>
              <td className="px-4 py-3">
                <input
                  type="checkbox"
                  checked={selectedIds.has(record.id)}
                  onChange={() => onToggleSelection(record.id)}
                  className="rounded"
                />
              </td>
              <td className="px-4 py-3 font-medium">{record.name || record.title || record.slug}</td>
              <td className="px-4 py-3">
                <span
                  className={`px-2 py-1 text-xs rounded-full ${
                    record.status === 'PUBLISHED'
                      ? 'bg-green-100 text-green-800'
                      : record.status === 'DRAFT'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {record.status || '-'}
                </span>
              </td>
              <td className="px-4 py-3 text-gray-500 text-xs font-mono">{record.id.slice(0, 8)}...</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Preview Modal Component
function PreviewModal({
  preview,
  onConfirm,
  onCancel,
  executing,
}: {
  preview: BulkEditPreview;
  onConfirm: () => void;
  onCancel: () => void;
  executing: boolean;
}) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-hidden">
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold">Vista Previa de Cambios</h3>
          <p className="text-sm text-gray-500">
            Se modificaran {preview.matchingCount} registros
          </p>
        </div>
        <div className="p-6 overflow-y-auto max-h-[50vh]">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left">Registro</th>
                <th className="px-4 py-2 text-left">Valor Actual</th>
                <th className="px-4 py-2 text-center">
                  <ChevronRight className="w-4 h-4 inline" />
                </th>
                <th className="px-4 py-2 text-left">Nuevo Valor</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {preview.matchingRecords.slice(0, 20).map((record) => (
                <tr key={record.id}>
                  <td className="px-4 py-2 font-medium">{record.displayName}</td>
                  <td className="px-4 py-2 text-gray-500">
                    {record.currentValue?.toString() || <span className="italic">vacio</span>}
                  </td>
                  <td className="px-4 py-2 text-center text-gray-400">
                    <ChevronRight className="w-4 h-4 inline" />
                  </td>
                  <td className="px-4 py-2 text-blue-600 font-medium">
                    {record.newValue?.toString() || <span className="italic">vacio</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {preview.matchingRecords.length > 20 && (
            <p className="text-sm text-gray-500 mt-4 text-center">
              ... y {preview.matchingRecords.length - 20} registros mas
            </p>
          )}
        </div>
        <div className="p-6 border-t bg-gray-50 flex justify-end gap-3">
          <Button variant="outline" onClick={onCancel} disabled={executing}>
            Cancelar
          </Button>
          <Button onClick={onConfirm} disabled={executing} className="bg-blue-600 hover:bg-blue-700">
            {executing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Aplicando...
              </>
            ) : (
              <>
                <Play className="w-4 h-4 mr-2" />
                Aplicar Cambios
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function BulkEditPage() {
  // State
  const [metadata, setMetadata] = useState<EntityMetadata[]>([]);
  const [selectedEntity, setSelectedEntity] = useState<BulkEditEntityType | ''>('');
  const [filters, setFilters] = useState<FilterCondition[]>([]);
  const [records, setRecords] = useState<any[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [relationOptions, setRelationOptions] = useState<Record<string, { id: string; name: string }[]>>({});

  // Edit operation state
  const [editField, setEditField] = useState<string>('');
  const [editValue, setEditValue] = useState<any>('');

  // UI state
  const [loading, setLoading] = useState(true);
  const [querying, setQuerying] = useState(false);
  const [preview, setPreview] = useState<BulkEditPreview | null>(null);
  const [executing, setExecuting] = useState(false);
  const [result, setResult] = useState<{ success: boolean; count: number } | null>(null);

  // Load metadata on mount
  useEffect(() => {
    const loadMetadata = async () => {
      try {
        const data = await adminService.getBulkEditMetadata();
        setMetadata(data);
      } catch (error) {
        console.error('Error loading metadata:', error);
      } finally {
        setLoading(false);
      }
    };
    loadMetadata();
  }, []);

  // Get current entity metadata
  const currentEntity = metadata.find((e) => e.name === selectedEntity);
  const editableFields = currentEntity?.fields.filter((f) => f.editable) || [];
  const selectedEditField = editableFields.find((f) => f.name === editField);

  // Load relation options
  const loadRelationOptions = useCallback(async (relationEntity: string) => {
    if (relationOptions[relationEntity]) return;
    try {
      const options = await adminService.getBulkEditRelationOptions(relationEntity);
      setRelationOptions((prev) => ({ ...prev, [relationEntity]: options }));
    } catch (error) {
      console.error('Error loading relation options:', error);
    }
  }, [relationOptions]);

  // Load relation options for edit field
  useEffect(() => {
    if (selectedEditField?.type === 'relation' && selectedEditField.relationEntity) {
      loadRelationOptions(selectedEditField.relationEntity);
    }
  }, [selectedEditField, loadRelationOptions]);

  // Query records
  const handleQuery = async () => {
    if (!selectedEntity) return;

    setQuerying(true);
    setRecords([]);
    setSelectedIds(new Set());

    try {
      const { data } = await adminService.bulkEditQuery(
        selectedEntity,
        { conditions: filters.filter((f) => f.field && f.operator) },
        100
      );
      setRecords(data);
      // Select all by default
      setSelectedIds(new Set(data.map((r: any) => r.id)));
    } catch (error) {
      console.error('Error querying:', error);
      alert('Error al buscar registros');
    } finally {
      setQuerying(false);
    }
  };

  // Add filter
  const addFilter = () => {
    setFilters([...filters, { field: '', operator: 'equals', value: '' }]);
  };

  // Update filter
  const updateFilter = (index: number, condition: FilterCondition) => {
    const newFilters = [...filters];
    newFilters[index] = condition;
    setFilters(newFilters);
  };

  // Remove filter
  const removeFilter = (index: number) => {
    setFilters(filters.filter((_, i) => i !== index));
  };

  // Toggle selection
  const toggleSelection = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  // Toggle all
  const toggleAll = () => {
    if (selectedIds.size === records.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(records.map((r) => r.id)));
    }
  };

  // Preview changes
  const handlePreview = async () => {
    if (!selectedEntity || !editField || selectedIds.size === 0) return;

    try {
      // Create filter to match selected IDs
      const idFilter: BulkEditFilters = {
        conditions: [{ field: 'id', operator: 'in', value: Array.from(selectedIds) }],
      };

      const operation: BulkEditOperation = { field: editField, value: editValue };
      const previewData = await adminService.bulkEditPreview(selectedEntity, idFilter, operation);
      setPreview(previewData);
    } catch (error) {
      console.error('Error previewing:', error);
      alert('Error al generar la vista previa');
    }
  };

  // Execute changes
  const handleExecute = async () => {
    if (!selectedEntity || !editField || selectedIds.size === 0) return;

    setExecuting(true);
    try {
      const idFilter: BulkEditFilters = {
        conditions: [{ field: 'id', operator: 'in', value: Array.from(selectedIds) }],
      };

      const operation: BulkEditOperation = { field: editField, value: editValue };
      const result = await adminService.bulkEditExecute(selectedEntity, idFilter, operation);

      setResult({ success: result.success, count: result.updatedCount });
      setPreview(null);

      // Refresh results
      handleQuery();
    } catch (error) {
      console.error('Error executing:', error);
      alert('Error al aplicar los cambios');
    } finally {
      setExecuting(false);
    }
  };

  // Reset form
  const handleReset = () => {
    setFilters([]);
    setRecords([]);
    setSelectedIds(new Set());
    setEditField('');
    setEditValue('');
    setResult(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Editor Masivo</h1>
        <p className="text-gray-500">Modifica multiples registros a la vez</p>
      </div>

      {/* Success Message */}
      {result && result.success && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
          <CheckCircle className="w-5 h-5 text-green-600" />
          <div>
            <p className="font-medium text-green-800">Cambios aplicados correctamente</p>
            <p className="text-sm text-green-700">{result.count} registros actualizados</p>
          </div>
          <Button variant="ghost" size="sm" onClick={() => setResult(null)} className="ml-auto">
            <X className="w-4 h-4" />
          </Button>
        </div>
      )}

      {/* Step 1: Select Entity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-sm flex items-center justify-center font-bold">
              1
            </span>
            Seleccionar Entidad
          </CardTitle>
          <CardDescription>Elige el tipo de elemento que quieres modificar</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {metadata.map((entity) => (
              <Button
                key={entity.name}
                variant={selectedEntity === entity.name ? 'default' : 'outline'}
                onClick={() => {
                  setSelectedEntity(entity.name);
                  handleReset();
                }}
              >
                {entity.label}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Step 2: Filter */}
      {selectedEntity && currentEntity && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-sm flex items-center justify-center font-bold">
                2
              </span>
              Filtrar Registros
            </CardTitle>
            <CardDescription>Añade filtros para encontrar los registros a modificar</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Filters */}
            {filters.map((condition, index) => (
              <FilterRow
                key={index}
                condition={condition}
                fields={currentEntity.fields}
                relationOptions={relationOptions}
                onUpdate={(c) => updateFilter(index, c)}
                onRemove={() => removeFilter(index)}
                onLoadRelationOptions={loadRelationOptions}
              />
            ))}

            {/* Add Filter Button */}
            <div className="flex gap-2">
              <Button variant="outline" onClick={addFilter}>
                <Plus className="w-4 h-4 mr-2" />
                Añadir Filtro
              </Button>
              <Button onClick={handleQuery} disabled={querying}>
                {querying ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Buscando...
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4 mr-2" />
                    Buscar
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Results & Selection */}
      {records.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-sm flex items-center justify-center font-bold">
                3
              </span>
              Resultados ({records.length} encontrados, {selectedIds.size} seleccionados)
            </CardTitle>
            <CardDescription>Selecciona los registros que quieres modificar</CardDescription>
          </CardHeader>
          <CardContent>
            <ResultsTable
              records={records}
              selectedIds={selectedIds}
              onToggleSelection={toggleSelection}
              onToggleAll={toggleAll}
            />
          </CardContent>
        </Card>
      )}

      {/* Step 4: Edit Operation */}
      {selectedIds.size > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-sm flex items-center justify-center font-bold">
                4
              </span>
              Definir Cambio
            </CardTitle>
            <CardDescription>
              Selecciona el campo a modificar y el nuevo valor para {selectedIds.size} registro(s)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              {/* Field selector */}
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Campo</label>
                <select
                  value={editField}
                  onChange={(e) => {
                    setEditField(e.target.value);
                    setEditValue('');
                  }}
                  className="w-full px-3 py-2 border rounded-md"
                >
                  <option value="">Seleccionar campo...</option>
                  {editableFields.map((field) => (
                    <option key={field.name} value={field.name}>
                      {field.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Value input */}
              {selectedEditField && (
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nuevo Valor</label>
                  {selectedEditField.type === 'boolean' ? (
                    <select
                      value={editValue?.toString() || ''}
                      onChange={(e) => setEditValue(e.target.value === 'true')}
                      className="w-full px-3 py-2 border rounded-md"
                    >
                      <option value="true">Si</option>
                      <option value="false">No</option>
                    </select>
                  ) : selectedEditField.type === 'enum' && selectedEditField.enumValues ? (
                    <select
                      value={editValue || ''}
                      onChange={(e) => setEditValue(e.target.value)}
                      className="w-full px-3 py-2 border rounded-md"
                    >
                      <option value="">Seleccionar...</option>
                      {selectedEditField.enumValues.map((val) => (
                        <option key={val} value={val}>
                          {val}
                        </option>
                      ))}
                    </select>
                  ) : selectedEditField.type === 'relation' && selectedEditField.relationEntity ? (
                    <select
                      value={editValue || ''}
                      onChange={(e) => setEditValue(e.target.value)}
                      className="w-full px-3 py-2 border rounded-md"
                    >
                      <option value="">Seleccionar...</option>
                      {(relationOptions[selectedEditField.relationEntity] || []).map((opt) => (
                        <option key={opt.id} value={opt.id}>
                          {opt.name}
                        </option>
                      ))}
                    </select>
                  ) : selectedEditField.type === 'number' ? (
                    <input
                      type="number"
                      value={editValue || ''}
                      onChange={(e) => setEditValue(parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 border rounded-md"
                      placeholder="Nuevo valor..."
                    />
                  ) : (
                    <input
                      type="text"
                      value={editValue || ''}
                      onChange={(e) => setEditValue(e.target.value)}
                      className="w-full px-3 py-2 border rounded-md"
                      placeholder="Nuevo valor..."
                    />
                  )}
                </div>
              )}
            </div>

            {/* Action buttons */}
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button variant="outline" onClick={handleReset}>
                <Trash2 className="w-4 h-4 mr-2" />
                Limpiar
              </Button>
              <Button
                onClick={handlePreview}
                disabled={!editField || editValue === '' || selectedIds.size === 0}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Eye className="w-4 h-4 mr-2" />
                Vista Previa
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Preview Modal */}
      {preview && (
        <PreviewModal
          preview={preview}
          onConfirm={handleExecute}
          onCancel={() => setPreview(null)}
          executing={executing}
        />
      )}

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>Como usar el Editor Masivo</CardTitle>
        </CardHeader>
        <CardContent className="prose prose-sm max-w-none">
          <ol className="list-decimal list-inside space-y-2 text-gray-600">
            <li>
              <strong>Selecciona la entidad:</strong> Elige si quieres modificar competiciones, eventos, ediciones, etc.
            </li>
            <li>
              <strong>Aplica filtros:</strong> Añade condiciones para encontrar los registros especificos que quieres modificar.
            </li>
            <li>
              <strong>Revisa y selecciona:</strong> Verifica los resultados y selecciona los registros a modificar.
            </li>
            <li>
              <strong>Define el cambio:</strong> Elige el campo y el nuevo valor que quieres aplicar.
            </li>
            <li>
              <strong>Vista previa y confirma:</strong> Revisa los cambios antes de aplicarlos definitivamente.
            </li>
          </ol>
          <div className="mt-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <p className="text-yellow-800 text-sm">
              <strong>Importante:</strong> Los cambios se aplican inmediatamente y no se pueden deshacer.
              Asegurate de revisar la vista previa antes de confirmar.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
