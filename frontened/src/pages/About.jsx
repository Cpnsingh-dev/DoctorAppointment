import React from 'react'
import { assets } from '../assets/assets'

const About = () => {
    return (
        <div>
            <div className='text-center text-2xl pt-10 text-gray-500'>
                <p>ABOUT <span className='text-gray-700 font-medium'>US</span></p>
            </div>

            <div className='my-10 flex flex-col md:flex-row gap-12'>
                <img className='w-full md:max-w-[360px] rounded-lg' src={assets.about_image} alt="" />
                <div className='flex flex-col justify-center gap-6 md:w-2/4 text-sm text-gray-600'>
                    <p className='leading-relaxed'>Your health deserves the best care, and we’re here to make it easier than ever! Our Doctor Booking App bridges the gap between patients and trusted healthcare professionals, helping you find the right doctor at the right time. With a simple, user-friendly platform, you can explore experienced specialists, check their availability, and book appointments in just a few clicks. We believe that quality healthcare should be accessible, convenient, and stress-free for everyone. Whether it’s a routine checkup or expert medical guidance, we’re here to support you at every step of your healthcare journey. **Your health, your time, your care — all in one place.**</p>
                    <p className='leading-relaxed'>We are a team of dedicated professionals committed to providing you with the best possible healthcare experience. Our team of experienced doctors and medical staff are passionate about making a difference in the lives of our patients. We believe in providing compassionate, personalized care to each individual who comes through our doors. Our goal is to ensure that every patient receives the highest quality of care in a safe and comfortable environment. We are proud of our commitment to excellence and look forward to serving you and your family for many years to come.</p>
                    <b className='text-gray-800 text-base'>Our Values</b>
                    <p className='leading-relaxed'>Choose us for a seamless and reliable healthcare experience. We connect you with trusted doctors, offer easy online appointment booking, and provide a user-friendly platform that saves your time. Your health and convenience are our top priorities, making quality healthcare just a few clicks away.</p>
                </div>
            </div>

            <div className='text-xl my-4 text-gray-500'>
                <p>WHY <span className='text-gray-700 font-semibold'>CHOOSE US</span></p>
            </div>

            <div className='flex flex-col md:flex-row mb-20'>
                <div className='border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-primary hover:text-white transition-all duration-300 text-gray-600 cursor-pointer'>
                    <b>EFFICIENCY:</b>
                    <p>Save time with quick and easy appointment bookings, appointment reminders, and access to your medical history all in one place.</p>
                </div>
                <div className='border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-primary hover:text-white transition-all duration-300 text-gray-600 cursor-pointer'>
                    <b>CONVENIENCE:</b>
                    <p>Access our platform anytime, anywhere, and book appointments that fit your schedule, whether at home or on the go.</p>
                </div>
                <div className='border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-primary hover:text-white transition-all duration-300 text-gray-600 cursor-pointer'>
                    <b>PERSONALISATION:</b>
                    <p>Receive tailored healthcare solutions based on your needs, preferences, and medical history, ensuring you get the right care at the right time.</p>
                </div>
            </div>
        </div>
    )
}

export default About