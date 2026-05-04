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
import ImageUpload from "../../add-product/_components/ImageUpload";
import axios from "axios";
import { useUser } from "@clerk/nextjs";
import { Loader2Icon } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";
import Image from "next/image";

function EditProduct() {
    const categoryOptions = ["Pain Relief", "First Aid", "Vitamins & Supplements", "Skin Care", "Orthopedics", "Diabetic Care", "Baby Care", "Women's Health", "Dental Care",
    "Eye Care", "Fitness & Nutrition", "Ayurvedic", "Sexual Wellness", "Diagnostics", "Hospital Supplies", "Heart Care", "Respiratory Care", "Cold & Flu", "Digestional",
    "Neurological", "Allergy Relief", "Personal Hygiene", "Nutritionals", "Home Healthcare", "Immunity Boosters", "Incontinence Care", "Pain Management", "Diabetes Management"];
    
    const [formData, setFormData] = useState({});
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(false);
    const [fetchLoading, setFetchLoading] = useState(true);
    const { user } = useUser();
    const router = useRouter();
    const params = useParams();
    const productId = params?.productId;

    useEffect(() => {
        if (productId) {
            fetchProduct();
        }
    }, [productId]);

    const fetchProduct = async () => {
        setFetchLoading(true);
        try {
            const result = await axios.get(`/api/products?id=${productId}`);
            const data = result.data;
            setProduct(data);
            setFormData({
                title: data?.title || '',
                price: data?.price || '',
                category: data?.category || '',
                description: data?.description || '',
                about: data?.about || '',
                message: data?.message || '',
                userEmail: user?.primaryEmailAddress?.emailAddress,
                existingImageUrl: data?.imageUrl,
                existingFileUrl: data?.fileUrl,
            });
        } catch (error) {
            console.error("Failed to fetch product:", error);
            toast.error("Failed to load product");
        } finally {
            setFetchLoading(false);
        }
    };

    const handleInputChange = (fieldName, fieldValue) => {
        setFormData(prev => ({
            ...prev,
            [fieldName]: fieldValue
        }));
    };

    const onUpdateProductBtnClick = async () => {
        setLoading(true);
        try {
            const formDataObj = new FormData();
            
            if (formData.image) {
                formDataObj.append("image", formData.image);
            }
            if (formData.file) {
                formDataObj.append("file", formData.file);
            }
            
            const dataToSend = {
                title: formData?.title,
                category: formData?.category,
                description: formData?.description,
                price: formData?.price,
                about: formData?.about,
                message: formData?.message,
                userEmail: formData?.userEmail,
            };
            
            formDataObj.append("data", JSON.stringify(dataToSend));

            const result = await axios.put(`/api/products?id=${productId}`, formDataObj, {
                headers: {
                    "Content-Type": 'multiport/form-data'
                }
            });

            if (result) {
                toast.success('Product updated successfully!!');
                router.push('/dashboard');
            }
        } catch (error) {
            console.error(error);
            toast.error('Failed to update product');
        } finally {
            setLoading(false);
        }
    };

    if (fetchLoading) {
        return (
            <div className="flex items-center justify-center h-96">
                <Loader2Icon className="w-10 h-10 animate-spin text-pink-400" />
            </div>
        );
    }

    return (
        <div className="mt-10">
            <h2 className="text-3xl font-bold">Edit Product</h2>
            <p>Update your product details.</p>

            <div className="grid grid-cols-1 gap-5 mt-10 md:grid-cols-2">
                <div className="flex flex-col gap-5">
                    <div>
                        <h4>Current Product Image</h4>
                        {formData?.existingImageUrl && !formData?.image && (
                            <Image src={formData.existingImageUrl} alt="current" width={300} height={300} className="object-contain h-50 rounded-lg border mt-2" />
                        )}
                        <ImageUpload onImageSelect={(e) => handleInputChange(e.target.name, e.target.files[0])} />
                    </div>
                    <div>
                        <h4>Upload New Product File (optional)</h4>
                        <Input type="file" name="file" onChange={(e) => handleInputChange(e.target.name, e.target.files[0])} />
                    </div>
                    <div>
                        <h4>Message to User</h4>
                        <Textarea name="message" value={formData?.message || ''} placeholder="Enter a message to the buyer" className="w-full h-20 px-3 py-2 text-base bg-transparent border-2 border-b-4 border-r-4 border-black shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                            onChange={(e) => handleInputChange(e.target.name, e.target.value)} />
                    </div>
                </div>
                <div className="flex flex-col gap-5">
                    <div>
                        <h4>Product Title</h4>
                        <Input name="title" value={formData?.title || ''} placeholder="Enter product title" onChange={(e) => handleInputChange(e.target.name, e.target.value)} />
                    </div>
                    <div>
                        <h4>Price</h4>
                        <Input type="number" name="price" value={formData?.price || ''} placeholder="Enter product price" onChange={(e) => handleInputChange(e.target.name, e.target.value)} />
                    </div>
                    <div>
                        <h4>Category</h4>
                        <Select name="category" value={formData?.category || ''} onValueChange={(value) => handleInputChange("category", value)}>
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
                        <Textarea name="description" value={formData?.description || ''} placeholder={"Add product description"} className="w-full h-20 px-3 py-2 text-base bg-transparent border-2 border-b-4 border-r-4 border-black shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                            onChange={(e) => handleInputChange(e.target.name, e.target.value)} />
                    </div>
                    <div>
                        <h4>About Product (Optional)</h4>
                        <Textarea name="about" value={formData?.about || ''} placeholder="Enter product details" className="w-full h-20 px-3 py-2 text-base bg-transparent border-2 border-b-4 border-r-4 border-black shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                            onChange={(e) => handleInputChange(e.target.name, e.target.value)} />
                    </div>
                    <Button className="bg-pink-400 hover:bg-red-500" onClick={onUpdateProductBtnClick} disabled={loading}>
                        {loading ? <Loader2Icon className="animate-spin" /> : 'Update Product'}
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default EditProduct

