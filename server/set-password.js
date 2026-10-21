// Usage: npm run set-password            (prompts, input hidden)
//        MYDAY_PASSWORD=... npm run set-password   (non-interactive)
import readline from 'node:readline';
import { setPassword } from './auth.js';

async function ask(q) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout, terminal: true });
  rl._writeToOutput = (s) => { if (s.includes(q)) rl.output.write(s); };
  return new Promise((r) => rl.question(q, (a) => { rl.close(); process.stdout.write('\n'); r(a); }));
}

let pw = process.env.MYDAY_PASSWORD;
if (!pw) {
  pw = await ask('New password (at least 10 characters): ');
  if (pw !== await ask('Repeat password: ')) { console.error('Passwords do not match.'); process.exit(1); }
}
if (!pw || pw.length < 10) { console.error('Please use at least 10 characters.'); process.exit(1); }
setPassword(pw);
console.log('Password saved. All existing sessions were signed out.');
