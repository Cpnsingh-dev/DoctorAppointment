
import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";


export const DoctorContext = createContext()

const DoctorContextProvider = (props) => {

    const backenedUrl = import.meta.env.VITE_BACKENED_URL;
    const [dToken, setDToken] = useState(localStorage.getItem('dToken') ? localStorage.getItem('dToken') : "");

    const [doctorAppoinments, setDoctorAppoinments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [doctorDashboardData, setDoctorDashboardData] = useState(false);

    const fetchDoctorAppointments = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get(`${backenedUrl}/api/doctor/appointments`, {
                headers: {
                    "Content-Type": "application/json",
                    "authtoken": dToken
                }
            });
            console.log(data);
            if (data.success) {
                setDoctorAppoinments(data.appointments.reverse());
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    }

    const [profileData, setProfileData] = useState(false);

    useEffect(() => {
        if (dToken) {
            localStorage.setItem('dToken', dToken);
        } else {
            localStorage.removeItem('dToken');
            setDoctorAppoinments([]);
            setDoctorDashboardData(false);
            setProfileData(false);
        }
    }, [dToken]);

    useEffect(() => {
        if (dToken) {
            fetchDoctorAppointments();
        }
    }, [dToken]);

    const cancelAppointment = async (appointmentId) => {
        try {
            setLoading(true);
            const { data } = await axios.post(
                `${backenedUrl}/api/doctor/cancel-appointment`,
                { appointmentId },
                {
                    headers: {
                        authtoken: dToken
                    }
                }
            );

            if (data.success) {
                toast.success(data.message);
                fetchDoctorAppointments();
                fetchDoctorDashboard();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    const completeAppointment = async (appointmentId) => {
        try {
            setLoading(true);
            const { data } = await axios.post(
                `${backenedUrl}/api/doctor/complete-appointment`,
                { appointmentId },
                {
                    headers: {
                        authtoken: dToken
                    }
                }
            );

            if (data.success) {
                toast.success(data.message);
                fetchDoctorAppointments();
                fetchDoctorDashboard();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    const logoutDoctor = () => {
        setDToken("");
        localStorage.removeItem('dToken');
        setDoctorAppoinments([]);
        setDoctorDashboardData(false);
        setProfileData(false);
    };

    const fetchDoctorDashboard = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get(`${backenedUrl}/api/doctor/dashboard`, {
                headers: {
                    "Content-Type": "application/json",
                    "authtoken": dToken
                }
            });
            console.log(data);
            if (data.success) {
                setDoctorDashboardData(data.dashData);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    const getProfileData = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get(`${backenedUrl}/api/doctor/profile`, {
                headers: {
                    authtoken: dToken
                }
            });
            if (data.success) {
                setProfileData(data.profileData);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    const value = {
        backenedUrl,
        dToken,
        setDToken,
        doctorAppoinments,
        fetchDoctorAppointments,
        cancelAppointment,
        completeAppointment,
        logoutDoctor,
        loading,
        setLoading,
        fetchDoctorDashboard,
        doctorDashboardData,
        setDoctorDashboardData,
        profileData,
        setProfileData,
        getProfileData
    }

    return (
        <DoctorContext.Provider value={value}>
            {props.children}
        </DoctorContext.Provider>
    )
}

export default DoctorContextProvider