const GEMINI_API_KEY = "AIzaSyCwoBHaBeAwrJ01gbqQUQTa58BgIj9vJoI";
const db = {
    listening: [
        { 
            name: "IELTS Listening Practice Test 1", 
            url: "materials/listening/test1.pdf", // Путь к файлу в твоем репозитории
            type: "pdf", 
            date: "Pre-installed" 
        },
        { 
            name: "Video Lesson: Listening Strategies", 
            url: "materials/listening/lesson1.mp4", 
            type: "video", 
            date: "Pre-installed" 
        }
    ],
    reading: [
        { 
            name: "Academic Reading Task: Ecology", 
            url: "materials/reading/ecology_task.pdf", 
            type: "pdf", 
            date: "Pre-installed" 
        }
    ],
    writing: [],
    speaking: []
};
function showModule(moduleName) {
    // Обновляем активную кнопку в меню
    document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('active'));
    document.getElementById('btn-' + moduleName).classList.add('active');

    const display = document.getElementById('display-area');

    if (moduleName === 'home') {
        display.innerHTML = `
            <h1>Student Dashboard</h1>
            <p>Select a module from the sidebar to start uploading and practicing.</p>
            <div class="card" style="margin-top:20px">
                <h3>Welcome back!</h3>
                <p>Track your progress and access your saved materials here.</p>
            </div>
        `;
        return;
    }

    // Интерфейс конкретного модуля
    display.innerHTML = `
        <h1 style="text-transform: capitalize;">${moduleName} Module</h1>
        <p class="subtitle">Manage your PDF tasks and Video lessons for ${moduleName}.</p>

        <div class="upload-grid">
            <div class="upload-box">
                <h4>📄 Upload PDF Task</h4>
                <input type="file" id="pdf-input" accept=".pdf" style="display:none" onchange="uploadFile('${moduleName}', 'pdf')">
                <button class="btn-upload" onclick="document.getElementById('pdf-input').click()">Choose PDF</button>
            </div>
            <div class="upload-box">
                <h4>🎥 Upload Video Lesson</h4>
                <input type="file" id="video-input" accept=".mp4,.mkv" style="display:none" onchange="uploadFile('${moduleName}', 'video')">
                <button class="btn-upload" onclick="document.getElementById('video-input').click()">Choose Video</button>
            </div>
        </div>

        <h3>My Materials</h3>
        <div id="library-${moduleName}" class="library-grid">
            </div>
    `;

    renderLibrary(moduleName);
}

// 2. Функция "загрузки" файла
function uploadFile(module, type) {
    const inputId = type === 'pdf' ? 'pdf-input' : 'video-input';
    const file = document.getElementById(inputId).files[0];

    if (file) {
        const fileData = {
            name: file.name,
            url: URL.createObjectURL(file),
            type: type,
            date: new Date().toLocaleDateString()
        };
        db[module].push(fileData);
        renderLibrary(module);
    }
}

// 3. Отображение списка файлов
function renderLibrary(module) {
    const container = document.getElementById(`library-${module}`);
    if (!container) return;

    container.innerHTML = db[module].length === 0 ? '<p>No materials uploaded yet.</p>' : '';

    db[module].forEach(file => {
        container.innerHTML += `
            <div class="item-card">
                <span class="type-tag tag-${file.type}">${file.type}</span>
                <div style="font-weight:600; margin-bottom:10px; font-size:14px">${file.name}</div>
                <div style="font-size:11px; color:gray; margin-bottom:15px">Added: ${file.date}</div>
                <a href="${file.url}" target="_blank" class="btn-upload" style="text-decoration:none; display:inline-block; font-size:12px">View Material</a>
            </div>
        `;
    });
}

// Инициализация при загрузке
window.onload = () => showModule('home');

// Логика чата (Gemini)
function toggleChat() { document.getElementById('chat-window').classList.toggle('show'); }

async function sendMsg() {
    const input = document.getElementById('chat-input');
    const body = document.getElementById('chat-body');
    const text = input.value.trim();
    if (!text) return;

    body.innerHTML += `<div class="msg user">${text}</div>`;
    input.value = '';
    body.scrollTop = body.scrollHeight;

    const loadId = "load-" + Date.now();
    body.innerHTML += `<div class="msg ai" id="${loadId}">Thinking...</div>`;

    try {
        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: [{ parts: [{ text: "IELTS Expert mode: " + text }] }] })
        });
        const data = await res.json();
        document.getElementById(loadId).innerText = data.candidates[0].content.parts[0].text;
    } catch (e) {
        document.getElementById(loadId).innerText = "API Error. Check your key.";
    }
    body.scrollTop = body.scrollHeight;
}
