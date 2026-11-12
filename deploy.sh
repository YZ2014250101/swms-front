#!/bin/bash
set -e

echo "1. 修改 Ubuntu apt 源为阿里云..."
# 备份原文件
cp /etc/apt/sources.list /etc/apt/sources.list.bak
# 替换为阿里云源（针对 Ubuntu 22.04）
sed -i 's/archive.ubuntu.com/mirrors.aliyun.com/g' /etc/apt/sources.list
sed -i 's/security.ubuntu.com/mirrors.aliyun.com/g' /etc/apt/sources.list

echo "2. 安装 Node.js 20 (通过 NodeSource 阿里云镜像)..."
apt-get update
apt-get install -y curl
# 使用阿里云的 nodesource 镜像，彻底解决被墙问题
curl -fsSL https://mirrors.aliyun.com/nodesource/setup_20.x | bash -
apt-get install -y nodejs

echo "3. 验证 Node 版本..."
node -v
npm -v

echo "4. 切换 npm 国内源..."
npm config set registry https://registry.npmmirror.com

echo "5. 安装依赖..."
# 加上 --no-audit 减少不必要的网络请求，加快速度
npm install --no-audit

echo "6. 启动..."
# 注意：生产环境通常不建议用 dev，如果是测试环境可以保留
exec npm run dev