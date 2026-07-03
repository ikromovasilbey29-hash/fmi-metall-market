"use client";

import { useState, useMemo } from "react";
import {
  CalendarDays,
  CheckCircle2,
  XCircle,
  Clock,
  AlertCircle,
  Save,
  Loader2,
  Settings,
  X,
} from "lucide-react";
import { useHRStore } from "@/store/hrStore";
import toast from "react-hot-toast";
import { useT } from "@/hooks/useT";

type AttendanceStatus = "present" | "absent" | "late" | "half";

function getStatusConfig(t: ReturnType<typeof useT>) {
  return {
    present: { label: t.adminHr.statusPresent, color: "text-green-400", bg: "bg-green-500/10 border-green-500/20", icon: CheckCircle2 },
    absent: { label: t.adminHr.statusAbsent, color: "text-red-400", bg: "bg-red-500/10 border-red-500/20", icon: XCircle },
    late: { label: t.adminHr.statusLate, color: "text-yellow-400", bg: "bg-yellow-500/10 border-yellow-500/20", icon: Clock },
    half: { label: t.adminHr.statusHalf, color: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/20", icon: AlertCircle },
  } as const;
}

export default function HRAttendancePage() {
  const t = useT();
  const statusConfig = getStatusConfig(t);
  const { employees, attendance, markAttendance } = useHRStore();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [saving, setSaving] = useState(false);

  // Ish vaqti sozlamalari
  const [workStartTime, setWorkStartTime] = useState("08:00");
  const [showWorkTimeModal, setShowWorkTimeModal] = useState(false);
  const [tempWorkTime, setTempWorkTime] = useState("08:00");

  // Kechikish vaqti modali
  const [lateModal, setLateModal] = useState<{ empId: string; empName: string } | null>(null);
  const [lateTime, setLateTime] = useState("");
  const [lateTimeError, setLateTimeError] = useState("");

  const activeEmployees = employees.filter((e) => e.status === "active");

  // Joriy sana davomati
  const todayAttendance = useMemo(
    () => attendance.filter((a) => a.date === selectedDate),
    [attendance, selectedDate]
  );

  const getRecord = (empId: string) => todayAttendance.find((a) => a.employeeId === empId);
  const [marks, setMarks] = useState<Record<string, { status: AttendanceStatus; checkIn?: string }>>({});

  // Status belgilash
  const handleMark = (empId: string, empName: string, status: AttendanceStatus) => {
    if (status === "late") {
      // Kechikish uchun vaqt so'raymiz
      setLateTime("");
      setLateTimeError("");
      setLateModal({ empId, empName });
      return;
    }
    setMarks((prev) => ({ ...prev, [empId]: { status } }));
  };

  // Kechikish vaqtini tasdiqlash
  const confirmLateTime = () => {
    if (!lateModal) return;
    if (!lateTime) { setLateTimeError(t.adminHr.toastEnterTime); return; }

    // Ish boshlanish vaqtidan oldin bo'lmasligi kerak
    const [wH, wM] = workStartTime.split(":").map(Number);
    const [lH, lM] = lateTime.split(":").map(Number);
    const workMinutes = wH * 60 + wM;
    const lateMinutes = lH * 60 + lM;

    if (lateMinutes <= workMinutes) {
      setLateTimeError(`${t.adminHr.toastLateAfterStartPrefix}${workStartTime}${t.adminHr.toastLateAfterStartSuffix}`);
      return;
    }

    setMarks((prev) => ({ ...prev, [lateModal.empId]: { status: "late", checkIn: lateTime } }));
    setLateModal(null);
    toast.success(`${lateModal.empName} — ${lateTime} ${t.adminHr.toastLateArrivalSuffix}`);
  };

  // Saqlash
  const handleSaveAll = async () => {
    if (Object.keys(marks).length === 0) { toast.error(t.adminHr.toastNothingMarked); return; }
    setSaving(true);
    await new Promise((r) => setTimeout(r, 500));
    Object.entries(marks).forEach(([empId, data]) => {
      markAttendance({ employeeId: empId, date: selectedDate, status: data.status, checkIn: data.checkIn });
    });
    setMarks({});
    setSaving(false);
    toast.success(t.adminHr.toastAttendanceSaved);
  };

  // Statistika
  const stats = useMemo(() => {
    const all = [...todayAttendance];
    return {
      present: all.filter((a) => a.status === "present").length,
      absent: all.filter((a) => a.status === "absent").length,
      late: all.filter((a) => a.status === "late").length,
      half: all.filter((a) => a.status === "half").length,
    };
  }, [todayAttendance]);

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black text-text-primary flex items-center gap-3">
            <CalendarDays size={28} className="text-purple-400" /> {t.adminHr.attendanceTitle}
          </h1>
          <p className="text-text-muted text-sm mt-1">
            {t.adminHr.workStartTimeLabel}{" "}
            <span className="text-accent-gold font-semibold">{workStartTime}</span>
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* Ish vaqti sozlash tugmasi */}
          <button
            onClick={() => { setTempWorkTime(workStartTime); setShowWorkTimeModal(true); }}
            className="flex items-center gap-2 px-4 py-2.5 bg-bg-card border border-border hover:border-accent-gold/40 text-text-secondary hover:text-accent-gold text-sm font-medium rounded-xl transition-all"
          >
            <Settings size={16} />
            {t.adminHr.setWorkTimeBtn}
          </button>
          <input
            type="date"
            className="input-field text-sm"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
          {Object.keys(marks).length > 0 && (
            <button onClick={handleSaveAll} className="btn-primary flex items-center gap-2 text-sm" disabled={saving}>
              {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              {t.adminHr.save} ({Object.keys(marks).length})
            </button>
          )}
        </div>
      </div>

      {/* Statistika */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {(Object.entries(statusConfig) as [AttendanceStatus, typeof statusConfig[AttendanceStatus]][]).map(([key, cfg]) => {
          const Icon = cfg.icon;
          return (
            <div key={key} className="card p-4 flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${cfg.bg}`}>
                <Icon size={18} className={cfg.color} />
              </div>
              <div>
                <p className={`text-xl font-black ${cfg.color}`}>{stats[key]}</p>
                <p className="text-text-muted text-xs">{cfg.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Davomat jadvali */}
      <div className="card overflow-hidden">
        <div className="p-4 border-b border-border bg-bg-panel flex items-center justify-between">
          <p className="text-text-primary font-semibold text-sm">
            {new Date(selectedDate).toLocaleDateString("uz-UZ", {
              weekday: "long", day: "numeric", month: "long", year: "numeric",
            })}
          </p>
          <p className="text-text-muted text-xs">{activeEmployees.length} {t.adminHr.activeEmployeesCount}</p>
        </div>

        <div className="divide-y divide-border">
          {activeEmployees.map((emp) => {
            const saved = getRecord(emp.id);
            const current = marks[emp.id]?.status || (saved?.status as AttendanceStatus | undefined);
            const currentCheckIn = marks[emp.id]?.checkIn || saved?.checkIn;

            return (
              <div key={emp.id} className="flex items-center gap-4 px-5 py-3 hover:bg-bg-panel/30 transition-colors">
                {/* Avatar */}
                <div className="w-9 h-9 bg-purple-400/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-purple-400 font-bold text-sm">{emp.name[0]}</span>
                </div>

                {/* Ism va lavozim */}
                <div className="flex-1 min-w-0">
                  <p className="text-text-primary text-sm font-medium">{emp.name}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <p className="text-text-muted text-xs">{emp.position} · {emp.department}</p>
                    {/* Kechikish vaqti ko'rsatish */}
                    {current === "late" && currentCheckIn && (
                      <span className="text-xs text-yellow-400 bg-yellow-500/10 border border-yellow-500/20 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Clock size={10} />
                        {currentCheckIn} {t.adminHr.arrivedAt}
                      </span>
                    )}
                  </div>
                </div>

                {/* Status tugmalari */}
                <div className="flex gap-1.5 flex-wrap justify-end">
                  {(Object.entries(statusConfig) as [AttendanceStatus, typeof statusConfig[AttendanceStatus]][]).map(([key, cfg]) => (
                    <button
                      key={key}
                      onClick={() => handleMark(emp.id, emp.name, key)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                        current === key
                          ? `${cfg.bg} ${cfg.color}`
                          : "border-border text-text-muted hover:border-border-light bg-bg-panel"
                      }`}
                    >
                      {cfg.label}
                    </button>
                  ))}
                </div>

                {saved && !marks[emp.id] && (
                  <span className="text-text-muted text-xs flex-shrink-0">✓</span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ===== Ish vaqtini belgilash modali ===== */}
      {showWorkTimeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowWorkTimeModal(false)} />
          <div className="relative bg-bg-card border border-border rounded-2xl w-full max-w-sm shadow-card animate-slide-up">
            <div className="flex items-center justify-between p-5 border-b border-border">
              <h3 className="font-bold text-text-primary flex items-center gap-2">
                <Settings size={18} className="text-accent-gold" />
                {t.adminHr.workTimeModalTitle}
              </h3>
              <button onClick={() => setShowWorkTimeModal(false)} className="p-1.5 rounded-lg hover:bg-bg-panel text-text-muted">
                <X size={18} />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <p className="text-text-muted text-sm">
                {t.adminHr.workTimeModalDesc}
              </p>
              <div>
                <label className="text-text-secondary text-sm mb-1.5 block">{t.adminHr.workStartInputLabel}</label>
                <input
                  type="time"
                  className="input-field text-lg font-bold text-accent-gold"
                  value={tempWorkTime}
                  onChange={(e) => setTempWorkTime(e.target.value)}
                  autoFocus
                />
              </div>
              <div className="flex gap-3">
                <button onClick={() => setShowWorkTimeModal(false)} className="btn-secondary flex-1">
                  {t.adminHr.cancel}
                </button>
                <button
                  onClick={() => {
                    setWorkStartTime(tempWorkTime);
                    setShowWorkTimeModal(false);
                    toast.success(`${t.adminHr.toastWorkTimeSetPrefix}${tempWorkTime}${t.adminHr.toastWorkTimeSetSuffix}`);
                  }}
                  className="btn-primary flex-1 flex items-center justify-center gap-2"
                >
                  <Save size={16} />
                  {t.adminHr.save}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===== Kechikish vaqti modali ===== */}
      {lateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setLateModal(null)} />
          <div className="relative bg-bg-card border border-border rounded-2xl w-full max-w-sm shadow-card animate-slide-up">
            <div className="flex items-center justify-between p-5 border-b border-border">
              <h3 className="font-bold text-yellow-400 flex items-center gap-2">
                <Clock size={18} />
                {t.adminHr.lateModalTitle}
              </h3>
              <button onClick={() => setLateModal(null)} className="p-1.5 rounded-lg hover:bg-bg-panel text-text-muted">
                <X size={18} />
              </button>
            </div>
            <div className="p-5 space-y-4">
              {/* Xodim */}
              <div className="flex items-center gap-3 p-3 bg-bg-panel rounded-xl">
                <div className="w-9 h-9 bg-purple-400/20 rounded-full flex items-center justify-center">
                  <span className="text-purple-400 font-bold text-sm">{lateModal.empName[0]}</span>
                </div>
                <div>
                  <p className="text-text-primary font-semibold text-sm">{lateModal.empName}</p>
                  <p className="text-text-muted text-xs">{t.adminHr.workStartsAt} {workStartTime}</p>
                </div>
              </div>

              <div>
                <label className="text-text-secondary text-sm mb-1.5 block">
                  {t.adminHr.whenArrivedLabel} *
                </label>
                <input
                  type="time"
                  className={`input-field text-lg font-bold ${lateTimeError ? "border-red-400" : "text-yellow-400"}`}
                  value={lateTime}
                  onChange={(e) => { setLateTime(e.target.value); setLateTimeError(""); }}
                  min={workStartTime}
                  autoFocus
                />
                {lateTimeError && (
                  <p className="text-red-400 text-xs mt-1.5 flex items-center gap-1">
                    <AlertCircle size={12} />
                    {lateTimeError}
                  </p>
                )}
                {lateTime && !lateTimeError && (
                  <p className="text-yellow-400 text-xs mt-1.5">
                    {t.adminHr.lateDelay}{" "}
                    {(() => {
                      const [wH, wM] = workStartTime.split(":").map(Number);
                      const [lH, lM] = lateTime.split(":").map(Number);
                      const diff = (lH * 60 + lM) - (wH * 60 + wM);
                      if (diff <= 0) return "";
                      const h = Math.floor(diff / 60);
                      const m = diff % 60;
                      return h > 0 ? `${h} ${t.adminHr.hourLabel} ${m} ${t.adminHr.minuteLabel}` : `${m} ${t.adminHr.minuteLabel}`;
                    })()}
                  </p>
                )}
              </div>

              <div className="flex gap-3">
                <button onClick={() => setLateModal(null)} className="btn-secondary flex-1">
                  {t.adminHr.cancel}
                </button>
                <button
                  onClick={confirmLateTime}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm bg-yellow-500/20 border border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/30 transition-all"
                >
                  <CheckCircle2 size={16} />
                  {t.adminHr.confirmBtn}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
