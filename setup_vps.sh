#!/bin/bash
sudo apt-get update
sudo apt-get install -y docker.io docker-compose nginx certbot python3-certbot-nginx git
sudo groupadd docker
sudo usermod -aG docker $USER
sudo systemctl enable --now docker
sudo systemctl enable --now nginx
echo "Hạ tầng đã sẵn sàng!"
