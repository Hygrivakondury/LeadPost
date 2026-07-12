# Railway setup — Leadpost

Everything you need to publish this template. Same flow you used for Launchlist.

## Step 1 — GitHub
Create a new **public** repo named `leadpost` and upload the files from this folder so they
sit at the **top level** of the repo (not nested inside another folder).

In `README.md`, replace `YOUR_GITHUB` in the Source line with your GitHub username.

## Step 2 — Create the Railway template
Railway → **Templates → + New**, then on the SAME canvas add BOTH of these before saving:

1. **Service 1 — GitHub repo:** select `leadpost`
2. **Service 2 — Database:** Add → Database → **PostgreSQL**
   (leave it named `Postgres` — capital P — do not rename)

## Step 3 — Set variables on the app service
Click the **Leadpost** service (the GitHub one) → Variables → add these three exactly:

| Variable | Value |
|----------|-------|
| `DATABASE_URL` | `${{Postgres.DATABASE_URL}}` |
| `ADMIN_PASSWORD` | `change-me-please` |
| `PROJECT_NAME` | `our product` |

Type `${{Postgres.DATABASE_URL}}` exactly, with the double curly braces. It links the app to the database.

Confirm BOTH services show on the canvas, then click **Save**.

## Step 4 — Publish
Templates list → **Publish** on this template, then:

- **Name:** `Leadpost`
- **Short description:** `Self-hosted lead capture with a simple CRM pipeline`
- **Category:** Starters
- **Long description:** paste the contents of `README.md` (it already starts with the required
  `# Deploy and Host` heading, which Railway needs — do not remove that first line).

Click **Publish Template**. Done.

## After deploy — where things are
- **Public page:** `/  (contact form)`
- **Admin dashboard:** `/admin.html` (log in with whatever ADMIN_PASSWORD the deployer set)

## Notes
- You do NOT need to "Deploy" a copy to publish. Publishing lists it in the marketplace; deploying
  runs a paid live instance. Skip deploying unless you actually want a running copy.
- The database service MUST stay named `Postgres` for the `${{Postgres.DATABASE_URL}}` reference to work.
- SSL is handled automatically (the included Postgres is SSL-enabled). Do not set PGSSL on Railway.
