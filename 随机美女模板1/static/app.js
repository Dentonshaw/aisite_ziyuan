const grid=document.getElementById('grid');
const loading=document.getElementById('loading');
const preview=document.getElementById('preview');
const prevImg=document.getElementById('prevImg');
let currentApi='';
let currentName='';
let isPc=false;
let loadingLock=false;
let imageList=[];
function bindCat(){document.querySelectorAll('.cat-item,.mobile-cat').forEach(el=>{el.onclick=()=>{document.querySelectorAll('.cat-item,.mobile-cat').forEach(i=>i.classList.remove('active'));el.classList.add('active');currentApi=el.dataset.api;currentName=el.dataset.name;isPc=currentName.includes('电脑壁纸');isPc?grid.classList.add('single'):grid.classList.remove('single');imageList=[];grid.innerHTML='';loadFirst();}})}
async function loadFirst(){if(loadingLock)return;loadingLock=true;loading.style.display='block';imageList=[];for(let i=0;i<4;i++)imageList.push(getUrl());render(imageList);loading.style.display='none';loadingLock=false;}
async function loadMore(){if(loadingLock)return;loadingLock=true;let add=[];for(let i=0;i<2;i++)add.push(getUrl());render(add);loadingLock=false;}
function getUrl(){return currentApi+(currentApi.includes('?')?'&':'?')+'v='+Math.random().toString(36).slice(2,10);}
function render(list){list.forEach((url,i)=>{setTimeout(()=>{const card=document.createElement('div');card.className='wall-card';const img=new Image();img.src=url;img.alt=currentName;const bottom=document.createElement('div');bottom.className='card-bottom';const tag=document.createElement('div');tag.className='tag';tag.textContent=currentName;const down=document.createElement('div');down.className='down-btn';down.textContent='下载';down.onclick=(e)=>{e.stopPropagation();const a=document.createElement('a');a.href=url;a.download='wallpaper.jpg';a.target='_blank';a.click();};bottom.append(tag,down);card.append(img,bottom);grid.appendChild(card);img.onload=()=>img.classList.add('loaded');img.onerror=()=>img.src=getUrl();img.onclick=()=>{prevImg.src=url;preview.style.display='grid';};},i*150);})}
window.addEventListener('scroll',()=>{if(window.scrollY+window.innerHeight+300>=document.documentElement.scrollHeight){loadMore();}});
document.querySelector('.close').onclick=()=>preview.style.display='none';
preview.onclick=(e)=>e.target===preview&&(preview.style.display='none');
bindCat();
document.querySelector('.cat-item').click();