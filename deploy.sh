#!/bin/bash
set -e

echo "1. 开始安装 Node.js..."
apt-get update
# 使用国内阿里云源加速 apt-get
# 这里省略了换 apt 源的复杂步骤，直接安装
apt-get install -y curl
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt-get install -y nodejs

echo "2. 切换 npm 国内源..."
npm config set registry https://registry.npmmirror.com

echo "3. 安装依赖..."
npm install

echo "4. 启动..."
exec npm run dev