const getId = (id) => document.getElementById(id);
const noteInput = getId("noteInput");
const noteBtn = getId("noteBtn");
const noteList = getId("noteList");
const noteTitle = getId("noteTitle");

const darkModeBtn = getId("darkModeBtn");

const characterCounter = getId("characterCounter");

const totalNotesElement = getId("totalNotes");
const remainingNotesElement = getId("remainingNotes");
const completedNotesElement = getId("completedNotes");

const liveDate = getId("liveDate");
const liveTime = getId("liveTime");

const searchInput = getId("searchInput");

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

function createButton(text, ...classNames) {
  const button = createElement("button");
  button.textContent = text;
  button.classList.add(...classNames);

  return button;
}

function createNoteElement(note) {
  const li = createElement("li");
  li.classList.add("list", "list-animation");

  const listContainer = createElement("div");
  listContainer.classList.add("list-container");

  const textContainer = createElement("div");
  textContainer.classList.add("text-container");

  const completeCheckbox = createElement("input");
  completeCheckbox.type = "checkbox";
  completeCheckbox.classList.add("complete-checkbox");
  completeCheckbox.checked = note.completed;
  completeCheckbox.id = `complete-${note.id}`;
  completeCheckbox.name = `complete-${note.id}`;

  const span = createElement("span");
  span.classList.add("text-span");
  span.textContent = note.text;

  if (note.completed) {
    span.classList.add("completed");
  }

  const buttonContainer = createElement("div");
  buttonContainer.classList.add("button-container");

  const editBtn = createButton("✏️", "button-action", "action-hover", "ml-8");
  const deleteBtn = createButton("❌", "button-action", "action-hover");

  const dateContainer = createElement("div");
  dateContainer.classList.add("date-container");

  const date = new Date(note.createdAt);
  const formattedDate = date.toLocaleString("id-ID");

  const dateElement = createElement("p");
  dateElement.classList.add("date-element");
  dateElement.textContent = formattedDate;

  li.appendChild(listContainer);
  listContainer.appendChild(textContainer);
  textContainer.appendChild(completeCheckbox);
  textContainer.appendChild(span);
  listContainer.appendChild(buttonContainer);
  buttonContainer.appendChild(editBtn);
  buttonContainer.appendChild(deleteBtn);

  li.appendChild(dateContainer);
  dateContainer.appendChild(dateElement);

  setTimeout(() => {
    li.classList.add("active");
  }, 10);

  //  Edit note
  let editInput;
  editBtn.addEventListener("click", noteEdit);

  function noteEdit() {
    if (editBtn.textContent === "✏️") {
      editInput = createElement("input");
      editInput.classList.add("text-input");
      editInput.value = span.textContent;
      editInput.id = `edit-${note.id}`;
      editInput.name = `edit-${note.id}`;

      textContainer.replaceChild(editInput, span);
      editBtn.textContent = "💾";

      editInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          saveEdit(e);
        }
      });
    } else {
      saveEdit();
    }

    function saveEdit() {
      const newText = editInput.value.trim();
      if (!newText) return;
      span.textContent = newText;
      textContainer.replaceChild(span, editInput);

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
    }
  }

  completeCheckbox.addEventListener("change", () => {
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
    updateStats();
  });

  // Delete note
  deleteBtn.addEventListener("click", () => {
    li.remove();

    notes = notes.filter((item) => item.id !== note.id);

    saveNotes();
    updateStats();
    updateNoteTitle();
  });

  return li;
}

function updateLiveTime() {
  const now = new Date();
  liveDate.textContent = now.toLocaleString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  liveTime.textContent = now.toLocaleTimeString("id-ID");
}

function counterText() {
  const currentText = noteInput.value.length;
  characterCounter.textContent = `${currentText}/100`;
}

function updateStats() {
  const totalNotes = notes.length;
  const remainingNotes = notes.filter((note) => !note.completed).length;
  const completedNotes = notes.filter((note) => note.completed).length;

  totalNotesElement.textContent = `📝 Total: ${totalNotes}`;
  remainingNotesElement.textContent = `⏳ Remaining: ${remainingNotes}`;
  completedNotesElement.textContent = `✅ completed: ${completedNotes}`;
}

function renderNotes(notesArray) {
  noteList.innerHTML = "";

  notesArray.forEach((note) => {
    const li = createNoteElement(note);
    noteList.appendChild(li);
  });
}
renderNotes(notes);

updateLiveTime();
counterText();
setInterval(updateLiveTime, 1000);
updateStats();
updateNoteTitle();

searchInput.addEventListener("input", filteredNotes);

function filteredNotes() {
  const searchText = searchInput.value.trim();
  const filteredNotes = notes.filter((note) =>
    note.text.toLowerCase().includes(searchText.toLowerCase()),
  );
  renderNotes(filteredNotes);
}

function updateNoteTitle() {
  if (notes.length > 0) {
    noteTitle.textContent = "Catatan Saya";
  } else {
    noteTitle.textContent = "";
  }
}

function addNote(e) {
  e.preventDefault();
  const noteText = noteInput.value.trim();
  const newNote = {
    id: Date.now(),
    text: noteText,
    completed: false,
    createdAt: Date.now(),
  };
  if (!noteText) return;

  notes.push(newNote);
  filteredNotes();
  saveNotes();

  noteInput.value = "";
  counterText();
  updateStats();
  updateNoteTitle();
}

noteInput.addEventListener("input", counterText);

noteBtn.addEventListener("click", addNote);

noteInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    addNote(e);
  }
});
