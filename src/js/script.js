const id = (id) => document.getElementById(id);
const noteInput = id("noteInput");
const noteBtn = id("noteBtn");
const noteList = id("noteList");
const darkModeBtn = id("darkModeBtn");

if (localStorage.getItem("darkMode") === "true") {
  document.body.classList.add("dark-mode");
}

darkModeBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");

  const isDark = document.body.classList.contains("dark-mode");
  localStorage.setItem("darkMode", isDark);
});

// Ambil catatan lama dari localStorage
let notes = JSON.parse(localStorage.getItem("notes")) || [];

function createNoteElement(noteText) {
  const li = document.createElement("li");
  li.classList.add("list", "list-animation");

  const buttonContainer = document.createElement("div");
  buttonContainer.classList.add("button-container");

  const span = document.createElement("span");
  span.classList.add("list-description");
  span.textContent = noteText;

  const editBtn = document.createElement("button");
  editBtn.classList.add("edit-button");
  editBtn.classList.add("ml-8");
  editBtn.textContent = "✏️";

  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "❌";
  deleteBtn.classList.add("delete-btn");

  li.appendChild(span);
  li.appendChild(buttonContainer);
  buttonContainer.appendChild(editBtn);
  buttonContainer.appendChild(deleteBtn);

  setTimeout(() => {
    li.classList.add("active");
  }, 10);

  // Metode 1
  // editBtn.addEventListener("click", () => {
  //   noteInput.value = noteText;
  //   notes = notes.filter((note) => note !== noteText);
  //   localStorage.setItem("notes", JSON.stringify(notes));
  //   li.remove();
  // });

  // Metode 2
  editBtn.addEventListener("click", () => {
    const editInput = document.createElement("input");
    editInput.classList.add("edit-input");
    editInput.value = span.textContent;
    li.replaceChild(editInput, span);
    editBtn.textContent = "💾";

    editInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        saveEdit(e);
      }
    });

    editBtn.addEventListener("click", saveEdit);

    function saveEdit() {
      const newText = editInput.value.trim();
      if (!newText) return;
      span.textContent = newText;
      li.replaceChild(span, editInput);

      notes = notes.map((note) => {
        if (note === noteText) {
          return newText;
        }
        return note;
      });

      localStorage.setItem("notes", JSON.stringify(notes));
      noteText = newText;
      editBtn.textContent = "✏️";
      editBtn.removeEventListener("click", saveEdit);
    }
  });

  deleteBtn.addEventListener("click", () => {
    li.remove();

    notes = notes.filter((note) => note !== noteText);

    localStorage.setItem("notes", JSON.stringify(notes));
  });

  return li;
}

notes.forEach((noteText) => {
  const li = createNoteElement(noteText);
  noteList.appendChild(li);
});

function addNote(e) {
  e.preventDefault();
  const noteText = noteInput.value.trim();
  if (!noteText) return;

  const li = createNoteElement(noteText);
  noteList.appendChild(li);

  notes.push(noteText);
  localStorage.setItem("notes", JSON.stringify(notes));

  noteInput.value = "";
}

noteBtn.addEventListener("click", addNote);

noteInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    addNote(e);
  }
});
