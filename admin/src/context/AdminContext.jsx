import { useState, useEffect, createContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const AdminContext = createContext();

const AdminContextProvider = (props) => {

    const [aToken, setAToken] = useState(localStorage.getItem('aToken') ? localStorage.getItem('aToken') : "");
    const [doctors, setDoctors] = useState([]);
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [dashData, setDashData] = useState({});
    const backenedUrl = import.meta.env.VITE_BACKENED_URL;

    useEffect(() => {
        if (aToken) {
            localStorage.setItem('aToken', aToken);
        } else {
            localStorage.removeItem('aToken');
        }
    }, [aToken]);

    const getAllDoctors = async () => {
        try {
            setLoading(true);
            const { data } = await axios.post(
                backenedUrl + '/api/admin/all-doctors',
                {},
                { headers: { aToken } }
            );

            if (data.success) {
                setDoctors(data.doctors);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    const changeAvailability = async (docId) => {
        try {
            setLoading(true);
            const { data } = await axios.post(
                backenedUrl + '/api/admin/change-availability',
                { docId },
                { headers: { aToken } }
            );

            if (data.success) {
                toast.success(data.message);
                getAllDoctors();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    const getAllAppointments = async () => {
        try {
            setLoading(true);
            const { data } = await axios.post(
                backenedUrl + '/api/admin/all-appointments',
                {},
                { headers: { aToken } }
            );

            if (data.success) {
                setAppointments(data.appointments);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    const cacelAppointmentByAdmin = async (aptId) => {
        try {
            setLoading(true);
            const { data } = await axios.post(
                backenedUrl + '/api/admin/cancel-appointment',
                { aptId },
                { headers: { aToken } }
            );

            if (data.success) {
                toast.success(data.message);
                getAllAppointments();
                getDashBoardData();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    const getDashBoardData = async () => {
        try {
            setLoading(true);
            const { data } = await axios.post(
                backenedUrl + '/api/admin/dashboard',
                {},
                { headers: { aToken } }
            );

            if (data.success) {
                setDashData(data.dashData);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    }

    const value = {
        aToken,
        setAToken,
        backenedUrl,
        doctors,
        getAllDoctors,
        changeAvailability,
        loading,
        setLoading,
        appointments, setAppointments,
        getAllAppointments,
        cacelAppointmentByAdmin,
        cancelAppointmentByAdmin: cacelAppointmentByAdmin,
        dashData,
        getDashBoardData, setDashData
    };

    return (
        <AdminContext.Provider value={value}>
            {props.children}
        </AdminContext.Provider>
    );
};

export default AdminContextProvider;