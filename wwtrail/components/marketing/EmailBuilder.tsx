'use client';

import { useEffect, useRef, useState } from 'react';
import {
  Type, Heading, Image as ImageIcon, MousePointerClick, Minus, MoveVertical,
  Columns, Trash2, ArrowUp, ArrowDown, Copy, Bold, Italic, Underline, Link2, List, ListOrdered,
} from 'lucide-react';

// ---- Block model -----------------------------------------------------------

type BlockType = 'heading' | 'text' | 'image' | 'button' | 'textImage' | 'divider' | 'spacer';

interface Block {
  id: string;
  type: BlockType;
  // shared / per-type fields
  html?: string;        // text / textImage rich content
  text?: string;        // heading text
  url?: string;         // image src / button href / image link
  alt?: string;
  label?: string;       // button label
  imageUrl?: string;    // textImage image
  imagePos?: 'left' | 'right';
  align?: 'left' | 'center' | 'right';
}

const uid = () => Math.random().toString(36).slice(2, 9);

function newBlock(type: BlockType): Block {
  switch (type) {
    case 'heading': return { id: uid(), type, text: 'Título', align: 'left' };
    case 'text': return { id: uid(), type, html: '<p>Escribe tu texto aquí…</p>' };
    case 'image': return { id: uid(), type, url: '', alt: '', align: 'center' };
    case 'button': return { id: uid(), type, label: 'Ver más', url: 'https://', align: 'center' };
    case 'textImage': return { id: uid(), type, html: '<p>Texto junto a la imagen.</p>', imageUrl: '', imagePos: 'left' };
    case 'divider': return { id: uid(), type };
    case 'spacer': return { id: uid(), type };
  }
}

// ---- Email HTML compiler (table-based, email-safe) -------------------------

const GREEN = '#0E612F';
const ACCENT = '#B66916';

