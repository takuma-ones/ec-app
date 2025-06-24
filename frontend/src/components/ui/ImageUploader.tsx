'use client'

import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { useState } from 'react'
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  DragStartEvent,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import Image from 'next/image'
import { X } from 'lucide-react'

export type ImageItem = {
  id: string
  file: File
  base64: string
}

type Props = {
  value: ImageItem[]
  onChange: (images: ImageItem[]) => void
}

export default function ImageUploader({ value, onChange }: Props) {
  const [activeId, setActiveId] = useState<string | null>(null)
  const sensors = useSensors(useSensor(PointerSensor))
  const activeImage = value.find((img) => img.id === activeId) || null

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return

    const files = Array.from(e.target.files)
    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/gif']
    const validFiles = files.filter((file) => allowedTypes.includes(file.type))

    const newImages: ImageItem[] = await Promise.all(
      validFiles.map(async (file) => {
        const base64 = await readAsBase64(file)
        return {
          id: crypto.randomUUID(),
          file,
          base64,
        }
      })
    )

    onChange([...value, ...newImages])
  }

  const readAsBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (active.id !== over?.id) {
      const oldIndex = value.findIndex((i) => i.id === active.id)
      const newIndex = value.findIndex((i) => i.id === over?.id)
      onChange(arrayMove(value, oldIndex, newIndex))
    }
    setActiveId(null)
  }

  const handleRemoveImage = (id: string) => {
    onChange(value.filter((img) => img.id !== id))
  }

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">商品画像（.png, .jpg, .jpeg, .webp, .gif）</label>
      <Input type="file" multiple accept=".png,.jpg,.jpeg,.webp,.gif" onChange={handleFileChange} />

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={(event: DragStartEvent) => setActiveId(event.active.id.toString())}
        onDragEnd={handleDragEnd}
        onDragCancel={() => setActiveId(null)}
      >
        <SortableContext items={value.map((img) => img.id)} strategy={verticalListSortingStrategy}>
          <div className="grid grid-cols-3 gap-4">
            {value.map((img, index) => (
              <SortableImage
                key={img.id}
                id={img.id}
                base64={img.base64}
                order={index}
                onRemove={() => handleRemoveImage(img.id)}
              />
            ))}
          </div>
        </SortableContext>

        <DragOverlay>
          {activeImage ? (
            <div className="w-full max-w-[120px]">
              <Image
                src={activeImage.base64}
                alt="drag"
                width={100}
                height={100}
                className="w-full h-24 object-cover rounded shadow-lg"
              />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  )
}

function SortableImage({
  id,
  base64,
  order,
  onRemove,
}: {
  id: string
  base64: string
  order: number
  onRemove: () => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id })
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation()
    onRemove()
  }

  return (
    <Card
      ref={setNodeRef}
      style={style}
      {...attributes}
      className="relative p-2 text-center shadow-md border cursor-move"
    >
      <div {...listeners}>
        <Image
          src={base64}
          alt={`img-${id}`}
          width={100}
          height={100}
          className="w-full h-24 object-cover rounded"
        />
      </div>
      <div className="text-xs text-muted-foreground font-semibold">順番 {order + 1}</div>
      <button
        type="button"
        onClick={handleRemove}
        className="absolute top-1 right-1 text-gray-600 hover:text-red-500"
      >
        <X size={16} />
      </button>
    </Card>
  )
}
