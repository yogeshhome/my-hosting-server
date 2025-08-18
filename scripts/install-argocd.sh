#!/bin/bash
set -e

# Create namespace
kubectl create namespace argocd || true

# Install ArgoCD
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml

# Wait for pods
kubectl rollout status deployment/argocd-server -n argocd

# Port forward
kubectl port-forward svc/argocd-server -n argocd 8080:443 &

# Print admin password
echo "ArgoCD admin password:"
kubectl get secret argocd-initial-admin-secret -n argocd -o jsonpath="{.data.password}" | base64 -d
echo
