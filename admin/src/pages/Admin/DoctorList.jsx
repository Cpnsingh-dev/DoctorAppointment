import React, { useContext, useEffect } from 'react'
import { AdminContext } from '../../context/AdminContext'
import Loading from '../../components/Loading'

const DoctorList = () => {

    const { doctors, aToken, getAllDoctors, changeAvailability, loading } = useContext(AdminContext)

    useEffect(() => {
        if (aToken) {
            getAllDoctors()
        }
    }, [aToken])

    if (loading) {
        return <Loading message="Loading doctors..." />
    }

    return (
        <div className='m-2.5 sm:m-5 w-full max-h-[90vh] overflow-y-auto pr-1 sm:pr-2'>
            <div className='flex items-center justify-between mb-2 sm:mb-4'>
                <h1 className='text-base sm:text-xl font-bold text-gray-800'>All Doctors</h1>
                <span className='text-xs bg-indigo-50 text-primary font-semibold px-2.5 py-0.5 rounded-full border border-indigo-100'>
                    {doctors.length} Doctors
                </span>
            </div>

            <div className='w-full grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 pt-2 pb-8'>
                {
                    doctors.map((item, index) => (
                        <div
                            className='border border-indigo-100 rounded-xl overflow-hidden cursor-pointer group bg-white shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between'
                            key={index}
                        >
                            <div className='w-full bg-indigo-50 group-hover:bg-primary transition-all duration-500 overflow-hidden'>
                                <img
                                    className='w-full h-36 sm:h-48 object-cover object-top group-hover:scale-105 transition-all duration-500'
                                    src={item.image}
                                    alt={item.name}
                                />
                            </div>
                            <div className='p-2.5 sm:p-4 flex flex-col justify-between flex-grow'>
                                <div>
                                    <p className='text-neutral-800 text-sm sm:text-base font-semibold leading-snug line-clamp-1' title={item.name}>
                                        {item.name}
                                    </p>
                                    <p className='text-zinc-500 text-xs sm:text-sm mt-0.5 line-clamp-1'>
                                        {item.speciality}
                                    </p>
                                </div>
                                <div className='mt-2.5 pt-2 border-t border-gray-100 flex items-center justify-between'>
                                    <label className='flex items-center gap-1.5 cursor-pointer select-none'>
                                        <input
                                            onChange={() => changeAvailability(item._id)}
                                            type="checkbox"
                                            checked={item.available}
                                            className='accent-primary w-3.5 h-3.5 sm:w-4 sm:h-4 rounded cursor-pointer'
                                        />
                                        <span className={`text-[11px] sm:text-xs font-medium ${item.available ? 'text-green-600' : 'text-gray-400'}`}>
                                            {item.available ? 'Available' : 'Unavailable'}
                                        </span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}

export default DoctorList