import { html, useState } from '../../vendor/preact-htm.js';
import { useStore, Card, Field, toast } from '../ui.js';
import { SubHeader } from './more.js';
import * as M from '../model.js';
import { isStandalone, isIOS } from '../push-client.js';
import { isValidTime } from '../core/time.js';
import { IS_ARTIFACT, IS_LOCAL, NO_PUSH } from '../config.js';

const ZONES = (() => {
  try { return Intl.supportedValuesOf('timeZone'); } catch { return ['Asia/Kolkata', 'Asia/Dubai', 'Asia/Singapore', 'Europe/London', 'America/New_York', 'UTC']; }
})();

export function SettingsView() {
  useStore();
  const [s, setS] = useState(M.settings());
  const valid = isValidTime(s.quietStart) && isValidTime(s.quietEnd);
  const save = (e) => { e.preventDefault(); if (!valid) return; M.saveSettings(s); toast('Settings saved'); };
  return html`<div class="screen">
    <${SubHeader} title="Settings" />
    <form class="card stack" onSubmit=${save}>
      <${Field} label="Time zone" id="st-tz" hint="The schedule, “today” and reminders all use this time zone.">
        <select id="st-tz" value=${s.tz} onChange=${(e) => setS({ ...s, tz: e.currentTarget.value })}>${ZONES.map((z) => html`<option value=${z}>${z}</option>`)}</select>
      <//>
      <div class="row">
        <${Field} label="Quiet hours start" id="st-qs"><input id="st-qs" type="time" value=${s.quietStart} onInput=${(e) => setS({ ...s, quietStart: e.currentTarget.value })} /><//>
        <${Field} label="Quiet hours end" id="st-qe"><input id="st-qe" type="time" value=${s.quietEnd} onInput=${(e) => setS({ ...s, quietEnd: e.currentTarget.value })} /><//>
      </div>
      <p class="hint">Reminders that fall in quiet hours are held until quiet hours end.</p>
      <div class="sheet-actions"><button class="btn" type="submit" disabled=${!valid}>Save settings</button></div>
    </form>
  </div>`;
}

function WebAppInstall() {
  return html`<div class="screen">
    <${SubHeader} title="Add to Home Screen" />
    <${Card} title="On iPhone">
      <ol class="steps">
        <li>Open your My Day link in <strong>Safari</strong> and sign in to claude.ai if asked.</li>
        <li>Tap the <strong>Share</strong> button (square with an arrow).</li>
        <li>Tap <strong>Add to Home Screen</strong>, then <strong>Add</strong>.</li>
        <li>Open My Day from its icon. It opens through claude.ai, so you stay signed in there.</li>
      </ol>
      <p class="hint">Your data is saved to your claude.ai account, so it is the same in Safari, the Claude app and on your computer.</p>
    <//>
    <${Card} title="On a computer">
      <p>Bookmark the link, or pin the tab.</p>
    <//>
  </div>`;
}

export function InstallView() {
  if (IS_ARTIFACT) return html`<${WebAppInstall} />`;
  const standalone = isStandalone();
  return html`<div class="screen">
    <${SubHeader} title="Add to Home Screen" />
    ${standalone ? html`<${Card}><p><strong>You are using the Home Screen app.</strong>${NO_PUSH ? '' : html` You can now <a href="#more/notifications">turn on notifications</a>.`}</p><//>` : ''}
    <${Card} title="On iPhone (iOS 16.4 or later)">
      <ol class="steps">
        <li>Open My Day in <strong>Safari</strong> (not inside another app’s browser).</li>
        <li>Tap the <strong>Share</strong> button (square with an arrow).</li>
        <li>Scroll down and tap <strong>Add to Home Screen</strong>, then <strong>Add</strong>.</li>
        <li>Close Safari and open <strong>My Day</strong> from its Home Screen icon.</li>
        ${IS_LOCAL
          ? html`<li>Use My Day from the Home Screen icon from now on. It keeps its own storage, separate from Safari, and works offline.</li>`
          : html`<li>Sign in again inside the Home Screen app — it keeps its own storage, separate from Safari.</li>
        ${!NO_PUSH && html`<li>Go to More → Reminders and notifications → <strong>Enable Notifications</strong>, then send a test.</li>`}`}
      </ol>
      ${isIOS() && !standalone && html`<p class="note">You are viewing this in the browser. ${IS_LOCAL ? 'Add it to the Home Screen so it works offline and keeps its data in one place.' : NO_PUSH ? 'Add it to the Home Screen so it opens like an app and works offline.' : 'Notifications on iPhone need the Home Screen app.'}</p>`}
    <//>
    <${Card} title="On a computer or Android">
      <p>In Chrome or Edge, use the install icon in the address bar, or the menu → Install My Day. On Android, use the menu → Add to Home screen.</p>
    <//>
  </div>`;
}
