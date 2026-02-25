// База данных материалов (статические файлы, которые уже есть на GitHub)
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
