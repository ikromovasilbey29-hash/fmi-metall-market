"use client";

import { useState } from "react";
import { CheckSquare, Plus, Trash2, X, Save, Loader2, Circle, Clock, CheckCircle2 } from "lucide-react";
import { useHRStore } from "@/store/hrStore";
import toast from "react-hot-toast";
import { useT } from "@/hooks/useT";

function getPriorityConfig(t: ReturnType<typeof useT>) {
  return {
    low: { label: t.adminHr.priorityLow, color: "text-blue-400", bg: "bg-blue-400/10 border-blue-400/20" },
    medium: { label: t.adminHr.priorityMedium, color: "text-yellow-400", bg: "bg-yellow-400/10 border-yellow-400/20" },
    high: { label: t.adminHr.priorityHigh, color: "text-red-400", bg: "bg-red-400/10 border-red-400/20" },
  } as const;
}

function getStatusConfig(t: ReturnType<typeof useT>) {
  return {
    todo: { label: t.adminHr.taskStatusTodo, icon: Circle, color: "text-text-muted" },
    inprogress: { label: t.adminHr.taskStatusInProgress, icon: Clock, color: "text-yellow-400" },
    done: { label: t.adminHr.taskStatusDone, icon: CheckCircle2, color: "text-green-400" },
  } as const;
}

type Task = ReturnType<typeof useHRStore.getState>["tasks"][0];

