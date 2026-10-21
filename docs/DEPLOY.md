# Deploying My Day

You need: an always-on Linux server, a domain or free subdomain pointing at it,
and ports 80 and 443 open. Instructions use Docker; a plain Node.js route is at the end.

## 1. Get a server (free option)

1. Create an Oracle Cloud account and an **Always Free** VM (Ubuntu, ARM "Ampere" A1 or AMD micro).
2. In the VM’s network security list, allow inbound TCP **80** and **443**.
   On Ubuntu images also open the host firewall:
   `sudo iptables -I INPUT -p tcp --dport 80 -j ACCEPT && sudo iptables -I INPUT -p tcp --dport 443 -j ACCEPT && sudo netfilter-persistent save`
3. Note the VM’s public IP address.

## 2. Get an address

* Free: create a subdomain at duckdns.org (e.g. `myday-yourname.duckdns.org`) and set it to the VM’s IP.
* Or: an A record on your own domain pointing at the IP.

## 3. Install and start

```bash
sudo apt update && sudo apt install -y docker.io docker-compose-v2 git
sudo usermod -aG docker $USER && newgrp docker

# copy the project to the server (git clone, scp, or unzip), then:
cd my-day
cp .env.example .env
nano .env        # set at least:  DOMAIN=myday-yourname.duckdns.org
                 #                VAPID_SUBJECT=mailto:your-real-email@example.com
docker compose up -d --build
docker compose exec -it app node --disable-warning=ExperimentalWarning server/set-password.js
```

Open `https://<your-domain>` — Caddy fetches the HTTPS certificate on first visit (takes a few seconds).

## 4. Check

* `https://<domain>/api/health` → `{"ok":true}`
* `docker compose logs -f app` shows `scheduler`/`backup` lines (never your task text).

## Updating

```bash
cd my-day && git pull   # or copy the new files
docker compose up -d --build
```

The service worker detects the new version automatically; the app shows “A new version is ready · Update”.

## Backups

* Automatic: one database copy per day in the `myday-data` volume under `backups/`, last 14 kept.
* Copy them off the server occasionally:
  `docker compose cp app:/data ./myday-data-copy`
* **Also back up `vapid.json`** (in the same folder). If it is lost, every device must turn notifications off and on again.
* In the app: More → Backup and restore → Save a backup file (weekly; store in iCloud Drive/Files).

## Restoring the server from a backup copy

```bash
docker compose stop app
docker compose cp ./myday-YYYY-MM-DD.sqlite app:/data/myday.sqlite
docker compose start app
```

## Changing the password

`docker compose exec -it app node --disable-warning=ExperimentalWarning server/set-password.js` — this signs out all devices.

## Without Docker (plain Node.js)

```bash
# Node.js 22.13+ required
npm ci --omit=dev
cp .env.example .env    # set TRUST_PROXY=1, VAPID_SUBJECT, DATA_DIR
npm run set-password
npm start               # listens on 127.0.0.1:8080
```

Put any HTTPS reverse proxy in front (Caddy: `your.domain { reverse_proxy 127.0.0.1:8080 }`)
and keep it running with systemd (`Restart=always`).

## Security notes

* The server has no sign-up page; the only account is the password set from the command line.
* Five wrong passwords lock that address out for 15 minutes; more than 30 failures an hour blocks all sign-in attempts for that hour.
* Do not enable access logs in Caddy if you want URLs out of logs (they contain no task text, but less is better).
