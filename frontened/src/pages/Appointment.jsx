import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AppContext } from '../context/AppContext';
import { assets } from '../assets/assets';
import RelatedDoc from '../components/RelatedDoc';
import axios from 'axios';
import { toast } from 'react-toastify';


const Appointment = () => {
    const { doctorId } = useParams();
    const { doctors, currency, backendUrl, token, getDoctorsData } = useContext(AppContext);
    const navigate = useNavigate();
    const [docInfo, setDocInfo] = useState(null);
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const [docSlot, setDocSlot] = useState([]);
    const [slotIdx, setSlotIdx] = useState(0);
    const [slotTime, setSlotTime] = useState('');
    const [isBooking, setIsBooking] = useState(false);

    const fetchDocInfo = async () => {
        const docInfo = doctors.find(doc => doc._id === doctorId);
        setDocInfo(docInfo);
    }

    const getAvailableSlot = async () => {
        if (!docInfo) return;
        let today = new Date();
        let allSlots = [];

        // get the 7 days from today
        for (let i = 0; i < 7; i++) {
            let day = new Date(today);
            day.setDate(today.getDate() + i);

            // setting end time of the date with index (9:00 PM)
            let end = new Date(today);
            end.setDate(today.getDate() + i);
            end.setHours(21, 0, 0, 0);

            // setting starting hours
            if (today.getDate() === day.getDate()) {
                day.setHours(day.getHours() > 10 ? day.getHours() + 1 : 10);
                day.setMinutes(day.getMinutes() > 30 ? 30 : 0);
            } else {
                day.setHours(10, 0, 0, 0);
                day.setMinutes(0);
            }

            let TimeSlot = [];

            while (day < end) {
                let formattedTime = day.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                let dayNum = day.getDate();
                let month = day.getMonth() + 1;
                let year = day.getFullYear();

                const slotDate = `${dayNum}_${month}_${year}`;
                const isSlotBooked = Boolean(docInfo?.slots_booked?.[slotDate]?.includes(formattedTime));

                if (!isSlotBooked) {
                    TimeSlot.push({
                        dateTime: new Date(day),
                        time: formattedTime
                    });
                }

                // increment current time by 30 min
                day.setMinutes(day.getMinutes() + 30);
            }

            allSlots.push(TimeSlot);
        }

        setDocSlot(allSlots);
    }

    useEffect(() => {
        fetchDocInfo();
    }, [doctors, doctorId]);

    useEffect(() => {
        getAvailableSlot();
    }, [docInfo]);

    useEffect(() => {
        console.log(docSlot);
    }, [docSlot]);

    useEffect(() => {
        console.log(
            slotIdx,
            slotTime,
            slotTime.length
        );
    }, [slotIdx, slotTime]);

    const bookAppointment = async () => {
        if (!token) {
            toast.warn('Please login to book an appointment');
            return navigate('/login');
        }

        if (!docInfo.available) {
            toast.warn('Doctor is currently unavailable');
            return;
        }

        if (!slotTime) {
            toast.warn('Please select a time slot');
            return;
        }

        const selectedDaySlots = docSlot[slotIdx];
        if (!selectedDaySlots || selectedDaySlots.length === 0) {
            toast.warn('No slots available for this day');
            return;
        }

        const date = selectedDaySlots[0].dateTime;
        let day = date.getDate();
        let month = date.getMonth() + 1;
        let year = date.getFullYear();

        const slotDate = `${day}_${month}_${year}`;

        try {
            setIsBooking(true);
            const { data } = await axios.post(
                `${backendUrl}/api/user/book-appointment`,
                { doctorId, slotDate, slotTime },
                { headers: { token } }
            );

            if (data.success) {
                toast.success(data.message);
                await getDoctorsData();
                navigate('/my-appointments');
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || error.message);
        } finally {
            setIsBooking(false);
        }
    };

    return docInfo && (
        <div>
            {/* Doctor details */}
            <div className='flex flex-col sm:flex-row gap-4'>
                <div>
                    <img className='bg-primary w-full sm:max-w-72 rounded-lg' src={docInfo.image} alt={docInfo.name} />
                </div>

                <div className='flex-1 border border-gray-400 rounded-lg p-8 py-7 bg-white mx-2 sm:mx-0 mt-[-80px] sm:mt-0'>
                    {/* Doc info name degree etc */}
                    <div className='flex items-center gap-3 flex-wrap'>
                        <p className='flex items-center gap-2 text-2xl font-medium text-gray-900'>
                            {docInfo.name}
                            <img className='w-5' src={assets.verified_icon} alt="" />
                        </p>
                        <span className={`inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-medium ${docInfo.available ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-gray-100 text-gray-500 border border-gray-200'}`}>
                            <span className={`w-2 h-2 rounded-full ${docInfo.available ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                            {docInfo.available ? 'Available' : 'Currently Unavailable'}
                        </span>
                    </div>
                    <div className='flex items-center gap-2 text-sm mt-1 text-gray-600'>
                        <p>{docInfo.degree} - {docInfo.speciality}</p>
                        <button className='py-0.5 px-2 border text-xs rounded-full'>{docInfo.experience}</button>
                    </div>

                    {/* doctor about */}
                    <div>
                        <p className='flex items-center gap-1 text-sm font-medium text-gray-900 mt-3'>
                            About <img src={assets.info_icon} alt="" />
                        </p>
                        <p className='text-sm text-gray-500 max-w-[700px] mt-1'>{docInfo.about}</p>
                    </div>

                    <p className='mt-3 text-gray-700 text-lg font-medium'>Appointment Fee : <span className='font-bold text-primary text-2xl'>{currency}{docInfo.fees}</span></p>

                </div>
            </div>

            {/* booking slots */}
            <div className='sm:ml-72 sm:pl-4 mt-4 font-medium text-gray-700'>
                <p>Booking slots</p>
                <div className='flex gap-3 items-center w-full overflow-x-scroll mt-4'>
                    {docSlot.length > 0 && docSlot.map((item, index) => {
                        const dateObj = item[0] ? item[0].dateTime : new Date(Date.now() + index * 24 * 60 * 60 * 1000);
                        return (
                            <div
                                onClick={() => setSlotIdx(index)}
                                className={`text-center py-6 min-w-16 rounded-full cursor-pointer transition-all ${slotIdx === index ? 'bg-primary text-white' : 'border border-gray-200'}`}
                                key={index}
                            >
                                <p>{daysOfWeek[dateObj.getDay()]}</p>
                                <p>{dateObj.getDate()}</p>
                            </div>
                        );
                    })}
                </div>

                <div className='flex items-center gap-3 w-full overflow-x-scroll mt-4'>
                    {docSlot.length > 0 && docSlot[slotIdx] && docSlot[slotIdx].map((item, index) => (
                        <p
                            onClick={() => setSlotTime(item.time)}
                            className={`text-sm font-light flex-shrink-0 px-5 py-2 rounded-full cursor-pointer transition-all ${item.time === slotTime ? 'bg-primary text-white' : 'text-gray-400 border border-gray-300'}`}
                            key={index}
                        >
                            {item.time.toLowerCase()}
                        </p>
                    ))}
                </div>

                <button
                    onClick={bookAppointment}
                    disabled={!docInfo.available || isBooking}
                    className={`text-sm font-light px-14 py-3 rounded-full my-6 transition-all ${
                        docInfo.available && !isBooking 
                            ? 'bg-primary text-white cursor-pointer hover:bg-opacity-90 active:scale-95' 
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                >
                    {!docInfo.available 
                        ? 'Doctor is Currently Unavailable' 
                        : isBooking 
                            ? 'Booking Appointment...' 
                            : 'Book an appointment'}
                </button>
            </div>

            {/* Listing related doctors */}
            <RelatedDoc docId={doctorId} speciality={docInfo.speciality} />
        </div>
    );
}

export default Appointment