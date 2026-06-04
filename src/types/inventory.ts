export interface Glass {
  id: string
  box_id: string
  tags: string[]
  created_at: string
}

export type GlassInsertData = Omit<Glass, 'created_at'>

export type ActionResponse<T = void> = 
  | (T extends void ? { success: true; data?: never } : { success: true; data: T })
  | { success: false; error: string; data?: never }