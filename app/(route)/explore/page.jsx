"use client"
import DisplayProductList from "@/app/_components/DisplayProductList";
import SortProducts from "@/app/_components/SortProducts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { Search } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

function Explore() {

    const [productsList, setProductsList]= useState([]);
    const [offset, setOffset]= useState(0);
    const [searchInput,setSearchInput]=useState('');
    const [sort, setSort] = useState({
        
            label: 'NEWST',
            field: 'id',
            order: 'desc'
        
    });
    
    useEffect(()=>{
        GetProductList(0);
    },[])
    
    const GetProductList= async(offset_)=>{
        const result = await axios.post('/api/all-products',{
            limit:6,
            offset: offset_,
            searchText: searchInput || '',
            sort: sort??[]
        });
        
        if(result?.data?.error)
        {
            toast(result?.data?.error)
            return;
        }
        
        if(offset_===0)
        {
            setProductsList(result.data);
        }
        else{
            // Deduplicate by product id before appending
            setProductsList(prev=>{
                const existingIds = new Set(prev.map(p => p.id));
                const newProducts = (result.data || []).filter(p => !existingIds.has(p.id));
                return [...prev, ...newProducts];
            });
        }
        
        // Update offset state
        setOffset(offset_);
    }
    
    useEffect(()=>{
        if(sort)
        {
            setOffset(0);
            setProductsList([]);
            GetProductList(0);
        }
    },[sort])

    return(
        <div className="mt-10">
            <h2 className="text-3xl font-bold">Explore</h2>

            <div className="flex items-center justify-between mt-5 mb-5">
                <div className="flex items-center gap-2 ">
                    <h2>Search :</h2>
                    <Input placeholder="Search" className="w-80" value={searchInput}
                        onChange={(event)=>setSearchInput(event.target.value)}
                    />
                    <Button onClick={()=>{
                        setOffset(0);
                        GetProductList(0);
                        }}><Search/>Search</Button>
                </div>
                <SortProducts onSortChange={(value)=>setSort(value)}/>
            </div>
            <DisplayProductList productsList={productsList}/>
            <div className="flex items-center justify-center mt-10">
                <Button onClick={()=>{
                    GetProductList(offset + 6, searchInput);
                    }}>Load More</Button>
            </div>
        </div>
    )
        
}

export default Explore;