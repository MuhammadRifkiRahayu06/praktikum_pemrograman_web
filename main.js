// File: main.js
// Modul 4: Dasar Logika Pemrograman dengan JavaScript & Integrasi DOM

// Dataset awal portofolio (Array of Objects sesuai standar Modul 4)
let projects = [
  {
    id: 1,
    title: "Sistem Manajemen Inventori Database",
    category: "Web App",
    budget: 2500000,
    completed: true
  },
  {
    id: 2,
    title: "Aplikasi Kasir & Perhitungan Transaksi",
    category: "Desktop App",
    budget: 5000000,
    completed: true
  },
  {
    id: 3,
    title: "Landing Page Profil Perusahaan",
    category: "Web App",
    budget: 1500000,
    completed: false
  },
  {
    id: 4,
    title: "Aplikasi Presensi GPS Mobile",
    category: "Mobile App",
    budget: 4500000,
    completed: false
  }
];

// State untuk menyimpan filter kategori & kata kunci pencarian aktif
let activeCategory = "Semua";
let searchKeyword = "";

// Helper function format Rupiah (Arrow Function - ES6+)
const formatRupiah = (angka) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0
  }).format(angka);
};

// Fungsi memperbarui Kartu Statistik menggunakan .reduce() dan .filter()
const updateStats = (dataList) => {
  const totalProjects = dataList.length;
  const totalBudget = dataList.reduce((acc, curr) => acc + curr.budget, 0);
  const completedCount = dataList.filter((item) => item.completed === true).length;

  document.getElementById("stat-total-projects").textContent = totalProjects;
  document.getElementById("stat-total-budget").textContent = formatRupiah(totalBudget);
  document.getElementById("stat-completed-projects").textContent = completedCount;
};

// Fungsi menyaring data terpadu (Kategori + Live Search)
const getFilteredProjects = () => {
  return projects.filter((proj) => {
    const matchCategory =
      activeCategory === "Semua" || proj.category === activeCategory;
    const matchSearch = proj.title.toLowerCase().includes(searchKeyword);
    return matchCategory && matchSearch;
  });
};

// Fungsi render daftar kartu proyek ke DOM menggunakan .map().join("")
const renderProjects = (filteredList) => {
  const container = document.getElementById("project-list");
  if (!container) return;

  if (filteredList.length === 0) {
    container.innerHTML =
      "<p class='empty-state'>Tidak ada proyek yang sesuai dengan filter atau pencarian.</p>";
    return;
  }

  const htmlString = filteredList
    .map((proj) => {
      const badgeClass = proj.completed ? "badge-success" : "badge-pending";
      const statusText = proj.completed ? "Selesai" : "Dalam Pengerjaan";

      return `
        <article class="project-card">
          <div class="project-header">
            <div class="project-info">
              <span class="project-category">${proj.category}</span>
              <h3>${proj.title}</h3>
              <p class="project-budget">Estimasi Anggaran: ${formatRupiah(proj.budget)}</p>
            </div>
            <div>
              <span class="badge ${badgeClass}">${statusText}</span>
            </div>
          </div>

          <div class="card-actions">
            <button
              type="button"
              class="btn-action btn-toggle"
              data-action="toggle"
              data-id="${proj.id}"
            >
              Ubah Status
            </button>
            <button
              type="button"
              class="btn-action btn-delete"
              data-action="delete"
              data-id="${proj.id}"
            >
              Hapus Proyek
            </button>
          </div>
        </article>
      `;
    })
    .join("");

  container.innerHTML = htmlString;
};

// Fungsi sinkronisasi tampilan daftar proyek dan kartu statistik
const refreshUI = () => {
  renderProjects(getFilteredProjects());
  updateStats(projects);
};

// Siklus hidup DOMContentLoaded sesuai Modul 4
document.addEventListener("DOMContentLoaded", () => {
  // Render awal saat halaman selesai dimuat
  refreshUI();

  // ==========================================================
  // FITUR 1: Formulir Input Proyek Dinamis (Handling & Validasi)
  // ==========================================================
  const projectForm = document.getElementById("project-form");
  const titleInput = document.getElementById("project-title");
  const categoryInput = document.getElementById("project-category");
  const budgetInput = document.getElementById("project-budget");
  const completedInput = document.getElementById("project-completed");

  projectForm.addEventListener("submit", (e) => {
    e.preventDefault(); // Mencegah reload halaman

    const title = titleInput.value.trim();
    const category = categoryInput.value;
    const budget = Number(budgetInput.value);
    const completed = completedInput.checked;

    // Validasi input
    if (title === "") {
      alert("Judul proyek tidak boleh kosong!");
      titleInput.focus();
      return;
    }

    if (isNaN(budget) || budget <= 0) {
      alert("Estimasi anggaran harus lebih besar dari 0!");
      budgetInput.focus();
      return;
    }

    // Buat objek proyek baru dengan id unik Date.now()
    const newProject = {
      id: Date.now(),
      title: title,
      category: category,
      budget: budget,
      completed: completed
    };

    // Tambahkan ke array menggunakan spread operator
    projects = [...projects, newProject];

    // Reset form dan render ulang daftar proyek & kartu statistik
    projectForm.reset();
    refreshUI();
  });

  // ==========================================================
  // FITUR 2: Pencarian Real-Time & Filter Terpadu (Live Search)
  // ==========================================================
  const searchInput = document.getElementById("search-input");
  const filterButtons = document.querySelectorAll(".btn-filter");

  searchInput.addEventListener("input", (e) => {
    searchKeyword = e.target.value.toLowerCase();
    renderProjects(getFilteredProjects());
  });

  filterButtons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      filterButtons.forEach((b) => b.classList.remove("active"));
      e.target.classList.add("active");

      activeCategory = e.target.getAttribute("data-category");
      renderProjects(getFilteredProjects());
    });
  });

  // ==========================================================
  // FITUR 3: Aksi Interaktif Kartu (Ubah Status & Hapus Proyek)
  // ==========================================================
  const projectListContainer = document.getElementById("project-list");

  projectListContainer.addEventListener("click", (e) => {
    const action = e.target.getAttribute("data-action");
    if (!action) return;

    const projectId = Number(e.target.getAttribute("data-id"));

    if (action === "toggle") {
      // Ubah status antara 'Dalam Pengerjaan' (false) dan 'Selesai' (true)
      projects = projects.map((proj) => {
        if (proj.id === projectId) {
          return { ...proj, completed: !proj.completed };
        }
        return proj;
      });
    } else if (action === "delete") {
      // Hapus item dari array berdasarkan id-nya
      projects = projects.filter((proj) => proj.id !== projectId);
    }

    // Perbarui tampilan kartu dan angka statistik secara instan
    refreshUI();
  });
});