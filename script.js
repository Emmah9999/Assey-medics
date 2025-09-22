// ========================
// Require login
// ========================
function requireLogin(allowHome = false) {
  const user = localStorage.getItem("loggedInUser");
  if (!user && !allowHome) {
    alert("Login required to view this page!");
    window.location.href = "login.html"; // redirect baada ya alert
  }
}

function logout() {
  localStorage.removeItem("loggedInUser");
  window.location.href = "login.html";
}

// ========================
// Documents Database
// ========================
const documentsDB = {
  "Nursing": {
    "Year 1": [
      { title: "ANATOMY BASICS", type: "notes", file: "doc/ANATOMY.doc" },
      { title: "COMMUNICATION SKILLS", type: "notes", file: "doc/COMMUNICATION.doc" },
      { title: "COMPUTER", type: "notes", file: "doc/COMPUTER.doc" },
      { title: "PARASITOLOGY", type: "notes", file: "doc/PARASITOLOGY.doc" },
      { title: "PROFESSIONALISM", type: "notes", file: "Professionalism.doc" },
      { title: "INFECTION PREVANTION CONTROL", type: "notes", file: "doc/IPC-1.doc" },
      { title: "Portfolio Sample", type: "portfolio", file: "docs/nursing_year1_portfolio.docx" }
    ],
    "Year 2": [
      { title: "Medical-Surgical Nursing", type: "notes", file: "docs/nursing_year2_medical.docx" },
      { title: "Pathophysiology Notes", type: "notes", file: "docs/nursing_year2_patho.pdf" },
      { title: "Past Paper - 2023", type: "pastpaper", file: "docs/nursing_year2_pastpaper.pdf" }
    ]
  },
  "Pharmacist": {
    "Year 1": [
      { title: "Pharmacology Basics", type: "notes", file: "docs/pharmacy_year1_basics.pdf" },
      { title: "Drug Calculation Guide", type: "notes", file: "docs/pharmacy_year1_drugcalc.docx" },
      { title: "Research on Drug Safety", type: "research", id: "pharmaR1" }
    ]
  },
  "Doctor": {
    "Year 1": [
      { title: "Biochemistry Notes", type: "notes", file: "docs/doctor_year1_biochem.pptx" },
      { title: "Portfolio Sample", type: "portfolio", file: "docs/doctor_year1_portfolio.pdf" }
    ]
  }
};

// ========================
// Highlight active nav
// ========================
function highlightNav() {
  const pageId = document.body.id;
  const navLinks = document.querySelectorAll("nav ul li a");

  if (!navLinks) return;

  navLinks.forEach(link => {
    link.classList.remove("active-nav");
    if (
      (pageId === "home" && link.getAttribute("href") === "index.html") ||
      (pageId === "about" && link.getAttribute("href") === "about.html") ||
      (pageId === "contact" && link.getAttribute("href") === "contact.html") ||
      (pageId === "dashboard" && link.getAttribute("href") === "dashboard.html")
    ) {
      link.classList.add("active-nav");
    }
  });
}

// ========================
// Show documents
// ========================
function showDocs(course, level, category, btnElement) {
  const results = document.getElementById("docResults");
  if (!results || !documentsDB[course] || !documentsDB[course][level]) return;

  const docs = documentsDB[course][level].filter(d => d.type === category);

  // Highlight active button
  const allButtons = document.querySelectorAll('#categoryOptions button');
  allButtons.forEach(btn => btn.classList.remove('active'));
  if (btnElement) btnElement.classList.add('active');

  if (docs.length > 0) {
    let html = `<h3>${category.toUpperCase()} - ${course} (${level})</h3><ul>`;
    docs.forEach(doc => {
      if (doc.type === "research") {
        const waText = encodeURIComponent(`Nataka Research: ${doc.title} (${course} ${level})`);
        html += `<li>${doc.title} 
          <a href="https://wa.me/255794318660?text=${waText}" target="_blank" class="btn">
              Request via WhatsApp
          </a></li>`;
      } else {
        html += `<li>${doc.title} 
          <a href="${doc.file}" download class="btn">Download</a></li>`;
      }
    });
    html += "</ul>";
    results.innerHTML = html;
  } else {
    results.innerHTML = `<p>No ${category} documents for ${course} - ${level}</p>`;
  }
}

// ========================
// DOMContentLoaded
// ========================
document.addEventListener("DOMContentLoaded", () => {
  highlightNav();

  // ---- Mobile menu toggle ----
  const menuBtn = document.querySelector(".menu-btn");
  const navUl = document.querySelector("nav ul");
  if (menuBtn && navUl) {
    menuBtn.addEventListener("click", () => {
      navUl.classList.toggle("active");
    });
  }

  // ---- LOGIN FORM ----
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const username = document.getElementById("username").value;
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;

      // Hifadhi data localStorage
      const userData = { username, email, password, loginTime: new Date().toISOString() };
      localStorage.setItem("loggedInUser", JSON.stringify(userData));

      // Tuma email notification kupitia EmailJS
      if (typeof emailjs !== "undefined") {
        emailjs.init("YOUR_PUBLIC_KEY"); // weka public key yako
        emailjs.send("YOUR_SERVICE_ID", "YOUR_TEMPLATE_ID", {
          username: username,
          email: email,
          login_time: new Date().toLocaleString()
        })
        .then(() => console.log("Email notification sent!"))
        .catch((err) => console.error("EmailJS error:", err));
      }

      // Redirect
      window.location.href = "dashboard.html";
    });
  }

  // ---- FEEDBACK FORM ----
  const feedbackForm = document.getElementById("feedbackForm");
  if (feedbackForm) {
    feedbackForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const name = document.getElementById("fb_name").value;
      const email = document.getElementById("fb_email").value;
      const message = document.getElementById("fb_message").value;

      if (typeof emailjs !== "undefined") {
        emailjs.init("YOUR_PUBLIC_KEY");
        emailjs.send("YOUR_SERVICE_ID", "YOUR_FEEDBACK_TEMPLATE_ID", {
          from_name: name,
          from_email: email,
          message: message,
          sent_time: new Date().toLocaleString()
        })
        .then(() => {
          alert("Message sent successfully!");
          feedbackForm.reset();
        })
        .catch((err) => {
          console.error("EmailJS error:", err);
          alert("Failed to send message, try again.");
        });
      }
    });
  }

  // ---- DOC FORM ----
  const docForm = document.getElementById("docForm");
  if (docForm) {
    docForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const course = document.getElementById("course").value;
      const level = document.getElementById("level").value;
      const results = document.getElementById("docResults");
      const catOptions = document.getElementById("categoryOptions");

      if (documentsDB[course] && documentsDB[course][level]) {
        const docs = documentsDB[course][level];
        const categories = [...new Set(docs.map(d => d.type))];

        let catHtml = "<h3>Choose Category:</h3>";
        categories.forEach(cat => {
          catHtml += `<button type="button" class="btn" onclick="showDocs('${course}','${level}','${cat}', this)">${cat.toUpperCase()}</button> `;
        });

        catOptions.innerHTML = catHtml;
        results.innerHTML = "";
      } else {
        catOptions.innerHTML = "";
        results.innerHTML = `<p>No documents found for ${course} - ${level}</p>`;
      }
    });
  }
});
