"use client";

import { useState, useEffect, useCallback } from "react";
import {
  BookOpen, Plus, Trash2, X, Save, Loader2,
  Building2, User, Phone, CreditCard, CheckCircle2,
  AlertCircle, Clock, ChevronDown, ChevronUp,
} from "lucide-react";
import { formatPrice } from "@/lib/utils";
import toast from "react-hot-toast";
import { useT } from "@/hooks/useT";

type DebtStatus = "ACTIVE" | "PARTIAL" | "PAID";
type CreditorType = "COMPANY" | "PERSON";

interface DebtPayment {
  id: string;
  debtId: string;
  amount: number;
  date: string;
  note?: string | null;
  createdAt: string;
}

interface Debt {
  id: string;
  creditorName: string;
  creditorType: CreditorType;
  phone?: string | null;
  description?: string | null;
  totalAmount: number;
  paidAmount: number;
  status: DebtStatus;
  dueDate?: string | null;
  createdAt: string;
  updatedAt: string;
  payments: DebtPayment[];
}

function getStatusConfig(t: ReturnType<typeof useT>) {
  return {
    ACTIVE:  { label: t.adminDebts.statusActiveLabel,  color: "text-red-400",    bg: "bg-red-500/10 border-red-500/20",       icon: AlertCircle },
    PARTIAL: { label: t.adminDebts.statusPartialLabel, color: "text-yellow-400", bg: "bg-yellow-500/10 border-yellow-500/20", icon: Clock },
    PAID:    { label: t.adminDebts.statusPaidLabel,    color: "text-green-400",  bg: "bg-green-500/10 border-green-500/20",   icon: CheckCircle2 },
  } as const;
}

const LS_KEY = "fmi_debts";

/* ── localStorage helpers ── */
function lsLoad(): Debt[] {
  try { return JSON.parse(localStorage.getItem(LS_KEY) || "[]"); }
  catch { return []; }
}
function lsSave(data: Debt[]) {
  localStorage.setItem(LS_KEY, JSON.stringify(data));
}
function uid() { return "local-" + Date.now() + "-" + Math.random().toString(36).slice(2); }

