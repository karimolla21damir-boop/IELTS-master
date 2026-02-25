// ВСТАВЬ СВОЙ КЛЮЧ GEMINI НИЖЕ
const GEMINI_API_KEY = "AIzaSyCwoBHaBeAwrJ01gbqQUQTa58BgIj9vJoI";

// Реальные задания (структура Cambridge IELTS)
const db = {
    listening: [
        { 
            title: "Cambridge 18: Test 1", 
            desc: "Section 1: Notes completion about a transport survey.",
            pdf: "materials/listening/c18_test1.pdf",
            audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3", // Пример аудио
            level: "Easy"
        },
        { 
            title: "Map Labeling Practice", 
            desc: "Section 2: Layout of a local community center.",
            pdf: "materials/listening/map_task.pdf",
            audio: "#",
            level: "Medium"
        }
    ],
    reading: [
        { 
            title: "The History of Tea", 
            desc: "Academic Reading Passage 1: T/F/NG and Summary Completion.",
            pdf: "materials/reading/tea_history.pdf",
            level: "Medium"
        },
        { 
            title: "Climate Change Effects", 
            desc: "Academic Reading Passage 3: Matching Headings and MCQ.",
            pdf: "materials/reading/climate_task.pdf",
            level: "Hard"
        }
    ],
    writing: [
        { 
            title: "Task 1: Line Graph", 
            desc: "Describe changes in energy consumption (1980-2020).",
            pdf: "materials/writing/line_graph.pdf",
            level: "Medium"
        },
        { 
            title: "Task 2: Essay Question", 
            desc: "Topic: Should government fund arts or public services?",
            pdf: "materials/writing/essay_task.pdf",
            level: "Hard"
        }
    ],
    speaking: [
        { 
            title: "Part 1: Daily Routine", 
            desc: "Questions about your morning, study habits, and hobbies.",
            level: "Easy"
        },
        { 
            title: "Part 2: Cue Card", 
            desc: "Describe a book you read that was useful to you.",
            level: "Medium"
        }
    ]
};

// Функция отображения контента
function showModule(moduleName) {
    // Обновляем активную кнопку
    document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('active'));
    document.getElementById('btn-' + moduleName).classList.add('active');

    const area = document.getElementById('display-area');

    if (moduleName === 'home') {
        area.innerHTML = `
            <h1>Good Morning, Scholar!</h1>
            <p class="subtitle">Ready to boost your IELTS score? Select a section to start practicing.</p>
            <div class="card">
                <h3>Your Weekly Goal</h3>
                <p>Complete 2 Listening and 1 Writing task today to stay on track.</p>
            </div>
        `;
        return;
    }

    // Отрисовка заданий
    let tasksHtml = `<h1 style="text-transform: capitalize;">${moduleName} Practice</h1>
                     <p class="subtitle">Real Cambridge-style tasks for your preparation.</p>
                     <div class="task-grid">`;

    db[moduleName].forEach(task => {
        tasksHtml += `
            <div class="card task-card">
                <span class="badge ${task.level}">${task.level}</span>
                <h3 style="margin-bottom:10px">${task.title}</h3>
                <p style="font-size:14px; color:#64748b; margin-bottom:15px">${task.desc}</p>
                ${task.audio && task.audio !== '#' ? `<audio controls src="${task.audio}" style="width:100%; margin-bottom:15px"></audio>` : ''}
                <a href="${task.pdf || '#'}" target="_blank" class="btn-main">Open Task PDF</a>
            </div>
        `;
    });

    tasksHtml += `</div>`;
    area.innerHTML = tasksHtml;
}

// Управление чатом
function toggleChat() {
    document.getElementById('chat-window').classList.toggle('show');
}

async function sendMsg() {
    const input = document.getElementById('chat-input');
    const body = document.getElementById('chat-body');
    const btn = document.getElementById('send-btn');
    const text = input.value.trim();

    if (!text) return;

    body.innerHTML += `<div class="msg user">${text}</div>`;
    input.value = '';
    body.scrollTop = body.scrollHeight;

    const loadId = "ai-" + Date.now();
    body.innerHTML += `<div class="msg ai" id="${loadId}">Analyzing...</div>`;
    btn.disabled = true;

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: "You are a professional IELTS tutor. Provide helpful, academic feedback or answers. Question: " + text }] }]
            })
        });
        const data = await response.json();
        const reply = data.candidates[0].content.parts[0].text;
        document.getElementById(loadId).innerText = reply;
    } catch (e) {
        document.getElementById(loadId).innerText = "Error: Check your API key.";
    } finally {
        btn.disabled = false;
        body.scrollTop = body.scrollHeight;
    }
}

// Запуск при загрузке
window.onload = () => showModule('home');

// Enter для отправки
document.getElementById('chat-input')?.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMsg();
});
