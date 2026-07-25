const API_URL1 = 'https://api.suyanw.cn/api/meizi.php?type=json';
const API_URL2 = 'https://api.suyanw.cn/api/ksxjj.php?return=json';

let API_URL = 'https://api.suyanw.cn/api/ksxjj.php';
async function fetchWithTimeout(url, timeout = 15000) {
    return Promise.race([
        fetch(url),
        new Promise((_, reject) =>
            setTimeout(() => reject(new Error('请求超时')), timeout)
        )
    ]);
}

async function getPrimaryData() {
    try {
        const response = await fetchWithTimeout(API_URL1, 15000);
        if (!response.ok) {
            throw new Error(`接口1状态码异常: ${response.status}`);
        }
        
        const data = await response.json();
        if (typeof data.text !== 'string' || !data.text.startsWith('http')) {
            throw new Error('接口1返回数据格式错误');
        }
        return data.text;
        
    } catch (error) {
        console.error('接口1加载失败:', error.message);
        return null;
    }
}

async function getBackupData() {
    try {
        const response = await fetch(API_URL2);
        
        if (!response.ok) {
            throw new Error(`接口2状态码异常: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (typeof data.imgurl !== 'string' || !data.imgurl.startsWith('http')) {
            throw new Error('接口2返回数据格式错误');
        }
        
        return data.imgurl;
        
    } catch (error) {
        console.error('接口2加载失败:', error.message);
        return null;
    }
}

async function main() {
    const primaryResult = await getPrimaryData();
    if (primaryResult) {
        API_URL = primaryResult;
    } else {
        const backupResult = await getBackupData();
        API_URL = backupResult || '';
    }
}

// 状态管理
const state = {
    currentImageUrl: '',
    currentImageId: '',
    favorites: JSON.parse(localStorage.getItem('favorites') || '[]'),
    history: JSON.parse(localStorage.getItem('history') || '[]'),
    stats: JSON.parse(localStorage.getItem('stats') || '{"views":0,"downloads":0,"shares":0}'),
    theme: localStorage.getItem('theme') || 'dark',
    quality: 'original'
};

// DOM 元素
const elements = {
    image: document.getElementById('randomImage'),
    loading: document.getElementById('loading'),
    error: document.getElementById('errorMsg'),
    loadBtn: document.getElementById('loadBtn'),
    downloadBtn: document.getElementById('downloadBtn'),
    favoriteBtn: document.getElementById('favoriteBtn'),
    favoriteIcon: document.getElementById('favoriteIcon'),
    fullscreenOverlay: document.getElementById('fullscreenOverlay'),
    fullscreenImage: document.getElementById('fullscreenImage'),
    sharePanel: document.getElementById('sharePanel'),
    favoritesList: document.getElementById('favoritesList'),
    historyList: document.getElementById('historyList'),
    viewCount: document.getElementById('viewCount'),
    favoriteCount: document.getElementById('favoriteCount'),
    downloadCount: document.getElementById('downloadCount'),
    shareCount: document.getElementById('shareCount')
};

// 创建粒子背景
function createParticles() {
    const particlesContainer = document.getElementById('particles');
    for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 6 + 's';
        particle.style.animationDuration = (Math.random() * 3 + 3) + 's';
        particlesContainer.appendChild(particle);
    }
}

// 1. 随机图片加载
function loadRandomImage() {
    main();
    showLoading();
    const randomParam = '?t=' + new Date().getTime() + '&quality=' + state.quality;
    const imageUrl = API_URL + randomParam;
    
    const img = new Image();
    img.onload = function() {
        state.currentImageUrl = imageUrl;
        state.currentImageId = new Date().getTime().toString();
        
        elements.image.src = imageUrl;
        elements.image.style.display = 'block';
        
        hideLoading();
        addToHistory();
        updateStats('views');
        updateFavoriteButton();
    };
    
    img.onerror = function() {
        hideLoading();
        showError();
    };
    
    setTimeout(() => {
        if (!img.complete) {
            hideLoading();
            showError();
        }
    }, 15000);
    
    img.src = imageUrl;
}

// 初始化
function init() {
    createParticles();
    loadStats();
    loadFavorites();
    loadHistory();
    setupQualitySelector();
    applyTheme();
    loadRandomImage();
}

// 2. 全屏查看
function enterFullscreen() {
    if (!state.currentImageUrl) return;
    
    elements.fullscreenImage.src = state.currentImageUrl;
    elements.fullscreenOverlay.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    
    document.addEventListener('keydown', handleFullscreenKeydown);
}

function exitFullscreen() {
    elements.fullscreenOverlay.style.display = 'none';
    document.body.style.overflow = 'auto';
    document.removeEventListener('keydown', handleFullscreenKeydown);
}

function handleFullscreenKeydown(e) {
    if (e.key === 'Escape') exitFullscreen();
    if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        loadRandomImage();
    }
}

// 3. 收藏功能
function toggleFavorite() {
    if (!state.currentImageUrl) return;
    
    const favoriteIndex = state.favorites.findIndex(f => f.id === state.currentImageId);
    
    if (favoriteIndex > -1) {
        state.favorites.splice(favoriteIndex, 1);
        showNotification('已取消收藏', 'fas fa-heart-broken');
    } else {
        state.favorites.unshift({
            id: state.currentImageId,
            url: state.currentImageUrl,
            timestamp: new Date().toLocaleString()
        });
        showNotification('收藏成功', 'fas fa-heart');
    }
    
    localStorage.setItem('favorites', JSON.stringify(state.favorites));
    loadFavorites();
    updateFavoriteButton();
    updateStats('favorites');
}

function updateFavoriteButton() {
    const isFavorited = state.favorites.some(f => f.id === state.currentImageId);
    elements.favoriteIcon.className = isFavorited ? 'fas fa-heart' : 'far fa-heart';
    elements.favoriteBtn.innerHTML = `
        <i class="${isFavorited ? 'fas' : 'far'} fa-heart"></i>
        <span>${isFavorited ? '已收藏' : '收藏'}</span>
    `;
}

function loadFavorites() {
    const container = elements.favoritesList;
    
    if (state.favorites.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; color: var(--text-muted); padding: 30px 20px;">
                <i class="far fa-heart" style="font-size: 24px; margin-bottom: 10px; display: block;"></i>
                暂无收藏
            </div>
        `;
        return;
    }
    
    container.innerHTML = state.favorites.slice(0, 5).map(fav => `
        <div class="content-item" onclick="loadImageFromFavorite('${fav.url}', '${fav.id}')">
            <img class="content-thumb" src="${fav.url}" alt="收藏图片" loading="lazy">
            <div class="content-info">${fav.timestamp}</div>
            <button class="remove-btn" onclick="event.stopPropagation(); removeFavorite('${fav.id}')">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `).join('');
}

function loadImageFromFavorite(url, id) {
    state.currentImageUrl = url;
    state.currentImageId = id;
    elements.image.src = url;
    elements.image.style.display = 'block';
    updateFavoriteButton();
}

function removeFavorite(id) {
    state.favorites = state.favorites.filter(f => f.id !== id);
    localStorage.setItem('favorites', JSON.stringify(state.favorites));
    loadFavorites();
    updateStats('favorites');
    updateFavoriteButton();
}

// 4. 分享功能
function showSharePanel() {
    if (!state.currentImageUrl) return;
    elements.sharePanel.classList.add('active');
}

function hideSharePanel() {
    elements.sharePanel.classList.remove('active');
}

function shareToWeibo() {
    const text = encodeURIComponent('发现一张超美的图片！');
    const url = encodeURIComponent(state.currentImageUrl);
    window.open(`http://service.weibo.com/share/share.php?title=${text}&pic=${url}`);
    updateStats('shares');
    hideSharePanel();
}

function shareToWeixin() {
    copyLink();
    showNotification('链接已复制，请在微信中粘贴分享', 'fab fa-weixin');
    hideSharePanel();
}

function shareToQQ() {
    const text = encodeURIComponent('发现一张超美的图片！');
    const url = encodeURIComponent(state.currentImageUrl);
    window.open(`http://connect.qq.com/widget/shareqq/index.html?title=${text}&pics=${url}`);
    updateStats('shares');
    hideSharePanel();
}

function copyLink() {
    navigator.clipboard.writeText(state.currentImageUrl).then(() => {
        showNotification('链接已复制到剪贴板', 'fas fa-link');
        updateStats('shares');
    }).catch(() => {
        showNotification('复制失败，请手动复制', 'fas fa-exclamation-triangle');
    });
}

// 5. 主题切换
function toggleTheme() {
    state.theme = state.theme === 'light' ? 'dark' : 'light';
    localStorage.setItem('theme', state.theme);
    applyTheme();
}

function applyTheme() {
    document.body.setAttribute('data-theme', state.theme);
}

// 6. 图片质量选择
function setupQualitySelector() {
    document.querySelectorAll('.quality-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.quality-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            state.quality = btn.getAttribute('data-quality');
        });
    });
}