export default function HRTasksPage() {
  const t = useT();
  const priorityConfig = getPriorityConfig(t);
  const statusConfig = getStatusConfig(t);
  const { employees, tasks, addTask, updateTaskStatus, deleteTask } = useHRStore();
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [filter, setFilter] = useState<"all" | "todo" | "inprogress" | "done">("all");
  const [form, setForm] = useState({
    title: "", description: "", assignedTo: "",
    priority: "medium" as "low" | "medium" | "high",
    dueDate: "", status: "todo" as "todo" | "inprogress" | "done",
  });

  const activeEmps = employees.filter(e => e.status === "active");
  const filtered = tasks.filter(t => filter === "all" ? true : t.status === filter);

  const getEmployee = (id: string) => employees.find(e => e.id === id);

  const openAdd = () => {
    setForm({ title: "", description: "", assignedTo: activeEmps[0]?.id || "", priority: "medium", dueDate: "", status: "todo" });
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await new Promise(r => setTimeout(r, 400));
    addTask(form);
    setSaving(false);
    setShowModal(false);
    toast.success(t.adminHr.toastTaskAdded);
  };

  const handleStatusChange = (id: string, status: Task["status"]) => {
    updateTaskStatus(id, status);
    toast.success(statusConfig[status].label);
  };

  const handleDelete = (id: string) => {
    if (!confirm(t.adminHr.confirmDeleteTask)) return;
    deleteTask(id);
    toast.success(t.adminHr.toastTaskDeleted);
  };

  const stats = {
    todo: tasks.filter(t => t.status === "todo").length,
    inprogress: tasks.filter(t => t.status === "inprogress").length,
    done: tasks.filter(t => t.status === "done").length,
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black text-text-primary flex items-center gap-3">
            <CheckSquare size={28} className="text-purple-400" /> {t.adminHr.tasksTitle}
          </h1>
          <p className="text-text-muted text-sm mt-1">{tasks.length} {t.adminHr.tasksCount}</p>
        </div>
        <button onClick={openAdd} className="btn-primary flex items-center gap-2 text-sm">
          <Plus size={18} /> {t.adminHr.addTaskBtn}
        </button>
      </div>

      {/* Statistika */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {(Object.entries(statusConfig) as [string, typeof statusConfig[keyof typeof statusConfig]][]).map(([key, cfg]) => {
          const Icon = cfg.icon;
          return (
            <div key={key} className="card p-4 flex items-center gap-3">
              <Icon size={24} className={cfg.color} />
              <div>
                <p className={`text-xl font-black ${cfg.color}`}>{stats[key as keyof typeof stats]}</p>
                <p className="text-text-muted text-xs">{cfg.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Filter */}
      <div className="flex gap-2 mb-5">
        {[{ v: "all", l: t.adminHr.filterAll }, { v: "todo", l: t.adminHr.taskStatusTodo }, { v: "inprogress", l: t.adminHr.taskStatusInProgress }, { v: "done", l: t.adminHr.taskStatusDone }].map(f => (
          <button key={f.v} onClick={() => setFilter(f.v as typeof filter)}
            className={`px-3 py-1.5 rounded-lg text-sm transition-all ${filter === f.v ? "bg-accent-gold text-bg-primary font-medium" : "bg-bg-card border border-border text-text-secondary hover:text-text-primary"}`}>
            {f.l}
          </button>
        ))}
      </div>

      {/* Vazifalar */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="card p-12 text-center">
            <CheckSquare size={40} className="text-text-muted opacity-30 mx-auto mb-3" />
            <p className="text-text-secondary">{t.adminHr.noTasks}</p>
          </div>
        ) : filtered.map(task => {
          const emp = getEmployee(task.assignedTo);
          const pCfg = priorityConfig[task.priority];
          const sCfg = statusConfig[task.status];
          const StatusIcon = sCfg.icon;
          const isOverdue = task.status !== "done" && task.dueDate && new Date(task.dueDate) < new Date();
          return (
            <div key={task.id} className={`card p-4 hover:border-accent-gold/20 transition-all ${task.status === "done" ? "opacity-70" : ""}`}>
              <div className="flex items-start gap-4">
                <StatusIcon size={20} className={`${sCfg.color} flex-shrink-0 mt-0.5`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className={`font-semibold text-sm ${task.status === "done" ? "line-through text-text-muted" : "text-text-primary"}`}>
                        {task.title}
                      </p>
                      {task.description && <p className="text-text-muted text-xs mt-0.5">{task.description}</p>}
                    </div>
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <span className={`text-xs px-2 py-0.5 rounded-full border ${pCfg.bg} ${pCfg.color}`}>{pCfg.label}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 mt-3">
                    {emp && (
                      <div className="flex items-center gap-1.5">
                        <div className="w-5 h-5 bg-purple-400/20 rounded-full flex items-center justify-center">
                          <span className="text-purple-400 text-xs font-bold">{emp.name[0]}</span>
                        </div>
                        <span className="text-text-muted text-xs">{emp.name}</span>
                      </div>
                    )}
                    {task.dueDate && (
                      <span className={`text-xs ${isOverdue ? "text-red-400" : "text-text-muted"}`}>
                        {isOverdue ? "⚠ " : ""}{t.adminHr.dueDatePrefix} {new Date(task.dueDate).toLocaleDateString("uz-UZ", { day: "numeric", month: "short" })}
                      </span>
                    )}
                    {/* Status o'zgartirish */}
                    <div className="flex gap-1 ml-auto">
                      {(["todo", "inprogress", "done"] as Task["status"][]).map(s => (
                        <button key={s} onClick={() => handleStatusChange(task.id, s)}
                          className={`text-xs px-2 py-0.5 rounded-md border transition-all ${task.status === s ? `${statusConfig[s].color} bg-opacity-20 border-opacity-40` : "border-border text-text-muted hover:border-border-light"}`}>
                          {statusConfig[s].label}
                        </button>
                      ))}
                      <button onClick={() => handleDelete(task.id)} className="p-1 rounded-md hover:bg-red-500/10 text-text-muted hover:text-red-400 transition-all ml-1">
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="relative bg-bg-card border border-border rounded-2xl w-full max-w-md shadow-card animate-slide-up">
            <div className="flex items-center justify-between p-5 border-b border-border">
              <h3 className="font-bold text-text-primary flex items-center gap-2"><CheckSquare size={18} className="text-purple-400" /> {t.adminHr.newTaskModalTitle}</h3>
              <button onClick={() => setShowModal(false)} className="p-1.5 rounded-lg hover:bg-bg-panel text-text-muted"><X size={18} /></button>
            </div>
            <form onSubmit={handleSave} className="p-5 space-y-3">
              <div>
                <label className="text-text-secondary text-sm mb-1.5 block">{t.adminHr.taskNameLabel} *</label>
                <input className="input-field" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required placeholder={t.adminHr.taskNamePlaceholder} autoFocus />
              </div>
              <div>
                <label className="text-text-secondary text-sm mb-1.5 block">{t.adminHr.descriptionLabel}</label>
                <textarea className="input-field resize-none" rows={2} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder={t.adminHr.descriptionPlaceholder} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-text-secondary text-sm mb-1.5 block">{t.adminHr.employeeLabel}</label>
                  <select className="input-field" value={form.assignedTo} onChange={e => setForm({ ...form, assignedTo: e.target.value })}>
                    {activeEmps.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-text-secondary text-sm mb-1.5 block">{t.adminHr.priorityLabel}</label>
                  <select className="input-field" value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value as typeof form.priority })}>
                    <option value="low">{t.adminHr.priorityLow}</option>
                    <option value="medium">{t.adminHr.priorityMedium}</option>
                    <option value="high">{t.adminHr.priorityHigh}</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-text-secondary text-sm mb-1.5 block">{t.adminHr.dueDateFieldLabel}</label>
                <input type="date" className="input-field" value={form.dueDate} onChange={e => setForm({ ...form, dueDate: e.target.value })} />
              </div>
              <div className="flex gap-3 pt-1">
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary flex-1">{t.adminHr.cancel}</button>
                <button type="submit" className="btn-primary flex-1 flex items-center justify-center gap-2" disabled={saving}>
                  {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                  {t.adminHr.add}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
