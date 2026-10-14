import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AppContext } from '../context/AppContext'

const Doctors = () => {

    const navigate = useNavigate();

    const { speciality } = useParams()
    const { doctors } = useContext(AppContext);
    const [filterDoc, setFilterDoc] = useState([]);
    const [showFilter, setShowFilter] = useState(false);

    const ApllyFilter = () => {
        if (speciality) {
            setFilterDoc(doctors.filter(doc => doc.speciality.toLocaleLowerCase() === speciality.toLocaleLowerCase()))
        } else {
            setFilterDoc(doctors);
        }
    }

    useEffect(() => {
        ApllyFilter()
    }, [doctors, speciality]);

    return (
        <div>
            <p className='text-gray-600 font-semibold'>Browse through the doctors specialist.</p>
            <div className='flex flex-col sm:flex-row items-start gap-5 mt-5'>
                <button className={`py-1 px-3 border rounded text-sm transition-all sm:hidden ${showFilter ? 'bg-primary text-white' : ''}`} onClick={() => setShowFilter(prev => !prev)}>
                    Filters by Speciality
                </button>

                <div className={`flex-col gap-4 text-sm text-gray-600 ${showFilter ? 'flex' : 'hidden sm:flex'}`}>
                    <p onClick={() => speciality?.toLowerCase() === 'general physician' ? navigate('/doctors') : navigate('/doctors/General physician')} className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality?.toLowerCase() === 'general physician' ? 'bg-indigo-100 text-black font-medium' : ''}`}>
                        General physician
                    </p>
                    <p onClick={() => speciality?.toLowerCase() === 'gynecologist' ? navigate('/doctors') : navigate('/doctors/Gynecologist')} className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality?.toLowerCase() === 'gynecologist' ? 'bg-indigo-100 text-black font-medium' : ''}`}>
                        Gynecologist
                    </p>
                    <p onClick={() => speciality?.toLowerCase() === 'dermatologist' ? navigate('/doctors') : navigate('/doctors/Dermatologist')} className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality?.toLowerCase() === 'dermatologist' ? 'bg-indigo-100 text-black font-medium' : ''}`}>
                        Dermatologist
                    </p>
                    <p onClick={() => speciality?.toLowerCase() === 'pediatricians' ? navigate('/doctors') : navigate('/doctors/Pediatricians')} className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality?.toLowerCase() === 'pediatricians' ? 'bg-indigo-100 text-black font-medium' : ''}`}>
                        Pediatricians
                    </p>
                    <p onClick={() => speciality?.toLowerCase() === 'neurologist' ? navigate('/doctors') : navigate('/doctors/Neurologist')} className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality?.toLowerCase() === 'neurologist' ? 'bg-indigo-100 text-black font-medium' : ''}`}>
                        Neurologist
                    </p>
                    <p onClick={() => speciality?.toLowerCase() === 'gastroenterologist' ? navigate('/doctors') : navigate('/doctors/Gastroenterologist')} className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality?.toLowerCase() === 'gastroenterologist' ? 'bg-indigo-100 text-black font-medium' : ''}`}>
                        Gastroenterologist
                    </p>
                </div>

                <div className='w-full grid grid-cols-auto gap-4 gap-y-6'>
                    {filterDoc.map((doctor, index) => (
                        <div onClick={() => { navigate(`/appointment/${doctor._id}`); scrollTo(0, 0) }} className='border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-10px] transition-all duration-500 shadow-sm hover:shadow-md' key={index}>
                            <img className='bg-blue-50 w-full' src={doctor.image} alt="" />
                            <div className='p-4'>
                                <div className={`flex items-center gap-2 text-sm text-center ${doctor.available ? 'text-green-500' : 'text-gray-500'}`}>
                                    <p className={`w-2 h-2 ${doctor.available ? 'bg-green-500' : 'bg-gray-400'} rounded-full`}></p>
                                    <p>{doctor.available ? 'Available' : 'Not Available'}</p>
                                </div>
                                <p className='text-gray-900 text-lg font-medium'>{doctor.name}</p>
                                <p className='text-gray-600 text-sm'>{doctor.speciality}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Doctors