#!/bin/bash
set -e

echo "1. 更新 apt 并安装必需工具..."
# 使用阿里云源
sed -i 's/archive.ubuntu.com/mirrors.aliyun.com/g' /etc/apt/sources.list
sed -i 's/security.ubuntu.com/mirrors.aliyun.com/g' /etc/apt/sources.list
apt-get update
apt-get install -y curl xz-utils

echo "2. 直接从清华镜像下载 Node.js 20 二进制包..."
# 避免使用 apt 源和 NodeSource，直接下压缩包解压，又快又稳
cd /tmp
curl -fsSL https://mirrors.tuna.tsinghua.edu.cn/nodejs-release/v20.18.0/node-v20.18.0-linux-x64.tar.xz -o node.tar.xz
tar -xf node.tar.xz
# 把 node 和 npm 链接到系统路径里
ln -sf /tmp/node-v20.18.0-linux-x64/bin/node /usr/local/bin/node
ln -sf /tmp/node-v20.18.0-linux-x64/bin/npm /usr/local/bin/npm
ln -sf /tmp/node-v20.18.0-linux-x64/bin/npx /usr/local/bin/npx

echo "3. 验证 Node 版本..."
node -v
npm -v

echo "4. 切换 npm 国内源..."
npm config set registry https://registry.npmmirror.com

echo "5. 安装依赖..."
# 加上 --no-audit 减少网络请求，加快速度
npm install --no-audit

echo "6. 启动..."
# 注意：必须在前台运行，不能放到后台，否则容器会以为脚本结束而退出
exec npm run dev