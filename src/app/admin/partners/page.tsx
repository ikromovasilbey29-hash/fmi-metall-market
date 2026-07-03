"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Handshake, Plus, X, Save, Loader2, Building2, User,
  Phone, Mail, Globe, MapPin, Calendar, ArrowDown, ArrowUp,
  TrendingUp, Search, ChevronRight,
} from "lucide-react";
import { formatPrice } from "@/lib/utils";
import toast from "react-hot-toast";
import {
  Partner, PartnerType, getTypeConfig, getStatusCfg,
  lsLoad, lsSave, uid, totalReceived, totalSent,
  EMPTY_PARTNER,
} from "@/lib/partners";
import { useT } from "@/hooks/useT";

export default function PartnersPage() {
  const t = useT();
  const TYPE_CONFIG = getTypeConfig(t);
  const STATUS_CFG = getStatusCfg(t);
  const router = useRouter();
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState("");
  const [filterType, setFilterType] = useState<"all" | PartnerType>("all");
  const [showAdd, setShowAdd]   = useState(false);
  const [saving, setSaving]     = useState(false);
  const [addForm, setAddForm]   = useState({ ...EMPTY_PARTNER });

  useEffect(() => {
    setPartners(lsLoad());
    setLoading(false);
  }, []);

  const filtered = partners.filter(p => {
    const mt = filterType === "all" || p.type === filterType;
    const ms = !search ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.contactPerson || "").toLowerCase().includes(search.toLowerCase());
    return mt && ms;
  });

  /* global stats */
  const totalP  = partners.length;
  const activeP = partners.filter(p => p.status === "ACTIVE").length;
  const allRecv = partners.reduce((s, p) => s + totalReceived(p), 0);
  const allSent = partners.reduce((s, p) => s + totalSent(p),     0);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addForm.name.trim()) { toast.error(t.adminPartners.toastEnterName); return; }
    setSaving(true);
    const now = new Date().toISOString();
    const newP: Partner = {
      id: uid(), ...addForm, name: addForm.name.trim(),
      transactions: [], createdAt: now, updatedAt: now,
    };
    const updated = [newP, ...partners];
    lsSave(updated);
    setPartners(updated);
    setShowAdd(false);
    setAddForm({ ...EMPTY_PARTNER });
    setSaving(false);
    toast.success(t.adminPartners.toastPartnerAdded);
    // navigate to detail page
    router.push(`/admin/partners/${newP.id}`);
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black text-text-primary flex items-center gap-3">
            <Handshake size={28} className="text-accent-gold" />
            {t.adminPartners.title}
          </h1>
          <p className="text-text-muted text-sm mt-1">{t.adminPartners.subtitle}</p>
        </div>
        <button onClick={() => { setAddForm({ ...EMPTY_PARTNER }); setShowAdd(true); }}
          className="btn-primary flex items-center gap-2 text-sm">
          <Plus size={18} /> {t.adminPartners.addPartner}
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: t.adminPartners.statTotal,  value: totalP,                sub: `${activeP} ${t.adminPartners.statTotalSub}`,   color: "text-accent-gold", Icon: Handshake },
          { label: t.adminPartners.statActive,  value: activeP,               sub: `${totalP - activeP} ${t.adminPartners.statActiveSub}`, color: "text-green-400", Icon: TrendingUp },
          { label: t.adminPartners.statReceived,    value: formatPrice(allRecv),  sub: t.adminPartners.statReceivedSub,          color: "text-blue-400",    Icon: ArrowDown },
          { label: t.adminPartners.statSent, value: formatPrice(allSent),  sub: t.adminPartners.statSentSub,          color: "text-purple-400",  Icon: ArrowUp },
        ].map(({ label, value, sub, color, Icon }) => (
          <div key={label} className="card p-5">
            <p className="text-text-muted text-xs mb-2 flex items-center gap-1.5">
              <Icon size={13} className={color} />{label}
            </p>
            <p className={`text-xl font-black ${color}`}>{value}</p>
            <p className="text-text-muted text-xs mt-1">{sub}</p>
          </div>
        ))}
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input type="text" placeholder={t.adminPartners.searchPlaceholder}
            value={search} onChange={e => setSearch(e.target.value)}
            className="input-field pl-9 text-sm" />
        </div>
        <div className="flex gap-2 flex-wrap">
          {([["all",t.adminPartners.filterAll],["SUPPLIER",t.adminPartners.filterSupplier],["BUYER",t.adminPartners.filterBuyer],["BOTH",t.adminPartners.filterBoth]] as const).map(([v, lbl]) => (
            <button key={v} onClick={() => setFilterType(v)}
              className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                filterType === v
                  ? "bg-accent-gold text-bg-primary font-medium"
                  : "bg-bg-card border border-border text-text-secondary hover:text-text-primary"
              }`}>
              {lbl}
            </button>
          ))}
        </div>
      </div>

      {/* Cards */}
      {loading ? (
        <div className="card p-12 text-center">
          <Loader2 size={36} className="text-accent-gold animate-spin mx-auto mb-3" />
          <p className="text-text-secondary">{t.adminPartners.loading}</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="card p-12 text-center">
          <Handshake size={40} className="text-text-muted opacity-30 mx-auto mb-3" />
          <p className="text-text-secondary">{search ? t.adminPartners.notFoundSearch : t.adminPartners.noPartnersYet}</p>
          {!search && (
            <button onClick={() => setShowAdd(true)} className="mt-4 btn-primary text-sm inline-flex items-center gap-2">
              <Plus size={16} /> {t.adminPartners.addFirstPartner}
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map(partner => {
            const recv  = totalReceived(partner);
            const sent  = totalSent(partner);
            const tcfg  = TYPE_CONFIG[partner.type];
            const scfg  = STATUS_CFG[partner.status];
            const days  = Math.floor((Date.now() - new Date(partner.partnerSince).getTime()) / 86400000);
            const lastD = partner.transactions.length
              ? partner.transactions.reduce((a, b) => a.date > b.date ? a : b).date
              : null;

            return (
              <div key={partner.id}
                onClick={() => router.push(`/admin/partners/${partner.id}`)}
                className="card p-5 cursor-pointer hover:border-accent-gold/50 hover:shadow-lg transition-all duration-200 group">

                {/* Top */}
                <div className="flex items-start justify-between gap-2 mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${tcfg.bg} ${tcfg.border} border`}>
                      <Building2 size={22} className={tcfg.color} />
                    </div>
                    <div>
                      <p className="text-text-primary font-bold text-sm leading-tight">{partner.name}</p>
                      {partner.contactPerson && (
                        <p className="text-text-muted text-xs mt-0.5 flex items-center gap-1">
                          <User size={10} />{partner.contactPerson}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                    <span className={`text-xs px-2 py-0.5 rounded-full border ${tcfg.bg} ${tcfg.border} ${tcfg.color}`}>
                      {tcfg.label}
                    </span>
                    <span className="flex items-center gap-1 text-xs">
                      <span className={`w-1.5 h-1.5 rounded-full ${scfg.dot}`} />
                      <span className="text-text-muted">{scfg.label}</span>
                    </span>
                  </div>
                </div>

                {/* Meta */}
                <div className="flex flex-wrap gap-x-3 gap-y-1 mb-4 text-xs text-text-muted">
                  {partner.phone && (
                    <span className="flex items-center gap-1"><Phone size={10} />{partner.phone}</span>
                  )}
                  <span className="flex items-center gap-1">
                    <Calendar size={10} />{days} {t.adminPartners.daysPartnerSuffix}
                  </span>
                  {lastD && (
                    <span className="flex items-center gap-1">
                      {t.adminPartners.lastTxPrefix} {new Date(lastD).toLocaleDateString("uz-UZ", { day:"numeric", month:"short" })}
                    </span>
                  )}
                </div>

                {/* Financials */}
                <div className="grid grid-cols-2 gap-2 mb-4">
                  <div className="bg-blue-400/5 border border-blue-400/15 rounded-xl p-3 text-center">
                    <p className="text-blue-400 text-xs mb-0.5 flex items-center justify-center gap-1">
                      <ArrowDown size={10} /> {t.adminPartners.receivedFromThem}
                    </p>
                    <p className="text-blue-400 font-bold text-sm">{formatPrice(recv)}</p>
                  </div>
                  <div className="bg-purple-400/5 border border-purple-400/15 rounded-xl p-3 text-center">
                    <p className="text-purple-400 text-xs mb-0.5 flex items-center justify-center gap-1">
                      <ArrowUp size={10} /> {t.adminPartners.sentToThem}
                    </p>
                    <p className="text-purple-400 font-bold text-sm">{formatPrice(sent)}</p>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-3 border-t border-border/50">
                  <span className="text-text-muted text-xs">{partner.transactions.length} {t.adminPartners.transactionsCountSuffix}</span>
                  <span className="flex items-center gap-1 text-xs text-accent-gold opacity-0 group-hover:opacity-100 transition-opacity font-medium">
                    {t.adminPartners.viewBtn} <ChevronRight size={13} />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Partner Modal */}
      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowAdd(false)} />
          <div className="relative bg-bg-card border border-border rounded-2xl w-full max-w-xl shadow-2xl max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-5 border-b border-border">
              <h3 className="font-bold text-accent-gold flex items-center gap-2">
                <Handshake size={18} /> {t.adminPartners.modalAddTitle}
              </h3>
              <button onClick={() => setShowAdd(false)} className="p-1.5 rounded-lg hover:bg-bg-panel text-text-muted">
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleAdd} className="p-5 space-y-4 overflow-y-auto flex-1">
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2 sm:col-span-1">
                  <label className="text-text-secondary text-sm mb-1.5 block">{t.adminPartners.companyNameLabel} *</label>
                  <input autoFocus required type="text" className="input-field" placeholder={t.adminPartners.companyNamePlaceholder}
                    value={addForm.name} onChange={e => setAddForm(p => ({ ...p, name: e.target.value }))} />
                </div>
                <div>
                  <label className="text-text-secondary text-sm mb-1.5 block">{t.adminPartners.typeLabel}</label>
                  <select className="input-field" value={addForm.type}
                    onChange={e => setAddForm(p => ({ ...p, type: e.target.value as PartnerType }))}>
                    <option value="SUPPLIER">{t.adminPartners.typeSupplier}</option>
                    <option value="BUYER">{t.adminPartners.typeBuyer}</option>
                    <option value="BOTH">{t.adminPartners.typeBoth}</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-text-secondary text-sm mb-1.5 block">{t.adminPartners.phoneLabel}</label>
                  <input type="tel" className="input-field" placeholder="+998901234567"
                    value={addForm.phone} onChange={e => setAddForm(p => ({ ...p, phone: e.target.value }))} />
                </div>
                <div>
                  <label className="text-text-secondary text-sm mb-1.5 block">{t.adminPartners.contactPersonLabel}</label>
                  <input type="text" className="input-field" placeholder={t.adminPartners.contactPersonPlaceholder}
                    value={addForm.contactPerson} onChange={e => setAddForm(p => ({ ...p, contactPerson: e.target.value }))} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-text-secondary text-sm mb-1.5 block">{t.adminPartners.partnerSinceLabel}</label>
                  <input type="date" className="input-field" value={addForm.partnerSince}
                    onChange={e => setAddForm(p => ({ ...p, partnerSince: e.target.value }))} />
                </div>
                <div>
                  <label className="text-text-secondary text-sm mb-1.5 block">{t.adminPartners.statusLabel}</label>
                  <select className="input-field" value={addForm.status}
                    onChange={e => setAddForm(p => ({ ...p, status: e.target.value as "ACTIVE" | "INACTIVE" }))}>
                    <option value="ACTIVE">{t.adminPartners.statusActive}</option>
                    <option value="INACTIVE">{t.adminPartners.statusInactive}</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-text-secondary text-sm mb-1.5 block">{t.adminPartners.emailLabel}</label>
                  <input type="email" className="input-field" placeholder="info@company.uz"
                    value={addForm.email} onChange={e => setAddForm(p => ({ ...p, email: e.target.value }))} />
                </div>
                <div>
                  <label className="text-text-secondary text-sm mb-1.5 block">{t.adminPartners.websiteLabel}</label>
                  <input type="text" className="input-field" placeholder="https://company.uz"
                    value={addForm.website} onChange={e => setAddForm(p => ({ ...p, website: e.target.value }))} />
                </div>
              </div>
              <div>
                <label className="text-text-secondary text-sm mb-1.5 block">{t.adminPartners.addressLabel}</label>
                <input type="text" className="input-field" placeholder={t.adminPartners.addressPlaceholder}
                  value={addForm.address} onChange={e => setAddForm(p => ({ ...p, address: e.target.value }))} />
              </div>
              <div>
                <label className="text-text-secondary text-sm mb-1.5 block">{t.adminPartners.extraInfoLabel}</label>
                <textarea rows={2} className="input-field" placeholder={t.adminPartners.extraInfoPlaceholder}
                  value={addForm.description} onChange={e => setAddForm(p => ({ ...p, description: e.target.value }))} />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowAdd(false)} className="btn-secondary flex-1">
                  {t.adminPartners.cancel}
                </button>
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
