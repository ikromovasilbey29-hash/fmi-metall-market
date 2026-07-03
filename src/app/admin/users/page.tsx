"use client";

import { useState } from "react";
import { Shield, ShieldOff, Eye, X } from "lucide-react";
import toast from "react-hot-toast";
import { useT } from "@/hooks/useT";

const initialUsers = [
  { id: "1", name: "Alisher Karimov", email: "alisher@example.com", phone: "+998 91 234 56 78", orders: 5, role: "USER", blocked: false, date: "15.01.2026" },
  { id: "2", name: "Bobur Toshmatov", email: "bobur@example.com", phone: "+998 93 345 67 89", orders: 3, role: "USER", blocked: false, date: "20.02.2026" },
  { id: "3", name: "Kamola Yusupova", email: "kamola@example.com", phone: "+998 90 456 78 90", orders: 8, role: "USER", blocked: false, date: "05.03.2026" },
  { id: "4", name: "Nodir Rahimov", email: "nodir@example.com", phone: "+998 99 567 89 01", orders: 1, role: "USER", blocked: true, date: "12.04.2026" },
  { id: "5", name: "Admin", email: "admin@fmimetall.uz", phone: "+998 91 000 00 00", orders: 0, role: "ADMIN", blocked: false, date: "01.01.2026" },
];

type User = typeof initialUsers[0];

export default function AdminUsersPage() {
  const [users, setUsers] = useState(initialUsers);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const t = useT();

  const toggleBlock = (id: string) => {
    const user = users.find((u) => u.id === id);
    if (!user) return;
    if (!user.blocked) {
      if (!confirm(`${user.name} ${t.adminUsers.confirmBlock}`)) return;
    }
    const wasBlocked = user.blocked;
    setUsers((prev) => prev.map((u) => u.id === id ? { ...u, blocked: !u.blocked } : u));
    toast.success(wasBlocked ? `${user.name} ${t.adminUsers.toastUnblocked}` : `${user.name} ${t.adminUsers.toastBlocked}`);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black text-text-primary">{t.adminUsers.title}</h1>
          <p className="text-text-muted text-sm mt-1">{users.length} {t.adminUsers.usersCountSuffix}</p>
        </div>
      </div>

      <div className="card overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              {[t.adminUsers.tableName, t.adminUsers.tableEmail, t.adminUsers.tablePhone, t.adminOrders.items, t.adminUsers.tableRole, t.adminUsers.tableDate, ""].map((h) => (
                <th key={h} className="text-left py-4 px-4 text-text-muted text-xs font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className={`border-b border-border/50 hover:bg-bg-panel/50 transition-colors ${user.blocked ? "opacity-60" : ""}`}>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-accent-gold/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-accent-gold font-bold text-xs">{user.name[0]}</span>
                    </div>
                    <div>
                      <p className="text-text-primary text-sm font-medium">{user.name}</p>
                      {user.blocked && <span className="text-xs text-red-400">{t.adminUsers.blocked}</span>}
                    </div>
                  </div>
                </td>
                <td className="py-3 px-4 text-text-secondary text-sm">{user.email}</td>
                <td className="py-3 px-4 text-text-secondary text-sm">{user.phone}</td>
                <td className="py-3 px-4 text-text-primary text-sm font-medium">{user.orders} ta</td>
                <td className="py-3 px-4">
                  <span className={`text-xs px-2 py-1 rounded-full border font-medium ${
                    user.role === "ADMIN" ? "bg-accent-gold/20 text-accent-gold border-accent-gold/30" : "bg-bg-panel text-text-secondary border-border"
                  }`}>
                    {user.role === "ADMIN" ? t.adminUsers.roleAdmin : t.adminUsers.roleUser}
                  </span>
                </td>
                <td className="py-3 px-4 text-text-muted text-xs">{user.date}</td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-1">
                    <button onClick={() => setSelectedUser(user)} className="p-1.5 rounded-lg hover:bg-bg-card text-text-muted hover:text-accent-gold transition-all" title="Ko'rish">
                      <Eye size={15} />
                    </button>
                    {user.role !== "ADMIN" && (
                      <button onClick={() => toggleBlock(user.id)} className={`p-1.5 rounded-lg transition-all ${
                        user.blocked ? "hover:bg-green-500/10 text-text-muted hover:text-green-400" : "hover:bg-red-500/10 text-text-muted hover:text-red-400"
                      }`} title={user.blocked ? "Blokdan chiqarish" : "Bloklash"}>
                        {user.blocked ? <Shield size={15} /> : <ShieldOff size={15} />}
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Foydalanuvchi detail modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedUser(null)} />
          <div className="relative bg-bg-card border border-border rounded-2xl w-full max-w-sm shadow-card animate-slide-up">
            <div className="flex items-center justify-between p-5 border-b border-border">
              <h3 className="font-bold text-text-primary">{t.adminUsers.detailsModalTitle}</h3>
              <button onClick={() => setSelectedUser(null)} className="p-1.5 rounded-lg hover:bg-bg-panel text-text-muted"><X size={18} /></button>
            </div>
            <div className="p-5 space-y-3">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 bg-accent-gold/20 rounded-full flex items-center justify-center">
                  <span className="text-accent-gold font-black text-xl">{selectedUser.name[0]}</span>
                </div>
                <div>
                  <p className="text-text-primary font-bold">{selectedUser.name}</p>
                  <p className="text-text-muted text-sm">{selectedUser.role === "ADMIN" ? t.adminUsers.roleAdmin : t.adminUsers.roleUser}</p>
                </div>
              </div>
              {[
                { label: t.common.email, value: selectedUser.email },
                { label: t.common.phone, value: selectedUser.phone },
                { label: t.adminUsers.ordersLabel, value: `${selectedUser.orders} ta` },
                { label: t.adminUsers.registeredLabel, value: selectedUser.date },
                { label: t.adminUsers.statusLabel, value: selectedUser.blocked ? t.adminUsers.blocked : t.adminUsers.activeStatus },
              ].map((item) => (
                <div key={item.label} className="flex justify-between py-2 border-b border-border/50">
                  <span className="text-text-muted text-sm">{item.label}</span>
                  <span className="text-text-primary text-sm font-medium">{item.value}</span>
                </div>
              ))}
              {selectedUser.role !== "ADMIN" && (
                <button
                  onClick={() => { toggleBlock(selectedUser.id); setSelectedUser(null); }}
                  className={`w-full mt-2 py-2.5 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-all ${
                    selectedUser.blocked
                      ? "bg-green-500/10 border border-green-500/30 text-green-400 hover:bg-green-500/20"
                      : "bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20"
                  }`}
                >
                  {selectedUser.blocked ? <><Shield size={16} /> {t.adminUsers.unblockBtn}</> : <><ShieldOff size={16} /> {t.adminUsers.blockBtn}</>}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
