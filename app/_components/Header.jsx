'use client';
import { Button } from '@/components/ui/button'
import { ShoppingBag } from 'lucide-react'
import React, { useContext } from 'react'
import { UserButton } from '@clerk/nextjs'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { CartContext } from '../_context/CartContext'
import CartList from './CartList'


function Header() {

    const MenuList = [
        {
            name: "Home",
            path: "/"
        },
        {
            name: "Store",
            path: "/store"
        },
        {
            name: "Explore",
            path: "/explore"
        }
    ]

    const { cart, setCart } = useContext(CartContext)
    return (
        <div className='flex items-center justify-between p-4 px-10 bg-yellow-500 border-b-4 border-black md:px-32 lg:px-48'>
            <h2 className='p-1 px-2 text-lg font-bold text-white bg-black'>MediCare</h2>

            <ul className='hidden gap-5 md:flex'>
                {MenuList.map((menu, index) => (
                    <Link 
                      key={index} 
                      href={menu.path}
                      className='p-1 px-2 hover:border-2 hover:border-white block'
                    >
                      {menu.name}
                    </Link>
                ))}
            </ul>
            <div className='flex items-center gap-5'>

                <CartList>
                    <div className='flex items-center' suppressHydrationWarning>
                        <ShoppingBag />
                        <Badge className='text-white hover:bg-pink-400 rounded-full py-1'>
                            {cart?.length || 0}
                        </Badge>
                    </div>
                </CartList>



                <Link href={"/dashboard"}>
                    <Button className="bg-red-400 hover:bg-red-600">Start Selling</Button>
                </Link>
                <UserButton />
                <Link href={"/sign-in"} className='flex items-center justify-center'>
                    <Button className='text-white bg-black hover:bg-gray-800'>Login</Button>
                </Link>
            </div>
        </div>
    )
}

export default Header
