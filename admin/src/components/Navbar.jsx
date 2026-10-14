import React, { useContext } from 'react'
import { assets } from '../assets/assets'
import { AdminContext } from '../context/AdminContext'
import { DoctorContext } from '../context/DoctorContext'
import { useNavigate } from 'react-router-dom'

const Navbar = () => {

    const { aToken, setAToken } = useContext(AdminContext);
    const { dToken, setDToken } = useContext(DoctorContext);
    const navigate = useNavigate();

    const logout = () => {
        navigate('/')
        if (aToken) {
            setAToken('')
            localStorage.removeItem('aToken')
        }
        if (dToken) {
            setDToken('')
            localStorage.removeItem('dToken')
        }
    }

    return (
        <div className='flex justify-between items-center px-4 sm:px-10 py-3 border-b bg-white border-b-gray-400 gap-2'>
            <div className='flex items-center gap-2 text-xs'>
                <img className='w-28 sm:w-40 cursor-pointer' src={assets.admin_logo} alt="" />
                <p className='border px-2 sm:px-2.5 py-0.5 rounded-full border-gray-500 text-gray-600 text-[11px] sm:text-xs whitespace-nowrap'>{aToken ? 'Admin' : 'Doctor'} Panel</p>
            </div>
            <button onClick={logout} className='bg-primary text-white text-xs sm:text-sm px-5 sm:px-10 py-1.5 sm:py-2 rounded-full cursor-pointer hover:bg-opacity-90 transition-all shrink-0'>Logout</button>
        </div>
    )
}

export default Navbar