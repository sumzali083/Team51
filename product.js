// Product details with thumbnail gallery
const $ = (s, r=document)=>r.querySelector(s);
const $$ = (s, r=document)=>Array.from(r.querySelectorAll(s));

function qp(name){
  const u = new URL(location.href);
  return u.searchParams.get(name);
}

window.addEventListener("DOMContentLoaded", ()=>{
  const y = $("#y");
  if(y) y.textContent = new Date().getFullYear();

  const id = qp("id");
  const p = PRODUCTS.find(x => x.id === id);

  if(!p){
    $("#app").innerHTML = `
      <div class="product"><div>Product not found.</div></div>
      <div class="pagination"><a class="btn" href="mens.html">Back to store</a></div>`;
    return;
  }

  // highlight nav for men / women / kids
  const catToNavId = {
    men: "nav-men",
    women: "nav-women",
    kids: "nav-kids"
  };
  Object.values(catToNavId).forEach(id=>{
    const el = document.getElementById(id);
    if(el) el.removeAttribute("aria-current");
  });
  const currentNavId = catToNavId[p.cat];
  if(currentNavId){
    const el = document.getElementById(currentNavId);
    if(el) el.setAttribute("aria-current", "page");
  }

  // mapping for category page + label
  const catToPage = {
    men: "mens.html",
    women: "womens.html",
    kids: "kids.html"
  };
  const catToLabel = {
    men: "Men",
    women: "Women",
    kids: "Kids"
  };
  const catPage = catToPage[p.cat] || "HomePage.html";
  const catLabel = catToLabel[p.cat] || "Shop";

  // thumbnails html
  const thumbs = p.images.map((src, i)=>`
    <button class="thumb-btn${i===0 ? " active":""}" data-index="${i}" aria-label="Image ${i+1}">
      <img alt="${p.name} thumbnail ${i+1}" src="${src}">
    </button>
  `).join("");

  $("#app").innerHTML = `
    <nav class="crumbs" aria-label="Breadcrumb">
      <a href="${catPage}">Home</a> ›
      <a href="${catPage}">${catLabel}</a> ›
      <span aria-current="page">${p.name}</span>
    </nav>

    <section class="product" aria-labelledby="ptitle">
      <div>
        <div class="gallery">
          <img id="mainImg" alt="${p.name}" src="${p.images[0]}">
        </div>
        <div class="thumbs" role="list" aria-label="Product thumbnails">
          ${thumbs}
        </div>
      </div>

      <div>
        <h1 id="ptitle" class="p-title">${p.name}</h1>
        <div class="p-price">£${p.price.toFixed(2)}</div>
        <p class="p-desc">${p.desc}</p>

        <div class="opt-row" aria-label="Size options">
          ${p.sizes.map(s=>`<button class="opt" data-size="${s}">${s}</button>`).join("")}
        </div>
        <div class="opt-row" aria-label="Color options">
          ${p.colors.map(c=>`<button class="opt" data-color="${c}">${c}</button>`).join("")}
        </div>

        <div class="cta">
          <button class="btn primary" id="add">Add to bag</button>
          <a class="btn ghost" id="back" href="${catPage}">Back to products</a>
        </div>
        <div class="note" id="msg" role="status" aria-live="polite"></div>
      </div>
    </section>
  `;

  // image thumb behavior
  const mainImg = $("#mainImg");
  $$(".thumb-btn").forEach(btn=>{
    btn.addEventListener("click", ()=>{
      $$(".thumb-btn").forEach(b=>b.classList.remove("active"));
      btn.classList.add("active");
      const idx = Number(btn.dataset.index);
      mainImg.src = p.images[idx];
      mainImg.alt = `${p.name} – image ${idx+1}`;
    });
  });

  // options / add to bag
  $("#add").addEventListener("click", ()=>{
    const size = $('.opt[data-size].active')?.dataset.size || p.sizes[0];
    const color = $('.opt[data-color].active')?.dataset.color || p.colors[0];
    $("#msg").textContent = `Added “${p.name}” (${color}, ${size}) to bag (demo).`;
  });

  $$(".opt").forEach(btn=>{
    btn.addEventListener("click", ()=>{
      const attr = btn.dataset.size ? "size" : "color";
      $$(`.opt[data-${attr}]`).forEach(b=>b.classList.remove("active"));
      btn.classList.add("active");
    });
  });
});
