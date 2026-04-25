# Smart Task Manager - Absolute Victory Deployment Script
$RG = "rg-smart-task-manager-sea"
$ACR = "acrsmarttaskmanagersea.azurecr.io"

Clear-Host
Write-Host "====================================================" -ForegroundColor Cyan
Write-Host " STARTING ABSOLUTE VICTORY DEPLOYMENT" -ForegroundColor Cyan
Write-Host "====================================================" -ForegroundColor Cyan

# 1. Login
Write-Host "`nStep 1: Authenticating..." -ForegroundColor Yellow
az acr login --name acrsmarttaskmanagersea

# 2. Build and Push
Write-Host "`nStep 2: Building and Pushing..." -ForegroundColor Yellow
docker build -t "$ACR/auth-service:latest" ./auth-service; docker push "$ACR/auth-service:latest"
docker build -t "$ACR/task-service:latest" ./task-service; docker push "$ACR/task-service:latest"
docker build -t "$ACR/notification-service:latest" ./notification-service; docker push "$ACR/notification-service:latest"
docker build -t "$ACR/report-service:latest" ./report-service; docker push "$ACR/report-service:latest"
docker build -t "$ACR/audit-service:latest" ./audit-service; docker push "$ACR/audit-service:latest"
docker build -t "$ACR/api-gateway:latest" ./api-gateway; docker push "$ACR/api-gateway:latest"

# 3. Client
$GATEWAY_URL = (& az containerapp show --name api-gateway --resource-group $RG --query "properties.configuration.ingress.fqdn" -o tsv)
docker build --build-arg VITE_API_BASE_URL=https://$GATEWAY_URL -t "$ACR/client:latest" ./client; docker push "$ACR/client:latest"

# 4. Update Azure
Write-Host "`nStep 3: Refreshing Azure..." -ForegroundColor Yellow
az containerapp update --name auth-service --resource-group $RG --image "$ACR/auth-service:latest"
az containerapp update --name task-service --resource-group $RG --image "$ACR/task-service:latest"
az containerapp update --name notification-service --resource-group $RG --image "$ACR/notification-service:latest"
az containerapp update --name report-service --resource-group $RG --image "$ACR/report-service:latest"
az containerapp update --name audit-service --resource-group $RG --image "$ACR/audit-service:latest"
az containerapp update --name api-gateway --resource-group $RG --image "$ACR/api-gateway:latest"
az containerapp update --name client --resource-group $RG --image "$ACR/client:latest"

Write-Host "`n====================================================" -ForegroundColor Green
Write-Host " DEPLOYMENT COMPLETE! " -ForegroundColor Green
Write-Host "Frontend URL: https://client.jollycoast-3e03ff25.southeastasia.azurecontainerapps.io" -ForegroundColor Green
Write-Host "====================================================" -ForegroundColor Green
