// Prints a VAPID key pair for .env. (Optional: the server also generates and
// stores one in data/vapid.json automatically on first start.)
import webpush from 'web-push';

const k = webpush.generateVAPIDKeys();
console.log(`VAPID_PUBLIC_KEY=${k.publicKey}\nVAPID_PRIVATE_KEY=${k.privateKey}`);