// 下载功能
function downloadImage() {
    if (!state.currentImageUrl) {
        showNotification('请先加载一张图片', 'fas fa-exclamation-triangle');
        return;
    }
    
    try {
        const link = document.createElement('a');
        link.href = state.currentImageUrl;
        link.download = `美女图片_${state.currentImageId}.jpg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        updateStats('downloads');
        showNotification('下载成功', 'fas fa-download');
    } catch (error) {
        showNotification('下载失败，请右键保存', 'fas fa-exclamation-triangle');
    }
}

// 历史记录
function addToHistory() {
    const historyItem = {
        id: state.currentImageId,
        url: state.currentImageUrl,
        timestamp: new Date().toLocaleString()
    };
    
    state.history.unshift(historyItem);
    state.history = state.history.slice(0, 10);
    
    localStorage.setItem('history', JSON.stringify(state.history));
    loadHistory();
}

function loadHistory() {
    const container = elements.historyList;
    
    if (state.history.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; color: var(--text-muted); padding: 30px 20px;">
                <i class="fas fa-history" style="font-size: 24px; margin-bottom: 10px; display: block;"></i>
                暂无历史
            </div>
        `;
        return;
    }
    
    container.innerHTML = state.history.map(item => `
        <div class="content-item" onclick="loadImageFromFavorite('${item.url}', '${item.id}')">
            <i class="fas fa-image" style="font-size: 24px; color: var(--accent);"></i>
            <div class="content-info">${item.timestamp}</div>
        </div>
    `).join('');
}