export default function DebtsPage() {
  const t = useT();
  const STATUS_CONFIG = getStatusConfig(t);
  const [debts, setDebts]               = useState<Debt[]>([]);
  const [loading, setLoading]           = useState(true);
  const [useApi, setUseApi]             = useState(true);       // API available?
  const [showAdd, setShowAdd]           = useState(false);
  const [payTarget, setPayTarget]       = useState<Debt | null>(null);
  const [expandedId, setExpandedId]     = useState<string | null>(null);
  const [filter, setFilter]             = useState<"all" | DebtStatus>("all");
  const [saving, setSaving]             = useState(false);

  const [addForm, setAddForm] = useState({
    creditorName: "",
    creditorType: "COMPANY" as CreditorType,
    phone: "",
    description: "",
    totalAmount: "" as string | number,
    dueDate: "",
  });

  const [payForm, setPayForm] = useState({
    amount: "" as string | number,
    date: new Date().toISOString().split("T")[0],
    note: "",
  });

  /* ── Fetch ── */
  const fetchDebts = useCallback(async (apiMode = useApi) => {
    setLoading(true);

    // Always load from localStorage first (instant)
    const local = lsLoad();
    const filtered = filter === "all" ? local : local.filter(d => d.status === filter);
    setDebts(filtered);
    setLoading(false);

    // Then try API in background to sync
    if (apiMode) {
      try {
        const url = filter === "all" ? "/api/debts" : `/api/debts?status=${filter}`;
        const res = await fetch(url, { signal: AbortSignal.timeout(5000) });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        if (json.success) {
          // API works — use its data and sync to localStorage
          lsSave(json.data);
          setDebts(json.data);
          return;
        }
        throw new Error(json.error);
      } catch {
        // API not available — stay with localStorage silently
        setUseApi(false);
      }
    }
  }, [filter, useApi]);

  useEffect(() => { fetchDebts(); }, [filter]);

  /* ── Add Debt ── */
  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    const name  = String(addForm.creditorName).trim();
    const total = parseFloat(String(addForm.totalAmount));
    if (!name)          { toast.error(t.adminDebts.toastEnterCreditorName); return; }
    if (!total || total <= 0) { toast.error(t.adminDebts.toastAmountPositive); return; }

    setSaving(true);
    const payload = {
      creditorName: name,
      creditorType: addForm.creditorType,
      phone:       addForm.phone.trim() || null,
      description: addForm.description.trim() || null,
      totalAmount: total,
      dueDate:     addForm.dueDate || null,
    };

    if (useApi) {
      try {
        const res  = await fetch("/api/debts", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
        const json = await res.json();
        if (json.success) {
          await fetchDebts();
          resetAdd();
          toast.success(t.adminDebts.toastDebtAdded);
          setSaving(false); return;
        }
        toast.error(json.error || t.adminDebts.toastError); setSaving(false); return;
      } catch { setUseApi(false); }
    }

    // localStorage
    const all = lsLoad();
    const now = new Date().toISOString();
    const newDebt: Debt = { id: uid(), ...payload, paidAmount: 0, status: "ACTIVE", createdAt: now, updatedAt: now, payments: [] };
    lsSave([newDebt, ...all]);
    await fetchDebts(false);
    resetAdd();
    toast.success(t.adminDebts.toastDebtAddedOffline);
    setSaving(false);
  };

  const resetAdd = () => {
    setShowAdd(false);
    setAddForm({ creditorName: "", creditorType: "COMPANY", phone: "", description: "", totalAmount: "", dueDate: "" });
  };

  /* ── Payment ── */
  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!payTarget) return;
    const amount = parseFloat(String(payForm.amount));
    if (!amount || amount <= 0) { toast.error(t.adminDebts.toastEnterPaymentAmount); return; }
    const remain = payTarget.totalAmount - payTarget.paidAmount;
    if (amount > remain)        { toast.error(`${t.adminDebts.toastMaxPayment} ${formatPrice(remain)}`); return; }

    setSaving(true);
    if (useApi) {
      try {
        const res  = await fetch(`/api/debts/${payTarget.id}/payments`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ amount, date: payForm.date, note: payForm.note || null }) });
        const json = await res.json();
        if (json.success) {
          await fetchDebts();
          setPayTarget(null);
          setPayForm({ amount: "", date: new Date().toISOString().split("T")[0], note: "" });
          toast.success(t.adminDebts.toastPaymentSaved);
          setSaving(false); return;
        }
        toast.error(json.error || t.adminDebts.toastError); setSaving(false); return;
      } catch { setUseApi(false); }
    }

    // localStorage
    const all = lsLoad();
    const now = new Date().toISOString();
    const newPmt: DebtPayment = { id: uid(), debtId: payTarget.id, amount, date: payForm.date, note: payForm.note || null, createdAt: now };
    const updated = all.map(d => {
      if (d.id !== payTarget.id) return d;
      const paid = d.paidAmount + amount;
      const status: DebtStatus = paid >= d.totalAmount ? "PAID" : "PARTIAL";
      return { ...d, paidAmount: paid, status, updatedAt: now, payments: [...d.payments, newPmt] };
    });
    lsSave(updated);
    await fetchDebts(false);
    setPayTarget(null);
    setPayForm({ amount: "", date: new Date().toISOString().split("T")[0], note: "" });
    toast.success(t.adminDebts.toastPaymentSavedOffline);
    setSaving(false);
  };

  /* ── Delete ── */
  const handleDelete = async (debt: Debt) => {
    if (!confirm(`"${debt.creditorName}" ${t.adminDebts.confirmDelete}`)) return;
    if (useApi) {
      try {
        const res  = await fetch(`/api/debts/${debt.id}`, { method: "DELETE" });
        const json = await res.json();
        if (json.success) { await fetchDebts(); toast.success(t.adminDebts.toastDebtDeleted); return; }
        toast.error(json.error || t.adminDebts.toastError); return;
      } catch { setUseApi(false); }
    }
    lsSave(lsLoad().filter(d => d.id !== debt.id));
    await fetchDebts(false);
    toast.success(t.adminDebts.toastDebtDeleted);
  };

  /* ── Computed ── */
  const totalDebt   = debts.reduce((s, d) => s + d.totalAmount,  0);
  const totalPaid   = debts.reduce((s, d) => s + d.paidAmount,   0);
  const totalRemain = debts.reduce((s, d) => s + (d.totalAmount - d.paidAmount), 0);
  const pct = (d: Debt) => d.totalAmount > 0 ? Math.round((d.paidAmount / d.totalAmount) * 100) : 0;

  const payAmount    = parseFloat(String(payForm.amount)) || 0;
  const newPaidAfter = payTarget ? payTarget.paidAmount + payAmount : 0;
  const newPctAfter  = payTarget && payTarget.totalAmount > 0 ? Math.round((newPaidAfter / payTarget.totalAmount) * 100) : 0;

  return (
    <div>
      {/* ── Header ── */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black text-text-primary flex items-center gap-3">
            <BookOpen size={28} className="text-accent-gold" />
            {t.adminDebts.title}
          </h1>
          <p className="text-text-muted text-sm mt-1">
            {t.adminDebts.subtitle}
            {!useApi && <span className="ml-2 text-yellow-400 text-xs">{t.adminDebts.offlineMode}</span>}
          </p>
        </div>
        <button onClick={() => setShowAdd(true)} className="btn-primary flex items-center gap-2 text-sm">
          <Plus size={18} /> {t.adminDebts.addDebt}
        </button>
      </div>

      {/* ── Statistika ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
        <div className="card p-5">
          <p className="text-text-muted text-sm mb-2 flex items-center gap-1.5">
            <CreditCard size={15} className="text-accent-gold" /> {t.adminDebts.totalDebt}
          </p>
          <p className="text-2xl font-black text-accent-gold">{formatPrice(totalDebt)}</p>
          <p className="text-text-muted text-xs mt-1">{debts.length} {t.adminDebts.totalDebtCreditors}</p>
        </div>
        <div className="card p-5">
          <p className="text-text-muted text-sm mb-2 flex items-center gap-1.5">
            <CheckCircle2 size={15} className="text-green-400" /> {t.adminDebts.paidAmount}
          </p>
          <p className="text-2xl font-black text-green-400">{formatPrice(totalPaid)}</p>
          <p className="text-text-muted text-xs mt-1">
            {totalDebt > 0 ? Math.round((totalPaid / totalDebt) * 100) : 0}{t.adminDebts.totalPaidPercent}
          </p>
        </div>
        <div className="card p-5 border-red-500/20">
          <p className="text-text-muted text-sm mb-2 flex items-center gap-1.5">
            <AlertCircle size={15} className="text-red-400" /> {t.adminDebts.remainingDebtTitle}
          </p>
          <p className="text-2xl font-black text-red-400">{formatPrice(totalRemain)}</p>
          <p className="text-text-muted text-xs mt-1">
            {debts.filter(d => d.status !== "PAID").length} {t.adminDebts.remainingUnpaidCount}
          </p>
        </div>
      </div>

      {/* ── Filter ── */}
      <div className="flex gap-2 mb-5 flex-wrap">
        {([ ["all",t.adminDebts.filterAll], ["ACTIVE",t.adminDebts.filterActive], ["PARTIAL",t.adminDebts.filterPartial], ["PAID",t.adminDebts.filterPaid] ] as const).map(([v, lbl]) => (
          <button key={v} onClick={() => setFilter(v)}
            className={`px-4 py-1.5 rounded-lg text-sm transition-all ${filter === v ? "bg-accent-gold text-bg-primary font-medium" : "bg-bg-card border border-border text-text-secondary hover:text-text-primary"}`}>
            {lbl}
          </button>
        ))}
        <span className="ml-auto text-text-muted text-sm self-center">{debts.length} {t.adminDebts.recordsCount}</span>
      </div>

      {/* ── List ── */}
      <div className="space-y-3">
        {loading ? (
          <div className="card p-12 text-center">
            <Loader2 size={40} className="text-accent-gold animate-spin mx-auto mb-3" />
            <p className="text-text-secondary">{t.adminDebts.loading}</p>
          </div>
        ) : debts.length === 0 ? (
          <div className="card p-12 text-center">
            <BookOpen size={40} className="text-text-muted opacity-30 mx-auto mb-3" />
            <p className="text-text-secondary">{t.adminDebts.noDebtsYet}</p>
            <button onClick={() => setShowAdd(true)} className="mt-4 btn-primary text-sm inline-flex items-center gap-2">
              <Plus size={16} /> {t.adminDebts.addFirstDebt}
            </button>
          </div>
        ) : debts.map(debt => {
          const p = pct(debt);
          const remain = debt.totalAmount - debt.paidAmount;
          const cfg = STATUS_CONFIG[debt.status];
          const Icon = cfg.icon;
          const isExpanded = expandedId === debt.id;
          const isOverdue = debt.dueDate && debt.status !== "PAID" && new Date(debt.dueDate) < new Date();

          return (
            <div key={debt.id} className={`card overflow-hidden transition-all ${debt.status === "PAID" ? "opacity-70" : ""}`}>
              <div className="p-5">
                <div className="flex items-start gap-4">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${debt.creditorType === "COMPANY" ? "bg-blue-400/10" : "bg-purple-400/10"}`}>
                    {debt.creditorType === "COMPANY"
                      ? <Building2 size={20} className="text-blue-400" />
                      : <User size={20} className="text-purple-400" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3 flex-wrap">
                      <div>
                        <p className="text-text-primary font-bold text-sm">{debt.creditorName}</p>
                        <div className="flex flex-wrap items-center gap-2 text-text-muted text-xs mt-0.5">
                          {debt.phone && <><Phone size={11} />{debt.phone}</>}
                          {debt.dueDate && (
                            <span className={isOverdue ? "text-red-400" : ""}>
                              · {t.adminDebts.dueDatePrefix} {new Date(debt.dueDate).toLocaleDateString("uz-UZ", { day:"numeric", month:"short", year:"numeric" })}
                              {isOverdue && ` ⚠ ${t.adminDebts.overdueLabel}`}
                            </span>
                          )}
                        </div>
                        {debt.description && <p className="text-text-muted text-xs mt-1">{debt.description}</p>}
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full border flex items-center gap-1 ${cfg.bg} ${cfg.color}`}>
                        <Icon size={11} />{cfg.label}
                      </span>
                    </div>

                    {/* Progress */}
                    <div className="mt-3">
                      <div className="flex justify-between text-xs mb-1.5">
                        <span className="text-text-muted">{t.adminDebts.paidColon} <span className="text-green-400 font-semibold">{formatPrice(debt.paidAmount)}</span></span>
                        <span className="text-text-muted">{t.adminDebts.remainingColon} <span className="text-red-400 font-semibold">{formatPrice(remain)}</span></span>
                      </div>
                      <div className="h-2.5 bg-bg-panel rounded-full overflow-hidden">
                        <div className={`h-full rounded-full transition-all duration-500 ${p >= 100 ? "bg-green-400" : p > 0 ? "bg-yellow-400" : "bg-red-400"}`} style={{ width: `${p}%` }} />
                      </div>
                      <div className="flex justify-between mt-1">
                        <span className="text-text-muted text-xs">{t.adminDebts.totalColon} <span className="text-text-primary font-semibold">{formatPrice(debt.totalAmount)}</span></span>
                        <span className={`text-xs font-bold ${p >= 100 ? "text-green-400" : p > 0 ? "text-yellow-400" : "text-red-400"}`}>{p}%</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 mt-4 pt-3 border-t border-border/50 flex-wrap">
                  {debt.status !== "PAID" && (
                    <button onClick={() => { setPayTarget(debt); setPayForm({ amount: "", date: new Date().toISOString().split("T")[0], note: "" }); }}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-green-500/20 hover:bg-green-500/30 border border-green-500/30 text-green-400 text-xs font-semibold rounded-lg transition-all">
                      <CreditCard size={13} /> {t.adminDebts.addPaymentBtn}
                    </button>
                  )}
                  {debt.payments.length > 0 && (
                    <button onClick={() => setExpandedId(isExpanded ? null : debt.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-bg-panel border border-border text-text-secondary hover:text-text-primary text-xs rounded-lg transition-all">
                      {isExpanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                      {t.adminDebts.historyBtn} ({debt.payments.length})
                    </button>
                  )}
                  <button onClick={() => handleDelete(debt)}
                    className="ml-auto p-1.5 rounded-lg hover:bg-red-500/10 text-text-muted hover:text-red-400 transition-all">
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>

              {/* Payments history */}
              {isExpanded && (
                <div className="border-t border-border bg-bg-panel/50 p-4">
                  <p className="text-text-muted text-xs font-semibold mb-3 uppercase tracking-wide">{t.adminDebts.paymentsHistoryTitle}</p>
                  <div className="space-y-2">
                    {[...debt.payments].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((pmt, i) => (
                      <div key={pmt.id} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 bg-green-400/20 rounded-full flex items-center justify-center">
                            <span className="text-green-400 text-xs font-bold">{debt.payments.length - i}</span>
                          </div>
                          <div>
                            <p className="text-green-400 text-sm font-bold">+{formatPrice(pmt.amount)}</p>
                            {pmt.note && <p className="text-text-muted text-xs">{pmt.note}</p>}
                          </div>
                        </div>
                        <p className="text-text-muted text-xs">{new Date(pmt.date).toLocaleDateString("uz-UZ", { day:"numeric", month:"short", year:"numeric" })}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ══════════ ADD MODAL ══════════ */}
      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={resetAdd} />
          <div className="relative bg-bg-card border border-border rounded-2xl w-full max-w-lg shadow-card">
            <div className="flex items-center justify-between p-5 border-b border-border">
              <h3 className="font-bold text-accent-gold flex items-center gap-2"><Plus size={18} /> {t.adminDebts.addDebt}</h3>
              <button onClick={resetAdd} className="p-1.5 rounded-lg hover:bg-bg-panel text-text-muted"><X size={18} /></button>
            </div>

            <form onSubmit={handleAdd} className="p-5 space-y-4">
              {/* Row 1 */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-text-secondary text-sm mb-1.5 block">{t.adminDebts.creditorTypeLabel}</label>
                  <select className="input-field" value={addForm.creditorType}
                    onChange={e => setAddForm(p => ({ ...p, creditorType: e.target.value as CreditorType }))}>
                    <option value="COMPANY">{t.adminDebts.company}</option>
                    <option value="PERSON">{t.adminDebts.person}</option>
                  </select>
                </div>
                <div>
                  <label className="text-text-secondary text-sm mb-1.5 block">{t.adminDebts.nameLabel} *</label>
                  <input autoFocus required type="text" className="input-field" placeholder={t.adminDebts.namePlaceholder}
                    value={addForm.creditorName} onChange={e => setAddForm(p => ({ ...p, creditorName: e.target.value }))} />
                </div>
              </div>

              {/* Row 2 */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-text-secondary text-sm mb-1.5 block">{t.adminDebts.phoneLabel}</label>
                  <input type="tel" className="input-field" placeholder="+998901234567"
                    value={addForm.phone} onChange={e => setAddForm(p => ({ ...p, phone: e.target.value }))} />
                </div>
                <div>
                  <label className="text-text-secondary text-sm mb-1.5 block">{t.adminDebts.dueDateLabel}</label>
                  <input type="date" className="input-field" value={addForm.dueDate}
                    onChange={e => setAddForm(p => ({ ...p, dueDate: e.target.value }))} />
                </div>
              </div>

              {/* Summa */}
              <div>
                <label className="text-text-secondary text-sm mb-1.5 block">{t.adminDebts.amountLabel} *</label>
                <input required type="number" min="1" step="1" className="input-field" placeholder={t.adminDebts.amountPlaceholder}
                  value={addForm.totalAmount}
                  onChange={e => setAddForm(p => ({ ...p, totalAmount: e.target.value }))} />
              </div>

              {/* Tavsif */}
              <div>
                <label className="text-text-secondary text-sm mb-1.5 block">{t.adminDebts.extraInfoLabel}</label>
                <textarea rows={2} className="input-field" placeholder={t.adminDebts.optionalPlaceholder}
                  value={addForm.description} onChange={e => setAddForm(p => ({ ...p, description: e.target.value }))} />
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={resetAdd} className="btn-secondary flex-1">{t.adminDebts.cancel}</button>
                <button type="submit" disabled={saving}
                  className="flex-1 btn-primary flex items-center justify-center gap-2 disabled:opacity-40">
                  {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                  {t.adminDebts.save}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ══════════ PAY MODAL ══════════ */}
      {payTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setPayTarget(null)} />
          <div className="relative bg-bg-card border border-border rounded-2xl w-full max-w-lg shadow-card">
            <div className="flex items-center justify-between p-5 border-b border-border">
              <h3 className="font-bold text-green-400 flex items-center gap-2"><CreditCard size={18} /> {t.adminDebts.modalPayTitle}</h3>
              <button onClick={() => setPayTarget(null)} className="p-1.5 rounded-lg hover:bg-bg-panel text-text-muted"><X size={18} /></button>
            </div>

            {/* Kreditor info */}
            <div className="px-5 py-4 border-b border-border bg-bg-panel/30 flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${payTarget.creditorType === "COMPANY" ? "bg-blue-400/10" : "bg-purple-400/10"}`}>
                {payTarget.creditorType === "COMPANY" ? <Building2 size={18} className="text-blue-400" /> : <User size={18} className="text-purple-400" />}
              </div>
              <div>
                <p className="text-text-primary font-bold text-sm">{payTarget.creditorName}</p>
                <p className="text-text-muted text-xs">{t.adminDebts.remainingColon} <span className="text-red-400 font-semibold">{formatPrice(payTarget.totalAmount - payTarget.paidAmount)}</span></p>
              </div>
            </div>

            <form onSubmit={handlePay} className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-text-secondary text-sm mb-1.5 block">{t.adminDebts.paymentAmountLabel} *</label>
                  <input autoFocus required type="number" min="1" step="1" className="input-field" placeholder="0"
                    value={payForm.amount}
                    onChange={e => setPayForm(p => ({ ...p, amount: e.target.value }))} />
                  <p className="text-text-muted text-xs mt-1">{t.adminDebts.maxLabel} {formatPrice(payTarget.totalAmount - payTarget.paidAmount)}</p>
                </div>
                <div>
                  <label className="text-text-secondary text-sm mb-1.5 block">{t.adminDebts.paymentDateLabel}</label>
                  <input required type="date" className="input-field" value={payForm.date}
                    onChange={e => setPayForm(p => ({ ...p, date: e.target.value }))} />
                </div>
              </div>

              <div>
                <label className="text-text-secondary text-sm mb-1.5 block">{t.adminDebts.noteLabel}</label>
                <textarea rows={2} className="input-field" placeholder={t.adminDebts.optionalPlaceholder}
                  value={payForm.note} onChange={e => setPayForm(p => ({ ...p, note: e.target.value }))} />
              </div>

              {/* Preview */}
              {payAmount > 0 && (
                <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-3 space-y-1 text-sm">
                  <p className="text-text-muted text-xs mb-1 font-semibold uppercase tracking-wide">{t.adminDebts.afterPaymentTitle}</p>
                  <div className="flex justify-between">
                    <span className="text-text-muted">{t.adminDebts.paidColon}</span>
                    <span className="text-green-400 font-bold">{formatPrice(newPaidAfter)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-muted">{t.adminDebts.remainingColon}</span>
                    <span className="text-red-400 font-bold">{formatPrice(payTarget.totalAmount - newPaidAfter)}</span>
                  </div>
                  <div className="flex justify-between border-t border-green-500/20 pt-1 mt-1">
                    <span className="text-text-muted">{t.adminDebts.percentLabel}</span>
                    <span className="text-green-400 font-bold">{newPctAfter}%</span>
                  </div>
                  {/* mini progress */}
                  <div className="h-1.5 bg-bg-panel rounded-full overflow-hidden mt-2">
                    <div className={`h-full rounded-full transition-all ${newPctAfter >= 100 ? "bg-green-400" : "bg-yellow-400"}`} style={{ width: `${Math.min(newPctAfter, 100)}%` }} />
                  </div>
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setPayTarget(null)} className="btn-secondary flex-1">{t.adminDebts.cancel}</button>
                <button type="submit" disabled={saving || payAmount <= 0}
                  className="flex-1 bg-green-500/20 hover:bg-green-500/30 border border-green-500/30 text-green-400 py-3 rounded-xl font-semibold text-sm transition-all disabled:opacity-40 flex items-center justify-center gap-2">
                  {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                  {t.adminDebts.save}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
