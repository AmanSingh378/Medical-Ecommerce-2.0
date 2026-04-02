import React from "react"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
  } from "@/components/ui/popover"
import { ChartLine, PenBox, Trash2 } from "lucide-react"

function ProductEditableOption({children}) {
    return (
        <Popover>
    <PopoverTrigger>
        {children}
    </PopoverTrigger>
    <PopoverContent>
        <ul>
            <li className="flex gap-2 p-2 rounded-md cursor-pointer hover:bg-slate-200"> <PenBox/> Edit </li>
            <li className="flex gap-2 p-2 rounded-md cursor-pointer hover:bg-slate-200"> <ChartLine/> Analytic </li>
            <li className="flex gap-2 p-2 text-red-600 rounded-md cursor-pointer hover:bg-slate-200"> <Trash2/> Delete </li>
        </ul>
    </PopoverContent>
  </Popover>
    )
}

export default ProductEditableOption