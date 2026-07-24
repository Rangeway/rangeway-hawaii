# Deploy and operations

Production domain: `https://hawaii.rangeway.co`

Hosting: Hostinger VPS at `72.60.71.39`, served by Nginx from `/var/www/rangeway-hawaii/`.

## Deployment path

1. Push to `main`.
2. GitHub Actions publishes the static site to the repository's `deploy-dist` branch.
3. The VPS service `rangeway-deploy.timer` checks the branch every two minutes.
4. `/usr/local/bin/rangeway-pull-deploy` syncs the branch into `/var/www/rangeway-hawaii/`.

The originals in `source-assets/`, repository documentation, tests, and local tools are excluded from `deploy-dist`. If publishing fails, the prior live files remain in place.

## DNS and TLS

- Cloudflare DNS-only A record: `hawaii.rangeway.co` to `72.60.71.39`
- Nginx configuration: `/etc/nginx/sites-available/rangeway-hawaii`
- Enabled link: `/etc/nginx/sites-enabled/rangeway-hawaii`
- Let's Encrypt certificate: `/etc/letsencrypt/live/hawaii.rangeway.co/`
- Certificate renewal: standard Certbot system renewal

The repository preserves the bootstrap and production Nginx configurations in
`ops/nginx-hawaii-http.conf` and `ops/nginx-hawaii.conf`.

## VPS deployment registration

`/etc/rangeway-deploy.conf` includes:

```text
rangeway-hawaii /var/www/rangeway-hawaii
```

## Local checks

```bash
npm test
npm run check
```

To preview locally:

```bash
python3 -m http.server 8000
```
