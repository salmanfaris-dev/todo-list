const id = (id) => document.getElementById(id);
const noteInput = id("noteInput");
const noteBtn = id("noteBtn");
const noteList = id("noteList");
const darkModeBtn = id("darkModeBtn");
const createElement = (element) => document.createElement(element);

if (localStorage.getItem("darkMode") === "true") {
  document.body.classList.add("dark-mode");
}

darkModeBtn.addEventListener("click", toggleDarkMode);

function toggleDarkMode() {
  document.body.classList.toggle("dark-mode");

  const isDark = document.body.classList.contains("dark-mode");
  localStorage.setItem("darkMode", isDark);
}

// Ambil catatan lama dari localStorage
let notes = JSON.parse(localStorage.getItem("notes")) || [];

function saveNotes() {
  localStorage.setItem("notes", JSON.stringify(notes));
}

function createNoteElement(note) {
  const li = createElement("li");
  li.classList.add("list", "list-animation");

  const buttonContainer = createElement("div");
  buttonContainer.classList.add("button-container");

  const textContainer = createElement("div");
  textContainer.classList.add("text-container");

  const completeCheckbox = createElement("input");
  completeCheckbox.type = "checkbox";
  completeCheckbox.classList.add("complete-checkbox");
  completeCheckbox.checked = note.completed;

  const span = createElement("span");
  span.classList.add("text-span");
  span.textContent = note.text;

  if (note.completed) {
    span.classList.add("completed");
  }

  function createButton(text, ...classNames) {
    const button = createElement("button");
    button.textContent = text;
    button.classList.add(...classNames);

    return button;
  }

  const editBtn = createButton("✏️", "button-action", "action-hover", "ml-8");
  const deleteBtn = createButton("❌", "button-action", "action-hover");

  li.appendChild(textContainer);
  li.appendChild(buttonContainer);
  textContainer.appendChild(completeCheckbox);
  textContainer.appendChild(span);
  buttonContainer.appendChild(editBtn);
  buttonContainer.appendChild(deleteBtn);

  setTimeout(() => {
    li.classList.add("active");
  }, 10);

  //  Edit note
  editBtn.addEventListener("click", () => {
    const editInput = document.createElement("input");
    editInput.classList.add("text-input");
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

      notes = notes.map((item) => {
        if (item.id === note.id) {
          return {
            ...item,
            text: newText,
          };
        }
        return item;
      });

      saveNotes();
      editBtn.textContent = "✏️";
      editBtn.removeEventListener("click", saveEdit);
    }
  });

  completeCheckbox.addEventListener("click", () => {
    notes = notes.map((item) => {
      if (item.id === note.id) {
        return {
          ...item,
          completed: completeCheckbox.checked,
        };
      }
      return item;
    });

    span.classList.toggle("completed", completeCheckbox.checked);
    saveNotes();
  });

  // Delete note
  deleteBtn.addEventListener("click", () => {
    li.remove();

    notes = notes.filter((item) => item.id !== note.id);

    saveNotes();
  });

  return li;
}

notes.forEach((note) => {
  const li = createNoteElement(note);
  noteList.appendChild(li);
});

function addNote(e) {
  e.preventDefault();
  const noteText = noteInput.value.trim();
  const newNote = { id: Date.now(), text: noteText, completed: false };
  if (!noteText) return;

  const li = createNoteElement(newNote);
  noteList.appendChild(li);

  notes.push(newNote);
  saveNotes();
  noteInput.value = "";
}

noteBtn.addEventListener("click", addNote);

noteInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    addNote(e);
  }
});
