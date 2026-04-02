import { Button } from '@/components/ui/button'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

function Hero() {
    return (
        <div className='p-10 bg-green-600 px-28 lg:px-36'>
            <div className='grid grid-cols-1 gap-10 pt-20 md:grid-cols-2'>
                <div>
                    <h2 className='text-5xl font-extrabold text-white'>Welcome To Medicare E-Commerce Store</h2>
                    <p className='mt-5 text-gray-200'>Your one-stop shop for all your medical needs. Explore our wide range of products and enjoy seamless shopping experience.</p>
                    <div className='flex gap-5 mt-8'>
                        <Link href={'/explore'}>
                        <Button className='bg-red-300'>Explore</Button>
                        </Link>
                        <Link href={"/dashboard"}>
                        <Button className='bg-red-500'>Sell</Button>
                    </Link>
                    </div>
                </div>
                <div className='flex items-center justify-center'>
                    <Image src={'/Medic.jpg'} width={300} height={300} alt='Medic'/>
                </div>
            </div>
        </div>
    )
}

export default Hero

