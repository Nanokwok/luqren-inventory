export interface TagCategory {
  id: string
  label: string
  tags: string[]
}

export const TAG_TAXONOMY: TagCategory[] = [
  {
    id: 'shape',
    label: 'รูปทรง (Shape)',
    tags: ['ทรงกลม', 'ทรงเหลี่ยม', 'ทรงหยดน้ำ', 'แคทอาย', 'ทรงนักบิน', 'ทรงรี', 'ทรงหกเหลี่ยม', 'Oversized']
  },
  {
    id: 'color',
    label: 'สีเฟรม/กรอบ (Frame Color)',
    tags: ['สีดำ', 'สีทอง', 'สีเงิน', 'สีโรสโกลด์', 'สีชา', 'สีใส', 'สีลายกระ', 'สีชมพู', 'สีเทากลมควัน', 'สีครีม']
  },
  {
    id: 'material',
    label: 'วัสดุ (Material)',
    tags: ['โลหะล้วน', 'พลาสติก TR90', 'อะซิเตท (Acetate)', 'ไทเทเนียม', 'กรอบเซลลูลอยด์', 'ขาผสม (Mixed)']
  },
  {
    id: 'features',
    label: 'ดีไซน์พิเศษ (Special Features)',
    tags: ['กรอบมีคิ้ว', 'ไร้ขอบ (Frameless)', 'ครึ่งขอบ (Half)', 'ขาแว่นบาง', 'ขาแว่นหนา', 'แป้นจมูกในตัว', 'แป้นจมูกซิลิโคน', 'แป้นจมูกโลหะ']
  },
  {
    id: 'style',
    label: 'สไตล์/เลนส์ (Style & Lens)',
    tags: ['สไตล์วินเทจ', 'สไตล์แฟชั่น', 'เลนส์กรองแสงบลู', 'เลนส์กันแดด', 'เลนส์เปลี่ยนสี Auto', 'เฟรมใส (Demo)']
  }
]

export const ALL_TAGS: string[] = TAG_TAXONOMY.flatMap((category) => category.tags)