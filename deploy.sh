#!/bin/bash
set -e

echo "1. 更新 apt 并安装必需工具..."
# 使用阿里云源
sed -i 's/archive.ubuntu.com/mirrors.aliyun.com/g' /etc/apt/sources.list
sed -i 's/security.ubuntu.com/mirrors.aliyun.com/g' /etc/apt/sources.list
apt-get update
apt-get install -y curl xz-utils

echo "2. 从 npmmirror 下载 Node.js 20 二进制包..."
cd /tmp
rm -f node.tar.xz
# 换成淘宝的二进制镜像，避开清华源的 403 拦截
curl -fsSL https://registry.npmmirror.com/-/binary/node/v20.18.0/node-v20.18.0-linux-x64.tar.xz -o node.tar.xz
tar -xf node.tar.xz
ln -sf /tmp/node-v20.18.0-linux-x64/bin/node /usr/local/bin/node
ln -sf /tmp/node-v20.18.0-linux-x64/bin/npm /usr/local/bin/npm
ln -sf /tmp/node-v20.18.0-linux-x64/bin/npx /usr/local/bin/npx

echo "3. 验证 Node 版本..."
node -v
npm -v

echo "4. 切换 npm 国内源..."
npm config set registry https://registry.npmmirror.com

echo "5. 安装依赖..."
# 切回前端项目目录！
cd /home/workspace/deployments/swms-front
npm install --no-audit
# 2. 强制补装 Linux 专用的 Rolldown 绑定包
# 版本号需要和你的 rolldown 版本匹配，日志里显示是 1.2.3
npm install @rolldown/binding-linux-x64-gnu@1.2.3 --no-save --no-audit


echo "6. 启动..."
exec npm run dev -- --host 0.0.0.0