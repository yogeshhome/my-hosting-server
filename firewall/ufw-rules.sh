
# Allow only necessary ports
sudo ufw allow 22/tcp        # SSH
sudo ufw allow 80/tcp        # HTTP (for cert renewal)
sudo ufw allow 443/tcp       # HTTPS
sudo ufw allow 51820/udp     # WireGuard (if using VPN)
sudo ufw enable 