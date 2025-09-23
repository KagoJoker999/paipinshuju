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
                <p>该分类下暂时没有商品数据</p>
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
    
    // 处理图片
    const imageHtml = 图片链接 ? 
        `<img src="${图片链接}" alt="${商品名称}" onerror="this.parentElement.innerHTML='<div class=\\'image-placeholder\\'>图片加载失败</div>'">` :
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
                        <span class="detail-label">商品编码</span>
                        <span class="detail-value">${商品编码}</span>
                    </div>
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
                    <div class="detail-item" style="grid-column: span 2;">
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
    img.parentElement.innerHTML = '<div class="image-placeholder">图片加载失败</div>';
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