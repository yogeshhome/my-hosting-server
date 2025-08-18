

---

# 🚀 Continuous Deployment with ArgoCD & GitOps

This project is configured for **Continuous Deployment (CD)** using **ArgoCD** and **GitOps**.

## 📂 Project Structure
- `gitops-repo/` → Kubernetes manifests
  - app1-server (ClusterIP)
  - app1-client (LoadBalancer)
- `argocd/my-app-argo.yaml` → ArgoCD Applications
- `scripts/install-argocd.sh` → ArgoCD installer script

## 🛠 Setup & Deployment

### Step 1: Create ArgoCD Namespace
```bash
kubectl create namespace argocd
```

### Step 2: Install ArgoCD
```bash
bash scripts/install-argocd.sh
```

### Step 3: Apply ArgoCD Applications
```bash
kubectl apply -f argocd/my-app-argo.yaml
```

### Step 4: Verify Deployments
```bash
kubectl get pods -n production
kubectl get svc -n production
```

## 🔄 Workflow

1. Make a code change and push to GitHub.
2. ArgoCD will detect changes and auto-sync.
3. Apps will be deployed with the defined resource requests/limits.

## 🌐 Access
- **app1-server** → ClusterIP (internal access)
- **app1-client** → LoadBalancer (external access on port 80)

---
