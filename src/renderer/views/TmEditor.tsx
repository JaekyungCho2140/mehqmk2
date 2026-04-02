import { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { AgGridReact } from 'ag-grid-react';
import {
  AllCommunityModule,
  ModuleRegistry,
  type ColDef,
  type CellValueChangedEvent,
} from 'ag-grid-community';
import type { TranslationMemory, TranslationUnit } from '../../shared/types/tm';
import { Button } from '../components/Button';
import { Breadcrumb } from '../components/Breadcrumb';
import '../styles/tm-editor.css';

ModuleRegistry.registerModules([AllCommunityModule]);

interface TmEditorProps {
  readonly tmId: string;
  readonly onBack: () => void;
}

interface EditableEntry extends TranslationUnit {
  readonly isNew?: boolean;
}

export function TmEditor({ tmId, onBack }: TmEditorProps): React.ReactElement {
  const [tm, setTm] = useState<TranslationMemory | null>(null);
  const [entries, setEntries] = useState<EditableEntry[]>([]);
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showFindReplace, setShowFindReplace] = useState(false);
  const [findText, setFindText] = useState('');
  const [replaceText, setReplaceText] = useState('');
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [showFlaggedOnly, setShowFlaggedOnly] = useState(false);
  const gridRef = useRef<AgGridReact<EditableEntry>>(null);
  const dirtyIdsRef = useRef(new Set<string>());

  // Load TM info and entries
  useEffect(() => {
    let cancelled = false;
    Promise.all([
      window.electronAPI.tm.get(tmId),
      window.electronAPI.tm.listEntries(tmId),
    ]).then(([tmData, entryData]) => {
      if (cancelled) return;
      setTm(tmData);
      setEntries(entryData);
    });
    return () => { cancelled = true; };
  }, [tmId]);

  const columnDefs = useMemo<ColDef<EditableEntry>[]>(() => [
    {
      field: 'flagged',
      headerName: '',
      width: 40,
      cellRenderer: (params: { value: boolean }) =>
        params.value ? '🚩' : '',
      sortable: false,
      resizable: false,
    },
    {
      field: 'source',
      headerName: 'Source',
      flex: 1,
      editable: true,
      cellEditor: 'agTextCellEditor',
    },
    {
      field: 'target',
      headerName: 'Target',
      flex: 1,
      editable: true,
      cellEditor: 'agTextCellEditor',
    },
    {
      field: 'created_by',
      headerName: 'Created by',
      width: 100,
      editable: false,
    },
    {
      field: 'modified_at',
      headerName: 'Modified',
      width: 140,
      editable: false,
      valueFormatter: (params) => {
        if (!params.value) return '';
        return new Date(params.value as string).toLocaleString('ko-KR');
      },
    },
  ], []);

  const filteredEntries = useMemo(() => {
    if (!showFlaggedOnly) return entries;
    return entries.filter((e) => e.flagged);
  }, [entries, showFlaggedOnly]);

  const handleCellValueChanged = useCallback((event: CellValueChangedEvent<EditableEntry>) => {
    if (!event.data) return;
    setEntries((prev) =>
      prev.map((e) => (e.id === event.data!.id ? { ...e, ...event.data } : e)),
    );
    dirtyIdsRef.current.add(event.data.id);
    setDirty(true);
  }, []);

  const handleAddEntry = useCallback(() => {
    const newEntry: EditableEntry = {
      id: globalThis.crypto.randomUUID(),
      tm_id: tmId,
      source: '',
      target: '',
      prev_source: null,
      next_source: null,
      context_id: null,
      created_by: 'TestUser',
      created_at: new Date().toISOString(),
      modified_by: 'TestUser',
      modified_at: new Date().toISOString(),
      document_name: '',
      project_name: '',
      client: '',
      domain: '',
      flagged: false,
      isNew: true,
    };
    setEntries((prev) => [...prev, newEntry]);
    dirtyIdsRef.current.add(newEntry.id);
    setDirty(true);
  }, [tmId]);

  const handleDeleteSelected = useCallback(() => {
    const selectedNodes = gridRef.current?.api.getSelectedNodes() ?? [];
    const selectedIds = new Set(selectedNodes.map((n) => n.data?.id).filter(Boolean));
    if (selectedIds.size === 0) return;

    // Delete from DB for non-new entries
    for (const id of selectedIds) {
      const entry = entries.find((e) => e.id === id);
      if (entry && !entry.isNew) {
        window.electronAPI.tm.deleteEntry(id as string);
      }
      dirtyIdsRef.current.delete(id as string);
    }

    setEntries((prev) => prev.filter((e) => !selectedIds.has(e.id)));
    setDirty(dirtyIdsRef.current.size > 0);
  }, [entries]);

  const handleSave = useCallback(async () => {
    setSaving(true);
    const dirtyIds = Array.from(dirtyIdsRef.current);

    for (const id of dirtyIds) {
      const entry = entries.find((e) => e.id === id);
      if (!entry) continue;
      if (!entry.source.trim() && !entry.target.trim()) continue;

      if (entry.isNew) {
        await window.electronAPI.tm.addEntry({
          tmId,
          source: entry.source,
          target: entry.target,
          createdBy: entry.created_by,
        });
      } else {
        await window.electronAPI.tm.updateEntry(id, {
          source: entry.source,
          target: entry.target,
          flagged: entry.flagged,
        });
      }
    }

    dirtyIdsRef.current.clear();
    setDirty(false);
    setSaving(false);

    // Reload entries
    const fresh = await window.electronAPI.tm.listEntries(tmId);
    setEntries(fresh);
    const updated = await window.electronAPI.tm.get(tmId);
    if (updated) setTm(updated);
  }, [entries, tmId]);

  const handleToggleFlag = useCallback(() => {
    const selectedNodes = gridRef.current?.api.getSelectedNodes() ?? [];
    const selectedIds = new Set(selectedNodes.map((n) => n.data?.id).filter(Boolean));
    if (selectedIds.size === 0) return;

    setEntries((prev) =>
      prev.map((e) => {
        if (!selectedIds.has(e.id)) return e;
        dirtyIdsRef.current.add(e.id);
        return { ...e, flagged: !e.flagged };
      }),
    );
    setDirty(true);
  }, []);

  // Find Next
  const handleFindNext = useCallback(() => {
    if (!findText || !gridRef.current) return;
    const api = gridRef.current.api;
    const query = caseSensitive ? findText : findText.toLowerCase();
    let startRow = (api.getFocusedCell()?.rowIndex ?? -1) + 1;

    for (let i = 0; i < filteredEntries.length; i++) {
      const idx = (startRow + i) % filteredEntries.length;
      const entry = filteredEntries[idx];
      const source = caseSensitive ? entry.source : entry.source.toLowerCase();
      const target = caseSensitive ? entry.target : entry.target.toLowerCase();
      if (source.includes(query) || target.includes(query)) {
        api.ensureIndexVisible(idx);
        api.setFocusedCell(idx, source.includes(query) ? 'source' : 'target');
        return;
      }
    }
  }, [findText, caseSensitive, filteredEntries]);

  // Replace
  const handleReplace = useCallback(() => {
    if (!findText) return;
    const focused = gridRef.current?.api.getFocusedCell();
    if (!focused) return;

    const entry = filteredEntries[focused.rowIndex];
    if (!entry) return;

    const field = focused.column.getColId() as 'source' | 'target';
    const original = entry[field];
    const flags = caseSensitive ? 'g' : 'gi';
    const replaced = original.replace(new RegExp(findText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), flags), replaceText);

    if (replaced !== original) {
      setEntries((prev) =>
        prev.map((e) => (e.id === entry.id ? { ...e, [field]: replaced } : e)),
      );
      dirtyIdsRef.current.add(entry.id);
      setDirty(true);
    }
  }, [findText, replaceText, caseSensitive, filteredEntries]);

  // Replace All
  const handleReplaceAll = useCallback(() => {
    if (!findText) return;
    const flags = caseSensitive ? 'g' : 'gi';
    const regex = new RegExp(findText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), flags);
    let count = 0;

    setEntries((prev) =>
      prev.map((e) => {
        const newSource = e.source.replace(regex, replaceText);
        const newTarget = e.target.replace(regex, replaceText);
        if (newSource !== e.source || newTarget !== e.target) {
          dirtyIdsRef.current.add(e.id);
          count++;
          return { ...e, source: newSource, target: newTarget };
        }
        return e;
      }),
    );
    if (count > 0) setDirty(true);
  }, [findText, replaceText, caseSensitive]);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        if (dirty) handleSave();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'h') {
        e.preventDefault();
        setShowFindReplace((v) => !v);
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'm') {
        e.preventDefault();
        handleToggleFlag();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'Delete') {
        e.preventDefault();
        handleDeleteSelected();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [dirty, handleSave, handleToggleFlag, handleDeleteSelected]);

  if (!tm) {
    return (
      <div className="loading-screen">
        <div className="spinner" />
      </div>
    );
  }

  return (
    <div className="tm-editor" data-testid="tm-editor">
      <div className="tm-editor-toolbar">
        <div className="tm-editor-toolbar-left">
          <button className="back-btn" onClick={onBack} data-testid="tm-editor-back-btn">
            ←
          </button>
          <Breadcrumb
            items={[
              { label: 'Back', onClick: onBack },
              { label: `TM: ${tm.name}` },
            ]}
          />
        </div>
        <div className="tm-editor-toolbar-right">
          <span className="tm-editor-count">{entries.length} entries</span>
          <Button
            variant="ghost"
            onClick={() => setShowFlaggedOnly((v) => !v)}
            data-testid="tm-editor-filter-flagged"
          >
            {showFlaggedOnly ? '🚩 Flagged' : 'All'}
          </Button>
          <Button variant="ghost" onClick={handleAddEntry} data-testid="tm-editor-add-btn">
            + New
          </Button>
          <Button variant="ghost" onClick={handleDeleteSelected} data-testid="tm-editor-delete-btn">
            Delete
          </Button>
          <Button
            onClick={handleSave}
            disabled={!dirty || saving}
            data-testid="tm-editor-save-btn"
          >
            {saving ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </div>

      {showFindReplace && (
        <div className="tm-find-replace" data-testid="tm-find-replace">
          <input
            className="text-input tm-find-input"
            placeholder="Find..."
            value={findText}
            onChange={(e) => setFindText(e.target.value)}
            autoFocus
            data-testid="tm-find-input"
          />
          <input
            className="text-input tm-find-input"
            placeholder="Replace..."
            value={replaceText}
            onChange={(e) => setReplaceText(e.target.value)}
            data-testid="tm-replace-input"
          />
          <label className="tm-find-case">
            <input
              type="checkbox"
              checked={caseSensitive}
              onChange={(e) => setCaseSensitive(e.target.checked)}
            />
            Aa
          </label>
          <Button variant="ghost" onClick={handleFindNext} data-testid="tm-find-next-btn">
            Find Next
          </Button>
          <Button variant="ghost" onClick={handleReplace} data-testid="tm-replace-btn">
            Replace
          </Button>
          <Button variant="ghost" onClick={handleReplaceAll} data-testid="tm-replace-all-btn">
            Replace All
          </Button>
        </div>
      )}

      <div className="tm-editor-grid ag-theme-alpine">
        <AgGridReact<EditableEntry>
          ref={gridRef}
          rowData={filteredEntries}
          columnDefs={columnDefs}
          getRowId={(params) => params.data.id}
          rowSelection="multiple"
          onCellValueChanged={handleCellValueChanged}
          stopEditingWhenCellsLoseFocus
          domLayout="normal"
        />
      </div>
    </div>
  );
}
