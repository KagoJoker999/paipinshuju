#!/bin/bash

# 发饰数据库网站部署脚本

echo "🚀 开始部署发饰数据库网站..."

# 检查是否已经初始化Git仓库
if [ ! -d ".git" ]; then
    echo "📦 初始化Git仓库..."
    git init
    git branch -M main
fi

# 添加远程仓库（如果不存在）
if ! git remote get-url origin > /dev/null 2>&1; then
    echo "🔗 添加远程仓库..."
    git remote add origin git@github.com:KagoJoker999/paipinshuju.git
fi

# 添加所有文件
echo "📁 添加文件到Git..."
git add .

# 提交更改
echo "💾 提交更改..."
git commit -m "部署发饰数据库排品网站

- 响应式设计，支持手机端和电脑端
- A/B类商品分类展示
- 基于JSON数据动态生成
- 现代化UI设计
- 完整的商品信息展示"

# 推送到GitHub
echo "🌐 推送到GitHub..."
git push -u origin main

echo "✅ 部署完成！"
echo "📱 网站将在GitHub Pages上自动部署"
echo "🔗 访问地址：https://kagojoker999.github.io/paipinshuju/"
echo ""
echo "📋 后续步骤："
echo "1. 在GitHub仓库设置中启用Pages功能"
echo "2. 选择main分支作为源"
echo "3. 等待几分钟让GitHub Pages构建完成"