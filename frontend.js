const API_URL = "http://localhost:3000/api/tasks";

const form = document.getElementById("taskForm");

const taskId = document.getElementById("taskId");
const title = document.getElementById("title");
const description = document.getElementById("description");
const status = document.getElementById("status");
const priority = document.getElementById("priority");
const dueDate = document.getElementById("dueDate");

const filterStatus = document.getElementById("filterStatus");
const filterPriority = document.getElementById("filterPriority");

const tasksContainer = document.getElementById("tasks");
const message = document.getElementById("message");

const cancelBtn = document.getElementById("cancelBtn");


// =========================
// FELADATOK BETÖLTÉSE
// =========================

async function loadTasks() {

    try {

        const params = new URLSearchParams();

        if (filterStatus.value) {
            params.append(
                "status",
                filterStatus.value
            );
        }

        if (filterPriority.value) {
            params.append(
                "priority",
                filterPriority.value
            );
        }

        const url = params.toString()
            ? `${API_URL}?${params}`
            : API_URL;

        const response = await fetch(url);

        const tasks = await response.json();

        if (!response.ok) {
            throw new Error(
                tasks.error || "Hiba történt."
            );
        }

        renderTasks(tasks);

    } catch (error) {

        showMessage(error.message);

    }
}


// =========================
// FELADATOK MEGJELENÍTÉSE
// =========================

function renderTasks(tasks) {

    tasksContainer.innerHTML = "";

    if (tasks.length === 0) {

        tasksContainer.innerHTML =
            "<p>Nincs feladat.</p>";

        return;
    }


    tasks.forEach(task => {

        const article =
            document.createElement("article");

        article.className = "task";


        article.innerHTML = `

            <h3>
                ${escapeHtml(task.title)}
            </h3>

            <p>
                ${escapeHtml(
                    task.description || ""
                )}
            </p>

            <p>
                <strong>Státusz:</strong>
                ${statusText(task.status)}
            </p>

            <p>
                <strong>Prioritás:</strong>
                ${priorityText(task.priority)}
            </p>

            <p>
                <strong>Határidő:</strong>
                ${task.due_date || "Nincs megadva"}
            </p>

            <p>
                <strong>Létrehozva:</strong>
                ${task.created_at || ""}
            </p>

            <div class="actions">

                <button
                    onclick="editTask(${task.id})"
                >
                    Szerkesztés
                </button>

                <button
                    onclick="deleteTask(${task.id})"
                >
                    Törlés
                </button>

            </div>

        `;

        tasksContainer.appendChild(article);

    });
}


// =========================
// FELADAT LÉTREHOZÁSA / MÓDOSÍTÁSA
// =========================

async function saveTask(event) {

    event.preventDefault();


    const id = taskId.value;


    const task = {

        title: title.value,

        description: description.value,

        status: status.value,

        priority: priority.value,

        due_date: dueDate.value || null

    };


    const method = id
        ? "PUT"
        : "POST";


    const url = id
        ? `${API_URL}/${id}`
        : API_URL;


    try {

        const response = await fetch(url, {

            method: method,

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(task)

        });


        const data = await response.json();


        if (!response.ok) {

            throw new Error(
                data.error || "Mentési hiba."
            );

        }


        showMessage(
            id
                ? "Feladat módosítva."
                : "Feladat létrehozva."
        );


        resetForm();

        loadTasks();


    } catch (error) {

        showMessage(error.message);

    }
}


// =========================
// SZERKESZTÉS
// =========================

async function editTask(id) {

    try {

        const response =
            await fetch(`${API_URL}/${id}`);


        const task =
            await response.json();


        if (!response.ok) {

            throw new Error(
                task.error
            );

        }


        taskId.value =
            task.id;

        title.value =
            task.title;

        description.value =
            task.description || "";

        status.value =
            task.status;

        priority.value =
            task.priority;

        dueDate.value =
            task.due_date || "";


        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });


    } catch (error) {

        showMessage(
            error.message
        );

    }
}


// =========================
// TÖRLÉS
// =========================

async function deleteTask(id) {

    const confirmed =
        confirm(
            "Biztosan törlöd ezt a feladatot?"
        );


    if (!confirmed) {
        return;
    }


    try {

        const response =
            await fetch(
                `${API_URL}/${id}`,
                {
                    method: "DELETE"
                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.error ||
                "Törlési hiba."
            );

        }


        showMessage(
            "Feladat törölve."
        );


        loadTasks();


    } catch (error) {

        showMessage(
            error.message
        );

    }
}


// =========================
// ŰRLAP RESET
// =========================

function resetForm() {

    form.reset();

    taskId.value = "";

    status.value = "TODO";

    priority.value = "MEDIUM";

}


// =========================
// STÁTUSZ SZÖVEG
// =========================

function statusText(status) {

    const statuses = {

        TODO: "Teendő",

        IN_PROGRESS:
            "Folyamatban",

        DONE:
            "Kész"

    };


    return statuses[status]
        || status;
}


// =========================
// PRIORITÁS SZÖVEG
// =========================

function priorityText(priority) {

    const priorities = {

        LOW: "Alacsony",

        MEDIUM: "Közepes",

        HIGH: "Magas"

    };


    return priorities[priority]
        || priority;
}


// =========================
// HTML BIZTONSÁG
// =========================

function escapeHtml(value) {

    return String(value)

        .replaceAll(
            "&",
            "&amp;"
        )

        .replaceAll(
            "<",
            "&lt;"
        )

        .replaceAll(
            ">",
            "&gt;"
        )

        .replaceAll(
            '"',
            "&quot;"
        )

        .replaceAll(
            "'",
            "&#039;"
        );

}


// =========================
// ÜZENET
// =========================

function showMessage(text) {

    message.textContent =
        text;

}


// =========================
// ESEMÉNYEK
// =========================

form.addEventListener(
    "submit",
    saveTask
);


filterStatus.addEventListener(
    "change",
    loadTasks
);


filterPriority.addEventListener(
    "change",
    loadTasks
);


cancelBtn.addEventListener(
    "click",
    resetForm
);


// =========================
// INDULÁS
// =========================

loadTasks();