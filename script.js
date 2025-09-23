// 全局变量
let productsData = [];

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    loadProductData();
});

// 加载商品数据
async function loadProductData() {
    try {
        showLoading(true);
        const response = await fetch('data.json');
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        productsData = await response.json();
        
        if (!Array.isArray(productsData)) {
            throw new Error('数据格式错误：期望数组格式');
        }
        
        // 按样品序号排序
        productsData.sort((a, b) => {
            const sampleA = a.样品序号 || '';
            const sampleB = b.样品序号 || '';
            return sampleA.localeCompare(sampleB);
        });
        
        renderProducts();
        showLoading(false);
        
    } catch (error) {
        console.error('加载数据失败:', error);
        showError(true);
        showLoading(false);
    }
}

// 渲染商品
function renderProducts() {
    const productsA = productsData.filter(product => {
        const sampleNumber = product.样品序号 || '';
        return sampleNumber.toUpperCase().startsWith('A');
    });
    
    const productsB = productsData.filter(product => {
        const sampleNumber = product.样品序号 || '';
        return sampleNumber.toUpperCase().startsWith('B');
    });
    
    renderProductGrid('products-A', productsA);
    renderProductGrid('products-B', productsB);
}

// 渲染商品网格
function renderProductGrid(containerId, products) {
    const container = document.getElementById(containerId);
    
    if (products.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <h3>暂无商品</h3>
                <p>该区域下暂时没有商品数据</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = products.map(product => createProductCard(product)).join('');
}

// 创建商品卡片
function createProductCard(product) {
    const {
        图片链接 = '',
        商品名称 = '未知商品',
        商品编码 = '无编码',
        主仓位 = '未设置',
        样品序号 = '无序号',
        样品仓位 = '未设置',
        实际库存数 = 0
    } = product;
    
    // 处理图片 - 优化加载失败处理
    const imageHtml = 图片链接 ? 
        `<img src="${图片链接}" alt="${商品名称}" 
             onerror="handleImageError(this)" 
             onload="this.style.opacity='1'" 
             style="opacity:0; transition: opacity 0.3s ease;"
             crossorigin="anonymous">` :
        `<div class="image-placeholder">暂无图片</div>`;
    
    return `
        <div class="product-card">
            <div class="product-image">
                ${imageHtml}
            </div>
            <div class="product-info">
                <h3 class="product-name">${商品名称}</h3>
                <div class="product-details">
                    <div class="detail-item">
                        <span class="detail-label">主仓位</span>
                        <span class="detail-value">${主仓位}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">样品序号</span>
                        <span class="detail-value sample-number">${样品序号}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">样品仓位</span>
                        <span class="detail-value">${样品仓位}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">实际库存数</span>
                        <span class="detail-value stock-number">${实际库存数}</span>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// 切换标签页
function showTab(tabName) {
    // 隐藏所有标签页内容
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(content => {
        content.classList.remove('active');
    });
    
    // 移除所有按钮的激活状态
    const tabButtons = document.querySelectorAll('.tab-button');
    tabButtons.forEach(button => {
        button.classList.remove('active');
    });
    
    // 显示选中的标签页
    const selectedTab = document.getElementById(`tab-${tabName}`);
    if (selectedTab) {
        selectedTab.classList.add('active');
    }
    
    // 激活对应的按钮
    const activeButton = Array.from(tabButtons).find(button => 
        button.textContent.includes(tabName)
    );
    if (activeButton) {
        activeButton.classList.add('active');
    }
}

// 显示/隐藏加载状态
function showLoading(show) {
    const loading = document.getElementById('loading');
    loading.style.display = show ? 'block' : 'none';
}

// 显示/隐藏错误状态
function showError(show) {
    const error = document.getElementById('error');
    error.style.display = show ? 'block' : 'none';
}

// 图片加载错误处理
function handleImageError(img) {
    // 尝试使用代理服务
    const originalSrc = img.src;
    
    // 如果还没有尝试过代理，则尝试使用代理服务
    if (!img.dataset.proxyTried) {
        img.dataset.proxyTried = 'true';
        // 使用公共代理服务
        img.src = `https://images.weserv.nl/?url=${encodeURIComponent(originalSrc)}`;
        return;
    }
    
    // 如果代理也失败，显示占位符
    const placeholder = document.createElement('div');
    placeholder.className = 'image-placeholder';
    placeholder.innerHTML = `
        <div style="text-align: center; padding: 20px;">
            <div style="font-size: 2rem; margin-bottom: 10px;">📷</div>
            <div style="font-size: 0.9rem; color: #666;">图片暂时无法显示</div>
            <div style="font-size: 0.8rem; color: #999; margin-top: 5px;">商品编码: ${img.alt}</div>
        </div>
    `;
    
    img.parentElement.replaceChild(placeholder, img);
}

// 搜索功能（可选扩展）
function searchProducts(query) {
    if (!query.trim()) {
        renderProducts();
        return;
    }
    
    const filteredProducts = productsData.filter(product => {
        const searchText = `${product.商品名称} ${product.商品编码} ${product.样品序号}`.toLowerCase();
        return searchText.includes(query.toLowerCase());
    });
    
    const productsA = filteredProducts.filter(product => {
        const sampleNumber = product.样品序号 || '';
        return sampleNumber.toUpperCase().startsWith('A');
    });
    
    const productsB = filteredProducts.filter(product => {
        const sampleNumber = product.样品序号 || '';
        return sampleNumber.toUpperCase().startsWith('B');
    });
    
    renderProductGrid('products-A', productsA);
    renderProductGrid('products-B', productsB);
}