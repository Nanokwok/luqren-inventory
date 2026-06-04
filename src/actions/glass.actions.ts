"use server";

import { supabase } from "@/lib/supabase";
import { Glass, GlassInsertData, ActionResponse } from "@/types/inventory";

export async function addGlass(data: GlassInsertData): Promise<ActionResponse> {
  try {
    const { error } = await supabase.from("glasses").insert([data]);
    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (err) {
    return { success: false, error: "Internal Server Error" };
  }
}

export async function searchGlasses(
  selectedTags: string[],
): Promise<ActionResponse<Glass[]>> {
  try {
    if (!selectedTags || selectedTags.length === 0)
      return { success: true, data: [] };

    const { data, error } = await supabase
      .from("glasses")
      .select("id, box_id, tags, created_at")
      .contains("tags", selectedTags)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Supabase Error:", error.message);
      return { success: false, error: error.message };
    }

    return { success: true, data: data as Glass[] };
  } catch (err) {
    console.error("Catch Error:", err);
    return { success: false, error: "Internal Server Error" };
  }
}

export async function deleteGlass(id: string): Promise<ActionResponse> {
  try {
    const { error } = await supabase.from("glasses").delete().eq("id", id);

    if (error) {
      console.error("Supabase Delete Error:", error.message);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err) {
    console.error("Catch Delete Error:", err);
    return { success: false, error: "Internal Server Error" };
  }
}

export async function getDashboardStats() {
  try {
    const { count: totalCount } = await supabase
      .from("glasses")
      .select("*", { count: "exact", head: true });

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const { count: todayCount } = await supabase
      .from("glasses")
      .select("*", { count: "exact", head: true })
      .gte("created_at", startOfDay.toISOString());

    const { data: recentActivity } = await supabase
      .from("glasses")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(6);

    const { data: rawForStats } = await supabase
      .from("glasses")
      .select("box_id, tags")
      .order("created_at", { ascending: false })
      .limit(5000);

    const uniqueBoxes = new Set<string>();
    const tagCounts: Record<string, number> = {};

    if (rawForStats) {
      rawForStats.forEach((item) => {
        uniqueBoxes.add(item.box_id);
        item.tags.forEach((tag: string) => {
          tagCounts[tag] = (tagCounts[tag] || 0) + 1;
        });
      });
    }

    return {
      success: true,
      data: {
        totalCount: totalCount || 0,
        todayCount: todayCount || 0,
        totalBoxes: uniqueBoxes.size,
        recentActivity: (recentActivity || []) as Glass[],
        tagCounts,
      },
    };
  } catch (err) {
    console.error("Dashboard Stats Error:", err);
    return { success: false, error: "Failed to fetch dashboard stats" };
  }
}
