import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'

const MyAppointments = () => {
    const { backendUrl, token, getDoctorsData } = useContext(AppContext);
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [cancellingId, setCancellingId] = useState(null);
    const [payingId, setPayingId] = useState(null);
    const navigate = useNavigate();

    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    const slotDateFormat = (slotDate) => {
        if (!slotDate) return '';
        if (typeof slotDate === 'string' && slotDate.includes('_')) {
            const dateArray = slotDate.split('_');
            if (dateArray.length === 3) {
                const monthIndex = Number(dateArray[1]) - 1;
                return `${dateArray[0]} ${months[monthIndex] || ''} ${dateArray[2]}`;
            }
        }
        const d = new Date(slotDate);
        if (!isNaN(d.getTime())) {
            return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
        }
        return slotDate;
    };

    const formatAddress = (address) => {
        if (!address) return '';
        if (typeof address === 'string') {
            try {
                address = JSON.parse(address);
            } catch (e) {
                return address;
            }
        }
        if (typeof address === 'object') {
            return [address.line1, address.line2, address.city, address.state, address.pincode].filter(Boolean).join(", ");
        }
        return '';
    };

    const getUserAppointments = async () => {
        if (!token) return;
        try {
            setLoading(true);
            const { data } = await axios.get(`${backendUrl}/api/user/appointments`, {
                headers: { token }
            });

            if (data.success) {
                setAppointments(data.appointments);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || error.message);
        } finally {
            setLoading(false);
        }
    };

    const cancelAppointment = async (appointmentId) => {
        try {
            setCancellingId(appointmentId);
            const { data } = await axios.post(
                `${backendUrl}/api/user/cancel-appointment`,
                { appointmentId },
                { headers: { token } }
            );

            if (data.success) {
                toast.success(data.message);
                await getUserAppointments();
                if (getDoctorsData) {
                    await getDoctorsData();
                }
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || error.message);
        } finally {
            setCancellingId(null);
        }
    };

    const initPay = (order, razorpayKey) => {
        const key = razorpayKey || import.meta.env.VITE_RAZORPAY_KEY_ID;

        if (!key) {
            toast.error("Razorpay Key ID is not configured. Please add it to your .env file.");
            return;
        }

        const options = {
            key,
            amount: order.amount,
            currency: order.currency,
            name: 'Appointment Payment',
            description: 'Prescripto Doctor Appointment Fee',
            order_id: order.id,
            receipt: order.receipt,
            handler: async (response) => {
                try {
                    const { data } = await axios.post(
                        `${backendUrl}/api/user/verify-razorpay`,
                        { ...response, appointmentId: order.receipt },
                        { headers: { token } }
                    );

                    if (data.success) {
                        toast.success(data.message || "Payment Successful!");
                        await getUserAppointments();
                        if (getDoctorsData) {
                            await getDoctorsData();
                        }
                    } else {
                        toast.error(data.message || "Payment verification failed");
                    }
                } catch (error) {
                    console.log(error);
                    toast.error(error.response?.data?.message || error.message);
                }
            },
            theme: {
                color: '#5f6FFF'
            }
        };

        if (window.Razorpay) {
            const rzp = new window.Razorpay(options);
            rzp.on('payment.failed', function (response) {
                toast.error(response.error?.description || "Payment failed");
            });
            rzp.open();
        } else {
            toast.error("Razorpay SDK not loaded. Please check your internet connection.");
        }
    };

    const appointmentRazorpay = async (appointmentId) => {
        try {
            setPayingId(appointmentId);
            const { data } = await axios.post(
                `${backendUrl}/api/user/payment-razorpay`,
                { appointmentId },
                { headers: { token } }
            );

            if (data.success) {
                initPay(data.order, data.key);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || error.message);
        } finally {
            setPayingId(null);
        }
    };

    useEffect(() => {
        if (token) {
            getUserAppointments();
        }
    }, [token]);

    if (!token) {
        return (
            <div className='min-h-[50vh] flex flex-col items-center justify-center gap-4 text-center my-12'>
                <p className='text-lg font-medium text-gray-700'>Please login to view your appointments</p>
                <button
                    onClick={() => navigate('/login')}
                    className='bg-primary text-white px-8 py-2.5 rounded-full hover:bg-opacity-90 transition-all font-light cursor-pointer'
                >
                    Login
                </button>
            </div>
        );
    }

    return (
        <div>
            <p className='pb-3 mt-12 font-medium text-zinc-700 border-b border-gray-300'>
                My Appointments / Bookings
            </p>

            {loading ? (
                <div className='py-20 flex flex-col items-center justify-center gap-3 text-gray-500'>
                    <div className='w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin'></div>
                    <p>Loading your appointments...</p>
                </div>
            ) : appointments.length === 0 ? (
                <div className='py-20 flex flex-col items-center justify-center text-center gap-4'>
                    <p className='text-lg text-gray-600 font-medium'>No appointments booked yet.</p>
                    <button
                        onClick={() => navigate('/doctors')}
                        className='bg-primary text-white px-8 py-2.5 rounded-full hover:bg-opacity-90 transition-all font-light cursor-pointer'
                    >
                        Book an Appointment
                    </button>
                </div>
            ) : (
                <div className='divide-y divide-gray-200'>
                    {appointments.map((item) => {
                        const doctor = item.docData || item.doctorData || {};
                        return (
                            <div
                                className='grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 py-5 border-b border-gray-200'
                                key={item._id}
                            >
                                <div>
                                    <img
                                        className='w-32 h-36 object-cover bg-indigo-50 rounded-md'
                                        src={doctor.image}
                                        alt={doctor.name || "Doctor"}
                                    />
                                </div>

                                <div className='flex-1 text-sm text-zinc-600'>
                                    <p className='text-neutral-800 font-semibold text-base'>{doctor.name}</p>
                                    <p className='text-zinc-500'>{doctor.speciality}</p>

                                    <p className='text-zinc-700 font-medium mt-2'>Address:</p>
                                    <p className='text-xs text-zinc-500 max-w-sm'>
                                        {formatAddress(doctor.address) || "Clinic Address"}
                                    </p>

                                    <p className='text-xs mt-2'>
                                        <span className='text-sm text-neutral-700 font-medium'>Date & Time : </span>
                                        <span className='font-medium text-primary text-sm'>
                                            {slotDateFormat(item.slotDate)} | {item.slotTime}
                                        </span>
                                    </p>
                                </div>

                                <div className='flex flex-col gap-2 justify-end'>
                                    {!item.cancel && item.payment && !item.isComplete && (
                                        <button
                                            disabled
                                            className='sm:min-w-48 py-2 border border-indigo-200 rounded text-primary bg-indigo-50 text-sm font-medium cursor-default text-center'
                                        >
                                            Paid
                                        </button>
                                    )}

                                    {!item.cancel && !item.payment && !item.isComplete && (
                                        <button
                                            onClick={() => appointmentRazorpay(item._id)}
                                            disabled={payingId === item._id}
                                            className={`text-sm text-center sm:min-w-48 py-2 border rounded transition-all duration-300 cursor-pointer ${payingId === item._id
                                                    ? 'border-gray-300 bg-gray-100 text-gray-400 cursor-not-allowed'
                                                    : 'border-gray-300 text-stone-500 hover:bg-primary hover:text-white hover:border-primary'
                                                }`}
                                        >
                                            {payingId === item._id ? 'Processing...' : 'Pay Online'}
                                        </button>
                                    )}

                                    {!item.cancel && !item.isComplete && (
                                        <button
                                            onClick={() => cancelAppointment(item._id)}
                                            disabled={cancellingId === item._id}
                                            className={`text-sm text-center sm:min-w-48 py-2 border rounded transition-all duration-300 cursor-pointer ${cancellingId === item._id
                                                    ? 'border-gray-300 bg-gray-100 text-gray-400 cursor-not-allowed'
                                                    : 'border-gray-300 text-stone-500 hover:bg-red-600 hover:text-white hover:border-red-600'
                                                }`}
                                        >
                                            {cancellingId === item._id ? 'Cancelling...' : 'Cancel Appointment'}
                                        </button>
                                    )}

                                    {item.cancel && (
                                        <button
                                            disabled
                                            className='sm:min-w-48 py-2 border border-red-500 rounded text-red-500 bg-red-50 text-sm font-medium cursor-not-allowed text-center'
                                        >
                                            Appointment Cancelled
                                        </button>
                                    )}

                                    {item.isComplete && (
                                        <button
                                            disabled
                                            className='sm:min-w-48 py-2 border border-green-500 rounded text-green-500 bg-green-50 text-sm font-medium cursor-not-allowed text-center'
                                        >
                                            Completed
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default MyAppointments;