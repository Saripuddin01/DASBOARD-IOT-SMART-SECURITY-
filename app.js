// 1. GUNAKAN LINK CDN (Agar bisa jalan di browser tanpa install npm)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { 
  getFirestore, 
  collection, 
  addDoc, 
  getDocs, 
  deleteDoc, 
  doc, 
  query, 
  orderBy 
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCRl1ue9gOpBNmOKaYv4g5FsxSCvq_dKJE",
  authDomain: "udangan-pernikangan.firebaseapp.com",
  projectId: "udangan-pernikangan",
  storageBucket: "udangan-pernikangan.firebasestorage.app",
  messagingSenderId: "511181627721",
  appId: "1:511181627721:web:346f33dd7c5ddeb92afa98"
};

// Initialize Firebase & Firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// 2. FUNGSI TAMBAH (Ditempel ke window agar terbaca onclick HTML)
window.addTask = async function () {
  const taskInput = document.getElementById("task");
  const taskText = taskInput.value.trim();

  if (taskText === "") {
    alert("Isi dulu tugasnya!");
    return;
  }

  try {
    await addDoc(collection(db, "todos"), {
      task: taskText,
      createdAt: new Date() // Penting untuk urutan
    });
    taskInput.value = "";
    loadTasks(); // Refresh list
  } catch (e) {
    console.error("Gagal simpan:", e);
  }
};

// 3. FUNGSI TAMPILKAN DATA
async function loadTasks() {
  const list = document.getElementById("list");
  list.innerHTML = "<li>Memuat...</li>";

  try {
    // Ambil data dari collection 'todos' urut berdasarkan waktu terbaru
    const q = query(collection(db, "todos"), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    
    list.innerHTML = "";
    if (snapshot.empty) {
      list.innerHTML = '<li class="kosong">Belum ada tugas hari ini.</li>';
      return;
    }

    snapshot.forEach((item) => {
      const data = item.data();
      const li = document.createElement("li");
      li.innerHTML = `
        <span class="task-text">${data.task}</span>
        <button class="btn-hapus" onclick="deleteTask('${item.id}')">Hapus</button>
      `;
      list.appendChild(li);
    });
  } catch (e) {
    console.error("Gagal ambil data:", e);
    list.innerHTML = '<li class="kosong">Gagal memuat data. Cek Rules Firestore!</li>';
  }
}

// 4. FUNGSI HAPUS
window.deleteTask = async function (id) {
  if (confirm("Hapus tugas ini?")) {
    try {
      await deleteDoc(doc(db, "todos", id));
      loadTasks();
    } catch (e) {
      console.error("Gagal hapus:", e);
    }
  }
};

// Jalankan saat pertama kali dibuka
loadTasks();
