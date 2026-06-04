'use client'

import { useState } from 'react'
import { v7 as uuidv7 } from 'uuid'
import { toast } from 'sonner'
import { Pin, PinOff, Check, Package, Tag as TagIcon } from 'lucide-react'
import { addGlass } from '@/actions/glass.actions'
import { useInputStore } from '@/store/useInputStore'
import { TAG_TAXONOMY } from '@/config/tags'
import { Button } from '@/components/ui/button'

export default function TaggingEntryPage() {
  const store = useInputStore()
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

  const handleSave = async (): Promise<void> => {
    if (!store.boxId || store.selectedTags.length === 0) {
      toast.error('กรุณาระบุหมายเลขกล่องและเลือกอย่างน้อย 1 แท็ก')
      return
    }

    setIsSubmitting(true)
    
    const newData = {
      id: uuidv7(),
      box_id: store.boxId,
      tags: store.selectedTags,
    }

    const res = await addGlass(newData)

    if (res.success) {
      toast.success(`บันทึกสำเร็จ (${store.selectedTags.length} แท็ก)`)
      store.clearUnlockedTags()
    } else {
      toast.error(res.error || 'ระบบฐานข้อมูลขัดข้อง กรุณาลองใหม่')
    }
    
    setIsSubmitting(false)
  }

  return (
    <div className="mx-auto w-full max-w-md min-h-screen bg-white pb-32 font-sans text-neutral-900">
      
      <div className="sticky top-0 z-50 bg-white border-b border-neutral-200 px-4 py-5 shadow-sm space-y-4">
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold text-neutral-500 uppercase tracking-wide flex items-center gap-2">
            <Package size={16} />
            Storage Target
          </label>
          <input 
            type="text" 
            placeholder="BOX-001"
            value={store.boxId}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => store.setBoxId(e.target.value.toUpperCase())}
            className="w-full text-xl font-bold bg-neutral-100 border-2 border-neutral-100 focus:border-black focus:bg-white rounded-xl px-4 py-3 outline-none transition-colors uppercase placeholder:text-neutral-400"
          />
        </div>

        <div className="flex items-center justify-between text-sm bg-neutral-100 px-4 py-3 rounded-xl font-medium">
          <span className="flex items-center gap-2 text-neutral-700">
            <TagIcon size={16} /> 
            <span>Selected: {store.selectedTags.length}</span>
          </span>
          {store.lockedTags.length > 0 && (
            <span className="text-orange-600 flex items-center gap-1.5">
              <Pin size={14} fill="currentColor" />
              Locked: {store.lockedTags.length}
            </span>
          )}
        </div>
      </div>

      <div className="px-4 py-6 space-y-8">
        {TAG_TAXONOMY.map((cat) => (
          <div key={cat.id} className="space-y-3">
            <h2 className="text-sm font-bold text-neutral-900 uppercase tracking-wide">
              {cat.label}
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {cat.tags.map((tag: string) => {
                const isSelected = store.selectedTags.includes(tag)
                const isLocked = store.lockedTags.includes(tag)

                return (
                  <div key={tag} className="relative flex">
                    <Button
                      variant="outline"
                      className={`flex-1 h-14 text-sm justify-start pl-4 pr-10 border-2 transition-colors ${
                        isSelected 
                          ? 'bg-black border-black text-white hover:bg-neutral-800 hover:border-neutral-800' 
                          : 'bg-white border-neutral-200 text-neutral-700 hover:border-neutral-300 hover:bg-neutral-50'
                      }`}
                      onClick={() => store.toggleTag(tag)}
                    >
                      <div className="flex items-center gap-2 overflow-hidden w-full">
                        {isSelected && <Check size={16} className="shrink-0" />}
                        <span className="truncate">{tag}</span>
                      </div>
                    </Button>
                    
                    <button
                      onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                        e.stopPropagation()
                        store.toggleLock(tag)
                      }}
                      className={`absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg transition-colors ${
                        isLocked 
                          ? 'text-orange-500 bg-orange-100' 
                          : isSelected 
                            ? 'text-neutral-400 hover:bg-neutral-800 hover:text-white' 
                            : 'text-neutral-300 hover:bg-neutral-100 hover:text-neutral-600'
                      }`}
                    >
                      {isLocked ? <Pin size={16} fill="currentColor" /> : <PinOff size={16} />}
                    </button>
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-neutral-200">
        <div className="mx-auto max-w-md">
          <Button 
            className="w-full h-14 text-base font-bold bg-black hover:bg-neutral-800 text-white rounded-xl active:scale-95 transition-transform disabled:opacity-50 disabled:active:scale-100" 
            onClick={handleSave}
            disabled={isSubmitting || store.selectedTags.length === 0 || !store.boxId}
          >
            {isSubmitting ? 'กำลังบันทึกข้อมูล...' : 'บันทึกข้อมูล (Save & Next)'}
          </Button>
        </div>
      </div>

    </div>
  )
}