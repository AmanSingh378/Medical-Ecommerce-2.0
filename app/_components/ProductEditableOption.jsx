'use client';

import React, { useState } from "react"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { ChartLine, PenBox, Trash2 } from "lucide-react"
import axios from "axios"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

function ProductEditableOption({ children, product, onDelete }) {
    const [open, setOpen] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const router = useRouter();

    const handleEdit = (e) => {
        e.stopPropagation();
        e.preventDefault();
        setOpen(false);
        router.push(`/edit-product/${product?.id}`);
    };

    const handleAnalytic = (e) => {
        e.stopPropagation();
        e.preventDefault();
        setOpen(false);
        router.push(`/analytics/${product?.id}`);
    };

    const handleDelete = async (e) => {
        e.stopPropagation();
        e.preventDefault();

        if (!confirm('Are you sure you want to delete this product?')) {
            return;
        }

        setDeleting(true);
        try {
            await axios.delete(`/api/products?id=${product?.id}`);
            toast.success('Product deleted successfully');
            setOpen(false);
            if (onDelete) onDelete(product?.id);
        } catch (error) {
            console.error(error);
            toast.error('Failed to delete product');
        } finally {
            setDeleting(false);
        }
    };

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger>
                {children}
            </PopoverTrigger>
            <PopoverContent>
                <ul>
                    <li 
                        className="flex gap-2 p-2 rounded-md cursor-pointer hover:bg-slate-200"
                        onClick={handleEdit}
                    >
                        <PenBox /> Edit
                    </li>
                    <li 
                        className="flex gap-2 p-2 rounded-md cursor-pointer hover:bg-slate-200"
                        onClick={handleAnalytic}
                    >
                        <ChartLine /> Analytic
                    </li>
                    <li
                        className={`flex gap-2 p-2 text-red-600 rounded-md cursor-pointer hover:bg-slate-200 ${deleting ? 'opacity-50 pointer-events-none' : ''}`}
                        onClick={handleDelete}
                    >
                        <Trash2 /> {deleting ? 'Deleting...' : 'Delete'}
                    </li>
                </ul>
            </PopoverContent>
        </Popover>
    )
}

export default ProductEditableOption