function escapeAttr(s = '') { return s.replace(/"/g, '&quot;'); }

function compileBlock(b: Block): string {
  const align = b.align || 'left';
  switch (b.type) {
    case 'heading':
      return `<tr><td style="padding:8px 28px;"><h2 style="margin:0;font-family:Helvetica,Arial,sans-serif;font-size:22px;line-height:1.3;color:#0f1315;text-align:${align};">${b.text || ''}</h2></td></tr>`;
    case 'text':
      return `<tr><td style="padding:8px 28px;font-family:Helvetica,Arial,sans-serif;font-size:15px;line-height:1.6;color:#3a4147;">${b.html || ''}</td></tr>`;
    case 'image':
      if (!b.url) return '';
      { const img = `<img src="${escapeAttr(b.url)}" alt="${escapeAttr(b.alt)}" style="max-width:100%;height:auto;border-radius:8px;display:inline-block;" />`;
        return `<tr><td style="padding:12px 28px;text-align:${align};">${b.url ? img : ''}</td></tr>`; }
    case 'button':
      return `<tr><td style="padding:16px 28px;text-align:${align};"><a href="${escapeAttr(b.url)}" style="display:inline-block;background:${ACCENT};color:#fff;text-decoration:none;font-family:Helvetica,Arial,sans-serif;font-weight:700;font-size:15px;padding:12px 26px;border-radius:8px;">${b.label || ''}</a></td></tr>`;
    case 'textImage': {
      const imgCell = b.imageUrl ? `<td width="45%" valign="top" style="padding:8px 28px;"><img src="${escapeAttr(b.imageUrl)}" alt="" style="max-width:100%;height:auto;border-radius:8px;" /></td>` : '';
      const txtCell = `<td valign="top" style="padding:8px 28px;font-family:Helvetica,Arial,sans-serif;font-size:15px;line-height:1.6;color:#3a4147;">${b.html || ''}</td>`;
      const cells = b.imagePos === 'right' ? txtCell + imgCell : imgCell + txtCell;
      return `<tr><td><table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>${cells}</tr></table></td></tr>`;
    }
    case 'divider':
      return `<tr><td style="padding:8px 28px;"><hr style="border:none;border-top:1px solid #e4e7eb;margin:0;" /></td></tr>`;
    case 'spacer':
      return `<tr><td style="height:24px;line-height:24px;font-size:0;">&nbsp;</td></tr>`;
  }
}

export function compileEmail(blocks: Block[]): string {
  const body = blocks.map(compileBlock).join('');
  return `<!doctype html><html><body style="margin:0;background:#f4f5f7;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f5f7;padding:24px 0;">
    <tr><td align="center">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#fff;border-radius:12px;overflow:hidden;border:1px solid #e4e7eb;">
        <tr><td style="background:${GREEN};padding:18px 28px;"><span style="color:#fff;font-family:Helvetica,Arial,sans-serif;font-weight:800;font-size:18px;letter-spacing:.02em;">WWTRAIL</span></td></tr>
        ${body}
      </table>
    </td></tr>
  </table>
  </body></html>`;
}

// ---- Rich text editor (contentEditable + minimal toolbar) ------------------

function RichText({ value, onChange }: { value: string; onChange: (html: string) => void }) {
  const ref = useRef<HTMLDivElement>(null);

  // Initialize once; do not re-set innerHTML on every render (caret jumps).
  useEffect(() => {
    if (ref.current && ref.current.innerHTML !== value) ref.current.innerHTML = value || '';
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const exec = (cmd: string, arg?: string) => {
    ref.current?.focus();
    // execCommand is deprecated but universally supported for basic rich text.
    document.execCommand(cmd, false, arg);
    if (ref.current) onChange(ref.current.innerHTML);
  };

  const btn = 'rounded p-1.5 text-gray-600 hover:bg-gray-100';
  return (
    <div className="rounded-lg border border-gray-300">
      <div className="flex flex-wrap items-center gap-0.5 border-b border-gray-200 bg-gray-50 px-1 py-1">
        <button type="button" className={btn} title="Negrita" onClick={() => exec('bold')}><Bold className="h-4 w-4" /></button>
        <button type="button" className={btn} title="Cursiva" onClick={() => exec('italic')}><Italic className="h-4 w-4" /></button>
        <button type="button" className={btn} title="Subrayado" onClick={() => exec('underline')}><Underline className="h-4 w-4" /></button>
        <button type="button" className={btn} title="Lista" onClick={() => exec('insertUnorderedList')}><List className="h-4 w-4" /></button>
        <button type="button" className={btn} title="Lista numerada" onClick={() => exec('insertOrderedList')}><ListOrdered className="h-4 w-4" /></button>
        <button type="button" className={btn} title="Enlace" onClick={() => { const u = prompt('URL del enlace:'); if (u) exec('createLink', u); }}><Link2 className="h-4 w-4" /></button>
      </div>
      <div
        ref={ref}
        contentEditable
        onInput={() => ref.current && onChange(ref.current.innerHTML)}
        className="min-h-[80px] px-3 py-2 text-sm outline-none [&_a]:text-blue-600 [&_a]:underline"
      />
    </div>
  );
}

// ---- Block editor + builder ------------------------------------------------

const ADD_MENU: { type: BlockType; label: string; icon: any }[] = [
  { type: 'heading', label: 'Título', icon: Heading },
  { type: 'text', label: 'Texto', icon: Type },
  { type: 'image', label: 'Imagen', icon: ImageIcon },
  { type: 'button', label: 'Botón', icon: MousePointerClick },
  { type: 'textImage', label: 'Texto + Imagen', icon: Columns },
  { type: 'divider', label: 'Separador', icon: Minus },
  { type: 'spacer', label: 'Espacio', icon: MoveVertical },
];

const inp = 'w-full rounded border border-gray-300 px-2 py-1 text-sm';

export function EmailBuilder({ onChange, initialBlocks }: { onChange: (html: string) => void; initialBlocks?: Block[] }) {
  const [blocks, setBlocks] = useState<Block[]>(
    initialBlocks && initialBlocks.length
      ? initialBlocks
      : [newBlock('heading'), newBlock('text')]
  );

  useEffect(() => { onChange(compileEmail(blocks)); }, [blocks, onChange]);

  const update = (id: string, patch: Partial<Block>) =>
    setBlocks((bs) => bs.map((b) => (b.id === id ? { ...b, ...patch } : b)));
  const remove = (id: string) => setBlocks((bs) => bs.filter((b) => b.id !== id));
  const move = (id: string, dir: -1 | 1) => setBlocks((bs) => {
    const i = bs.findIndex((b) => b.id === id);
    const j = i + dir;
    if (i < 0 || j < 0 || j >= bs.length) return bs;
    const copy = [...bs];
    [copy[i], copy[j]] = [copy[j], copy[i]];
    return copy;
  });
  const duplicate = (id: string) => setBlocks((bs) => {
    const i = bs.findIndex((b) => b.id === id);
    if (i < 0) return bs;
    const copy = [...bs];
    copy.splice(i + 1, 0, { ...bs[i], id: uid() });
    return copy;
  });
  const add = (type: BlockType) => setBlocks((bs) => [...bs, newBlock(type)]);

  const alignBtns = (b: Block) => (
    <div className="flex gap-1">
      {(['left', 'center', 'right'] as const).map((a) => (
        <button key={a} type="button" onClick={() => update(b.id, { align: a })}
          className={`rounded px-2 py-0.5 text-xs ${b.align === a ? 'bg-blue-100 text-blue-700' : 'text-gray-500 hover:bg-gray-100'}`}>{a === 'left' ? 'Izq' : a === 'center' ? 'Centro' : 'Der'}</button>
      ))}
    </div>
  );

  return (
    <div className="space-y-3">
      {blocks.map((b) => (
        <div key={b.id} className="rounded-lg border border-gray-200 bg-white p-3">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wide text-gray-400">
              {ADD_MENU.find((m) => m.type === b.type)?.label || b.type}
            </span>
            <div className="flex items-center gap-1">
              <button type="button" onClick={() => move(b.id, -1)} className="rounded p-1 text-gray-400 hover:bg-gray-100" title="Subir"><ArrowUp className="h-3.5 w-3.5" /></button>
              <button type="button" onClick={() => move(b.id, 1)} className="rounded p-1 text-gray-400 hover:bg-gray-100" title="Bajar"><ArrowDown className="h-3.5 w-3.5" /></button>
              <button type="button" onClick={() => duplicate(b.id)} className="rounded p-1 text-gray-400 hover:bg-gray-100" title="Duplicar"><Copy className="h-3.5 w-3.5" /></button>
              <button type="button" onClick={() => remove(b.id)} className="rounded p-1 text-red-400 hover:bg-red-50" title="Eliminar"><Trash2 className="h-3.5 w-3.5" /></button>
            </div>
          </div>

          {b.type === 'heading' && (
            <div className="space-y-2">
              <input value={b.text || ''} onChange={(e) => update(b.id, { text: e.target.value })} className={inp} />
              {alignBtns(b)}
            </div>
          )}

          {b.type === 'text' && (
            <RichText value={b.html || ''} onChange={(html) => update(b.id, { html })} />
          )}

          {b.type === 'image' && (
            <div className="space-y-2">
              <input placeholder="URL de la imagen (https://…)" value={b.url || ''} onChange={(e) => update(b.id, { url: e.target.value })} className={inp} />
              <input placeholder="Texto alternativo" value={b.alt || ''} onChange={(e) => update(b.id, { alt: e.target.value })} className={inp} />
              {alignBtns(b)}
              {b.url && <img src={b.url} alt="" className="mt-1 max-h-28 rounded object-contain" />}
            </div>
          )}

          {b.type === 'button' && (
            <div className="space-y-2">
              <input placeholder="Texto del botón" value={b.label || ''} onChange={(e) => update(b.id, { label: e.target.value })} className={inp} />
              <input placeholder="Enlace (https://…)" value={b.url || ''} onChange={(e) => update(b.id, { url: e.target.value })} className={inp} />
              {alignBtns(b)}
            </div>
          )}

          {b.type === 'textImage' && (
            <div className="space-y-2">
              <input placeholder="URL de la imagen (https://…)" value={b.imageUrl || ''} onChange={(e) => update(b.id, { imageUrl: e.target.value })} className={inp} />
              <div className="flex gap-1">
                {(['left', 'right'] as const).map((p) => (
                  <button key={p} type="button" onClick={() => update(b.id, { imagePos: p })}
                    className={`rounded px-2 py-0.5 text-xs ${b.imagePos === p ? 'bg-blue-100 text-blue-700' : 'text-gray-500 hover:bg-gray-100'}`}>{p === 'left' ? 'Imagen izq.' : 'Imagen der.'}</button>
                ))}
              </div>
              <RichText value={b.html || ''} onChange={(html) => update(b.id, { html })} />
            </div>
          )}

          {(b.type === 'divider' || b.type === 'spacer') && (
            <p className="text-xs text-gray-400">{b.type === 'divider' ? 'Línea separadora.' : 'Espacio vertical.'}</p>
          )}
        </div>
      ))}

      {/* Add block menu */}
      <div className="flex flex-wrap gap-2 rounded-lg border border-dashed border-gray-300 bg-gray-50 p-3">
        {ADD_MENU.map((m) => {
          const Icon = m.icon;
          return (
            <button key={m.type} type="button" onClick={() => add(m.type)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50">
              <Icon className="h-3.5 w-3.5 text-blue-600" /> {m.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default EmailBuilder;
