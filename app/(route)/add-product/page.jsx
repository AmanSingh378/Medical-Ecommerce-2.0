"use client"
import { Input } from "@/components/ui/input"
import React, { useEffect, useState } from "react"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import ImageUpload from "./_components/ImageUpload";
import axios from "axios";
import { useUser } from "@clerk/nextjs";
import { Loader, Loader2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

function AddProduct() {
    const categoryOptions = ['Medicine', 'Supplements', 'Equipment', 'Personal Care', 'Wellness', 'Other']
    const [formData, setFormData] = useState([]);
    const { user } = useUser();
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    useEffect(() => {
        setFormData({
            userEmail:user?.primaryEmailAddress?.emailAddress
        })
    }, [user])

    const handleInputChange = (fieldName, fieldValue) => {
        setFormData(prev => ({
            ...prev,
            [fieldName]: fieldValue
        }))
        console.log(formData)
        

    }

    const onAddProductBtnClick = async() => {
        console.log(formData);
        setLoading(true);
        const formDataObj = new FormData();
        formDataObj.append("image", formData.image);
        formDataObj.append("file", formData.file);
        formDataObj.append("data", JSON.stringify(formData));

        const result = await axios.post('/api/products', formDataObj, {
            headers: {
                "Content-Type": 'multiport/form-data'   //we are passing JSON data + files+image
            }
        });

        setLoading(false);

        if (result) {
            toast('New product added Successfully!!');
            
            router.push('/dashboard');
        }
    }

    return (
        <div className="mt-10">
            <h2 className="text-3xl font-bold">Add New Product</h2>
            <p>Start adding product details to sell your item.</p>

            <div className="grid grid-cols-1 gap-5 mt-10 md:grid-cols-2">
                <div className="flex flex-col gap-5">
                    <ImageUpload onImageSelect={(e) => handleInputChange(e.target.name, e.target.files[0])} />
                    <div>
                        <h4>Upload File of Product for Sell</h4>
                        <Input type="file" name="file" onChange={(e) => handleInputChange(e.target.name, e.target.files[0])} />
                    </div>
                    <div>
                        <h4>Message to User</h4>
                        <Textarea name="message" placeholder="Enter a message to the buyer" className="w-full h-20 px-3 py-2 text-base bg-transparent border-2 border-b-4 border-r-4 border-black shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                            onChange={(e) => handleInputChange(e.target.name, e.target.value)} />
                    </div>
                </div>
                <div className="flex flex-col gap-5">
                    <div>
                        <h4>Product Title</h4>
                        <Input name="title" placeholder="Enter product title" onChange={(e) => handleInputChange(e.target.name, e.target.value)} />
                    </div>
                    <div>
                        <h4>Price</h4>
                        <Input type="number" name="price" placeholder="Enter product price" onChange={(e) => handleInputChange(e.target.name, e.target.value)} />
                    </div>
                    <div>
                        <h4>Category</h4>
                        <Select name="category" onValueChange={(value) => handleInputChange("category", value)}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                            <SelectContent>
                                {categoryOptions?.map((category, index) => (
                                    <SelectItem key={index} value={category}>{category}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <h4>Description</h4>
                        <Textarea name="description" placeholder={"Add product description"} className="w-full h-20 px-3 py-2 text-base bg-transparent border-2 border-b-4 border-r-4 border-black shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                            onChange={(e) => handleInputChange(e.target.name, e.target.value)} />
                    </div>
                    <div>
                        <h4>About Product (Optional)</h4>
                        <Textarea name="about" placeholder="Enter product details" className="w-full h-20 px-3 py-2 text-base bg-transparent border-2 border-b-4 border-r-4 border-black shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                            onChange={(e) => handleInputChange(e.target.name, e.target.value)} />
                    </div>
                    <Button className="bg-pink-400 hover:bg-red-500" onClick={onAddProductBtnClick} disabled={loading}>
                        {loading ? <Loader2Icon className="animate-spin" /> : 'Add Product'}
                    </Button>
                </div>
            </div>
        </div>
    )
}
export default AddProduct