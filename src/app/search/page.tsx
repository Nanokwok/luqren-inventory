"use client";

import { useState, useEffect } from "react";
import { searchGlasses, deleteGlass } from "@/actions/glass.actions";
import { TAG_TAXONOMY } from "@/config/tags";
import { Glass } from "@/types/inventory";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import {
  Search,
  FolderOpen,
  RefreshCw,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  Layers,
  PackageSearch,
  PackageX,
  Loader2,
  Trash2
} from "lucide-react";

export default function AdvancedSearchPage() {
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [results, setResults] = useState<Glass[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isFilterExpanded, setIsFilterExpanded] = useState<boolean>(true);
  const [isDeleting, setIsDeleting] = useState<string | null>(null); // State ดักว่ากำลังลบ ID ไหนอยู่

  const toggleFilter = (tag: string): void => {
    setActiveFilters((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  };

  const clearAllFilters = (): void => {
    setActiveFilters([]);
    setResults([]);
  };

  // 🗑️ ฟังก์ชันจัดการการลบข้อมูล
  const handleDelete = async (id: string, boxId: string) => {
    // 1. ดักถามเพื่อความชัวร์ ป้องกันนิ้วเบียด
    if (!window.confirm(`⚠️ คุณแน่ใจหรือไม่ว่าต้องการลบแว่นตาในกล่อง ${boxId}?\nการกระทำนี้ไม่สามารถย้อนกลับได้`)) {
      return;
    }

    setIsDeleting(id);
    const loadingToast = toast.loading(`กำลังลบข้อมูลกล่อง ${boxId}...`);
    
    // 2. ยิงคำสั่งไปที่ Server
    const res = await deleteGlass(id);
    
    if (res.success) {
      toast.success(`ลบข้อมูลกล่อง ${boxId} เรียบร้อยแล้ว`, { id: loadingToast });
      // 3. อัปเดตหน้าจอทันที (ลบการ์ดใบนั้นออกโดยไม่ต้องรีเฟรชหน้า)
      setResults((prev) => prev.filter((glass) => glass.id !== id));
    } else {
      toast.error(`เกิดข้อผิดพลาด: ${res.error}`, { id: loadingToast });
    }
    
    setIsDeleting(null);
  };

  useEffect(() => {
    let ignore = false;

    const fetchResults = async () => {
      if (activeFilters.length === 0) {
        if (!ignore) {
          setResults([]);
          setIsLoading(false);
        }
        return;
      }
      
      setIsLoading(true);
      const res = await searchGlasses(activeFilters);
      
      if (!ignore) {
        if (res.success && res.data) {
          setResults(res.data);
        } else {
          setResults([]);
        }
        setIsLoading(false);
      }
    };

    const delayDebounce = setTimeout(() => {
      fetchResults();
    }, 300);

    return () => {
      clearTimeout(delayDebounce);
      ignore = true;
    };
  }, [activeFilters]);

  return (
    <div className="max-w-md mx-auto min-h-screen bg-zinc-50 font-sans pb-12 antialiased">
      {/* Header */}
      <div className="bg-white border-b border-zinc-100 shadow-sm sticky top-0 z-50 px-4 py-3.5 flex items-center justify-between backdrop-blur-md bg-white/90">
        <div className="flex items-center gap-2.5">
          <div className="bg-zinc-950 text-white p-2 rounded-xl shadow-md shadow-zinc-950/10">
            <Search size={18} className="stroke-[2.5]" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-zinc-900 tracking-tight">
              ระบบค้นหาสต๊อก
            </h1>
            <p className="text-[11px] text-zinc-400 font-medium">
              ค้นหาและจัดการพิกัดแว่นตา
            </p>
          </div>
        </div>

        {activeFilters.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="text-xs font-semibold text-rose-500 hover:text-rose-600 hover:bg-rose-50 h-8 px-2.5 rounded-lg transition-colors"
          >
            <RefreshCw size={12} className="mr-1.5" /> ล้างออก
          </Button>
        )}
      </div>

      {/* Filter Section */}
      <div className="p-4">
        <div className="bg-white border border-zinc-200/80 rounded-2xl shadow-sm overflow-hidden transition-all duration-200">
          <button
            onClick={() => setIsFilterExpanded(!isFilterExpanded)}
            className="w-full px-4 py-3 bg-zinc-50/50 flex items-center justify-between border-b border-zinc-100 active:bg-zinc-100/50 transition-colors focus:outline-none focus:ring-2 focus:ring-inset focus:ring-zinc-900/10"
          >
            <div className="flex items-center gap-2 text-zinc-700">
              <SlidersHorizontal
                size={14}
                className="text-zinc-400 stroke-[2.5]"
              />
              <span className="text-xs font-bold uppercase tracking-wider">
                ตัวเลือกตัวกรอง ({activeFilters.length})
              </span>
            </div>
            <div className="flex items-center gap-2">
              {activeFilters.length > 0 && !isFilterExpanded && (
                <div className="flex gap-1 max-w-[180px] truncate">
                  {activeFilters.map((t) => (
                    <span
                      key={t}
                      className="text-[10px] bg-zinc-900 text-white px-1.5 py-0.5 rounded-md font-medium"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              )}
              {isFilterExpanded ? (
                <ChevronUp size={16} className="text-zinc-400" />
              ) : (
                <ChevronDown size={16} className="text-zinc-400" />
              )}
            </div>
          </button>

          {isFilterExpanded && (
            <div className="p-3 divide-y divide-zinc-100 max-h-[380px] overflow-y-auto">
              {TAG_TAXONOMY.map((cat) => (
                <div
                  key={cat.id}
                  className="py-2.5 first:pt-0 last:pb-0 space-y-1.5"
                >
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block pl-0.5">
                    {cat.label}
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {cat.tags.map((tag: string) => {
                      const isSelected = activeFilters.includes(tag);
                      return (
                        <button
                          key={tag}
                          onClick={() => toggleFilter(tag)}
                          className={`text-xs px-3 py-1.5 rounded-xl font-medium transition-all duration-150 border active:scale-[0.97] focus:outline-none focus:ring-2 focus:ring-zinc-900/20
                            ${
                              isSelected
                                ? "bg-zinc-900 border-zinc-900 text-white shadow-sm font-semibold"
                                : "bg-zinc-50/50 hover:bg-zinc-100/80 border-zinc-200/80 text-zinc-600"
                            }
                          `}
                        >
                          {tag}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Results Section */}
      <div className="px-4 space-y-2.5">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
            <Layers size={12} /> ผลลัพธ์ที่ตรงเงื่อนไข ({results.length})
          </span>
        </div>

        {isLoading ? (
          <div className="bg-white border border-zinc-200/60 rounded-2xl py-16 text-center shadow-sm space-y-3 flex flex-col items-center justify-center">
            <Loader2 size={24} className="text-zinc-900 animate-spin" />
            <p className="text-xs text-zinc-400 font-semibold tracking-wide">
              กำลังค้นหา...
            </p>
          </div>
        ) : results.length > 0 ? (
          <div className="grid gap-2">
            {results.map((glass: Glass) => {
              // เช็คว่าการ์ดใบนี้กำลังถูกสั่งลบอยู่หรือเปล่า (ถ้าลบอยู่จะปรับ UI ให้ดูจางลง)
              const isThisCardDeleting = isDeleting === glass.id;

              return (
                <Card
                  key={glass.id}
                  className={`border-zinc-200/80 shadow-sm overflow-hidden transition-all duration-300 bg-white group
                    ${isThisCardDeleting ? 'opacity-50 scale-[0.98] pointer-events-none' : 'hover:border-zinc-900 active:scale-[0.995]'}
                  `}
                >
                  <CardContent className="p-4 flex items-start justify-between gap-3">
                    <div className="space-y-2 flex-1 min-w-0">
                      
                      <div className="flex items-center gap-2">
                        <div className="bg-zinc-100 group-hover:bg-zinc-900 group-hover:text-white p-1.5 rounded-lg transition-colors">
                          <FolderOpen size={16} className="stroke-[2]" />
                        </div>
                        <span className="text-xl font-extrabold text-zinc-950 tracking-tight uppercase">
                          {glass.box_id}
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-1">
                        {glass.tags.map((t: string) => {
                          const isMatch = activeFilters.includes(t);
                          return (
                            <span
                              key={t}
                              className={`text-[10px] px-2 py-0.5 rounded-md font-bold transition-colors tracking-wide
                                ${
                                  isMatch
                                    ? "bg-amber-500 text-white shadow-sm shadow-amber-500/10"
                                    : "bg-zinc-100 text-zinc-500 font-medium"
                                }
                              `}
                            >
                              {t}
                            </span>
                          );
                        })}
                      </div>
                    </div>

                    {/* โซนขวา: วันที่ + ปุ่มลบ */}
                    <div className="flex flex-col items-end gap-2 shrink-0">
                      <button
                        onClick={() => handleDelete(glass.id, glass.box_id)}
                        disabled={isThisCardDeleting}
                        className="text-rose-500 p-1.5 rounded-md transition-all duration-200"
                        title="ลบข้อมูลนี้"
                      >
                        {isThisCardDeleting ? (
                          <Loader2 size={16} className="animate-spin text-rose-500" />
                        ) : (
                          <Trash2 size={16} className="stroke-[2.5] text-rose-500" />
                        )}
                      </button>
                      
                      <div className="text-[10px] font-bold text-zinc-400 text-right bg-zinc-50 px-2 py-1 rounded-md border border-zinc-100 mt-auto">
                        {new Date(glass.created_at).toLocaleDateString("th-TH", {
                          month: "short",
                          day: "numeric",
                        })}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : activeFilters.length === 0 ? (
          <div className="bg-white border border-zinc-200/60 border-dashed rounded-2xl p-10 text-center shadow-sm">
            <div className="w-12 h-12 bg-zinc-50 text-zinc-400 rounded-full flex items-center justify-center mx-auto mb-3 border border-zinc-100">
              <PackageSearch size={24} className="stroke-[1.5]" />
            </div>
            <h3 className="text-sm font-bold text-zinc-800">
              คลังสินค้าพร้อมทำงาน
            </h3>
            <p className="text-xs text-zinc-400 max-w-[240px] mx-auto mt-1.5 leading-relaxed">
              กรุณากดเปิดแผงตัวกรองด้านบนและเลือกสเปกแว่นตาที่ต้องการ
              เพื่อดึงตำแหน่งกล่องจัดเก็บ
            </p>
          </div>
        ) : (
          <div className="bg-white border border-zinc-200/60 border-dashed rounded-2xl p-10 text-center shadow-sm">
            <div className="w-12 h-12 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-3 border border-rose-100">
              <PackageX size={24} className="stroke-[1.5]" />
            </div>
            <h3 className="text-sm font-bold text-zinc-800">
              ไม่พบแว่นตาตรงสเปก
            </h3>
            <p className="text-xs text-zinc-400 max-w-[220px] mx-auto mt-1.5 leading-relaxed">
              ไม่มีแว่นตาที่รวมคุณสมบัติทั้งหมดนี้เข้าด้วยกัน
              ลองถอดตัวกรองบางตัวออกเพื่อค้นหาใหม่
            </p>
          </div>
        )}
      </div>
    </div>
  );
}