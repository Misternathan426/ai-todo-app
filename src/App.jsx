import { useEffect, useMemo, useState } from "react";
import ThemeSwitch from "./src/components/ThemeSwitch";

function useLocalStorage(key, initial) {
  const [state, setState] = useState(() => {
    const saved = localStorage.getItem(key);
    if (saved !=null) return JSON.parse(saved);

    if (key === "theme.v1") {
      const prefersDark = window.matchMedia?.("(prefers-color-scheme: dark)").matches;
      return prefersDark ? "dark" : "light";
    }
    return initial;
  });
  useEffect(() => localStorage.setItem(key, JSON.stringify(state)), [key, state]);
  return [state, setState];
}

export default function App() {
  const qoutes = [
    "Great job! Keep up the good work!",
    "You're making awesome progress!",
    "Way to go! You're on fire!",
    "Fantastic effort! Keep it going!",
    "You're a productivity superstar!",
    "Impressive work! Keep it up!",
    "You're crushing your tasks!",
    "Amazing dedication! Keep pushing!",
    "You're unstoppable! Keep it up!",
    "Outstanding job! You're doing great!"
  ];

  const [motivation, setMotivation] = useState(null);
  const [theme, setTheme] = useLocalStorage("theme.v1", "dark");
  useEffect(() => {
    document.documentElement.classList.toggle("light", theme === "light");
  }, [theme]);

  const [todos, setTodos] = useLocalStorage("todos.v1", []);
  const [text, setText] = useState("");

  const stats = useMemo(() => {
    const total = todos.length;
    const done = todos.filter(t => t.done).length;
    return { total, done, left: total - done };
  }, [todos]);

  function addTodo() {
    const trimmed = text.trim();
    if (!trimmed) return;
    setTodos(prev => [{ id: crypto.randomUUID(), text: trimmed, done: false, category, dueDate, createdAt: new Date().toISOString() }, ...prev]);
    setText("");
    setCategory("General");
    setDueDate("")
  }

  const [sortBy, setSortBy] = useState("newest");

  const sortedTodos = [...todos].sort((a, b) => {
    if (sortBy === "newest") {
      return new Date(b.createdAt) - new Date(a.createdAt)
    }
    if (sortBy === "oldest") {
      return new Date(a.createdAt) - new Date(b.createdAt);
    }
    if (sortBy === "deadline") {
      if (!a.dueDate && !b.dueDate) return 0;
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return new Date(a.dueDate) - new Date(b.dueDate)
    }
    return 0;
  });

  function formatDate(dateStr) {
    if (!dateStr) return "";
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateStr).toLocaleDateString(undefined, options)
  }

  function getDateStatus(dateStr) {
    if (!dateStr) return "none";
    const today = new Date().toISOString().split("T")[0];
    if (dateStr < today) return "overdue";
    if (dateStr === today) return "today";
    return "upcoming";
  }

  const [dueDate, setDueDate] = useState("");

  function isOverdue(date) {
    const today = new Date().toISOString().split("T")[0];
    return date < today;
  }

  const [category, setCategory] = useState("General");
  const [editCategory, setEditCategory] = useState("General");

  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");

  const toggleTodo = id => setTodos(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t));
  const removeTodo = id => setTodos(prev => prev.filter(t => t.id !== id));
  const clearDone = () => setTodos(prev => prev.filter(t => !t.done));

  const saveEdit = (id) => {
    setTodos(prev => prev.map(t => t.id === id ? { ...t, text: editText, category: editCategory } : t ));
    setEditingId(null);
    setEditText("");
    setEditCategory("General");
  };

  const [history, setHistory] = useState([]);

  return (
    <div className="container">
      <div className="card">
        <div className="header">
          <div className="title">My To-Do App</div>
          <ThemeSwitch theme={theme} onToggle={() => setTheme(theme === "dark" ? "light" : "dark")} />
        </div>

        <div className="row">
          <input
            className="input"
            placeholder="Add a task and press Enter…"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addTodo()}
          />

          <select className="input" value={category}
          onChange={(e) => setCategory(e.target.value)}>
            <option value="General">General</option>
            <option value="Work">Work</option>
            <option value="Personal">Personal</option>
            <option value="School">School</option>
          </select>

          <input type="date" className="input" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
          <button className="btn" onClick={addTodo}>Add</button>
        </div>

        <div className="sort-bar">
          <span className="sort-label">Sort by:</span>
          <select className="input" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="deadline">Deadline</option>
          </select>
        </div>

        <ul className="list">
          {sortedTodos.map(t => (
            <li key={t.id} className="item">
              {editingId === t.id ? (
                <div className="edit-container">
                  <input className="edit-input" value={editText} onChange={(e) => setEditText(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && saveEdit(t.id)} autoFocus />
                  <select className="edit-select" value={editCategory} onChange={(e) => setEditCategory(e.target.value)}>
                    <option value="General">General</option>
                    <option value="Work">Work</option>
                    <option value="Personal">Personal</option>
                    <option value="School">School</option>
                  </select>
                </div>
              ) : (
                  <div className="view-container">
                    <input className="checkbox" type="checkbox" checked={t.done} onChange={() => toggleTodo(t.id)} />
                    <span className={`text ${t.done ? "done" : ""}`}>{t.text}</span>
                    <small className="small" style={{ color: "#666", fontSize: "12px" }}>{t.category}</small>
                    {t.dueDate && (
                      <small className={`due-date ${getDateStatus(t.dueDate)}`}>Due: {formatDate(t.dueDate)}</small>
                    )}
                  </div>
              )}
              
              <div className="actions">
                {editingId === t.id ? (
                  <div className="row">
                    <button className="btn save small" onClick={() => saveEdit(t.id)}>Save</button>
                    <button className="btn cancel small" onClick={() => {
                      setEditingId(null);
                      setEditText("");
                    }}>Cancel</button>
                  </div>
                ) : (
                  <div className="row">
                  <button className="btn secondary small" onClick={() => {
                    setEditingId(t.id);
                    setEditText(t.text);
                  }}>Edit</button>
                  <button className="delete" onClick={() => removeTodo(t.id)}>✕</button>
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>

        <div className="meta">
          <span> Total: <b>{stats.total}</b> • Done: <b>{stats.done}</b> • Left: <b>{stats.left}</b> </span>
          <div className="row">
            <button className="btn secondary small" onClick={clearDone}>Clear done</button>
          </div>
        </div>
      </div>
    </div>

  );
}
