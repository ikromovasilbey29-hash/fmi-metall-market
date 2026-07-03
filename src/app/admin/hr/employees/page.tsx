"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, X, Save, Loader2, Phone, User, Briefcase } from "lucide-react";
import { useHRStore } from "@/store/hrStore";
import { formatPrice, formatPhoneNumber } from "@/lib/utils";
import toast from "react-hot-toast";
import { useT } from "@/hooks/useT";

type Employee = ReturnType<typeof useHRStore.getState>["employees"][0];

export default function HREmployeesPage() {
  const t = useT();
  const departments = t.adminHr.departments;
  const positions = t.adminHr.positions;
  const { employees, addEmployee, updateEmployee, deleteEmployee } = useHRStore();
  const [showModal, setShowModal] = useState(false);
  const [editEmp, setEditEmp] = useState<Employee | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<{
    name: string; position: string; department: string;
    phone: string; salary: number; startDate: string; status: "active" | "inactive";
  }>({
    name: "", position: positions[0], department: departments[0],
    phone: "", salary: 0, startDate: "", status: "active",
  });

  const openAdd = () => {
    setEditEmp(null);
    setForm({ name: "", position: positions[0], department: departments[0], phone: "", salary: 0, startDate: new Date().toISOString().split("T")[0], status: "active" });
    setShowModal(true);
  };

  const openEdit = (e: Employee) => {
    setEditEmp(e);
    setForm({ name: e.name, position: e.position, department: e.department, phone: e.phone, salary: e.salary, startDate: e.startDate, status: e.status });
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    if (!confirm(t.adminHr.confirmDeleteEmployee)) return;
    deleteEmployee(id);
    toast.success(t.adminHr.toastEmployeeDeleted);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    setSaving(true);
    await new Promise((r) => setTimeout(r, 400));
    if (editEmp) { updateEmployee(editEmp.id, form); toast.success(t.adminHr.toastEmployeeUpdated); }
    else { addEmployee(form); toast.success(t.adminHr.toastEmployeeAdded); }
    setSaving(false);
    setShowModal(false);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black text-text-primary flex items-center gap-3">
            <User size={28} className="text-purple-400" /> {t.adminHr.employeesTitle}
          </h1>
          <p className="text-text-muted text-sm mt-1">{employees.length} {t.adminHr.employeesCount} · {employees.filter(e => e.status === "active").length} {t.adminHr.activeCount}</p>
        </div>
        <button onClick={openAdd} className="btn-primary flex items-center gap-2 text-sm">
          <Plus size={18} /> {t.adminHr.addEmployee}
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {departments.slice(0, 4).map((dep) => {
          const count = employees.filter(e => e.department === dep && e.status === "active").length;
          return (
            <div key={dep} className="card p-4 text-center">
              <p className="text-2xl font-black text-text-primary">{count}</p>
              <p className="text-text-muted text-xs mt-0.5">{dep}</p>
            </div>
          );
        })}
      </div>

      <div className="card overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              {[t.adminHr.tableEmployee, t.adminHr.tablePosition, t.adminHr.tableDepartment, t.adminHr.tablePhone, t.adminHr.tableSalary, t.adminHr.tableStatus, ""].map((h) => (
                <th key={h} className="text-left py-4 px-4 text-text-muted text-xs font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {employees.map((emp) => (
              <tr key={emp.id} className="border-b border-border/50 hover:bg-bg-panel/50 transition-colors">
                <td className="py-3 px-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-purple-400/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-purple-400 font-bold text-sm">{emp.name[0]}</span>
                    </div>
                    <p className="text-text-primary text-sm font-medium">{emp.name}</p>
                  </div>
                </td>
                <td className="py-3 px-4 text-text-secondary text-sm">{emp.position}</td>
                <td className="py-3 px-4 text-text-secondary text-sm">{emp.department}</td>
                <td className="py-3 px-4 text-text-secondary text-sm">{emp.phone}</td>
                <td className="py-3 px-4 text-accent-gold text-sm font-bold">{formatPrice(emp.salary)}</td>
                <td className="py-3 px-4">
                  <span className={`text-xs px-2 py-1 rounded-full border ${emp.status === "active" ? "bg-green-500/10 text-green-400 border-green-500/20" : "bg-red-500/10 text-red-400 border-red-500/20"}`}>
                    {emp.status === "active" ? t.adminHr.activeStatus : t.adminHr.inactiveStatus}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <div className="flex gap-1">
                    <button onClick={() => openEdit(emp)} className="p-1.5 rounded-lg hover:bg-bg-card text-text-muted hover:text-accent-gold transition-all"><Pencil size={15} /></button>
                    <button onClick={() => handleDelete(emp.id)} className="p-1.5 rounded-lg hover:bg-red-500/10 text-text-muted hover:text-red-400 transition-all"><Trash2 size={15} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="relative bg-bg-card border border-border rounded-2xl w-full max-w-md shadow-card animate-slide-up">
            <div className="flex items-center justify-between p-5 border-b border-border">
              <h3 className="font-bold text-text-primary flex items-center gap-2"><User size={18} className="text-purple-400" />{editEmp ? t.adminHr.editEmployee : t.adminHr.newEmployee}</h3>
              <button onClick={() => setShowModal(false)} className="p-1.5 rounded-lg hover:bg-bg-panel text-text-muted"><X size={18} /></button>
            </div>
            <form onSubmit={handleSave} className="p-5 space-y-3">
              <div>
                <label className="text-text-secondary text-sm mb-1.5 flex items-center gap-1.5"><User size={13} /> {t.adminHr.fullName} *</label>
                <input className="input-field" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required placeholder={t.adminHr.fullNamePlaceholder} autoFocus />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-text-secondary text-sm mb-1.5 flex items-center gap-1.5"><Briefcase size={13} /> {t.adminHr.positionLabel}</label>
                  <select className="input-field" value={form.position} onChange={(e) => setForm({ ...form, position: e.target.value })}>
                    {positions.map((p) => <option key={p}>{p}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-text-secondary text-sm mb-1.5 block">{t.adminHr.departmentLabel}</label>
                  <select className="input-field" value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })}>
                    {departments.map((d) => <option key={d}>{d}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="text-text-secondary text-sm mb-1.5 flex items-center gap-1.5"><Phone size={13} /> {t.adminHr.phoneLabel}</label>
                <input
                  className="input-field"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: formatPhoneNumber(e.target.value) })}
                  placeholder="+998 XX XXX XX XX"
                  maxLength={17}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-text-secondary text-sm mb-1.5 block">{t.adminHr.monthlySalary}</label>
                  <input type="number" className="input-field" value={form.salary || ""} onChange={(e) => setForm({ ...form, salary: +e.target.value })} min={0} placeholder="0" />
                </div>
                <div>
                  <label className="text-text-secondary text-sm mb-1.5 block">{t.adminHr.startDateLabel}</label>
                  <input type="date" className="input-field" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} />
                </div>
              </div>
              <div>
                <label className="text-text-secondary text-sm mb-1.5 block">{t.adminHr.statusLabel}</label>
                <select className="input-field" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as "active" | "inactive" })}>
                  <option value="active">{t.adminHr.activeStatus}</option>
                  <option value="inactive">{t.adminHr.inactiveStatus}</option>
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary flex-1">{t.adminHr.cancel}</button>
                <button type="submit" className="btn-primary flex-1 flex items-center justify-center gap-2" disabled={saving}>
                  {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                  {editEmp ? t.adminHr.save : t.adminHr.add}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
