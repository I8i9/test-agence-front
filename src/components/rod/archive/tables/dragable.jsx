import {
  useSortable,
} from "@dnd-kit/sortable"

import {
  flexRender,
} from "@tanstack/react-table"

import {
  TableCell,
  TableRow,
} from '@/components/ui/table'

import { CSS } from "@dnd-kit/utilities"
import { Button } from '@/components/ui/button'
import { GripVerticalIcon } from "lucide-react"


export function DragHandle ({ id }) {
  const { attributes, listeners } = useSortable({
    id,
  })

  return (
    <Button
      {...attributes}
      {...listeners}
      variant="ghost"
      size="icon"
      className="text-muted-foreground size-7 hover:bg-transparent"
    >
      <GripVerticalIcon className="text-muted-foreground size-3" />
      <span className="sr-only">Drag to reorder</span>
    </Button>
  )
}

export function DraggableRow({ row , id} ) {
  const { transform, transition, setNodeRef, isDragging } = useSortable({
    id: row.original[id],
  })

  return (
    <TableRow
      data-state={row.getIsSelected() && "selected"}
      data-dragging={isDragging}
      ref={setNodeRef}
      className="relative group z-0 data-[dragging=true]:z-10 data-[dragging=true]:opacity-80"
      style={{
        transform: CSS.Transform.toString(transform),
        transition: transition,
      }}
    >
      {row.getVisibleCells().map((cell) => (
        <TableCell key={cell.id}
        style={{ ...cell?.column?.columnDef?.meta }}
        >
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </TableCell>
      ))}
    </TableRow>
  )
}
