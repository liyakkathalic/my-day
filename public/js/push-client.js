import { api } from './api.js';

export function isStandalone() {
  return navigator.standalone === true || matchMedia('(display-mode: standalone)').matches;
}
export function isIOS() {
  return /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
}

export function pushSupport() {
  const notif = 'Notification' in window;
  return {
    secure: window.isSecureContext,
    standalone: isStandalone(),
    ios: isIOS(),
    supported: 'serviceWorker' in navigator && 'PushManager' in window && notif,
    permission: notif ? Notification.permission : 'unsupported',
  };
}

function b64ToBytes(b64) {
  const pad = '='.repeat((4 - (b64.length % 4)) % 4);
  const raw = atob((b64 + pad).replace(/-/g, '+').replace(/_/g, '/'));
  return Uint8Array.from(raw, (c) => c.charCodeAt(0));
}

const deviceLabel = () => (isIOS() ? 'iPhone' : /Android/.test(navigator.userAgent) ? 'Android' : 'Browser');

export async function currentSubscription() {
  if (!('serviceWorker' in navigator)) return null;
  const reg = await navigator.serviceWorker.ready;
  return reg.pushManager?.getSubscription() ?? null;
}

/** Must be called directly from a button tap (iOS requires a user gesture). */
export async function enablePush() {
  // Ask for permission first, before any network wait, so the tap still counts as a gesture.
  const perm = await Notification.requestPermission();
  if (perm !== 'granted') return perm;
  const { publicKey } = await api('/api/push/key');
  const reg = await navigator.serviceWorker.ready;
  const key = b64ToBytes(publicKey);
  let sub = await reg.pushManager.getSubscription();
  if (sub) {
    const existing = sub.options?.applicationServerKey && new Uint8Array(sub.options.applicationServerKey);
    if (existing && existing.join() !== key.join()) { await sub.unsubscribe(); sub = null; }
  }
  if (!sub) sub = await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: key });
  await api('/api/push/subscribe', { method: 'POST', body: { subscription: sub.toJSON(), label: deviceLabel() } });
  return 'granted';
}

export async function disablePush() {
  const sub = await currentSubscription();
  if (!sub) return;
  try { await api('/api/push/unsubscribe', { method: 'POST', body: { endpoint: sub.endpoint } }); } finally { await sub.unsubscribe(); }
}

export async function serverStatus() {
  const sub = await currentSubscription();
  const s = await api('/api/push/status', { method: 'POST', body: { endpoint: sub?.endpoint || '' } });
  return { ...s, hasLocalSubscription: !!sub };
}

/** Re-register silently if the browser still has a subscription the server lost. */
export async function repairSubscription() {
  try {
    const sub = await currentSubscription();
    if (sub && Notification.permission === 'granted') {
      await api('/api/push/subscribe', { method: 'POST', body: { subscription: sub.toJSON(), label: deviceLabel() } });
    }
  } catch { /* offline or signed out */ }
}

export const sendTest = (delaySeconds = 0) => api('/api/push/test', { method: 'POST', body: { delaySeconds } });
