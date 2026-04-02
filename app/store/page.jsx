"use client"

import ProductsList from "../_components/ProductsList"
import { useState } from "react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const categories = ['All', 'Medicine', 'Supplements', 'Equipment', 'Personal Care', 'Wellness', 'Other']

export default function Store() {
  const [selectedCategory, setSelectedCategory] = useState('All')

  const categoryValue = selectedCategory === 'All' ? null : selectedCategory

  return (
    <div className="min-h-screen py-20 px-10 md:px-36 lg:px-48">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-16 bg-linear-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent">
          Store
        </h1>
        
        <div className="flex flex-col md:flex-row gap-6 mb-12 justify-center items-center">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-64">
              <SelectValue placeholder="Select Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <ProductsList category={categoryValue} />
      </div>
    </div>
  )
}