// 统计更新
function updateStats(type) {
    switch(type) {
        case 'views':
            state.stats.views++;
            elements.viewCount.textContent = state.stats.views;
            break;
        case 'downloads':
            state.stats.downloads++;
            elements.downloadCount.textContent = state.stats.downloads;
            break;
        case 'shares':
            state.stats.shares++;
            elements.shareCount.textContent = state.stats.shares;
            break;
        case 'favorites':
            elements.favoriteCount.textContent = state.favorites.length;
            break;
    }
    localStorage.setItem('stats', JSON.stringify(state.stats));
}

function loadStats() {
    elements.viewCount.textContent = state.stats.views;
    elements.downloadCount.textContent = state.stats.downloads;
    elements.shareCount.textContent = state.stats.shares;
    elements.favoriteCount.textContent = state.favorites.length;
}

// 工具函数
function showLoading() {
    elements.loading.style.display = 'block';
    elements.image.style.display = 'none';
    elements.error.style.display = 'none';
    elements.loadBtn.disabled = true;
    elements.downloadBtn.disabled = true;
}

function hideLoading() {
    elements.loading.style.display = 'none';
    elements.loadBtn.disabled = false;
    elements.downloadBtn.disabled = false;
}

function showError() {
    elements.error.style.display = 'block';
    elements.image.style.display = 'none';
}

function showNotification(message, iconClass) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerHTML = `
        <i class="${iconClass}"></i>
        <span>${message}</span>
    `;
    document.body.appendChild(notification);
    
    setTimeout(() => notification.classList.add('show'), 100);
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => document.body.removeChild(notification), 400);
    }, 3000);
}

// 键盘快捷键
document.addEventListener('keydown', function(e) {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    
    switch(e.code) {
        case 'Space':
            e.preventDefault();
            if (!elements.loadBtn.disabled) loadRandomImage();
            break;
        case 'KeyF':
            e.preventDefault();
            toggleFavorite();
            break;
        case 'KeyD':
            e.preventDefault();
            downloadImage();
            break;
        case 'KeyS':
            e.preventDefault();
            showSharePanel();
            break;
        case 'KeyT':
            e.preventDefault();
            toggleTheme();
            break;
        case 'Escape':
            hideSharePanel();
            break;
    }
});

// 点击外部关闭分享面板
document.addEventListener('click', function(e) {
    if (!elements.sharePanel.contains(e.target) && !e.target.closest('.btn') && !e.target.closest('.overlay-btn')) {
        hideSharePanel();
    }
});

// 页面加载完成后初始化
window.addEventListener('load', init);