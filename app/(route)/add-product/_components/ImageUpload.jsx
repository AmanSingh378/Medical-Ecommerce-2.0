"use client"
import Image from "next/image"
import React, { useState } from "react"

function ImageUpload({onImageSelect}) {

    const [image, setImage] = useState();
    const handleFileChange = (event) => {
        onImageSelect(event)
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onloadend = () => {
            setImage(reader.result)
        };
        reader.readAsDataURL(file)
    }
    return (
        <div>
            <h2>Upload Product Image</h2>
            <input type="file" id="imageUpload" name="image" className="hidden" onChange={handleFileChange} />
            <label htmlFor="imageUpload">
                <div className="flex items-center justify-center p-10 border-2 border-black border-dashed cursor-pointer bg-slate-200">
                    {image?
                        <Image src={image} width={300} height={300} className="object-contain h-50" alt='image'/> :
                        <Image src={'/image1.png'} alt='image' width={70} height={70} className="opacity-35" />
                    }
                </div>
            </label>
        </div>
    )
}

export default ImageUpload