import React from 'react'
import { assets } from '../assets/assets'

const Footer = () => {
    return (
        <div className='md:mx-10'>
            <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm'>
                {/* left section */}
                <div>
                    <img className='mb-5 w-40' src={assets.logo} alt="logo" />
                    <p className='w-full md:w-2/3 text-gray-600 leading-6'>
                        Take control of your health today. Find trusted doctors, book appointments easily, and get the care you need—anytime, anywhere.
                    </p>
                </div>

                {/* center section */}
                <div>
                    <h3 className='text-xl font-medium mb-5'>COMPANY</h3>
                    <ul className='flex flex-col gap-2 text-gray-600'>
                        <li className='cursor-pointer hover:text-black transition-colors'>Home</li>
                        <li className='cursor-pointer hover:text-black transition-colors'>About us</li>
                        <li className='cursor-pointer hover:text-black transition-colors'>Contact Us</li>
                        <li className='cursor-pointer hover:text-black transition-colors'>Privacy policy</li>
                    </ul>
                </div>

                {/* right section */}
                <div>
                    <p className='text-xl font-medium mb-5'>GET IN TOUCH</p>
                    <ul className='flex flex-col gap-2 text-gray-600'>
                        <li className='cursor-pointer hover:text-black transition-colors'>+91 9000000000</li>
                        <li className='cursor-pointer hover:text-black transition-colors'>adiledmorphy@gamail.com</li>
                        <li className='cursor-pointer hover:text-black transition-colors'>123 Health Street, Medical City - 123456</li>
                    </ul>
                </div>
            </div>

            {/* copy right section */}
            <div>
                <hr className='border-gray-200' />
                <p className='py-5 text-sm text-center text-gray-500'>Copyright 2026 Prescrripto. All rights reserved.</p>
            </div>
        </div>
    )
}

export default Footer