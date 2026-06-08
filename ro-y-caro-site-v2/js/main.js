function slugTitle(title){
  return String(title || "").replace(/\s+/g,"<br>");
}

function mediaThumb(project){
  if(project.cover){
    return `<img src="${project.cover}" alt="${project.title}">`;
  }
  if(project.video){
    return `<video src="${project.video}" muted playsinline loop></video>`;
  }
  return `<div class="fake-img"></div>`;
}

function projectCard(project, index){
  const doodleClass = project.doodle === ")))" ? "rays" : "curve";
  const doodle = project.doodle ? `<span class="scribble ${doodleClass}">${project.doodle}</span>` : "";
  return `
    <a class="card reveal" href="project.html?id=${project.id}">
      <p class="num">${project.number}</p>
      <h3 class="card-title">${slugTitle(project.title)}</h3>
      <div class="thumb">${mediaThumb(project)}</div>
      ${doodle}
      <span class="project-link">Ver proyecto →</span>
    </a>
  `;
}

function renderFeatured(){
  const grid = document.getElementById("featured-grid");
  if(!grid) return;
  grid.innerHTML = PROJECTS.filter(p => p.featured).slice(0,3).map(projectCard).join("");
}

function renderAllWork(){
  const grid = document.getElementById("all-work-grid");
  if(!grid) return;
  grid.innerHTML = PROJECTS.map(projectCard).join("");
}

function getEmbed(url){
  if(!url) return "";
  if(url.includes("youtube.com") || url.includes("youtu.be") || url.includes("vimeo.com")){
    return `<iframe src="${url}" title="Video del proyecto" allowfullscreen></iframe>`;
  }
  return "";
}

function mainMedia(project){
  if(project.videoEmbed) return getEmbed(project.videoEmbed);
  if(project.video) return `<video src="${project.video}" controls playsinline></video>`;
  if(project.cover) return `<img src="${project.cover}" alt="${project.title}">`;
  return `<div class="media-placeholder"></div>`;
}

function gallery(project){
  const items = (project.images || []).filter(Boolean);
  if(items.length === 0){
    return `
      <div class="project-gallery">
        <div class="gallery-item"><div class="media-placeholder"></div></div>
        <div class="gallery-item"><div class="media-placeholder"></div></div>
        <div class="gallery-item"><div class="media-placeholder"></div></div>
      </div>
    `;
  }
  return `<div class="project-gallery">${items.map(src => `
    <div class="gallery-item"><img src="${src}" alt="Imagen de ${project.title}"></div>
  `).join("")}</div>`;
}

function renderProject(){
  const detail = document.getElementById("project-detail");
  if(!detail) return;
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  const project = PROJECTS.find(p => p.id === id) || PROJECTS[0];
  const currentIndex = PROJECTS.findIndex(p => p.id === project.id);
  const nextProject = PROJECTS[(currentIndex + 1) % PROJECTS.length];
  document.title = `${project.title} — Ro y Caro`;

  detail.innerHTML = `
    <section class="project-hero reveal">
      <div>
        <p class="project-kicker">${project.number} / ${project.category}</p>
        <h1 class="project-title">${project.title}</h1>
      </div>
      <div class="project-meta">
        <div>${project.year}</div>
        <div>${project.role}</div>
        <div>${project.credits}</div>
      </div>
    </section>

    <div class="pen-line"></div>

    <section class="project-main-media reveal">${mainMedia(project)}</section>

    <section class="project-text reveal">
      <div>
        <h2>El caso</h2>
        <div class="mini-line"></div>
      </div>
      <div>
        <p>${project.subtitle}</p>
        <p>${project.description}</p>
      </div>
    </section>

    ${gallery(project)}

    <nav class="project-nav">
      <a class="back-link" href="work.html">← Todos los trabajos</a>
      <a class="next-link" href="project.html?id=${nextProject.id}">Siguiente proyecto →</a>
    </nav>
  `;
}

function revealOnScroll(){
  const items = document.querySelectorAll(".reveal");
  if(!("IntersectionObserver" in window)){
    items.forEach(item => item.classList.add("is-visible"));
    return;
  }
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, {threshold:.12});
  items.forEach(item => observer.observe(item));
}

renderFeatured();
renderAllWork();
renderProject();
revealOnScroll();
