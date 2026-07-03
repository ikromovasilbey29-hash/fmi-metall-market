"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, Eye, X, Save, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import Link from "next/link";
import { useT } from "@/hooks/useT";

const initialPosts = [
  { id: "1", title: "Qurilish uchun to'g'ri armatura qanday tanlanadi?", slug: "armatura-tanlash-qollanma", published: true, date: "20.06.2026", views: 245 },
  { id: "2", title: "2026-yil yozida metall narxlari", slug: "metall-narxlari-2026", published: true, date: "15.06.2026", views: 189 },
  { id: "3", title: "Profil quvur va yumaloq quvur: farqi nima?", slug: "quvur-turlari-farqi", published: true, date: "10.06.2026", views: 134 },
  { id: "4", title: "List temir qalinligini qanday tanlash kerak?", slug: "list-temir-qalinligi", published: false, date: "05.06.2026", views: 0 },
];

type Post = typeof initialPosts[0];

export default function AdminBlogPage() {
  const t = useT();
  const [posts, setPosts] = useState(initialPosts);
  const [showModal, setShowModal] = useState(false);
  const [editPost, setEditPost] = useState<Post | null>(null);
  const [form, setForm] = useState({ title: "", slug: "", published: false });
  const [saving, setSaving] = useState(false);

  const openAdd = () => {
    setEditPost(null);
    setForm({ title: "", slug: "", published: false });
    setShowModal(true);
  };

  const openEdit = (p: Post) => {
    setEditPost(p);
    setForm({ title: p.title, slug: p.slug, published: p.published });
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    if (!confirm(t.adminBlog.confirmDelete)) return;
    setPosts((prev) => prev.filter((p) => p.id !== id));
    toast.success(t.adminBlog.toastDeleted);
  };

  const togglePublish = (id: string) => {
    const post = posts.find((p) => p.id === id);
    setPosts((prev) => prev.map((p) => p.id === id ? { ...p, published: !p.published } : p));
    toast.success(post?.published ? t.adminBlog.toastHidden : t.adminBlog.toastPublished);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await new Promise((r) => setTimeout(r, 500));
    if (editPost) {
      setPosts((prev) => prev.map((p) => p.id === editPost.id ? { ...p, ...form } : p));
      toast.success(t.adminBlog.toastUpdated);
    } else {
      setPosts((prev) => [...prev, { ...form, id: Date.now().toString(), date: new Date().toLocaleDateString("uz-UZ"), views: 0 }]);
      toast.success(t.adminBlog.toastAdded);
    }
    setSaving(false);
    setShowModal(false);
  };

  // Auto slug generator
  const handleTitleChange = (title: string) => {
    const slug = title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
    setForm({ ...form, title, slug });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black text-text-primary">{t.adminBlog.title}</h1>
          <p className="text-text-muted text-sm mt-1">{posts.length} {t.adminBlog.postsCountSuffix}</p>
        </div>
        <button onClick={openAdd} className="btn-primary flex items-center gap-2 text-sm">
          <Plus size={18} /> {t.adminBlog.addPost}
        </button>
      </div>

      <div className="card overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              {[t.adminBlog.tableTitle, t.adminBlog.tableSlug, t.adminBlog.tableViews, t.adminBlog.tableStatus, t.adminBlog.tableDate, ""].map((h) => (
                <th key={h} className="text-left py-4 px-4 text-text-muted text-xs font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => (
              <tr key={post.id} className="border-b border-border/50 hover:bg-bg-panel/50 transition-colors">
                <td className="py-3 px-4">
                  <p className="text-text-primary text-sm font-medium line-clamp-1 max-w-xs">{post.title}</p>
                </td>
                <td className="py-3 px-4 text-text-muted text-xs font-mono">/{post.slug}</td>
                <td className="py-3 px-4 text-text-secondary text-sm">{post.views}</td>
                <td className="py-3 px-4">
                  <button onClick={() => togglePublish(post.id)} className={`text-xs px-2 py-1 rounded-full border transition-all ${
                    post.published
                      ? "bg-green-500/10 text-green-400 border-green-500/20 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20"
                      : "bg-yellow-500/10 text-yellow-400 border-yellow-500/20 hover:bg-green-500/10 hover:text-green-400 hover:border-green-500/20"
                  }`}>
                    {post.published ? t.adminBlog.published : t.adminBlog.draft}
                  </button>
                </td>
                <td className="py-3 px-4 text-text-muted text-xs">{post.date}</td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-1">
                    <Link href={`/blog/${post.slug}`} target="_blank" className="p-1.5 rounded-lg hover:bg-bg-card text-text-muted hover:text-blue-400 transition-all" title={t.adminBlog.view}>
                      <Eye size={15} />
                    </Link>
                    <button onClick={() => openEdit(post)} className="p-1.5 rounded-lg hover:bg-bg-card text-text-muted hover:text-accent-gold transition-all" title={t.adminBlog.edit}>
                      <Pencil size={15} />
                    </button>
                    <button onClick={() => handleDelete(post.id)} className="p-1.5 rounded-lg hover:bg-red-500/10 text-text-muted hover:text-red-400 transition-all" title={t.adminBlog.deletePost}>
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="relative bg-bg-card border border-border rounded-2xl w-full max-w-lg shadow-card animate-slide-up">
            <div className="flex items-center justify-between p-5 border-b border-border">
              <h3 className="font-bold text-text-primary">{editPost ? t.adminBlog.editModalTitle : t.adminBlog.newModalTitle}</h3>
              <button onClick={() => setShowModal(false)} className="p-1.5 rounded-lg hover:bg-bg-panel text-text-muted"><X size={18} /></button>
            </div>
            <form onSubmit={handleSave} className="p-5 space-y-4">
              <div>
                <label className="text-text-secondary text-sm mb-1.5 block">{t.adminBlog.titleLabel}</label>
                <input className="input-field" value={form.title} onChange={(e) => handleTitleChange(e.target.value)} required placeholder={t.adminBlog.titlePlaceholder} />
              </div>
              <div>
                <label className="text-text-secondary text-sm mb-1.5 block">{t.adminBlog.slugLabel}</label>
                <input className="input-field font-mono text-sm" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder={t.adminBlog.slugPlaceholder} />
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} className="w-4 h-4 accent-[#D4AF37]" />
                <span className="text-text-secondary text-sm">{t.adminBlog.publishNowLabel}</span>
              </label>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary flex-1">{t.adminBlog.cancel}</button>
                <button type="submit" className="btn-primary flex-1 flex items-center justify-center gap-2" disabled={saving}>
                  {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                  {editPost ? t.adminBlog.save : t.adminBlog.add}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
