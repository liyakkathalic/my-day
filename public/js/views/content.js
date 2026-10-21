import { html, useState } from '../../vendor/preact-htm.js';
import { useStore, Card, openSheet, Field, toast, Chips, EmptyState, askConfirm } from '../ui.js';
import { SubHeader } from './more.js';
import * as M from '../model.js';
import * as store from '../store.js';
import { CONTENT_STAGES, CONTENT_FORMATS } from '../core/defaults.js';
import { relDate } from '../core/time.js';

// Only ever render http(s) links, never javascript: or data: URLs.
const safeUrl = (u) => { try { const x = new URL(u); return x.protocol === 'https:' || x.protocol === 'http:' ? x.href : null; } catch { return null; } };

function instructionsText(c) {
  const lines = [`${c.title} (${CONTENT_FORMATS[c.format] || ''})`];
  if (c.sourceLiveId) { const src = store.get('content', c.sourceLiveId); if (src) lines.push(`From live session: ${src.title}`); }
  if (c.refs?.length) {
    lines.push('', 'References:');
    for (const r of c.refs) lines.push(`- ${r.url}${r.timestamps ? ` @ ${r.timestamps}` : ''}${r.note ? ` — ${r.note}` : ''}`);
  }
  if (c.editorInstructions) lines.push('', 'Instructions:', c.editorInstructions);
  return lines.join('\n');
}

