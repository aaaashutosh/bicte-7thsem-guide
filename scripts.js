document.addEventListener("DOMContentLoaded", () => {
  /* ---------- Data ---------- */
  const DATA = {
    notes: [
      { title: "Research Project (Notes)", slug: "research", url: "https://learncampusbook.blogspot.com/2024/10/research-project-bicte-seven-semester.html" },
      { title: "Python Programming (Notes)", slug: "python", url: "https://learncampusbook.blogspot.com/p/python-bicte-seven-semester-new-notes.html" },
      { title: "Teaching Methods (Notes)", slug: "teaching", url: "https://learncampusbook.blogspot.com/p/teaching-method-notes-seven-semester.html" },
      { title: "Multimedia (Notes)", slug: "multimedia", url: "https://learncampusbook.blogspot.com/2025/01/multimedia-in-education-syllabus-bicte.html" },
      { title: "GIS (Notes)", slug: "gis", url: "https://learncampusbook.blogspot.com/p/geographic-information-system-notes.html" }
    ],
    syllabuses: [
      { title: "Research Project (Syllabus)", slug: "research syllabus", path: "resources/syllabuses/syllabus_researchproject.pdf" },
      { title: "Python Programming (Syllabus)", slug: "python syllabus", path: "resources/syllabuses/syllabus_python.pdf" },
      { title: "Teaching Methods (Syllabus)", slug: "teaching syllabus", path: "resources/syllabuses/syllabus_teachingmethods.pdf" },
      { title: "Multimedia (Syllabus)", slug: "multimedia syllabus", path: "resources/syllabuses/syllabus_multimedia.pdf" },
      { title: "GIS (Syllabus)", slug: "gis syllabus", path: "resources/syllabuses/syllabus_GIS.pdf" }
    ],
    models: {
      python_programming_collection: [{ src: "resources/modelqs/python2081.jpg", alt: "Python model question 2081" }],
      research_project_collection: [{ src: "resources/modelqs/researchproject2081.jpg", alt: "Research project model question 2081" }],
      teaching_methods_collection: [{ src: "resources/modelqs/teachingmethods2081.jpg", alt: "Teaching methods model question 2081" }],
      multimedia_collection: [{ src: "resources/modelqs/multimedia2081.jpg", alt: "Multimedia model question 2081" }],
      GIS_collection: [
        { src: "resources/modelqs/gis_question_1.jpg", alt: "GIS Model Question Not Available" }    
      ]
    }
  };

  /* ---------- Helpers ---------- */
  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => Array.from(document.querySelectorAll(sel));
  const createEl = (tag, attrs = {}, children = []) => {
      const el = document.createElement(tag);
      Object.entries(attrs).forEach(([k,v]) => el.setAttribute(k,v));
      children.forEach(c => el.append(c));
      return el;
  };

  /* ---------- ✨ FIXED: Notes & Syllabus Rendering ---------- */
  function renderNoteCards() {
    const container = $("#notesGrid");
    container.innerHTML = "";
    DATA.notes.forEach(item => {
      const card = createEl("div", { class: "card" });
      card.innerHTML = `
        <div class="title">${item.title}</div>
        <div class="actions">
          <a class="btn primary" href="${item.url}" target="_blank" rel="noopener">Open Notes</a>
        </div>
      `;
      container.append(card);
    });
  }

  function renderSyllabusCards() {
    const container = $("#syllabusGrid");
    container.innerHTML = "";
    DATA.syllabuses.forEach(item => {
        const card = createEl("div", { class: "card" });
        card.innerHTML = `
            <div class="title">${item.title}</div>
            <div class="actions">
                <a class="btn primary" href="${item.path}" target="_blank" rel="noopener">Open</a>
                <a class="btn" href="${item.path}" download>Download</a>
            </div>`;
        container.append(card);
    });
  }

  /* ---------- Interactive Gallery Logic ---------- */
  function renderGalleries() {
    const container = $("#galleryContainer");
    container.innerHTML = ""; // Clear loader
    Object.entries(DATA.models).forEach(([key, images], index) => {
        if (!images || images.length === 0) {
          const galleryEl = createEl("div", { id: key, class: "gallery" });
          galleryEl.innerHTML = `<p class="muted">No model questions available for this subject yet.</p>`;
          container.append(galleryEl);
          return;
        }

        const galleryEl = createEl("div", { id: key, class: `gallery ${index === 0 ? 'active' : ''}` });
        const mainImage = createEl("div", { class: "gallery-main-image" });
        const imgEl = createEl("img", { src: images[0].src, alt: images[0].alt });
        const prevBtn = createEl("button", { class: "gallery-nav-button gallery-prev" }, ["‹"]);
        const nextBtn = createEl("button", { class: "gallery-nav-button gallery-next" }, ["›"]);
        mainImage.append(imgEl, prevBtn, nextBtn);

        const thumbnails = createEl("div", { class: "gallery-thumbnails" });
        images.forEach((img, idx) => {
            const thumb = createEl("img", { src: img.src, alt: `Thumbnail: ${img.alt}`, class: idx === 0 ? 'active' : '', 'data-index': idx });
            thumbnails.append(thumb);
        });

        galleryEl.append(mainImage, thumbnails);
        container.append(galleryEl);

        let currentIndex = 0;
        const updateGallery = () => {
            imgEl.src = images[currentIndex].src;
            imgEl.alt = images[currentIndex].alt;
            thumbnails.querySelectorAll('img').forEach((t, i) => t.classList.toggle('active', i === currentIndex));
        };

        prevBtn.addEventListener("click", () => { currentIndex = (currentIndex - 1 + images.length) % images.length; updateGallery(); });
        nextBtn.addEventListener("click", () => { currentIndex = (currentIndex + 1) % images.length; updateGallery(); });
        thumbnails.addEventListener('click', (e) => {
            if (e.target.tagName === 'IMG') { currentIndex = parseInt(e.target.dataset.index); updateGallery(); }
        });
    });
  }

  /* ---------- UI Event Listeners ---------- */
  function setupUI() {
    const themeToggle = $("#themeToggle"), htmlEl = document.documentElement;
    const savedTheme = localStorage.getItem("theme") || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    htmlEl.setAttribute("data-theme", savedTheme);
    themeToggle.addEventListener("click", () => {
        const newTheme = htmlEl.getAttribute("data-theme") === "dark" ? "light" : "dark";
        htmlEl.setAttribute("data-theme", newTheme);
        localStorage.setItem("theme", newTheme);
    });

    $(".tabs").addEventListener('click', (e) => {
      if (e.target.tagName !== 'BUTTON') return;
      $$(".tabs button").forEach(b => b.classList.remove("active"));
      $$(".gallery").forEach(g => g.classList.remove("active"));
      e.target.classList.add("active");
      $(`#${e.target.dataset.tab}`).classList.add("active");
    });
    
    const btt = $("#backToTop");
    window.addEventListener("scroll", () => btt.classList.toggle("show", window.scrollY > 600));
    btt.addEventListener("click", () => window.scrollTo({top:0, behavior:"smooth"}));
    $("#navToggle").addEventListener("click", () => $("#menu").classList.toggle("show"));
  }

  /* ---------- Init App ---------- */
  renderNoteCards();
  renderSyllabusCards();
  renderGalleries();
  setupUI();
});