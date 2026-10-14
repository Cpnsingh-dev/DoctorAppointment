import { useContext, useEffect } from 'react'
import { AdminContext } from '../../context/AdminContext'
import Loading from '../../components/Loading'
import { assets } from '../../assets/assets'

const AllAppointment = () => {

    const { aToken, getAllAppointments, appointments, loading, cacelAppointmentByAdmin } = useContext(AdminContext);

    useEffect(() => {
        if (aToken) {
            getAllAppointments();
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

    if (loading) {
        return <Loading message="Loading appointments..." />;
    }

    return (
        <div className='m-2.5 sm:m-5 w-full max-h-[90vh] overflow-y-auto pr-1 sm:pr-2'>
            <div className='flex items-center justify-between mb-3 sm:mb-4'>
                <h1 className='text-base sm:text-xl font-bold text-gray-800'>All Appointments</h1>
                <span className='text-xs bg-indigo-50 text-primary font-semibold px-2.5 py-0.5 rounded-full border border-indigo-100'>
                    {appointments?.length || 0} Appointments
                </span>
            </div>

            <div className='bg-white border border-gray-200 rounded-xl overflow-hidden shadow-xs'>
                {/* Table Header */}
                <div className='hidden sm:grid grid-cols-[0.5fr_2.5fr_2.5fr_2.5fr_1fr_1.2fr_1.2fr_1fr] items-center py-3.5 px-5 sm:px-6 border-b border-gray-200 bg-gray-50/80 text-gray-600 font-semibold text-xs uppercase tracking-wider'>
                    <p>#</p>
                    <p>Patient</p>
                    <p>Doctor</p>
                    <p>Date & Time</p>
                    <p>Amount</p>
                    <p>Payment</p>
                    <p>Status</p>
                    <p className='text-center'>Action</p>
                </div>

                {/* Table Body */}
                {appointments && appointments.length > 0 ? (
                    <div className='divide-y divide-gray-100 max-h-[75vh] overflow-y-auto'>
                        {appointments.map((appointment, index) => (
                            <div
                                key={appointment._id}
                                className='p-4 sm:px-6 sm:py-3.5 hover:bg-gray-50/80 transition-colors flex flex-col sm:grid sm:grid-cols-[0.5fr_2.5fr_2.5fr_2.5fr_1fr_1.2fr_1.2fr_1fr] sm:items-center gap-2.5 sm:gap-0 text-sm text-gray-600'
                            >
                                <p className='hidden sm:block font-medium text-gray-400'>{index + 1}</p>

                                <div className='flex items-center gap-2.5'>
                                    <span className='sm:hidden text-xs font-semibold text-gray-400 min-w-16'>Patient:</span>
                                    <div className='flex items-center gap-2'>
                                        {appointment.userData?.image ? (
                                            <img
                                                className='w-8 h-8 rounded-full object-cover border border-gray-200 shrink-0'
                                                src={appointment.userData.image}
                                                alt={appointment.userData?.name || 'Patient'}
                                            />
                                        ) : (
                                            <div className='w-8 h-8 rounded-full bg-indigo-50 text-primary flex items-center justify-center font-semibold text-xs border border-indigo-100 shrink-0'>
                                                {appointment.userData?.name?.charAt(0)?.toUpperCase() || 'P'}
                                            </div>
                                        )}
                                        <p className='font-medium text-gray-800 line-clamp-1'>
                                            {appointment.userData?.name || 'Unknown'}
                                        </p>
                                    </div>
                                </div>

                                <div className='flex items-center gap-2.5'>
                                    <span className='sm:hidden text-xs font-semibold text-gray-400 min-w-16'>Doctor:</span>
                                    <div className='flex items-center gap-2'>
                                        {appointment.docData?.image ? (
                                            <img
                                                className='w-8 h-8 rounded-full object-cover border border-gray-200 shrink-0'
                                                src={appointment.docData.image}
                                                alt={appointment.docData?.name || 'Doctor'}
                                            />
                                        ) : (
                                            <div className='w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center font-semibold text-xs border border-emerald-100 shrink-0'>
                                                {appointment.docData?.name?.charAt(0)?.toUpperCase() || 'D'}
                                            </div>
                                        )}
                                        <p className='font-medium text-gray-800 line-clamp-1'>
                                            {appointment.docData?.name || 'Unknown'}
                                        </p>
                                    </div>
                                </div>

                                <div className='flex items-center gap-2.5'>
                                    <span className='sm:hidden text-xs font-semibold text-gray-400 min-w-16'>Schedule:</span>
                                    <p className='text-xs sm:text-sm text-gray-600 font-medium'>
                                        <span>{slotDateFormat(appointment.slotDate)}</span>
                                        <span className='mx-1.5 text-gray-300'>|</span>
                                        <span className='text-primary'>{appointment.slotTime}</span>
                                    </p>
                                </div>

                                <div className='flex items-center gap-2.5'>
                                    <span className='sm:hidden text-xs font-semibold text-gray-400 min-w-16'>Amount:</span>
                                    <p className='font-semibold text-gray-800'>
                                        ${appointment.amount}
                                    </p>
                                </div>

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
                                        {appointment.payment ? "Paid" : "Not Paid"}
                                    </span>
                                </div>

                                <div className='flex items-center gap-2.5'>
                                    <span className='sm:hidden text-xs font-semibold text-gray-400 min-w-16'>Status:</span>
                                    <span
                                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${appointment.cancel
                                            ? 'bg-red-50 text-red-600 border-red-200'
                                            : appointment.isComplete
                                            ? 'bg-indigo-50 text-primary border-indigo-200'
                                            : 'bg-amber-50 text-amber-700 border-amber-200'
                                            }`}
                                    >
                                        <span
                                            className={`w-1.5 h-1.5 rounded-full mr-1.5 ${appointment.cancel
                                                ? 'bg-red-500'
                                                : appointment.isComplete
                                                ? 'bg-primary'
                                                : 'bg-amber-500'
                                                }`}
                                        />
                                        {appointment.cancel ? "Cancelled" : appointment.isComplete ? "Completed" : "Active"}
                                    </span>
                                </div>

                                <div className='flex items-center justify-between sm:justify-center gap-2.5 pt-1 sm:pt-0 border-t sm:border-0 border-gray-100'>
                                    <span className='sm:hidden text-xs font-semibold text-gray-400 min-w-16'>Action:</span>
                                    {appointment.cancel ? (
                                        <span className='text-xs font-medium text-red-500 bg-red-50 px-2.5 py-1 rounded-full border border-red-100'>
                                            Cancelled
                                        </span>
                                    ) : appointment.isComplete ? (
                                        <span className='text-xs font-medium text-green-600 bg-green-50 px-2.5 py-1 rounded-full border border-green-100'>
                                            Completed
                                        </span>
                                    ) : (
                                        <button
                                            onClick={() => cacelAppointmentByAdmin(appointment._id)}
                                            className='cursor-pointer group hover:scale-110 active:scale-95 transition-all p-1 rounded-full hover:bg-red-50 flex items-center justify-center'
                                            title='Cancel Appointment'
                                        >
                                            <img className='w-8 h-8' src={assets.cancel_icon} alt='Cancel' />
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className='flex flex-col items-center justify-center py-16 px-4 text-center'>
                        <div className='w-14 h-14 bg-indigo-50 text-primary rounded-full flex items-center justify-center mb-3 border border-indigo-100'>
                            <svg className='w-7 h-7 text-primary' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='1.5' d='M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' />
                            </svg>
                        </div>
                        <p className='text-gray-700 font-medium text-base'>No appointments found</p>
                        <p className='text-gray-400 text-xs sm:text-sm mt-1'>There are currently no booked appointments to display.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AllAppointment;