function ContentEditor({ item, close }) {
  const isNew = !item;
  const [c, setC] = useState(() => item ? JSON.parse(JSON.stringify(item)) : { id: M.uid(), title: '', format: 'recording', stage: 'Idea', refs: [] });
  const set = (k, v) => setC((x) => ({ ...x, [k]: v }));
  const setRef = (i, patch) => set('refs', c.refs.map((r, j) => (j === i ? { ...r, ...patch } : r)));
  const lives = M.contentItems().filter((x) => x.format === 'live' && x.id !== c.id);
  const save = (e) => {
    e.preventDefault();
    if (!c.title.trim()) return;
    store.put('content', c.id, { ...c, title: c.title.trim(), refs: (c.refs || []).filter((r) => r.url || r.note), createdAt: c.createdAt || Date.now() });
    close();
    toast(isNew ? 'Content item added' : 'Saved');
  };
  const del = async () => { if (await askConfirm('Delete this content item?', { ok: 'Delete' })) { store.remove('content', c.id); close(); } };
  const copy = async () => {
    try { await navigator.clipboard.writeText(instructionsText(c)); toast('Copied. Paste it into your own message to the editor.'); }
    catch { toast('Could not copy on this device.'); }
  };
  return html`<form class="stack" onSubmit=${save}>
    <${Field} label="Title" id="ce-title"><input id="ce-title" data-autofocus=${isNew} value=${c.title} onInput=${(e) => set('title', e.currentTarget.value)} /><//>
    <${Field} label="Format" id="ce-format" hint="A standalone recording and an edit of a live session are tracked separately.">
      <select id="ce-format" value=${c.format} onChange=${(e) => set('format', e.currentTarget.value)}>${Object.entries(CONTENT_FORMATS).map(([v, l]) => html`<option value=${v}>${l}</option>`)}</select>
    <//>
    ${c.format === 'liveEdit' && html`<${Field} label="Which live session?" id="ce-src">
      <select id="ce-src" value=${c.sourceLiveId || ''} onChange=${(e) => set('sourceLiveId', e.currentTarget.value)}>
        <option value="">Not linked</option>${lives.map((l) => html`<option value=${l.id}>${l.title}</option>`)}</select><//>`}
    <${Field} label="Stage" id="ce-stage"><select id="ce-stage" value=${c.stage} onChange=${(e) => set('stage', e.currentTarget.value)}>${CONTENT_STAGES.map((s) => html`<option value=${s}>${s}</option>`)}</select><//>
    <div class="row">
      <${Field} label="Planned date" id="ce-pd"><input id="ce-pd" type="date" value=${c.plannedDate || ''} onInput=${(e) => set('plannedDate', e.currentTarget.value)} /><//>
      <${Field} label=${c.format === 'recording' ? 'Recording date' : 'Live date'} id="ce-ld"><input id="ce-ld" type="date" value=${c.eventDate || ''} onInput=${(e) => set('eventDate', e.currentTarget.value)} /><//>
    </div>
    <fieldset class="field"><legend class="field-label">References and timestamps</legend>
      ${(c.refs || []).map((r, i) => html`<div class="ref-edit">
        <input type="url" inputmode="url" aria-label="Link" placeholder="https://…" value=${r.url || ''} onInput=${(e) => setRef(i, { url: e.currentTarget.value.trim() })} />
        <div class="row">
          <input aria-label="Timestamps" placeholder="Timestamps, e.g. 02:15–03:40" value=${r.timestamps || ''} onInput=${(e) => setRef(i, { timestamps: e.currentTarget.value })} />
          <button type="button" class="icon-btn" aria-label="Remove reference" onClick=${() => set('refs', c.refs.filter((_, j) => j !== i))}>✕</button>
        </div>
        <input aria-label="Note" placeholder="Note" value=${r.note || ''} onInput=${(e) => setRef(i, { note: e.currentTarget.value })} />
      </div>`)}
      <button type="button" class="link-btn" onClick=${() => set('refs', [...(c.refs || []), { url: '', timestamps: '', note: '' }])}>+ Add reference</button>
    </fieldset>
    <${Field} label="Editor (optional)" id="ce-ed" hint="Assigning an editor here does not send them anything."><input id="ce-ed" value=${c.editor || ''} onInput=${(e) => set('editor', e.currentTarget.value)} /><//>
    <${Field} label="Instructions for the editor" id="ce-ins"><textarea id="ce-ins" rows="4" value=${c.editorInstructions || ''} onInput=${(e) => set('editorInstructions', e.currentTarget.value)}></textarea><//>
    <button type="button" class="btn small secondary" onClick=${copy}>Copy instructions to share myself</button>
    <${Field} label="Published link" id="ce-pub"><input id="ce-pub" type="url" inputmode="url" value=${c.publishedUrl || ''} onInput=${(e) => set('publishedUrl', e.currentTarget.value.trim())} /><//>
    <${Field} label="Notes" id="ce-notes"><textarea id="ce-notes" rows="3" value=${c.notes || ''} onInput=${(e) => set('notes', e.currentTarget.value)}></textarea><//>
    <p class="hint">Video files are not stored here — keep links to where they live.</p>
    <div class="sheet-actions">
      ${!isNew && html`<button type="button" class="btn quiet" onClick=${del}>Delete</button>`}
      <button class="btn" type="submit" disabled=${!c.title.trim()}>Save</button>
    </div>
  </form>`;
}

export function ContentView() {
  useStore();
  const [stage, setStage] = useState('');
  const today = M.today();
  const all = M.contentItems();
  const active = all.filter((c) => c.stage !== 'Published');
  const shown = stage ? all.filter((c) => c.stage === stage) : active;
  const counts = Object.fromEntries(CONTENT_STAGES.map((s) => [s, all.filter((c) => c.stage === s).length]));
  const advance = (c) => {
    const i = CONTENT_STAGES.indexOf(c.stage);
    if (i < CONTENT_STAGES.length - 1) { store.put('content', c.id, { ...c, stage: CONTENT_STAGES[i + 1] }); toast(`Moved to ${CONTENT_STAGES[i + 1]}`); }
  };
  return html`<div class="screen">
    <${SubHeader} title="Content" />
    <div class="row between"><button class="btn" onClick=${() => openSheet('New content item', ContentEditor)}>+ New item</button></div>
    <${Chips} label="Stage" options=${CONTENT_STAGES.map((s) => [s, `${s}${counts[s] ? ` ${counts[s]}` : ''}`])} value=${stage} onChange=${setStage} />
    <p class="hint">${stage ? `Showing: ${stage}` : 'Showing everything not yet published.'}</p>
    ${shown.length ? html`<ul class="content-list">${shown.sort((a, b) => CONTENT_STAGES.indexOf(a.stage) - CONTENT_STAGES.indexOf(b.stage) || (a.plannedDate || '9').localeCompare(b.plannedDate || '9')).map((c) => html`<li key=${c.id} class="card content-item">
      <button class="content-main" onClick=${() => openSheet('Edit content', ContentEditor, { item: c })}>
        <span class="task-title">${c.title}</span>
        <span class="task-meta">${[CONTENT_FORMATS[c.format], c.stage, c.plannedDate && `Planned ${relDate(c.plannedDate, today)}`, c.editor && `Editor: ${c.editor}`].filter(Boolean).join(' · ')}</span>
      </button>
      <div class="stage-bar" aria-hidden="true">${CONTENT_STAGES.map((s, i) => html`<span class=${i <= CONTENT_STAGES.indexOf(c.stage) ? 'on' : ''}></span>`)}</div>
      ${c.refs?.length > 0 && html`<ul class="refs">${c.refs.slice(0, 3).map((r) => { const u = safeUrl(r.url); return html`<li>${u ? html`<a href=${u} target="_blank" rel="noopener noreferrer">${new URL(u).hostname}</a>` : r.note}${r.timestamps ? ` @ ${r.timestamps}` : ''}</li>`; })}</ul>`}
      ${c.stage !== 'Published' && html`<button class="btn small secondary" onClick=${() => advance(c)}>Move to ${CONTENT_STAGES[CONTENT_STAGES.indexOf(c.stage) + 1]}</button>`}
    </li>`)}</ul>` : html`<${EmptyState}>${stage ? `Nothing in ${stage}.` : 'No content in progress. Add an idea to start.'}<//>`}
  </div>`;
}
