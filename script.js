// Kunci penyimpanan di LocalStorage
const STORAGE_KEY = "todo_list_pertemuan_5";

// Mengambil data dari LocalStorage saat halaman dimuat
let todos = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

// Seleksi Elemen DOM
const todoForm = document.getElementById("todo-form");
const todoInput = document.getElementById("todo-input");
const todoList = document.getElementById("todo-list");
const taskCounter = document.getElementById("task-counter");
const clearCompletedBtn = document.getElementById("clear-completed-btn");

// Simpan array todos ke LocalStorage
const saveToLocalStorage = () => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
};

// FITUR 1: Penghitung Jumlah Tugas (Task Counter)
const updateTaskCounter = () => {
  const total = todos.length;
  const selesai = todos.filter((todo) => todo.completed === true).length;
  const belumSelesai = total - selesai;

  taskCounter.textContent = `Total: ${total} Tugas | Selesai: ${selesai} | Belum Selesai: ${belumSelesai}`;
};

// Render daftar tugas ke halaman web
const renderTodos = () => {
  todoList.innerHTML = "";

  if (todos.length === 0) {
    todoList.innerHTML = `<li class="empty-state">Belum ada tugas. Tambahkan tugas baru di atas.</li>`;
    updateTaskCounter();
    return;
  }

  todos.forEach((todo) => {
    const li = document.createElement("li");
    li.className = `todo-item ${todo.completed ? "completed" : ""}`;

    li.innerHTML = `
      <label class="todo-left">
        <input
          type="checkbox"
          data-action="toggle"
          data-id="${todo.id}"
          ${todo.completed ? "checked" : ""}
        >
        <span class="todo-text">${todo.text}</span>
      </label>
      <button
        type="button"
        class="btn-hapus"
        data-action="hapus"
        data-id="${todo.id}"
      >
        Hapus
      </button>
    `;

    todoList.appendChild(li);
  });

  // Perbarui angka ringkasan setiap kali daftar di-render ulang
  updateTaskCounter();
};

// Tambah Tugas Baru
todoForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const text = todoInput.value.trim();
  if (text === "") {
    alert("Nama tugas tidak boleh kosong!");
    todoInput.focus();
    return;
  }

  const newTodo = {
    id: Date.now(),
    text: text,
    completed: false
  };

  todos = [...todos, newTodo];
  saveToLocalStorage();
  renderTodos();

  todoForm.reset();
  todoInput.focus();
});

// Coret Tugas Selesai & FITUR 3: Konfirmasi Sebelum Menghapus (Confirm Dialog)
todoList.addEventListener("click", (e) => {
  const action = e.target.getAttribute("data-action");
  if (!action) return;

  const id = Number(e.target.getAttribute("data-id"));

  if (action === "toggle") {
    todos = todos.map((todo) =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    saveToLocalStorage();
    renderTodos();
  } else if (action === "hapus") {
    const isConfirmed = confirm("Apakah Anda yakin ingin menghapus tugas ini?");
    if (isConfirmed) {
      todos = todos.filter((todo) => todo.id !== id);
      saveToLocalStorage();
      renderTodos();
    }
  }
});

// FITUR 2: Tombol 'Bersihkan Tugas Selesai'
clearCompletedBtn.addEventListener("click", () => {
  const hasCompleted = todos.some((todo) => todo.completed === true);
  if (!hasCompleted) {
    alert("Tidak ada tugas selesai untuk dibersihkan.");
    return;
  }

  // Hanya menghapus tugas dengan status completed: true dari LocalStorage
  todos = todos.filter((todo) => todo.completed === false);
  saveToLocalStorage();
  renderTodos();
});

// Render awal saat halaman dibuka
renderTodos();