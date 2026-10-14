import React, { useContext, useEffect } from 'react';
import { DoctorContext } from '../../context/DoctorContext';
import Loading from '../../components/Loading';
import { assets } from '../../assets/assets';

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

const calculateAge = (dob) => {
    if (!dob) return '--';
    const birthDate = new Date(dob);
    if (isNaN(birthDate.getTime())) return '--';
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age > 0 ? `${age} yrs` : '--';
};

const DoctorAppointment = () => {

    const {
        doctorAppoinments,
        fetchDoctorAppointments,
        dToken,
        loading,
        cancelAppointment,
        completeAppointment
    } = useContext(DoctorContext);

    useEffect(() => {
        if (dToken) {
            fetchDoctorAppointments();
        }
    }, [dToken]);

    if (loading && (!doctorAppoinments || doctorAppoinments.length === 0)) {
        return <Loading message="Loading your appointments..." />;
    }

    return (
        <div className='m-2.5 sm:m-5 w-full max-h-[90vh] overflow-y-auto pr-1 sm:pr-2'>
            {/* Header Section */}
            <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 sm:mb-5'>
                <div>
                    <h1 className='text-lg sm:text-2xl font-bold text-gray-800 tracking-tight'>Doctor Appointments</h1>
                    <p className='text-xs sm:text-sm text-gray-500 mt-0.5'>Review your booked patient appointments and schedule details</p>
                </div>

                <div className='flex items-center gap-2.5 self-start sm:self-auto'>
                    <span className='text-xs bg-indigo-50 text-primary font-semibold px-3 py-1 rounded-full border border-indigo-100'>
                        {doctorAppoinments?.length || 0} Appointments
                    </span>
                    <button
                        onClick={() => fetchDoctorAppointments()}
                        disabled={loading}
                        className='text-xs bg-white hover:bg-gray-50 text-gray-700 font-medium px-3.5 py-1.5 rounded-lg border border-gray-300 shadow-2xs hover:border-gray-400 transition-all cursor-pointer flex items-center gap-1.5'
                    >
                        <svg className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15' />
                        </svg>
                        Refresh
                    </button>
                </div>
            </div>

            {/* Table Container */}
            <div className='bg-white border border-gray-200 rounded-xl overflow-hidden shadow-xs'>
                {/* Table Header (Desktop) */}
                <div className='hidden sm:grid grid-cols-[0.5fr_2.5fr_1.2fr_1fr_2fr_1fr_1.2fr] items-center py-3.5 px-5 sm:px-6 border-b border-gray-200 bg-gray-50/80 text-gray-600 font-semibold text-xs uppercase tracking-wider'>
                    <p>#</p>
                    <p>Patient</p>
                    <p>Payment</p>
                    <p>Age</p>
                    <p>Date & Time</p>
                    <p>Fees</p>
                    <p className='text-center'>Action</p>
                </div>

                {/* Table Body */}
                {doctorAppoinments && doctorAppoinments.length > 0 ? (
                    <div className='divide-y divide-gray-100 max-h-[75vh] overflow-y-auto'>
                        {doctorAppoinments.map((appointment, index) => {
                            const patientName = appointment.userData?.name || appointment.patientName || 'Unknown Patient';
                            const patientEmail = appointment.userData?.email || '';
                            const patientImage = appointment.userData?.image || null;
                            const slotDateDisplay = slotDateFormat(appointment.slotDate || appointment.date);
                            const slotTimeDisplay = appointment.slotTime || appointment.time || 'N/A';
                            const ageDisplay = calculateAge(appointment.userData?.dob);
                            const amountDisplay = appointment.amount ? `$${appointment.amount}` : '$0';

                            return (
                                <div
                                    key={appointment._id || index}
                                    className='p-4 sm:px-6 sm:py-3.5 hover:bg-gray-50/80 transition-colors flex flex-col sm:grid sm:grid-cols-[0.5fr_2.5fr_1.2fr_1fr_2fr_1fr_1.2fr] sm:items-center gap-3 sm:gap-0 text-sm text-gray-600'
                                >
                                    {/* Number / Index */}
                                    <p className='hidden sm:block font-medium text-gray-400'>{index + 1}</p>

                                    {/* Patient Info */}
                                    <div className='flex items-center gap-3'>
                                        <span className='sm:hidden text-xs font-semibold text-gray-400 min-w-16'>Patient:</span>
                                        <div className='flex items-center gap-2.5 min-w-0'>
                                            {patientImage ? (
                                                <img
                                                    className='w-9 h-9 rounded-full object-cover border border-gray-200 shrink-0 bg-indigo-50'
                                                    src={patientImage}
                                                    alt={patientName}
                                                />
                                            ) : (
                                                <div className='w-9 h-9 rounded-full bg-indigo-50 text-primary border border-indigo-100 flex items-center justify-center font-bold text-xs shrink-0'>
                                                    {patientName.charAt(0).toUpperCase()}
                                                </div>
                                            )}
                                            <div className='min-w-0'>
                                                <p className='font-semibold text-gray-800 text-sm truncate'>{patientName}</p>
                                                {patientEmail && (
                                                    <p className='text-xs text-gray-400 truncate'>{patientEmail}</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Payment Method / Status */}
                                    <div className='flex items-center gap-2.5'>
                                        <span className='sm:hidden text-xs font-semibold text-gray-400 min-w-16'>Payment:</span>
                                        <span
                                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${appointment.payment
                                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                                : 'bg-amber-50 text-amber-700 border-amber-200'
                                                }`}
                                        >
                                            <span
                                                className={`w-1.5 h-1.5 rounded-full mr-1.5 ${appointment.payment ? 'bg-emerald-500' : 'bg-amber-500'
                                                    }`}
                                            />
                                            {appointment.payment ? 'Online / Paid' : 'Cash'}
                                        </span>
                                    </div>

                                    {/* Age */}
                                    <div className='flex items-center gap-2.5'>
                                        <span className='sm:hidden text-xs font-semibold text-gray-400 min-w-16'>Age:</span>
                                        <p className='text-xs sm:text-sm font-medium text-gray-700'>{ageDisplay}</p>
                                    </div>

                                    {/* Date & Time */}
                                    <div className='flex items-center gap-2.5'>
                                        <span className='sm:hidden text-xs font-semibold text-gray-400 min-w-16'>Schedule:</span>
                                        <div className='text-xs sm:text-sm text-gray-600 font-medium flex items-center gap-1.5 flex-wrap'>
                                            <span>{slotDateDisplay}</span>
                                            <span className='text-gray-300'>|</span>
                                            <span className='text-primary font-semibold'>{slotTimeDisplay}</span>
                                        </div>
                                    </div>

                                    {/* Fees */}
                                    <div className='flex items-center gap-2.5'>
                                        <span className='sm:hidden text-xs font-semibold text-gray-400 min-w-16'>Fees:</span>
                                        <p className='font-bold text-gray-800 text-sm sm:text-base'>
                                            {amountDisplay}
                                        </p>
                                    </div>

                                    {/* Action */}
                                    <div className='flex items-center justify-between sm:justify-center gap-2.5 pt-2 sm:pt-0 border-t sm:border-0 border-gray-100'>
                                        <span className='sm:hidden text-xs font-semibold text-gray-400 min-w-16'>Action:</span>
                                        {appointment.cancel ? (
                                            <span className='inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border bg-red-50 text-red-600 border-red-200'>
                                                <span className='w-1.5 h-1.5 rounded-full mr-1.5 bg-red-500' />
                                                Cancelled
                                            </span>
                                        ) : appointment.isComplete ? (
                                            <span className='inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border bg-emerald-50 text-emerald-700 border-emerald-200'>
                                                <span className='w-1.5 h-1.5 rounded-full mr-1.5 bg-emerald-500' />
                                                Completed
                                            </span>
                                        ) : (
                                            <div className='flex items-center gap-2'>
                                                <button
                                                    onClick={() => cancelAppointment(appointment._id)}
                                                    disabled={loading}
                                                    className='cursor-pointer group hover:scale-110 active:scale-95 transition-all p-1 rounded-full hover:bg-red-50 flex items-center justify-center disabled:opacity-50'
                                                    title='Cancel Appointment'
                                                >
                                                    <img className='w-8 h-8' src={assets.cancel_icon} alt='Cancel' />
                                                </button>
                                                <button
                                                    onClick={() => completeAppointment(appointment._id)}
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
                        })}
                    </div>
                ) : (
                    /* Empty State */
                    <div className='flex flex-col items-center justify-center py-16 px-4 text-center'>
                        <div className='w-14 h-14 bg-indigo-50 text-primary rounded-full flex items-center justify-center mb-3.5 border border-indigo-100 shadow-2xs'>
                            <svg className='w-7 h-7 text-primary' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='1.5' d='M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' />
                            </svg>
                        </div>
                        <p className='text-gray-800 font-semibold text-base sm:text-lg'>No Appointments Found</p>
                        <p className='text-gray-400 text-xs sm:text-sm mt-1 max-w-sm'>
                            There are currently no patient appointments booked for your schedule.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DoctorAppointment;