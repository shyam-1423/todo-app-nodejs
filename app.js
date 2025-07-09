const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();
const port = 2025;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set('view engine', 'ejs');

const TASKS_FILE = './tasks.json';

// JSON read/write functions
function loadTasks() {
    try {
        return JSON.parse(fs.readFileSync(TASKS_FILE, 'utf8'));
    } catch {
        return [];
    }
}

function saveTasks(tasks) {
    fs.writeFileSync(TASKS_FILE, JSON.stringify(tasks, null, 2));
}

app.get('/', (req, res) => {
    let tasks = loadTasks();

    const sortBy = req.query.sort || 'created';
    const filterTarget = req.query.target || 'all';

    // Sort tasks
    tasks.sort((a, b) => {
        if (sortBy === 'due') {
            return new Date(a.dueDate) - new Date(b.dueDate);
        } else {
            return new Date(a.createdAt) - new Date(b.createdAt);
        }
    });

    // Filter tasks
    const filteredTasks = filterTarget === 'all'
        ? tasks
        : tasks.filter(t => t.target.toLowerCase() === filterTarget.toLowerCase());

    const pending = filteredTasks.filter(t => !t.completed);
    const completed = filteredTasks.filter(t => t.completed);

    // Calculate stats
    const today = new Date().toISOString().split('T')[0];
    const overdueCount = pending.filter(t => t.dueDate < today).length;
    const dueTodayCount = pending.filter(t => t.dueDate === today).length;

    res.render('index', {
        pending,
        completed,
        sortBy,
        filterTarget,
        overdueCount,
        dueTodayCount
    });
});

app.post('/add', (req, res) => {
    const { text, target, dueDate } = req.body;

    // Validate input
    if (!text || !target || !dueDate) {
        return res.redirect('/?error=missing_fields');
    }

    const tasks = loadTasks();
    tasks.push({
        text: text.trim(),
        target: target.trim(),
        dueDate,
        completed: false,
        createdAt: new Date().toISOString().split('T')[0]
    });
    saveTasks(tasks);
    res.redirect('/');
});

app.post('/delete/:index', (req, res) => {
    const tasks = loadTasks();
    const index = parseInt(req.params.index);

    if (index >= 0 && index < tasks.length) {
        tasks.splice(index, 1);
        saveTasks(tasks);
    }
    res.redirect('/');
});

app.post('/toggle/:index', (req, res) => {
    const tasks = loadTasks();
    const index = parseInt(req.params.index);

    if (index >= 0 && index < tasks.length) {
        tasks[index].completed = !tasks[index].completed;
        saveTasks(tasks);
    }
    res.redirect('/');
});

app.get('/edit/:index', (req, res) => {
    const tasks = loadTasks();
    const index = parseInt(req.params.index);

    if (index >= 0 && index < tasks.length) {
        res.render('edit', {
            index: req.params.index,
            task: tasks[index]
        });
    } else {
        res.redirect('/');
    }
});

app.post('/edit/:index', (req, res) => {
    const tasks = loadTasks();
    const { text, target, dueDate } = req.body;
    const index = parseInt(req.params.index);

    // Validate input
    if (!text || !target || !dueDate) {
        return res.redirect(`/edit/${index}?error=missing_fields`);
    }

    if (index >= 0 && index < tasks.length) {
        tasks[index] = {
            ...tasks[index],
            text: text.trim(),
            target: target.trim(),
            dueDate
        };
        saveTasks(tasks);
    }
    res.redirect('/');
});

// Error handling middleware
app.use((req, res) => {
    res.status(404).send(`
        <div style="text-align: center; padding: 50px; font-family: Arial, sans-serif;">
            <h1>404 - Page Not Found</h1>
            <p>The page you're looking for doesn't exist.</p>
            <a href="/" style="color: #667eea; text-decoration: none;">← Back to Tasks</a>
        </div>
    `);
});

app.listen(port, () => {
    console.log(`✅ TaskFlow app running at http://localhost:${port}`);
    console.log(`📁 Tasks will be saved to: ${TASKS_FILE}`);
});