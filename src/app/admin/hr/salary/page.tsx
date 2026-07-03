"use client";

import { useState, useMemo } from "react";
import { DollarSign, Plus, CheckCircle2, X, Save, Loader2, TrendingUp } from "lucide-react";
import { useHRStore } from "@/store/hrStore";
import { formatPrice } from "@/lib/utils";
import toast from "react-hot-toast";
import { useT } from "@/hooks/useT";
import { useLanguageStore } from "@/store/languageStore";

const monthValues = ["2026-06", "2026-05", "2026-04"];

export default function HRSalaryPage() {
  const t = useT();
  const lang = useLanguageStore((s) => s.lang);
  const months = monthValues.map((value) => ({
    value,
    label: new Date(value + "-01").toLocaleDateString(lang === "ru" ? "ru-RU" : "uz-UZ", { month: "long", year: "numeric" }),
  }));
  const { employees, salaries, addSalary, markSalaryPaid } = useHRStore();
  const [selectedMonth, setSelectedMonth] = useState("2026-06");
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ employeeId: "", bonus: 0, deduction: 0 });

  const activeEmps = employees.filter(e => e.status === "active");
  const monthSalaries = salaries.filter(s => s.month === selectedMonth);

  const getRecord = (empId: string) => monthSalaries.find(s => s.employeeId === empId);
  const selectedEmp = employees.find(e => e.id === form.employeeId);

  const stats = useMemo(() => ({
    total: monthSalaries.reduce((s, r) => s + r.total, 0),
    paid: monthSalaries.filter(r => r.paid).reduce((s, r) => s + r.total, 0),
    unpaid: monthSalaries.filter(r => !r.paid).reduce((s, r) => s + r.total, 0),
    paidCount: monthSalaries.filter(r => r.paid).length,
  }), [monthSalaries]);

  const openModal = (empId?: string) => {
    setForm({ employeeId: empId || (activeEmps[0]?.id || ""), bonus: 0, deduction: 0 });
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEmp) return;
    setSaving(true);
    await new Promise(r => setTimeout(r, 400));
    const total = selectedEmp.salary + form.bonus - form.deduction;
    addSalary({ employeeId: form.employeeId, month: selectedMonth, baseSalary: selectedEmp.salary, bonus: form.bonus, deduction: form.deduction, total, paid: false });
    setSaving(false);
    setShowModal(false);
    toast.success(`${selectedEmp.name}${t.adminHr.toastSalaryCalculatedSuffix}`);
  };

  const handlePay = (id: string, empName: string) => {
    if (!confirm(`${t.adminHr.confirmPaySalaryPrefix}${empName}${t.adminHr.confirmPaySalarySuffix}`)) return;
    markSalaryPaid(id);
    toast.success(`${empName}${t.adminHr.toastSalaryPaidSuffix}`);
  };

  // Oylik hisoblanmagan xodimlar
  const unprocessed = activeEmps.filter(e => !getRecord(e.id));

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black text-text-primary flex items-center gap-3">
            <DollarSign size={28} className="text-purple-400" /> {t.adminHr.salaryTitle}
          </h1>
          <p className="text-text-muted text-sm mt-1">{t.adminHr.employeesSalaryDesc}</p>
        </div>
        <div className="flex items-center gap-3">
          <select value={selectedMonth} onChange={e => setSelectedMonth(e.target.value)} className="input-field text-sm">
            {months.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
          </select>
          {unprocessed.length > 0 && (
            <button onClick={() => openModal()} className="btn-primary flex items-center gap-2 text-sm">
              <Plus size={18} /> {t.adminHr.calcSalaryBtn}
            </button>
          )}
        </div>
      </div>

      {/* Statistika */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="card p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-purple-400/10 rounded-xl flex items-center justify-center">
              <TrendingUp size={18} className="text-purple-400" />
            </div>
            <p className="text-text-muted text-sm">{t.adminHr.totalFund}</p>
          </div>
          <p className="text-2xl font-black text-text-primary">{formatPrice(stats.total)}</p>
        </div>
        <div className="card p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-green-400/10 rounded-xl flex items-center justify-center">
              <CheckCircle2 size={18} className="text-green-400" />
            </div>
            <p className="text-text-muted text-sm">{t.adminHr.paidLabel}</p>
          </div>
          <p className="text-2xl font-black text-green-400">{formatPrice(stats.paid)}</p>
          <p className="text-text-muted text-xs mt-1">{stats.paidCount} {t.adminHr.paidCount}</p>
        </div>
        <div className="card p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-yellow-400/10 rounded-xl flex items-center justify-center">
              <DollarSign size={18} className="text-yellow-400" />
            </div>
            <p className="text-text-muted text-sm">{t.adminHr.unpaidLabel}</p>
          </div>
          <p className="text-2xl font-black text-yellow-400">{formatPrice(stats.unpaid)}</p>
        </div>
      </div>

      {/* Xodimlar maosh jadvali */}
      <div className="card overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              {[t.adminHr.tableEmployee, t.adminHr.tablePosition, t.adminHr.tableBaseSalary, t.adminHr.tableBonus, t.adminHr.tableDeduction, t.adminHr.tableTotal, t.adminHr.tableStatus, ""].map(h => (
                <th key={h} className="text-left py-4 px-4 text-text-muted text-xs font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {activeEmps.map(emp => {
              const rec = getRecord(emp.id);
              return (
                <tr key={emp.id} className="border-b border-border/50 hover:bg-bg-panel/50 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 bg-purple-400/20 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-purple-400 font-bold text-xs">{emp.name[0]}</span>
                      </div>
                      <p className="text-text-primary text-sm font-medium">{emp.name}</p>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-text-muted text-xs">{emp.position}</td>
                  <td className="py-3 px-4 text-text-secondary text-sm">{formatPrice(rec?.baseSalary || emp.salary)}</td>
                  <td className="py-3 px-4 text-green-400 text-sm">{rec ? `+${formatPrice(rec.bonus)}` : "—"}</td>
                  <td className="py-3 px-4 text-red-400 text-sm">{rec ? `−${formatPrice(rec.deduction)}` : "—"}</td>
                  <td className="py-3 px-4 text-accent-gold text-sm font-bold">{rec ? formatPrice(rec.total) : "—"}</td>
                  <td className="py-3 px-4">
                    {rec ? (
                      <span className={`text-xs px-2 py-1 rounded-full border ${rec.paid ? "bg-green-500/10 text-green-400 border-green-500/20" : "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"}`}>
                        {rec.paid ? t.adminHr.paidStatus : t.adminHr.pendingStatus}
                      </span>
                    ) : (
                      <span className="text-xs text-text-muted">{t.adminHr.notCalculated}</span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    {rec && !rec.paid ? (
                      <button onClick={() => handlePay(rec.id, emp.name)} className="text-xs bg-green-500/20 hover:bg-green-500/30 border border-green-500/30 text-green-400 px-3 py-1.5 rounded-lg transition-all">
                        {t.adminHr.payBtn}
                      </button>
                    ) : !rec ? (
                      <button onClick={() => openModal(emp.id)} className="text-xs bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/30 text-purple-400 px-3 py-1.5 rounded-lg transition-all">
                        {t.adminHr.calcBtn}
                      </button>
                    ) : null}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="relative bg-bg-card border border-border rounded-2xl w-full max-w-md shadow-card animate-slide-up">
            <div className="flex items-center justify-between p-5 border-b border-border">
              <h3 className="font-bold text-text-primary flex items-center gap-2"><DollarSign size={18} className="text-purple-400" /> {t.adminHr.calcSalaryBtn}</h3>
              <button onClick={() => setShowModal(false)} className="p-1.5 rounded-lg hover:bg-bg-panel text-text-muted"><X size={18} /></button>
            </div>
            <form onSubmit={handleSave} className="p-5 space-y-4">
              <div>
                <label className="text-text-secondary text-sm mb-1.5 block">{t.adminHr.employeeLabel}</label>
                <select className="input-field" value={form.employeeId} onChange={e => setForm({ ...form, employeeId: e.target.value })}>
                  {activeEmps.filter(e => !getRecord(e.id)).map(e => (
                    <option key={e.id} value={e.id}>{e.name} — {formatPrice(e.salary)}</option>
                  ))}
                </select>
              </div>
              {selectedEmp && (
                <div className="p-3 bg-bg-panel rounded-xl">
                  <p className="text-text-muted text-xs mb-1">{t.adminHr.baseSalary}</p>
                  <p className="text-accent-gold font-bold">{formatPrice(selectedEmp.salary)}</p>
                </div>
              )}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-text-secondary text-sm mb-1.5 block">{t.adminHr.bonusPlus}</label>
                  <input type="number" className="input-field" value={form.bonus || ""} onChange={e => setForm({ ...form, bonus: +e.target.value })} min={0} placeholder="0" />
                </div>
                <div>
                  <label className="text-text-secondary text-sm mb-1.5 block">{t.adminHr.deductionMinus}</label>
                  <input type="number" className="input-field" value={form.deduction || ""} onChange={e => setForm({ ...form, deduction: +e.target.value })} min={0} placeholder="0" />
                </div>
              </div>
              {selectedEmp && (
                <div className={`p-3 rounded-xl border text-center ${form.bonus - form.deduction >= 0 ? "bg-green-500/10 border-green-500/20" : "bg-red-500/10 border-red-500/20"}`}>
                  <p className="text-text-muted text-xs mb-0.5">{t.adminHr.totalPayment}</p>
                  <p className="text-xl font-black text-accent-gold">{formatPrice(selectedEmp.salary + form.bonus - form.deduction)}</p>
                </div>
              )}
              <div className="flex gap-3">
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary flex-1">{t.adminHr.cancel}</button>
                <button type="submit" className="btn-primary flex-1 flex items-center justify-center gap-2" disabled={saving}>
                  {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                  {t.adminHr.calcBtn}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
