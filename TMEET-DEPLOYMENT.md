# T-Meet Greenlight Deployment

This fork runs at `https://tmeet.tsaedu.com` as the Docker image `greenlight-custom:production`, next to BigBlueButton 3.0.40.

The full server guide (BBB install, HTML5 client, favicon, upgrades, API) is in the BigBlueButton repo: `sndp231998/bigbluebutton` → `TMEET-DEPLOYMENT.md`.

## T-Meet changes in this fork

- Logo: `app/assets/images/t-meet-logo.png` (transparent, used by `Logo.jsx`)
- Favicon and touch icons: `public/favicon.ico`, `public/apple-touch-icon*.png` (also copied to `/var/www/bigbluebutton-default/assets/` on the server, which is where nginx serves them from)
- T-Meet texts in `config/locales/*.yml`, Google sign-in, `robots.txt`, `sitemap.xml`

## Deploy a change

```bash
cd /root/greenlight && git pull
docker build -t greenlight-custom:production .
cd /root/greenlight-v3 && docker compose up -d
docker logs --tail 20 greenlight-v3
```

Runtime config lives in `/root/greenlight-v3/.env` (created by `bbb-install.sh -g`); `docker-compose.yml` there must say `image: greenlight-custom:production`.

## Admin user

```bash
docker exec greenlight-v3 bundle exec rake "admin:create[Name,email@example.com,Strong@Pass1]"
```

Passwords need 8+ characters with upper case, lower case, a digit and a symbol.
