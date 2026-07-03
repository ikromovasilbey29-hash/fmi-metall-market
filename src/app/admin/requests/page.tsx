"use client";

import { useState } from "react";
import {
  MessageSquare,
  CheckCircle2,
  Clock,
  X,
  Send,
  Loader2,
  Phone,
  User,
  Calendar,
} from "lucide-react";
import { useSupportStore } from "@/store/supportStore";
import { useNotificationStore } from "@/store/notificationStore";
import toast from "react-hot-toast";
import { useT } from "@/hooks/useT";

export default function AdminRequestsPage() {
  const t = useT();
  const statusFilters = [
    { value: "all", label: t.adminRequests.filterAll },
    { value: "new", label: t.adminRequests.new },
    { value: "answered", label: t.adminRequests.replied },
  ];
  const { requests, answerRequest } = useSupportStore();
  const { addNotification } = useNotificationStore();

  const [filter, setFilter] = useState("all");
  const [selectedReq, setSelectedReq] = useState<string | null>(null);
  const [answer, setAnswer] = useState("");
  const [sending, setSending] = useState(false);

  const filtered = requests.filter((r) => {
    if (filter === "new") return r.status === "new";
    if (filter === "answered") return r.status === "answered";
    return true;
  });

  const selected = requests.find((r) => r.id === selectedReq);
  const newCount = requests.filter((r) => r.status === "new").length;

  const handleAnswer = async () => {
    if (!answer.trim() || !selected) return;
    setSending(true);
    await new Promise((r) => setTimeout(r, 600));

    // So'rovga javob berish
    answerRequest(selected.id, answer);

    // Mijozning bildirishnomalariga javob qo'shish
    if (addNotification) {
      addNotification({
        title: `${t.adminRequests.notificationTitlePrefix}${selected.subject}`,
        message: answer,
        type: "support",
        userId: selected.userId,
      });
    }

    setSending(false);
    setAnswer("");
    setSelectedReq(null);
    toast.success(t.adminRequests.toastReplySentWithNotif);
  };

  return (
    <div className="flex gap-6 h-full">
      {/* So'rovlar ro'yxati */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-black text-text-primary flex items-center gap-3">
              <MessageSquare size={28} className="text-accent-gold" />
              {t.adminRequests.title}
            </h1>
            <p className="text-text-muted text-sm mt-1">
              {newCount > 0 ? (
                <span className="text-accent-gold font-medium">{newCount} {t.adminRequests.newRequestsSuffix}</span>
              ) : (
                t.adminRequests.allReviewed
              )}
            </p>
          </div>
        </div>

        {/* Filter */}
        <div className="flex gap-2 mb-5">
          {statusFilters.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`px-4 py-1.5 rounded-lg text-sm transition-all ${
                filter === f.value
                  ? "bg-accent-gold text-bg-primary font-medium"
                  : "bg-bg-card border border-border text-text-secondary hover:text-text-primary"
              }`}
            >
              {f.label}
              {f.value === "new" && newCount > 0 && (
                <span className="ml-1.5 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                  {newCount}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* So'rovlar */}
        {filtered.length === 0 ? (
          <div className="card p-16 text-center">
            <MessageSquare size={48} className="text-text-muted opacity-30 mx-auto mb-4" />
            <p className="text-text-secondary font-semibold">{t.adminRequests.noRequestsYet}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((req) => (
              <div
                key={req.id}
                onClick={() => { setSelectedReq(req.id); setAnswer(""); }}
                className={`card p-4 cursor-pointer hover:border-accent-gold/30 transition-all ${
                  selectedReq === req.id ? "border-accent-gold/50 bg-accent-gold/5" : ""
                } ${req.status === "new" ? "border-l-2 border-l-blue-400" : ""}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${
                        req.status === "new"
                          ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
                          : "bg-green-500/10 text-green-400 border-green-500/20"
                      }`}>
                        {req.status === "new" ? t.adminRequests.new : t.adminRequests.replied}
                      </span>
                      <span className="text-text-muted text-xs">{req.subject}</span>
                    </div>
                    <p className="text-text-primary font-semibold text-sm">{req.userName}</p>
                    <p className="text-text-muted text-xs mt-0.5 line-clamp-2">{req.message}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-text-muted text-xs">
                      {new Date(req.createdAt).toLocaleDateString("uz-UZ", {
                        day: "numeric", month: "short",
                      })}
                    </p>
                    {req.status === "new" ? (
                      <Clock size={14} className="text-blue-400 mt-1 ml-auto" />
                    ) : (
                      <CheckCircle2 size={14} className="text-green-400 mt-1 ml-auto" />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Detail / Javob paneli */}
      {selected ? (
        <div className="w-96 flex-shrink-0">
          <div className="card flex flex-col sticky top-8" style={{ maxHeight: "calc(100vh - 120px)" }}>
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border flex-shrink-0">
              <h3 className="font-bold text-text-primary text-sm">{t.adminRequests.detailsTitle}</h3>
              <button onClick={() => setSelectedReq(null)} className="p-1.5 rounded-lg hover:bg-bg-panel text-text-muted">
                <X size={16} />
              </button>
            </div>

            {/* Mijoz ma'lumotlari */}
            <div className="p-4 border-b border-border space-y-2 flex-shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-accent-gold/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <User size={14} className="text-accent-gold" />
                </div>
                <div>
                  <p className="text-text-primary font-semibold text-sm">{selected.userName}</p>
                  <p className="text-text-muted text-xs flex items-center gap-1">
                    <Phone size={11} /> {selected.userPhone}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-text-muted text-xs">
                <Calendar size={12} />
                {new Date(selected.createdAt).toLocaleString("uz-UZ")}
              </div>
              <div className="bg-bg-panel rounded-lg px-3 py-1.5">
                <p className="text-text-muted text-xs">{t.adminRequests.subjectLabel}</p>
                <p className="text-accent-gold text-sm font-medium">{selected.subject}</p>
              </div>
            </div>

            {/* Xabar */}
            <div className="p-4 border-b border-border flex-shrink-0">
              <p className="text-text-muted text-xs mb-1">{t.adminRequests.customerMessageLabel}</p>
              <p className="text-text-primary text-sm leading-relaxed bg-bg-panel rounded-lg p-3">
                {selected.message}
              </p>
            </div>

            {/* Avvalgi javob */}
            {selected.answer && (
              <div className="p-4 border-b border-border flex-shrink-0">
                <p className="text-text-muted text-xs mb-1 flex items-center gap-1">
                  <CheckCircle2 size={12} className="text-green-400" />
                  {t.adminRequests.givenAnswerLabel}
                </p>
                <p className="text-green-400 text-sm leading-relaxed bg-green-500/5 border border-green-500/20 rounded-lg p-3">
                  {selected.answer}
                </p>
                <p className="text-text-muted text-xs mt-1">
                  {selected.answeredAt && new Date(selected.answeredAt).toLocaleString("uz-UZ")}
                </p>
              </div>
            )}

            {/* Javob yozish */}
            <div className="p-4 flex-1 flex flex-col gap-3">
              <p className="text-text-secondary text-sm font-medium">
                {selected.status === "answered" ? t.adminRequests.rewriteAnswer : t.adminRequests.writeAnswer}
              </p>
              <textarea
                className="input-field resize-none flex-1 text-sm"
                rows={4}
                placeholder={t.adminRequests.replyPlaceholder}
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
              />
              <button
                onClick={handleAnswer}
                disabled={!answer.trim() || sending}
                className="btn-primary w-full flex items-center justify-center gap-2"
              >
                {sending
                  ? <><Loader2 size={16} className="animate-spin" /> {t.adminRequests.sending}</>
                  : <><Send size={16} /> {t.adminRequests.sendReply}</>
                }
              </button>
              <p className="text-text-muted text-xs text-center">
                {t.adminRequests.notifyHint}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="w-96 flex-shrink-0">
          <div className="card p-10 text-center sticky top-8">
            <MessageSquare size={40} className="text-text-muted opacity-30 mx-auto mb-3" />
            <p className="text-text-muted text-sm">{t.adminRequests.selectRequestHint}</p>
          </div>
        </div>
      )}
    </div>
  );
}
