import Link from "next/link";
import { getDashboardStats } from "@/actions/glass.actions";
import { TAG_TAXONOMY } from "@/config/tags";
import { Card, CardContent } from "@/components/ui/card";
import {
  Package,
  Archive,
  TrendingUp,
  Clock,
  ArrowRight,
  BarChart3,
  Home,
  Plus,
  Search,
  Sparkles
} from "lucide-react";

export const revalidate = 0;

export default async function MobileFirstDashboard() {
  const statsRes = await getDashboardStats();
  const stats = statsRes.success && statsRes.data ? statsRes.data : {
    totalCount: 0,
    todayCount: 0,
    totalBoxes: 0,
    recentActivity: [],
    tagCounts: {} as Record<string, number>
  };

  const getProgressWidth = (count: number, max: number) => {
    if (max === 0) return 0;
    return Math.min(Math.round((count / max) * 100), 100);
  };

  return (
    <div className="max-w-md mx-auto min-h-screen bg-zinc-50 font-sans pb-24 relative shadow-2xl overflow-hidden">
      
      {/* 🏙️ Mobile Header */}
      <header className="bg-white px-5 py-4 border-b border-zinc-100 sticky top-0 z-10 flex justify-between items-center backdrop-blur-md bg-white/90">
        <div className="flex items-center gap-2">
          <div className="bg-zinc-900 p-1.5 rounded-lg shadow-sm">
            <Package size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-base font-extrabold text-zinc-900 tracking-tight leading-none">LUQREN</h1>
            <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider mt-0.5">Inventory</p>
          </div>
        </div>
      </header>

      <main className="p-4 space-y-5">
        
        <section className="space-y-3">
          <Card className="border-zinc-200/80 shadow-sm bg-gradient-to-br from-zinc-900 to-zinc-800 text-white overflow-hidden relative">
            <div className="absolute -right-4 -top-4 opacity-10">
              <Package size={100} />
            </div>
            <CardContent className="p-5 relative z-10">
              <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-1">แว่นตาทั้งหมดในคลัง</p>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-black tracking-tighter">{stats.totalCount.toLocaleString()}</span>
                <span className="text-sm font-semibold text-zinc-400">ชิ้น</span>
              </div>
            </CardContent>
          </Card>

          {/* การ์ดรอง (แบ่ง 2 คอลัมน์) */}
          <div className="grid grid-cols-2 gap-3">
            <Card className="border-zinc-200/80 shadow-sm bg-white">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 text-zinc-500 mb-2">
                  <Archive size={14} />
                  <span className="text-[10px] font-bold uppercase tracking-widest">กล่องจัดเก็บ</span>
                </div>
                <div className="text-2xl font-extrabold text-zinc-900">
                  {stats.totalBoxes.toLocaleString()} <span className="text-xs text-zinc-400 font-medium">กล่อง</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-emerald-200/60 shadow-sm bg-emerald-50/50">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 text-emerald-600 mb-2">
                  <TrendingUp size={14} />
                  <span className="text-[10px] font-bold uppercase tracking-widest">นำเข้าวันนี้</span>
                </div>
                <div className="text-2xl font-extrabold text-emerald-700">
                  +{stats.todayCount.toLocaleString()} <span className="text-xs opacity-70 font-medium">ชิ้น</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* 📈 โซนสถิติเชิงลึก (Analytics) แบบแนบชิดติดจอมือถือ */}
        <section className="space-y-3">
          <h2 className="text-xs font-bold text-zinc-800 uppercase tracking-wider flex items-center gap-1.5 pl-1">
            <BarChart3 size={14} className="text-zinc-400" /> สัดส่วนสินค้า (Top Tags)
          </h2>
          
          <div className="grid gap-3">
            {TAG_TAXONOMY.slice(0, 3).map((category) => {
              const maxCount = Math.max(...category.tags.map(t => stats.tagCounts[t] || 0));
              
              // ดึงแค่ Top 3 ของแต่ละหมวดมาแสดง จะได้ไม่ล้นจอ
              const topTags = category.tags
                .map(tag => ({ name: tag, count: stats.tagCounts[tag] || 0 }))
                .filter(item => item.count > 0)
                .sort((a, b) => b.count - a.count)
                .slice(0, 3);

              if (topTags.length === 0) return null;

              return (
                <Card key={category.id} className="border-zinc-200/60 shadow-sm">
                  <CardContent className="p-4">
                    <h3 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-3">
                      {category.label}
                    </h3>
                    <div className="space-y-3">
                      {topTags.map(item => (
                        <div key={item.name} className="space-y-1.5">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-semibold text-zinc-700">{item.name}</span>
                            <span className="font-bold text-zinc-900">{item.count.toLocaleString()}</span>
                          </div>
                          <div className="w-full bg-zinc-100 rounded-full h-1.5 overflow-hidden">
                            <div 
                              className="bg-zinc-900 h-full rounded-full transition-all" 
                              style={{ width: `${getProgressWidth(item.count, maxCount)}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </section>

        {/* ⚡ โซนความเคลื่อนไหวล่าสุด (Activity Feed) */}
        <section className="space-y-3 pt-2">
          <h2 className="text-xs font-bold text-zinc-800 uppercase tracking-wider flex items-center gap-1.5 pl-1">
            <Clock size={14} className="text-zinc-400" /> รายการล่าสุด
          </h2>
          
          <Card className="border-zinc-200/60 shadow-sm overflow-hidden">
            <div className="divide-y divide-zinc-100">
              {stats.recentActivity.length > 0 ? (
                stats.recentActivity.map((glass) => (
                  <div key={glass.id} className="p-3.5 bg-white">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-sm font-extrabold text-zinc-900 uppercase tracking-tight">
                        {glass.box_id}
                      </span>
                      <span className="text-[10px] font-bold text-zinc-400">
                        {new Date(glass.created_at).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {glass.tags.slice(0, 3).map(tag => (
                        <span key={tag} className="text-[9px] px-1.5 py-0.5 bg-zinc-100 text-zinc-600 rounded font-semibold">
                          {tag}
                        </span>
                      ))}
                      {glass.tags.length > 3 && (
                        <span className="text-[9px] px-1.5 py-0.5 text-zinc-400 font-bold">
                          +{glass.tags.length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-zinc-400 flex flex-col items-center gap-2">
                  <Sparkles size={20} className="opacity-50" />
                  <p className="text-xs font-medium">ยังไม่มีข้อมูลสินค้านำเข้า</p>
                </div>
              )}
            </div>
            {stats.recentActivity.length > 0 && (
              <Link href="/search" className="w-full p-3 bg-zinc-50 border-t border-zinc-100 flex items-center justify-center gap-1.5 text-[11px] font-bold text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 transition-colors">
                เปิดระบบค้นหา <ArrowRight size={12} />
              </Link>
            )}
          </Card>
        </section>
      </main>

      {/* 🚀 Mobile Bottom Navigation (จุดแข็งที่สุดของแอปมือถือ) */}
      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white border-t border-zinc-200 px-6 py-2 pb-safe flex justify-between items-center z-50 shadow-[0_-10px_20px_rgba(0,0,0,0.03)]">
        {/* ปุ่ม แดชบอร์ด (Active) */}
        <Link href="/" className="flex flex-col items-center gap-1 p-2 min-w-[64px] text-zinc-900">
          <div className="relative">
            <Home size={22} className="stroke-[2.5]" />
            <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 bg-zinc-900 rounded-full" />
          </div>
          <span className="text-[10px] font-bold mt-1">หน้าหลัก</span>
        </Link>

        {/* ปุ่ม นำเข้าสต๊อก (Floating Action Button Style) */}
        <Link href="/add" className="flex flex-col items-center -mt-6">
          <div className="bg-zinc-900 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg shadow-zinc-900/20 border-4 border-white active:scale-95 transition-transform">
            <Plus size={28} className="stroke-[2.5]" />
          </div>
          <span className="text-[10px] font-bold text-zinc-500 mt-1">นำเข้า</span>
        </Link>

        {/* ปุ่ม ค้นหาสินค้า */}
        <Link href="/search" className="flex flex-col items-center gap-1 p-2 min-w-[64px] text-zinc-400 hover:text-zinc-900 transition-colors">
          <Search size={22} className="stroke-[2.5]" />
          <span className="text-[10px] font-bold mt-1">ค้นหา</span>
        </Link>
      </nav>

    </div>
  );
}