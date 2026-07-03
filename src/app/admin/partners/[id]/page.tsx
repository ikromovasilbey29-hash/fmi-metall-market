"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  ArrowLeft, Building2, User, Phone, Mail, Globe, MapPin,
  Calendar, ArrowDown, ArrowUp, ArrowUpDown, Edit, Trash2,
  Plus, Save, X, Loader2, Package, FileText, TrendingUp,
} from "lucide-react";
import { formatPrice } from "@/lib/utils";
import toast from "react-hot-toast";
import {
  Partner, PartnerType, Transaction,
  getTypeConfig, getStatusCfg,
  lsLoad, lsSave, uid, totalReceived, totalSent,
  EMPTY_PARTNER, EMPTY_TX,
} from "@/lib/partners";
import { useT } from "@/hooks/useT";

export default function PartnerDetailPage() {
  const t = useT();
  const TYPE_CONFIG = getTypeConfig(t);
  const STATUS_CFG = getStatusCfg(t);
  const router = useRouter();
  const { id } = useParams<{ id: string }>();

  const [partner, setPartner]   = useState<Partner | null>(null);
  const [loading, setLoading]   = useState(true);
  const [showEdit, setShowEdit] = useState(false);
  const [showTx,   setShowTx]   = useState(false);
  const [saving,   setSaving]   = useState(false);
  const [txFilter, setTxFilter] = useState<"ALL" | "RECEIVED" | "SENT">("ALL");

  const [editForm, setEditForm] = useState({ ...EMPTY_PARTNER });
  const [txForm,   setTxForm]   = useState({ ...EMPTY_TX });

  /* load partner from localStorage */
  useEffect(() => {
    const all = lsLoad();
    const found = all.find(p => p.id === id) || null;
    setPartner(found);
    if (found) {
      setEditForm({
        name: found.name, type: found.type, status: found.status,
        phone: found.phone || "", email: found.email || "",
        website: found.website || "", address: found.address || "",
        contactPerson: found.contactPerson || "",
        description: found.description || "",
        partnerSince: found.partnerSince,
      });
    }
    setLoading(false);
  }, [id]);

  /* helper — save and re-sync state */
  const syncPartner = (updated: Partner[]) => {
    lsSave(updated);
    const found = updated.find(p => p.id === id) || null;
    setPartner(found);
  };

  /* ── Edit ── */
  const handleEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editForm.name.trim()) { toast.error(t.adminPartners.toastNameEmpty); return; }
    setSaving(true);
    const all = lsLoad();
    const updated = all.map(p =>
      p.id === id
        ? { ...p, ...editForm, name: editForm.name.trim(), updatedAt: new Date().toISOString() }
        : p
    );
    syncPartner(updated);
    setSaving(false);
    setShowEdit(false);
    toast.success(t.adminPartners.toastUpdated);
  };

  /* ── Delete partner ── */
  const handleDelete = () => {
    if (!confirm(`${t.adminPartners.confirmDeletePartnerPrefix}${partner?.name}${t.adminPartners.confirmDeletePartnerSuffix}`)) return;
    const all = lsLoad();
    lsSave(all.filter(p => p.id !== id));
    toast.success(t.adminPartners.toastPartnerDeleted);
    router.push("/admin/partners");
  };

  /* ── Add transaction ── */
  const handleAddTx = (e: React.FormEvent) => {
    e.preventDefault();
    const qty   = parseFloat(String(txForm.quantity));
    const price = parseFloat(String(txForm.totalPrice));
    if (!txForm.productName.trim()) { toast.error(t.adminPartners.toastEnterProductName); return; }
    if (!qty || qty <= 0)           { toast.error(t.adminPartners.toastEnterQuantity); return; }
    if (!price || price <= 0)       { toast.error(t.adminPartners.toastEnterAmount); return; }
    setSaving(true);
    const newTx: Transaction = {
      id: uid(), partnerId: id,
      type: txForm.type,
      productName: txForm.productName.trim(),
      quantity: qty, unit: txForm.unit,
      totalPrice: price, date: txForm.date,
      note: txForm.note.trim() || null,
    };
    const all = lsLoad();
    const updated = all.map(p =>
      p.id === id
        ? { ...p, transactions: [...p.transactions, newTx], updatedAt: new Date().toISOString() }
        : p
    );
    syncPartner(updated);
    setSaving(false);
    setShowTx(false);
    setTxForm({ ...EMPTY_TX });
    toast.success(t.adminPartners.toastTxAdded);
  };

  /* ── Delete transaction ── */
  const deleteTx = (txId: string) => {
    if (!confirm(t.adminPartners.confirmDeleteTx)) return;
    const all = lsLoad();
    const updated = all.map(p =>
      p.id === id
        ? { ...p, transactions: p.transactions.filter(tr => tr.id !== txId) }
        : p
    );
    syncPartner(updated);
    toast.success(t.adminPartners.toastDeleted);
  };

  /* ─────────────────── LOADING / NOT FOUND ─────────────────── */
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 size={36} className="text-accent-gold animate-spin" />
      </div>
    );
  }
  if (!partner) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <p className="text-text-secondary">{t.adminPartners.notFoundPartner}</p>
        <button onClick={() => router.push("/admin/partners")} className="btn-primary flex items-center gap-2">
          <ArrowLeft size={16} /> {t.adminPartners.back}
        </button>
      </div>
    );
  }

  /* ─────────────────── COMPUTED ─────────────────── */
  const recv    = totalReceived(partner);
  const sent    = totalSent(partner);
  const balance = recv - sent;
  const tcfg    = TYPE_CONFIG[partner.type];
  const scfg    = STATUS_CFG[partner.status];
  const days    = Math.floor((Date.now() - new Date(partner.partnerSince).getTime()) / 86400000);

  const visibleTxs = [...partner.transactions]
    .filter(t => txFilter === "ALL" || t.type === txFilter)
    .sort((a, b) => b.date.localeCompare(a.date));

  /* ─────────────────── RENDER ─────────────────── */
  return (
    <div className="max-w-5xl">

      {/* ── Back + Actions bar ── */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => router.push("/admin/partners")}
          className="flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors group">
          <span className="w-8 h-8 rounded-xl bg-bg-card border border-border flex items-center justify-center group-hover:border-accent-gold/40 transition-colors">
            <ArrowLeft size={16} />
          </span>
          <span className="text-sm font-medium">{t.adminPartners.backToPartners}</span>
        </button>
        <div className="flex items-center gap-2">
          <button onClick={() => setShowEdit(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-bg-card border border-border text-text-secondary hover:text-accent-gold hover:border-accent-gold/40 text-sm transition-all">
            <Edit size={15} /> {t.adminPartners.editBtn}
          </button>
          <button onClick={handleDelete}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-bg-card border border-border text-text-secondary hover:text-red-400 hover:border-red-500/40 text-sm transition-all">
            <Trash2 size={15} /> {t.adminPartners.deleteBtn}
          </button>
        </div>
      </div>

      {/* ── Profile Header ── */}
      <div className="card p-6 mb-6">
        <div className="flex items-start gap-5 flex-wrap">
          <div className={`w-20 h-20 rounded-2xl flex items-center justify-center flex-shrink-0 ${tcfg.bg} border ${tcfg.border}`}>
            <Building2 size={36} className={tcfg.color} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between flex-wrap gap-3">
              <div>
                <h1 className="text-2xl font-black text-text-primary">{partner.name}</h1>
                <div className="flex items-center gap-3 mt-2 flex-wrap">
                  <span className={`text-xs px-2.5 py-1 rounded-full border font-medium ${tcfg.bg} ${tcfg.border} ${tcfg.color}`}>
                    {tcfg.label}
                  </span>
                  <span className="flex items-center gap-1.5 text-sm text-text-muted">
                    <span className={`w-2 h-2 rounded-full ${scfg.dot}`} />
                    {scfg.label}
                  </span>
                  <span className="text-sm text-text-muted flex items-center gap-1">
                    <Calendar size={13} />
                    {new Date(partner.partnerSince).toLocaleDateString("uz-UZ", { day:"numeric", month:"long", year:"numeric" })} {t.adminPartners.sinceSuffix}
                    <span className="ml-1 text-accent-gold font-semibold">({days} {t.adminPartners.daysSuffix})</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Contact chips */}
            <div className="flex flex-wrap gap-3 mt-4">
              {partner.contactPerson && (
                <span className="flex items-center gap-1.5 text-sm text-text-secondary bg-bg-panel px-3 py-1.5 rounded-xl">
                  <User size={13} className="text-text-muted" />{partner.contactPerson}
                </span>
              )}
              {partner.phone && (
                <a href={`tel:${partner.phone}`} className="flex items-center gap-1.5 text-sm text-text-secondary bg-bg-panel px-3 py-1.5 rounded-xl hover:text-accent-gold transition-colors">
                  <Phone size={13} className="text-text-muted" />{partner.phone}
                </a>
              )}
              {partner.email && (
                <a href={`mailto:${partner.email}`} className="flex items-center gap-1.5 text-sm text-text-secondary bg-bg-panel px-3 py-1.5 rounded-xl hover:text-accent-gold transition-colors">
                  <Mail size={13} className="text-text-muted" />{partner.email}
                </a>
              )}
              {partner.website && (
                <a href={partner.website} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-sm text-text-secondary bg-bg-panel px-3 py-1.5 rounded-xl hover:text-accent-gold transition-colors">
                  <Globe size={13} className="text-text-muted" />{partner.website.replace(/^https?:\/\//, "")}
                </a>
              )}
              {partner.address && (
                <span className="flex items-center gap-1.5 text-sm text-text-secondary bg-bg-panel px-3 py-1.5 rounded-xl">
                  <MapPin size={13} className="text-text-muted" />{partner.address}
                </span>
              )}
            </div>

            {partner.description && (
              <p className="mt-3 text-text-muted text-sm flex items-start gap-1.5">
                <FileText size={13} className="mt-0.5 flex-shrink-0" />{partner.description}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* ── Financial stats ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="card p-5 border-blue-400/20">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-blue-400/10 rounded-xl flex items-center justify-center">
              <ArrowDown size={18} className="text-blue-400" />
            </div>
            <p className="text-text-muted text-sm">{t.adminPartners.receivedFromThem}</p>
          </div>
          <p className="text-2xl font-black text-blue-400">{formatPrice(recv)}</p>
          <p className="text-text-muted text-xs mt-1">
            {partner.transactions.filter(tr => tr.type === "RECEIVED").length} {t.adminPartners.transactionsCountSuffix}
          </p>
        </div>
        <div className="card p-5 border-purple-400/20">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-purple-400/10 rounded-xl flex items-center justify-center">
              <ArrowUp size={18} className="text-purple-400" />
            </div>
            <p className="text-text-muted text-sm">{t.adminPartners.sentToThem}</p>
          </div>
          <p className="text-2xl font-black text-purple-400">{formatPrice(sent)}</p>
          <p className="text-text-muted text-xs mt-1">
            {partner.transactions.filter(tr => tr.type === "SENT").length} {t.adminPartners.transactionsCountSuffix}
          </p>
        </div>
        <div className={`card p-5 ${balance >= 0 ? "border-green-400/20" : "border-red-400/20"}`}>
          <div className="flex items-center gap-3 mb-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${balance >= 0 ? "bg-green-400/10" : "bg-red-400/10"}`}>
              <ArrowUpDown size={18} className={balance >= 0 ? "text-green-400" : "text-red-400"} />
            </div>
            <p className="text-text-muted text-sm">{t.adminPartners.balance}</p>
          </div>
          <p className={`text-2xl font-black ${balance >= 0 ? "text-green-400" : "text-red-400"}`}>
            {balance >= 0 ? "+" : ""}{formatPrice(balance)}
          </p>
          <p className="text-text-muted text-xs mt-1">
            {balance >= 0 ? t.adminPartners.balancePositive : t.adminPartners.balanceNegative}
          </p>
        </div>
      </div>

      {/* ── Transactions ── */}
      <div className="card overflow-hidden">
        {/* header */}
        <div className="flex items-center justify-between p-5 border-b border-border flex-wrap gap-3">
          <div>
            <h2 className="text-text-primary font-bold flex items-center gap-2">
              <Package size={18} className="text-accent-gold" />
              {t.adminPartners.txHistoryTitle}
              <span className="text-text-muted text-sm font-normal">({partner.transactions.length})</span>
            </h2>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {/* filter tabs */}
            <div className="flex gap-1">
              {(["ALL","RECEIVED","SENT"] as const).map(f => (
                <button key={f} onClick={() => setTxFilter(f)}
                  className={`px-3 py-1 rounded-lg text-xs transition-all ${
                    txFilter === f
                      ? f === "RECEIVED" ? "bg-blue-400/20 text-blue-400 font-medium"
                        : f === "SENT" ? "bg-purple-400/20 text-purple-400 font-medium"
                        : "bg-accent-gold text-bg-primary font-medium"
                      : "bg-bg-panel border border-border text-text-muted hover:text-text-primary"
                  }`}>
                  {f === "ALL" ? t.adminPartners.txFilterAll : f === "RECEIVED" ? t.adminPartners.txFilterReceived : t.adminPartners.txFilterSent}
                </button>
              ))}
            </div>
            <button onClick={() => { setTxForm({ ...EMPTY_TX }); setShowTx(true); }}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-accent-gold text-bg-primary rounded-xl text-xs font-semibold hover:opacity-90 transition-opacity">
              <Plus size={13} /> {t.adminPartners.addTxBtn}
            </button>
          </div>
        </div>

        {/* list */}
        {visibleTxs.length === 0 ? (
          <div className="py-16 text-center">
            <Package size={36} className="text-text-muted opacity-20 mx-auto mb-3" />
            <p className="text-text-muted text-sm">{t.adminPartners.noTx}</p>
            <button onClick={() => { setTxForm({ ...EMPTY_TX }); setShowTx(true); }}
              className="mt-3 btn-primary text-xs inline-flex items-center gap-1.5">
              <Plus size={13} /> {t.adminPartners.addBtn}
            </button>
          </div>
        ) : (
          <div className="divide-y divide-border/60">
            {visibleTxs.map((tx, idx) => (
              <div key={tx.id}
                className={`flex items-start justify-between p-4 hover:bg-bg-panel/40 transition-colors ${
                  tx.type === "RECEIVED" ? "" : ""
                }`}>
                <div className="flex items-start gap-4">
                  {/* index + icon */}
                  <div className="flex flex-col items-center gap-1">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      tx.type === "RECEIVED" ? "bg-blue-400/15" : "bg-purple-400/15"
                    }`}>
                      {tx.type === "RECEIVED"
                        ? <ArrowDown size={16} className="text-blue-400" />
                        : <ArrowUp size={16} className="text-purple-400" />}
                    </div>
                    <span className="text-text-muted text-xs">{visibleTxs.length - idx}</span>
                  </div>
                  {/* info */}
                  <div>
                    <p className="text-text-primary font-semibold text-sm">{tx.productName}</p>
                    <div className="flex items-center gap-3 mt-1 flex-wrap text-xs text-text-muted">
                      <span className="flex items-center gap-1">
                        <Package size={10} />{tx.quantity} {tx.unit}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar size={10} />
                        {new Date(tx.date).toLocaleDateString("uz-UZ", { day:"numeric", month:"short", year:"numeric" })}
                      </span>
                      {tx.note && <span className="italic">"{tx.note}"</span>}
                    </div>
                  </div>
                </div>
                {/* price + actions */}
                <div className="flex items-start gap-3">
                  <div className="text-right">
                    <p className={`font-black text-base ${tx.type === "RECEIVED" ? "text-blue-400" : "text-purple-400"}`}>
                      {tx.type === "RECEIVED" ? "+" : "−"}{formatPrice(tx.totalPrice)}
                    </p>
                    <p className="text-text-muted text-xs mt-0.5">
                      {tx.type === "RECEIVED" ? t.adminPartners.receivedArrow : t.adminPartners.sentArrow}
                    </p>
                  </div>
                  <button onClick={() => deleteTx(tx.id)}
                    className="p-1.5 rounded-lg hover:bg-red-500/10 text-text-muted hover:text-red-400 transition-all mt-0.5">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* total row */}
        {visibleTxs.length > 0 && (
          <div className="flex items-center justify-between px-5 py-3 border-t border-border bg-bg-panel/40">
            <span className="text-text-muted text-xs">{visibleTxs.length} {t.adminPartners.shownSuffix}</span>
            <div className="flex gap-4 text-xs font-semibold">
              {txFilter !== "SENT" && (
                <span className="text-blue-400">
                  + {formatPrice(visibleTxs.filter(t => t.type === "RECEIVED").reduce((s, t) => s + t.totalPrice, 0))}
                </span>
              )}
              {txFilter !== "RECEIVED" && (
                <span className="text-purple-400">
                  − {formatPrice(visibleTxs.filter(t => t.type === "SENT").reduce((s, t) => s + t.totalPrice, 0))}
                </span>
              )}
            </div>
          </div>
        )}
      </div>


      {/* ══════ EDIT MODAL ══════ */}
      {showEdit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowEdit(false)} />
          <div className="relative bg-bg-card border border-border rounded-2xl w-full max-w-xl shadow-2xl max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-5 border-b border-border">
              <h3 className="font-bold text-accent-gold flex items-center gap-2">
                <Edit size={17} /> {t.adminPartners.editModalTitle}
              </h3>
              <button onClick={() => setShowEdit(false)} className="p-1.5 rounded-lg hover:bg-bg-panel text-text-muted">
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleEdit} className="p-5 space-y-4 overflow-y-auto flex-1">
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2 sm:col-span-1">
                  <label className="text-text-secondary text-sm mb-1.5 block">{t.adminPartners.companyNameLabel} *</label>
                  <input autoFocus required type="text" className="input-field"
                    value={editForm.name} onChange={e => setEditForm(p => ({ ...p, name: e.target.value }))} />
                </div>
                <div>
                  <label className="text-text-secondary text-sm mb-1.5 block">{t.adminPartners.typeLabel}</label>
                  <select className="input-field" value={editForm.type}
                    onChange={e => setEditForm(p => ({ ...p, type: e.target.value as PartnerType }))}>
                    <option value="SUPPLIER">{t.adminPartners.typeSupplier}</option>
                    <option value="BUYER">{t.adminPartners.typeBuyer}</option>
                    <option value="BOTH">{t.adminPartners.typeBoth}</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-text-secondary text-sm mb-1.5 block">{t.adminPartners.phoneLabel}</label>
                  <input type="tel" className="input-field" placeholder="+998..."
                    value={editForm.phone} onChange={e => setEditForm(p => ({ ...p, phone: e.target.value }))} />
                </div>
                <div>
                  <label className="text-text-secondary text-sm mb-1.5 block">{t.adminPartners.emailLabel}</label>
                  <input type="email" className="input-field"
                    value={editForm.email} onChange={e => setEditForm(p => ({ ...p, email: e.target.value }))} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-text-secondary text-sm mb-1.5 block">{t.adminPartners.contactPersonLabel}</label>
                  <input type="text" className="input-field"
                    value={editForm.contactPerson} onChange={e => setEditForm(p => ({ ...p, contactPerson: e.target.value }))} />
                </div>
                <div>
                  <label className="text-text-secondary text-sm mb-1.5 block">{t.adminPartners.partnerSinceLabel}</label>
                  <input type="date" className="input-field" value={editForm.partnerSince}
                    onChange={e => setEditForm(p => ({ ...p, partnerSince: e.target.value }))} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-text-secondary text-sm mb-1.5 block">{t.adminPartners.websiteLabel}</label>
                  <input type="text" className="input-field"
                    value={editForm.website} onChange={e => setEditForm(p => ({ ...p, website: e.target.value }))} />
                </div>
                <div>
                  <label className="text-text-secondary text-sm mb-1.5 block">{t.adminPartners.statusLabel}</label>
                  <select className="input-field" value={editForm.status}
                    onChange={e => setEditForm(p => ({ ...p, status: e.target.value as "ACTIVE" | "INACTIVE" }))}>
                    <option value="ACTIVE">{t.adminPartners.statusActive}</option>
                    <option value="INACTIVE">{t.adminPartners.statusInactive}</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-text-secondary text-sm mb-1.5 block">{t.adminPartners.addressLabel}</label>
                <input type="text" className="input-field"
                  value={editForm.address} onChange={e => setEditForm(p => ({ ...p, address: e.target.value }))} />
              </div>
              <div>
                <label className="text-text-secondary text-sm mb-1.5 block">{t.adminPartners.extraInfoLabel}</label>
                <textarea rows={2} className="input-field"
                  value={editForm.description} onChange={e => setEditForm(p => ({ ...p, description: e.target.value }))} />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowEdit(false)} className="btn-secondary flex-1">{t.adminPartners.cancel}</button>
                <button type="submit" disabled={saving}
                  className="flex-1 btn-primary flex items-center justify-center gap-2 disabled:opacity-40">
                  {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                  {t.adminPartners.save}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ══════ ADD TRANSACTION MODAL ══════ */}
      {showTx && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowTx(false)} />
          <div className="relative bg-bg-card border border-border rounded-2xl w-full max-w-lg shadow-2xl">
            <div className="flex items-center justify-between p-5 border-b border-border">
              <h3 className="font-bold text-accent-gold flex items-center gap-2">
                <Package size={17} /> {t.adminPartners.addTxModalTitle}
              </h3>
              <button onClick={() => setShowTx(false)} className="p-1.5 rounded-lg hover:bg-bg-panel text-text-muted">
                <X size={18} />
              </button>
            </div>
            <div className="px-5 py-3 bg-bg-panel/40 border-b border-border">
              <p className="text-text-secondary text-sm font-semibold">{partner.name}</p>
            </div>
            <form onSubmit={handleAddTx} className="p-5 space-y-4">
              {/* direction toggle */}
              <div>
                <label className="text-text-secondary text-sm mb-2 block">{t.adminPartners.directionLabel}</label>
                <div className="grid grid-cols-2 gap-2">
                  {(["RECEIVED","SENT"] as const).map(dir => (
                    <button key={dir} type="button" onClick={() => setTxForm(p => ({ ...p, type: dir }))}
                      className={`py-3 rounded-xl border text-sm font-semibold flex items-center justify-center gap-2 transition-all ${
                        txForm.type === dir
                          ? dir === "RECEIVED"
                            ? "bg-blue-400/20 border-blue-400/50 text-blue-400"
                            : "bg-purple-400/20 border-purple-400/50 text-purple-400"
                          : "bg-bg-panel border-border text-text-muted hover:text-text-primary"
                      }`}>
                      {dir === "RECEIVED"
                        ? <><ArrowDown size={15} /> {t.adminPartners.theyGaveUs}</>
                        : <><ArrowUp size={15} /> {t.adminPartners.weGaveThem}</>}
                    </button>
                  ))}
                </div>
              </div>
              {/* product + unit */}
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="text-text-secondary text-sm mb-1.5 block">{t.adminPartners.productLabel} *</label>
                  <input autoFocus required type="text" className="input-field" placeholder={t.adminPartners.productPlaceholder}
                    value={txForm.productName} onChange={e => setTxForm(p => ({ ...p, productName: e.target.value }))} />
                </div>
                <div>
                  <label className="text-text-secondary text-sm mb-1.5 block">{t.adminPartners.unitLabel}</label>
                  <select className="input-field" value={txForm.unit}
                    onChange={e => setTxForm(p => ({ ...p, unit: e.target.value }))}>
                    {["tonna","kg","metr","dona","m²","m³"].map(u => <option key={u}>{u}</option>)}
                  </select>
                </div>
              </div>
              {/* qty + price + date */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-text-secondary text-sm mb-1.5 block">{t.adminPartners.quantityLabel} *</label>
                  <input required type="number" min="0.001" step="any" className="input-field" placeholder="0"
                    value={txForm.quantity} onChange={e => setTxForm(p => ({ ...p, quantity: e.target.value }))} />
                </div>
                <div>
                  <label className="text-text-secondary text-sm mb-1.5 block">{t.adminPartners.amountLabel} *</label>
                  <input required type="number" min="1" step="1" className="input-field" placeholder="0"
                    value={txForm.totalPrice} onChange={e => setTxForm(p => ({ ...p, totalPrice: e.target.value }))} />
                </div>
                <div>
                  <label className="text-text-secondary text-sm mb-1.5 block">{t.adminPartners.dateLabel}</label>
                  <input required type="date" className="input-field" value={txForm.date}
                    onChange={e => setTxForm(p => ({ ...p, date: e.target.value }))} />
                </div>
              </div>
              <div>
                <label className="text-text-secondary text-sm mb-1.5 block">{t.adminPartners.noteLabel}</label>
                <input type="text" className="input-field" placeholder={t.adminPartners.optionalPlaceholder}
                  value={txForm.note} onChange={e => setTxForm(p => ({ ...p, note: e.target.value }))} />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowTx(false)} className="btn-secondary flex-1">{t.adminPartners.cancel}</button>
                <button type="submit" disabled={saving}
                  className="flex-1 btn-primary flex items-center justify-center gap-2 disabled:opacity-40">
                  {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                  {t.adminPartners.save}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
