# Deploy and Host Leadpost

Leadpost is a self-hosted lead capture form and mini CRM you deploy in one click. Collect leads from an embeddable contact form, then move them through a simple pipeline (New → Contacted → Qualified → Won/Lost) on a private board — all on infrastructure you own, with no monthly SaaS fee and no third party holding your prospect list.

## About Hosting Leadpost
Leadpost runs as a single Node.js service backed by a Postgres database, both included in this template. On deploy, the app creates its database table automatically and serves a clean contact form at the root URL. Captured leads land in a password-protected pipeline board at /admin.html, where you move them between stages and export everyone to CSV. Set ADMIN_PASSWORD to secure the board and PROJECT_NAME to display your company name; the database connection is wired automatically.

## Common Use Cases
- Capturing leads from a landing page or website contact form
- Running a lightweight sales pipeline without a heavy CRM
- Owning your prospect list and exporting it to CSV any time

## Dependencies for Leadpost Hosting
- A Postgres database (included and auto-connected)
- Node.js 18+ runtime (handled by Railway)

### Deployment Dependencies
- Source: https://github.com/YOUR_GITHUB/leadpost

## Why Deploy Leadpost on Railway?
Railway is a singular platform to deploy your infrastructure stack. Railway will host your infrastructure so you don't have to deal with configuration, while allowing you to vertically and horizontally scale it.

By deploying Leadpost on Railway, you are one step closer to supporting a complete full-stack application with minimal burden. Host your servers, databases, AI agents, and more on Railway.
