# BSSONS JEWELLERS — E-Commerce + DevOps CI/CD

A starter full-stack jewellery store with React/Vite, Express, MongoDB, Docker, Kubernetes, GitHub Actions, Argo CD, Prometheus and Grafana.

## Features
- Responsive storefront with Gold, Silver, Platinum, Diamond, Rings, Bracelets, Gents Chains and Ladies Chains categories
- Search, category filter, product detail, cart and demo checkout
- Express REST API and MongoDB product seed
- Docker Compose local development
- Kubernetes manifests + Argo CD GitOps application
- GitHub Actions builds/pushes images to GHCR and updates the Kubernetes image tag
- Prometheus scrape config and Grafana provisioning starter

> This is a learning/portfolio starter, not a production-ready payment or inventory system. Checkout is demo-only. Before launch, add authentication, authorization, payment gateway integration, server-side validation, rate limiting, audit logs, secrets management, tests and security review. Replace sample product photos with licensed images owned by the business.

## Tech stack
- Frontend: React 18 + Vite
- Backend: Node.js + Express
- Database: MongoDB
- Containers: Docker
- CI: GitHub Actions
- CD: Argo CD + Kubernetes
- Monitoring: Prometheus + Grafana

## Project structure
```text
bssons-jewellers/
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── data/
│   │   ├── App.jsx
│   │   ├── api.js
│   │   ├── main.jsx
│   │   └── styles.css
│   ├── Dockerfile
│   ├── nginx.conf
│   └── package.json
├── backend/
│   ├── src/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── seed.js
│   │   └── server.js
│   ├── Dockerfile
│   └── package.json
├── k8s/
│   ├── base/
│   └── overlays/prod/
├── argocd/application.yaml
├── monitoring/
├── .github/workflows/ci-cd.yml
├── docker-compose.yml
└── .env.example
```

## Step 1 — Run locally
Requirements: Node.js 20+, Docker Desktop and Git.

```bash
git clone <your-repository-url>
cd bssons-jewellers
cp .env.example .env
docker compose up --build
```

Open:
- Storefront: http://localhost:8080
- API health: http://localhost:5000/api/health
- Products API: http://localhost:5000/api/products

Seed demo products:
```bash
docker compose exec backend npm run seed
```

## Step 2 — Run without Docker (optional)
Terminal 1:
```bash
cd backend
npm install
npm run seed
npm run dev
```
Terminal 2:
```bash
cd frontend
npm install
npm run dev
```
For local non-Docker mode, set `VITE_API_URL=http://localhost:5000/api` in `frontend/.env`.

## Step 3 — Push to GitHub
Create a GitHub repository and push this project:
```bash
git init
git add .
git commit -m "Initial BSSONS Jewellers project"
git branch -M main
git remote add origin https://github.com/<OWNER>/<REPO>.git
git push -u origin main
```

In GitHub repository Settings → Actions → General, allow workflow write permissions.
The workflow uses `GITHUB_TOKEN` to publish images to GitHub Container Registry (GHCR) and update `k8s/overlays/prod/kustomization.yaml`.

## Step 4 — Kubernetes + Argo CD
1. Create or use a Kubernetes cluster (kind/minikube for practice; managed cluster for production).
2. Install Argo CD in the cluster using the official Argo CD installation guide.
3. Edit `argocd/application.yaml`: replace `<YOUR_GITHUB_REPO_URL>` and `<YOUR_GITHUB_BRANCH>`.
4. Create the database credentials in the `bssons` namespace before the first sync (use strong values; do not commit them):
```bash
kubectl create namespace bssons
kubectl -n bssons create secret generic bssons-secrets \\
  --from-literal=mongo-username='bssonsadmin' \\
  --from-literal=mongo-password='REPLACE_WITH_A_STRONG_PASSWORD' \\
  --from-literal=mongo-uri='mongodb://bssonsadmin:REPLACE_WITH_A_STRONG_PASSWORD@mongo:27017/bssons?authSource=admin'
```
5. Apply:
```bash
kubectl apply -f argocd/application.yaml
```
5. Argo CD watches `k8s/overlays/prod`. When GitHub Actions updates the image tag in Git, Argo CD detects the Git change and syncs Kubernetes.

If GHCR packages are private, configure `imagePullSecrets` in the target namespace. For a learning demo, packages can be made public in GitHub package settings.

## Step 5 — CI/CD flow
1. Developer pushes code to GitHub.
2. GitHub Actions runs frontend/backend build checks.
3. Workflow builds and pushes frontend/backend Docker images to GHCR.
4. Workflow updates image tags in the GitOps Kustomize overlay.
5. Argo CD detects the Git commit and syncs the cluster.
6. Kubernetes performs rolling deployments and restarts unhealthy containers.
7. Prometheus scrapes metrics; Grafana visualizes them.

## Step 6 — Monitoring
The `monitoring/` folder contains a Prometheus scrape configuration and Grafana provisioning examples. Install Prometheus and Grafana in your cluster (for example with the kube-prometheus-stack Helm chart), then adapt scrape targets and dashboards to your environment. The sample app exposes `/metrics` only after you add a metrics middleware/exporter; do not assume the starter API already exposes Prometheus metrics.

## Important production checklist
- Implement user accounts, hashed passwords, roles and admin authorization.
- Integrate a PCI-compliant payment provider; never store card data.
- Validate prices and stock on the server; never trust browser-submitted totals.
- Add image upload/storage (S3-compatible), image optimization and licensing records.
- Add GST/invoice, shipping, returns, privacy policy and terms for your market.
- Add automated unit/integration/e2e tests and vulnerability scanning.
- Store secrets in Kubernetes Secrets/External Secrets or a cloud secret manager.
- Configure TLS, ingress, DNS, backups, MongoDB persistence and disaster recovery.
