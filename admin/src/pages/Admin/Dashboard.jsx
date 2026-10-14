import React, { useContext, useEffect } from 'react'
import { AdminContext } from '../../context/AdminContext'
import { assets } from '../../assets/assets'
import Loading from '../../components/Loading'

const Dashboard = () => {

    const { aToken, dashData, getDashBoardData, loading, cacelAppointmentByAdmin } = useContext(AdminContext);

    useEffect(() => {
        if (aToken) {
            getDashBoardData();
        }
    }, [aToken]);

    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const slotDateFormat = (slotDate) => {
        if (!slotDate) return '';
        if (typeof slotDate === 'string' && slotDate.includes('_')) {
            const dateArray = slotDate.split('_');
            if (dateArray.length === 3) {
                return `${dateArray[0]} ${months[Number(dateArray[1]) - 1] || ''} ${dateArray[2]}`;
            }
        }
        return slotDate;
    };

    if (loading && (!dashData || Object.keys(dashData).length === 0)) {
        return <Loading message="Loading dashboard..." />;
    }

    return (
        <div className='m-2.5 sm:m-5 w-full max-h-[90vh] overflow-y-auto pr-1 sm:pr-2'>
            <div className='flex items-center justify-between mb-5'>
                <div>
                    <h1 className='text-lg sm:text-xl font-bold text-gray-800'>Dashboard</h1>
                    <p className='text-xs sm:text-sm text-gray-500 mt-0.5'>Overview of doctors, patients, and bookings</p>
                </div>
                <button
                    onClick={() => getDashBoardData()}
                    className='text-xs bg-indigo-50 hover:bg-indigo-100 text-primary font-medium px-3.5 py-1.5 rounded-lg border border-indigo-100 transition-colors cursor-pointer'
                >
                    Refresh
                </button>
            </div>

            {/* Stat Cards with Assets Icons */}
            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4 mb-7'>
                {/* Total Doctors */}
                <div className='flex items-center gap-3.5 bg-white p-4 rounded-xl border border-gray-200 shadow-xs hover:shadow-md hover:border-indigo-200 hover:scale-[1.02] transition-all cursor-pointer'>
                    <img className='w-14 h-14 shrink-0' src={assets.doctor_icon} alt="Doctors" />
                    <div>
                        <p className='text-xl sm:text-2xl font-bold text-gray-700 leading-tight'>{dashData?.doctors ?? 0}</p>
                        <p className='text-xs sm:text-sm text-gray-400 font-medium'>Total Doctors</p>
                    </div>
                </div>

                {/* Total Appointments */}
                <div className='flex items-center gap-3.5 bg-white p-4 rounded-xl border border-gray-200 shadow-xs hover:shadow-md hover:border-indigo-200 hover:scale-[1.02] transition-all cursor-pointer'>
                    <img className='w-14 h-14 shrink-0' src={assets.appointments_icon} alt="Appointments" />
                    <div>
                        <p className='text-xl sm:text-2xl font-bold text-gray-700 leading-tight'>{dashData?.appointments ?? 0}</p>
                        <p className='text-xs sm:text-sm text-gray-400 font-medium'>Appointments</p>
                    </div>
                </div>

                {/* Total Patients */}
                <div className='flex items-center gap-3.5 bg-white p-4 rounded-xl border border-gray-200 shadow-xs hover:shadow-md hover:border-indigo-200 hover:scale-[1.02] transition-all cursor-pointer'>
                    <img className='w-14 h-14 shrink-0' src={assets.patients_icon} alt="Patients" />
                    <div>
                        <p className='text-xl sm:text-2xl font-bold text-gray-700 leading-tight'>{dashData?.patients ?? 0}</p>
                        <p className='text-xs sm:text-sm text-gray-400 font-medium'>Total Patients</p>
                    </div>
                </div>

                {/* Completed Appointments */}
                <div className='flex items-center gap-3.5 bg-white p-4 rounded-xl border border-gray-200 shadow-xs hover:shadow-md hover:border-teal-200 hover:scale-[1.02] transition-all cursor-pointer'>
                    <div className='w-14 h-14 rounded-xl bg-[#F5FEF7] border border-[#7CFF89]/40 flex items-center justify-center shrink-0'>
                        <img className='w-10 h-10 object-contain' src={assets.tick_icon} alt="Completed" />
                    </div>
                    <div>
                        <p className='text-xl sm:text-2xl font-bold text-gray-700 leading-tight'>{dashData?.totalCompletedAppointments ?? 0}</p>
                        <p className='text-xs sm:text-sm text-gray-400 font-medium'>Completed</p>
                    </div>
                </div>

                {/* Cancelled Appointments */}
                <div className='flex items-center gap-3.5 bg-white p-4 rounded-xl border border-gray-200 shadow-xs hover:shadow-md hover:border-rose-200 hover:scale-[1.02] transition-all cursor-pointer'>
                    <div className='w-14 h-14 rounded-xl bg-[#FEF7F5] border border-[#FFE7E2] flex items-center justify-center shrink-0'>
                        <img className='w-10 h-10 object-contain' src={assets.cancel_icon} alt="Cancelled" />
                    </div>
                    <div>
                        <p className='text-xl sm:text-2xl font-bold text-gray-700 leading-tight'>{dashData?.totalCancelledAppointments ?? 0}</p>
                        <p className='text-xs sm:text-sm text-gray-400 font-medium'>Cancelled</p>
                    </div>
                </div>
            </div>

            {/* Latest Appointments Card */}
            <div className='bg-white border border-gray-200 rounded-xl shadow-xs overflow-hidden'>
                <div className='flex items-center gap-2.5 px-5 py-3.5 border-b border-gray-200 bg-gray-50/80'>
                    <img className='w-5 h-5' src={assets.list_icon} alt="" />
                    <h2 className='text-sm sm:text-base font-semibold text-gray-800'>Latest Bookings</h2>
                </div>

                <div className='divide-y divide-gray-100 max-h-[500px] overflow-y-auto'>
                    {dashData?.latestAppointments && dashData.latestAppointments.length > 0 ? (
                        dashData.latestAppointments.map((item, index) => (
                            <div
                                key={item._id || index}
                                className='flex items-center justify-between px-4 sm:px-6 py-3.5 gap-3 hover:bg-gray-50/80 transition-colors'
                            >
                                <div className='flex items-center gap-3.5 min-w-0 flex-1'>
                                    {item.docData?.image ? (
                                        <img
                                            className='w-11 h-11 rounded-full object-cover border border-gray-200 shrink-0 bg-indigo-50'
                                            src={item.docData.image}
                                            alt={item.docData.name}
                                        />
                                    ) : (
                                        <div className='w-11 h-11 rounded-full bg-indigo-50 text-primary border border-indigo-100 flex items-center justify-center font-bold text-sm shrink-0'>
                                            {item.docData?.name?.charAt(0) || 'D'}
                                        </div>
                                    )}

                                    <div className='min-w-0 flex-1 text-sm'>
                                        <div className='flex items-center gap-2 flex-wrap'>
                                            <p className='text-gray-800 font-semibold text-sm truncate'>
                                                {item.docData?.name || 'Doctor'}
                                            </p>
                                            <span className='text-xs text-gray-400 font-normal'>• Patient:</span>
                                            <span className='text-xs sm:text-sm text-gray-700 font-medium truncate'>
                                                {item.userData?.name || 'Patient'}
                                            </span>
                                        </div>
                                        <p className='text-gray-500 text-xs mt-0.5 flex items-center gap-1.5 flex-wrap'>
                                            <span>Booking on {slotDateFormat(item.slotDate)}</span>
                                            <span className='text-gray-300'>|</span>
                                            <span className='text-primary font-medium'>{item.slotTime}</span>
                                            <span className='text-gray-300'>|</span>
                                            <span className='font-semibold text-gray-700'>${item.amount}</span>
                                        </p>
                                    </div>
                                </div>

                                <div className='shrink-0 ml-2'>
                                    {item.cancel ? (
                                        <span className='text-xs font-medium text-red-500 bg-red-50 px-2.5 py-1 rounded-full border border-red-100'>
                                            Cancelled
                                        </span>
                                    ) : item.isComplete ? (
                                        <span className='text-xs font-medium text-green-600 bg-green-50 px-2.5 py-1 rounded-full border border-green-100'>
                                            Completed
                                        </span>
                                    ) : (
                                        <button
                                            onClick={() => cacelAppointmentByAdmin(item._id)}
                                            className='cursor-pointer group hover:scale-110 active:scale-95 transition-all p-1 rounded-full hover:bg-red-50 flex items-center justify-center'
                                            title='Cancel Appointment'
                                        >
                                            <img className='w-8 h-8' src={assets.cancel_icon} alt='Cancel' />
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className='py-12 px-4 text-center text-gray-400 text-sm'>
                            No recent appointments found
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;