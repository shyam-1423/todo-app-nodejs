# 📝 To-Do List App (Node.js + Express + EJS)

A simple and feature-rich to-do list app built using Node.js, Express.js, and EJS templating.  
Supports full CRUD operations, date tracking, filtering, and countdowns — all stored in a local JSON file.


## 🚀 Features

- ✅ Add, edit, delete, and toggle tasks (CRUD)
- 📅 Set due dates and see a countdown (e.g., "2 days left")
- 🧾 Automatically stores task creation date
- 🔍 Filter by target (Work, Study, Personal, etc.)
- 🔁 Sort by creation date or due date
- ✅ Separate completed and pending task sections
- 🔔 In-app notifications for:
  - Overdue tasks
  - Tasks due today
- 💾 Data stored persistently in a `tasks.json` file (no database needed)

---

## 📂 Project Structure

todo-app/
├── views/
│ ├── index.ejs # Main task list UI
│ └── edit.ejs # Edit form
├── public/
│ └── styles.css # Basic dark UI styling
├── tasks.json # Stores task data
├── app.js # Main Express server
├── package.json # Dependencies and metadata



---

## 🛠️ Getting Started

1. Clone the Repo
git clone https://github.com/shyam-1423/todo-crud-ejs.git
cd todo-crud-ejs


2. Install Dependencies
npm install

3. Run the App
node app.js

4. Visit in Browser
http://localhost:2025

Made with 💚 by Shyam Dabhi

