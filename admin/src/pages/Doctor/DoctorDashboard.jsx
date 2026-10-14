import React, { useContext, useEffect } from 'react';
import { DoctorContext } from '../../context/DoctorContext';
import { assets } from '../../assets/assets';
import Loading from '../../components/Loading';
import { useNavigate } from 'react-router-dom';

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

const DoctorDashboard = () => {

    const {
        doctorDashboardData,
        fetchDoctorDashboard,
        dToken,
        loading,
        cancelAppointment,
        completeAppointment
    } = useContext(DoctorContext);

    const navigate = useNavigate();

    useEffect(() => {
        if (dToken) {
            fetchDoctorDashboard();
        }
    }, [dToken]);

    if (loading && (!doctorDashboardData || Object.keys(doctorDashboardData).length === 0)) {
        return <Loading message="Loading your dashboard..." />;
    }

    return (
        <div className='m-2.5 sm:m-5 w-full max-h-[90vh] overflow-y-auto pr-1 sm:pr-2'>
            {/* Header Section */}
            <div className='flex items-center justify-between mb-5'>
                <div>
                    <h1 className='text-lg sm:text-2xl font-bold text-gray-800 tracking-tight'>Doctor Dashboard</h1>
                    <p className='text-xs sm:text-sm text-gray-500 mt-0.5'>
                        Welcome back! Overview of your earnings, patients, and bookings
                    </p>
                </div>
                <button
                    onClick={() => fetchDoctorDashboard()}
                    disabled={loading}
                    className='text-xs bg-white hover:bg-gray-50 text-gray-700 font-medium px-3.5 py-1.5 rounded-lg border border-gray-300 shadow-2xs hover:border-gray-400 transition-all cursor-pointer flex items-center gap-1.5'
                >
                    <svg className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15' />
                    </svg>
                    Refresh
                </button>
            </div>

            {/* Stat Cards Grid */}
            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4 mb-7'>
                {/* Total Earnings */}
                <div className='flex items-center gap-3.5 bg-white p-4 rounded-xl border border-gray-200 shadow-xs hover:shadow-md hover:border-indigo-200 hover:scale-[1.02] transition-all cursor-pointer'>
                    <img className='w-14 h-14 shrink-0' src={assets.earning_icon} alt="Earnings" />
                    <div>
                        <p className='text-xl sm:text-2xl font-bold text-gray-700 leading-tight'>
                            ${doctorDashboardData?.earnings ?? 0}
                        </p>
                        <p className='text-xs sm:text-sm text-gray-400 font-medium'>Total Earnings</p>
                    </div>
                </div>

                {/* Total Appointments */}
                <div
                    onClick={() => navigate('/doctor-appointments')}
                    className='flex items-center gap-3.5 bg-white p-4 rounded-xl border border-gray-200 shadow-xs hover:shadow-md hover:border-indigo-200 hover:scale-[1.02] transition-all cursor-pointer'
                >
                    <img className='w-14 h-14 shrink-0' src={assets.appointments_icon} alt="Appointments" />
                    <div>
                        <p className='text-xl sm:text-2xl font-bold text-gray-700 leading-tight'>
                            {doctorDashboardData?.appointments ?? 0}
                        </p>
                        <p className='text-xs sm:text-sm text-gray-400 font-medium'>Appointments</p>
                    </div>
                </div>

                {/* Total Patients */}
                <div className='flex items-center gap-3.5 bg-white p-4 rounded-xl border border-gray-200 shadow-xs hover:shadow-md hover:border-indigo-200 hover:scale-[1.02] transition-all cursor-pointer'>
                    <img className='w-14 h-14 shrink-0' src={assets.patients_icon} alt="Patients" />
                    <div>
                        <p className='text-xl sm:text-2xl font-bold text-gray-700 leading-tight'>
                            {doctorDashboardData?.patients ?? 0}
                        </p>
                        <p className='text-xs sm:text-sm text-gray-400 font-medium'>Total Patients</p>
                    </div>
                </div>

                {/* Completed Appointments */}
                <div className='flex items-center gap-3.5 bg-white p-4 rounded-xl border border-gray-200 shadow-xs hover:shadow-md hover:border-teal-200 hover:scale-[1.02] transition-all cursor-pointer'>
                    <div className='w-14 h-14 rounded-xl bg-[#F5FEF7] border border-[#7CFF89]/40 flex items-center justify-center shrink-0'>
                        <img className='w-10 h-10 object-contain' src={assets.tick_icon} alt="Completed" />
                    </div>
                    <div>
                        <p className='text-xl sm:text-2xl font-bold text-gray-700 leading-tight'>
                            {doctorDashboardData?.totalCompletedAppointments ?? 0}
                        </p>
                        <p className='text-xs sm:text-sm text-gray-400 font-medium'>Completed</p>
                    </div>
                </div>

                {/* Cancelled Appointments */}
                <div className='flex items-center gap-3.5 bg-white p-4 rounded-xl border border-gray-200 shadow-xs hover:shadow-md hover:border-rose-200 hover:scale-[1.02] transition-all cursor-pointer'>
                    <div className='w-14 h-14 rounded-xl bg-[#FEF7F5] border border-[#FFE7E2] flex items-center justify-center shrink-0'>
                        <img className='w-10 h-10 object-contain' src={assets.cancel_icon} alt="Cancelled" />
                    </div>
                    <div>
                        <p className='text-xl sm:text-2xl font-bold text-gray-700 leading-tight'>
                            {doctorDashboardData?.totalCancelledAppointments ?? 0}
                        </p>
                        <p className='text-xs sm:text-sm text-gray-400 font-medium'>Cancelled</p>
                    </div>
                </div>
            </div>

            {/* Latest Bookings Section */}
            <div className='bg-white border border-gray-200 rounded-xl shadow-xs overflow-hidden'>
                <div className='flex items-center justify-between px-5 py-3.5 border-b border-gray-200 bg-gray-50/80'>
                    <div className='flex items-center gap-2.5'>
                        <img className='w-5 h-5' src={assets.list_icon} alt="" />
                        <h2 className='text-sm sm:text-base font-semibold text-gray-800'>Latest Bookings</h2>
                    </div>
                    <button
                        onClick={() => navigate('/doctor-appointments')}
                        className='text-xs text-primary font-medium hover:underline cursor-pointer'
                    >
                        View all
                    </button>
                </div>

                <div className='divide-y divide-gray-100 max-h-[500px] overflow-y-auto'>
                    {doctorDashboardData?.latestAppointments && doctorDashboardData.latestAppointments.length > 0 ? (
                        doctorDashboardData.latestAppointments.map((item, index) => {
                            const patientName = item.userData?.name || item.patientName || 'Unknown Patient';
                            const patientImage = item.userData?.image || null;
                            const slotDateDisplay = slotDateFormat(item.slotDate || item.date);
                            const slotTimeDisplay = item.slotTime || item.time || 'N/A';
                            const amountDisplay = item.amount ? `$${item.amount}` : '$0';

                            return (
                                <div
                                    key={item._id || index}
                                    className='flex items-center justify-between px-4 sm:px-6 py-3.5 gap-3 hover:bg-gray-50/80 transition-colors'
                                >
                                    <div className='flex items-center gap-3.5 min-w-0 flex-1'>
                                        {patientImage ? (
                                            <img
                                                className='w-11 h-11 rounded-full object-cover border border-gray-200 shrink-0 bg-indigo-50'
                                                src={patientImage}
                                                alt={patientName}
                                            />
                                        ) : (
                                            <div className='w-11 h-11 rounded-full bg-indigo-50 text-primary border border-indigo-100 flex items-center justify-center font-bold text-sm shrink-0'>
                                                {patientName.charAt(0).toUpperCase()}
                                            </div>
                                        )}

                                        <div className='min-w-0 flex-1 text-sm'>
                                            <div className='flex items-center gap-2 flex-wrap'>
                                                <p className='text-gray-800 font-semibold text-sm truncate'>
                                                    {patientName}
                                                </p>
                                                {item.payment ? (
                                                    <span className='text-[11px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.2 rounded-full font-medium'>
                                                        Paid
                                                    </span>
                                                ) : (
                                                    <span className='text-[11px] bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.2 rounded-full font-medium'>
                                                        Cash
                                                    </span>
                                                )}
                                            </div>
                                            <p className='text-gray-500 text-xs mt-0.5 flex items-center gap-1.5 flex-wrap'>
                                                <span>Booking on {slotDateDisplay}</span>
                                                <span className='text-gray-300'>|</span>
                                                <span className='text-primary font-medium'>{slotTimeDisplay}</span>
                                                <span className='text-gray-300'>|</span>
                                                <span className='font-semibold text-gray-700'>{amountDisplay}</span>
                                            </p>
                                        </div>
                                    </div>

                                    {/* Action Buttons / Status */}
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
                                            <div className='flex items-center gap-1.5'>
                                                <button
                                                    onClick={() => cancelAppointment(item._id)}
                                                    disabled={loading}
                                                    className='cursor-pointer group hover:scale-110 active:scale-95 transition-all p-1 rounded-full hover:bg-red-50 flex items-center justify-center disabled:opacity-50'
                                                    title='Cancel Appointment'
                                                >
                                                    <img className='w-8 h-8' src={assets.cancel_icon} alt='Cancel' />
                                                </button>
                                                <button
                                                    onClick={() => completeAppointment(item._id)}
                                                    disabled={loading}
                                                    className='cursor-pointer group hover:scale-110 active:scale-95 transition-all p-1 rounded-full hover:bg-emerald-50 flex items-center justify-center disabled:opacity-50'
                                                    title='Mark Completed'
                                                >
                                                    <img className='w-8 h-8' src={assets.tick_icon} alt='Complete' />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className='py-12 px-4 text-center text-gray-400 text-sm'>
                            No recent bookings found
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DoctorDashboard;