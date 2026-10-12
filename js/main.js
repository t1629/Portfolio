let currentLang = "es";
let jobs = [];
let index = 0;
let jobInterval;

async function loadNav() {
  try {
    const res = await fetch("components/layout/Nav.html");
    if (!res.ok) {
      throw new Error(`Error al cargar Nav.html: ${res.status}`);
    }
    const html = await res.text();
    document.getElementById("nav-container").innerHTML = html;
    setupLangSwitch();
  } catch (err) {
    console.error("No se pudo cargar la navegación:", err);
  }
}
function setupLangSwitch() {
  const langSwitch = document.getElementById("lang-switch");
  const label = document.getElementById("lang-label");

  langSwitch.addEventListener("click", async () => {
    currentLang = currentLang === "es" ? "en" : "es";
    label.textContent = currentLang === "es" ? "Inglés" : "Spanish";
    await loadLang(currentLang);
  });
}
async function loadLang(lang) {
  const res = await fetch(`i18n/${lang}.json`);
  const data = await res.json();
  document.getElementById("start").textContent = data.about.start;
  document.getElementById("title").textContent = data.about.title;
  document.getElementById("text").textContent = data.about.text;
  document.getElementById("development").innerHTML =
    `<span id="job">${data.about.development[0]}</span>`;
  document.getElementById("information").textContent = data.about.information;
  document.getElementById("skill_information").textContent =
    data.about.skill_information;
  document.getElementById("passion_information").textContent =
    data.about.passion_information;
  document.getElementById("button_download").textContent =
    data.about.button_download;

  document.getElementById("technologies_title").textContent =
    data.technologies.title;
  document.getElementById("technologies_stack").textContent =
    data.technologies.technologies_title;
  document.getElementById("tools").textContent = data.technologies.tools;

  document.getElementById("education_title").textContent = data.education.title;
  document.getElementById("education_sub_title").textContent =
    data.education.sub_title;

  const content = document.getElementById("education_container");

  content.innerHTML = "";

  data.education.item.forEach((item) => {
    const div = document.createElement("div");
    div.classList.add("education_item");
    div.innerHTML = `
      <h4>${item.university}</h4>
      <p>${item.text}</p>
      <p>${item.date}</p>
    `;

    if (item.certification) {
      const link = document.createElement("a");
      link.href = item.certification;
      link.textContent = item.text_download;
      link.setAttribute("download", "");
      link.setAttribute("target", "_blank");
      div.appendChild(link);
    }

    content.appendChild(div);
  });

  document.getElementById("project_title").textContent = data.projects.title;
  const projectsContainer = document.getElementById("projects_container");
  projectsContainer.innerHTML = "";
  data.projects.allProjects.forEach((allProjects) => {
    const div = document.createElement("div");
    div.classList.add("project-card");
    div.innerHTML = `
      <h4>${allProjects.name}</h4>
      <p><strong>${allProjects.description}</strong></p>
      <a href="${allProjects.link}"  class="btn button_project" target= _blank>${allProjects.text_link}</a>
      <a href="${allProjects.code_link}" class="btn button_project"   target= _blank>${allProjects.text_code}</a>
      <p><strong>${allProjects.technologies_used}</strong></p>
      `;
    const ul = document.createElement("ul");
    allProjects.technologies.forEach((tech) => {
      const li = document.createElement("li");
      li.textContent = tech;
      ul.appendChild(li);
    });

    div.appendChild(ul);
    document.getElementById("projects_container").appendChild(div);
  });

  document.getElementById("title_skills").textContent = data.habilities.title;

  const skillsContainer = document.getElementById("conteiner_habilities");
  skillsContainer.innerHTML = "";

  data.habilities.skills.forEach((s) => {
    const div = document.createElement("div");
    div.classList.add("skill_item");
    div.innerHTML = `
      <h4>${s.name}</h4>
      <p>${s.description}</p>
    `;
    document.getElementById("conteiner_habilities").appendChild(div);
  });
  jobs = data.about.development;
  startJobAnimation();
}

function startJobAnimation() {
  clearInterval(jobInterval);
  index = 0;
  const jobEl = document.getElementById("job");

  function changeJob() {
    let currentText = jobs[index];
    let i = currentText.length;

    let eraseInterval = setInterval(() => {
      jobEl.textContent = currentText.substring(0, i);
      i--;
      if (i < 0) {
        clearInterval(eraseInterval);

        index = (index + 1) % jobs.length;
        let nextText = jobs[index];
        let j = 0;

        let typeInterval = setInterval(() => {
          jobEl.textContent = nextText.substring(0, j);
          j++;
          if (j > nextText.length) {
            clearInterval(typeInterval);
          }
        }, 100);
      }
    }, 100);
  }

  changeJob();
  jobInterval = setInterval(changeJob, 4000);
}

document.addEventListener("DOMContentLoaded", async () => {
  await loadNav();
  await loadLang(currentLang);
});
