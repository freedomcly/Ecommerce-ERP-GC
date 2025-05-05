# E-commerce ERP 

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/yourname/ecommerce-erp/blob/main/LICENSE)

Cross-border e-commerce ERP solution for multi-platform sellers

🇬🇧 English | [🇨🇳 中文版](#chinese-version)

## Supported Platforms

- ✅ Shopee 
- ✅ Lazada 
- ✅ TikTok
- ✅ Coupang

## Key Features
- 🌐 Unified API Integration - Streamline product upload and order processing across platforms
- 🗃️ Centralized Product Management - CRUD operations with version control
- 📦 Automated Procurement - Auto-merge orders from multiple platforms into standardized purchase lists
- 🧮 Intelligent Financial Settlement - Automated calculation of cross-border fees (shipping/taxes/platform charges)
- 🚀 Campaign Automation - Platform marketing event integration for traffic growth

## Quick Start
```bash
# Clone repo
git clone https://github.com/freedomcly/ecommerce-erp.git

# Install dependencies
cd backend
npm install

cd frontend
npm install

# Start service
cd frontend
npm run start

cd frontend
npm run start
```

## Config

需要配置目录backend/configs/下的文件，其中包含平台授权账号信息等
```
backend/configs/shopee.js
backend/configs/lazada.js
backend/configs/tiktok.js
backend/configs/coupang.js
backend/configs/mongodb.js
```

---

<a id="chinese-version"></a >
# 跨境电商ERP系统

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/yourname/ecommerce-erp/blob/main/LICENSE)

为多平台卖家打造的跨境电商ERP解决方案

## 已对接平台
- ✅ Shopee 
- ✅ Lazada 
- ✅ TikTok
- ✅ Coupang

## 核心功能
- 🌐 多平台开放接口对接 - 商品上传、订单处理等操作一站式管理
- 🗃️ 智能商品库 - 支持本地商品信息的增删改查及版本管理
- 📦 自动化采购系统 - 自动聚合多平台订单，生成标准化采购单
- 🧮 智能财务结算 - 多国运费/税费自动核算，统一平台费用计算模型
- 🚀 营销活动引擎 - 对接平台活动接口，实现自动报名与流量运营

## 快速开始
```bash
# 克隆仓库
git clone https://github.com/yourname/ecommerce-erp.git

# 安装依赖
npm install

# 启动服务
npm run start
```

## License
MIT © 2023 freedomcly