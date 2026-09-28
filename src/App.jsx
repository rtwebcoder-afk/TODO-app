import React, { useState, useEffect } from 'react';
import { 
  Plus, Check, Trash2, Edit2, Search, Filter, Moon, Sun, 
  Calendar, CheckCircle2, Clock, AlertCircle, Sparkles, Tag
} from 'lucide-react';

const CATEGORIES = [
  { id: 'work', name: 'Work', color: 'bg-blue-500/10 text-blue-500 border-blue-500/20' },
  { id: 'personal', name: 'Personal', color: 'bg-purple-500/10 text-purple-500 border-purple-500/20' },
  { id: 'shopping', name: 'Shopping', color: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' },
  { id: 'health', name: 'Health', color: 'bg-rose-500/10 text-rose-500 border-rose-500/20' },
  { id: 'other', name: 'Other', color: 'bg-amber-500/10 text-amber-500 border-amber-500/20' },
];

const PRIORITIES = [
  { id: 'low', name: 'Low', color: 'text-slate-500 bg-slate-500/10' },
  { id: 'medium', name: 'Medium', color: 'text-amber-500 bg-amber-500/10' },
  { id: 'high', name: 'High', color: 'text-rose-500 bg-rose-500/10' },
];

export default function App() {
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('react-todo-tasks');
    return saved ? JSON.parse(saved) : [];
  });

  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('react-todo-theme') === 'dark';
  });

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('work');
  const [priority, setPriority] = useState('medium');
  const [dueDate, setDueDate] = useState('');
  
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState('');

  useEffect(() => {
    localStorage.setItem('react-todo-tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('react-todo-theme', darkMode ? 'dark' : 'light');
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const handleAddTask = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newTask = {
      id: Date.now().toString(),
      title: title.trim(),
      category,
      priority,
      dueDate: dueDate || null,
      completed: false,
      createdAt: new Date().toISOString(),
    };

    setTasks([newTask, ...tasks]);
    setTitle('');
    setDueDate('');
  };

  const toggleTask = (id) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const startEdit = (task) => {
    setEditingId(task.id);
    setEditTitle(task.title);
  };

  const saveEdit = (id) => {
    if (!editTitle.trim()) return;
    setTasks(tasks.map(t => t.id === id ? { ...t, title: editTitle.trim() } : t));
    setEditingId(null);
  };

  const filteredTasks = tasks.filter(task => {
    const matchesStatus = 
      filterStatus === 'all' ? true :
      filterStatus === 'completed' ? task.completed : !task.completed;
    
    const matchesCategory = filterCategory === 'all' || task.category === filterCategory;
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesStatus && matchesCategory && matchesSearch;
  });

  const completedCount = tasks.filter(t => t.completed).length;
  const progressPercent = tasks.length ? Math.round((completedCount / tasks.length) * 100) : 0;

  return (
    <div className={`min-h-screen transition-colors duration-200 ${darkMode ? 'bg-slate-900 text-slate-100' : 'bg-slate-50 text-slate-800'}`}>
      <div className="max-w-4xl mx-auto px-4 py-8">
        
        {/* Header */}
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Sparkles className="w-8 h-8 text-indigo-500" /> Task Manager
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Organize your daily workflow efficiently</p>
          </div>
          <button 
            onClick={() => setDarkMode(!darkMode)}
            className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            {darkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-indigo-600" />}
          </button>
        </header>

        {/* Progress Bar */}
        <div className="mb-8 p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/50 shadow-sm">
          <div className="flex justify-between text-sm font-medium mb-2">
            <span>Progress Status</span>
            <span>{completedCount} of {tasks.length} Completed ({progressPercent}%)</span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-700 h-3 rounded-full overflow-hidden">
            <div 
              className="bg-indigo-600 h-full transition-all duration-300 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Add Task Form */}
        <form onSubmit={handleAddTask} className="mb-8 p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/50 shadow-sm flex flex-col md:flex-row gap-3">
          <input 
            type="text" 
            placeholder="Add a new task..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <div className="flex gap-2">
            <select 
              value={category} 
              onChange={(e) => setCategory(e.target.value)}
              className="px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {CATEGORIES.map(c => <option key={c.id} value={c.id} className="dark:bg-slate-800">{c.name}</option>)}
            </select>
            <select 
              value={priority} 
              onChange={(e) => setPriority(e.target.value)}
              className="px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {PRIORITIES.map(p => <option key={p.id} value={p.id} className="dark:bg-slate-800">{p.name}</option>)}
            </select>
            <button 
              type="submit"
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl flex items-center gap-2 transition"
            >
              <Plus className="w-5 h-5" /> Add
            </button>
          </div>
        </form>

        {/* Filters and Search */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center mb-6">
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-3.5 text-slate-400" />
            <input 
              type="text"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="flex gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
            {['all', 'pending', 'completed'].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-4 py-1.5 rounded-xl text-sm font-medium capitalize transition ${
                  filterStatus === status 
                    ? 'bg-indigo-600 text-white' 
                    : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Task List */}
        <div className="space-y-3">
          {filteredTasks.length === 0 ? (
            <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700/50">
              <CheckCircle2 className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-600 mb-3" />
              <p className="text-slate-500 dark:text-slate-400 font-medium">No tasks found</p>
            </div>
          ) : (
            filteredTasks.map((task) => (
              <div 
                key={task.id}
                className={`p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/50 shadow-sm flex items-center justify-between gap-4 transition ${
                  task.completed ? 'opacity-60' : ''
                }`}
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <button 
                    onClick={() => toggleTask(task.id)}
                    className={`w-6 h-6 rounded-lg border flex items-center justify-center transition ${
                      task.completed 
                        ? 'bg-indigo-600 border-indigo-600 text-white' 
                        : 'border-slate-300 dark:border-slate-600 hover:border-indigo-500'
                    }`}
                  >
                    {task.completed && <Check className="w-4 h-4" />}
                  </button>

                  {editingId === task.id ? (
                    <input 
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      onBlur={() => saveEdit(task.id)}
                      onKeyDown={(e) => e.key === 'Enter' && saveEdit(task.id)}
                      autoFocus
                      className="flex-1 px-2 py-1 rounded border border-indigo-500 bg-transparent text-sm focus:outline-none"
                    />
                  ) : (
                    <span className={`text-sm truncate font-medium ${task.completed ? 'line-through text-slate-400' : ''}`}>
                      {task.title}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2.5 py-1 rounded-lg border font-medium ${CATEGORIES.find(c => c.id === task.category)?.color}`}>
                    {CATEGORIES.find(c => c.id === task.category)?.name}
                  </span>
                  <button 
                    onClick={() => startEdit(task)}
                    className="p-1.5 text-slate-400 hover:text-indigo-500 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => deleteTask(task.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}