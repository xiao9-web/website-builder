#!/usr/bin/env bash
set -Eeuo pipefail

if [ "$(id -u)" -ne 0 ]; then
  echo "Please run with sudo: sudo $0"
  exit 1
fi

echo "==> Updating apt package index"
apt-get update

echo "==> Installing base packages"
apt-get install -y ca-certificates curl git ufw

if ! command -v docker >/dev/null 2>&1; then
  echo "==> Installing Docker Engine"
  install -m 0755 -d /etc/apt/keyrings
  curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
  chmod a+r /etc/apt/keyrings/docker.asc
  . /etc/os-release
  echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu ${VERSION_CODENAME} stable" > /etc/apt/sources.list.d/docker.list
  apt-get update
  apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
else
  echo "==> Docker already installed"
fi

echo "==> Enabling Docker"
systemctl enable --now docker

echo "==> Configuring Docker log rotation"
mkdir -p /etc/docker
cat >/etc/docker/daemon.json <<'JSON'
{
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "20m",
    "max-file": "3"
  }
}
JSON
systemctl restart docker

if ! swapon --show | grep -q .; then
  echo "==> Creating 2G swap file"
  fallocate -l 2G /swapfile
  chmod 600 /swapfile
  mkswap /swapfile
  swapon /swapfile
  if ! grep -q '^/swapfile ' /etc/fstab; then
    echo '/swapfile none swap sw 0 0' >> /etc/fstab
  fi
else
  echo "==> Swap already configured"
fi

echo "==> Configuring UFW firewall"
ufw allow OpenSSH
ufw allow 80/tcp
ufw --force enable

if [ -n "${SUDO_USER:-}" ] && [ "${SUDO_USER}" != "root" ]; then
  echo "==> Adding ${SUDO_USER} to docker group"
  usermod -aG docker "${SUDO_USER}"
fi

echo "==> Server init complete"
echo "Re-login your SSH session if Docker permission is not active for your user."
