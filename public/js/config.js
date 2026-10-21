// Which edition is running. The artifact build (scripts/build-artifact.mjs)
// replaces MYDAY_MODE with "artifact": data is then kept in the claude.ai
// account's private store instead of the self-hosted server.
/* global MYDAY_MODE */
export const MODE = typeof MYDAY_MODE !== 'undefined' ? MYDAY_MODE : 'server';
export const IS_ARTIFACT = MODE === 'artifact';
// GitHub Pages edition: static files only, data stays on this device.
export const IS_LOCAL = MODE === 'local';
/** Editions without a server that can send push notifications. */
export const NO_PUSH = IS_ARTIFACT || IS_LOCAL;
