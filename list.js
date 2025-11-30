// Category listing page (Men, Women, or Kids).
// Globals expected: PRODUCTS, CAT ("men"|"women"|"kids"), PAGE_TITLE

const PER_PAGE = 6;
const $ = (s, r=document)=>r.querySelector(s);

function qs(name, fallback=""){
  const u = new URL(location.href);
  return u.searchParams.get(name) ?? fallback;
}

function setQS(params){
  const u = new URL(location.href);
  Object.entries(params).forEach(([k,v])=>{
    if(v===null || v==="") u.searchParams.delete(k);
    else u.searchParams.set(k,String(v));
  });
  history.replaceState({}, "", u);
  render();
}

function setActiveNav(){
  const ids = ["nav-men", "nav-women", "nav-kids"];
  ids.forEach(id=>{
    const el = document.getElementById(id);
    if(el) el.removeAttribute("aria-current");
  });

  const mapping = { men:"nav-men", women:"nav-women", kids:"nav-kids" };
  const current = mapping[CAT];
  if(current){
    const el = document.getElementById(current);
    if(el) el.setAttribute("aria-current","page");
  }
}

function render(){
  setActiveNav();
  const y = document.getElementById("y");
  if(y) y.textContent = new Date().getFullYear();

  const q = qs("q","");
  const page = Math.max(1, parseInt(qs("page","1"),10));

  const items = PRODUCTS.filter(p =>
    p.cat===CAT && (!q || p.name.toLowerCase().includes(q.toLowerCase()))
  );

  const total = items.length;
  const pages = Math.max(1, Math.ceil(total / PER_PAGE));
  const safePage = Math.min(Math.max(1, page), pages);
  const start = (safePage-1)*PER_PAGE;
  const slice = items.slice(start, start + PER_PAGE);

  const count = document.getElementById("count");
  if(count){
    count.textContent = `${total} item${total!==1 ? "s":""} · ${PAGE_TITLE}`;
  }

  const grid = document.getElementById("grid");
  if(grid){
    grid.innerHTML = slice.map(p=>`
      <article class="card" role="listitem">
        <a href="product.html?id=${encodeURIComponent(p.id)}" aria-label="${p.name}">
          <div class="thumb">
            <img src="${p.images[0]}" alt="${p.name}">
          </div>
          <div class="body">
            <div class="title">${p.name}</div>
            <div class="meta">
              <span class="price">£${p.price.toFixed(2)}</span>
              ${p.tag ? `<span class="badge">${p.tag}</span>` : ""}
            </div>
          </div>
        </a>
      </article>
    `).join("");
  }

  const pageStat = document.getElementById("pageStat");
  if(pageStat){
    pageStat.textContent = `Page ${safePage} of ${pages}`;
  }

  const prev = document.getElementById("prev");
  const next = document.getElementById("next");
  if(prev && next){
    prev.disabled = safePage<=1;
    next.disabled = safePage>=pages;

    prev.onclick = ()=> setQS({page:safePage-1});
    next.onclick = ()=> setQS({page:safePage+1});
  }
}

window.addEventListener("DOMContentLoaded", render);
