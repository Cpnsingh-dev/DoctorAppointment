import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const AppContext = createContext();

const currency = "$";

const AppContextProvider = (props) => {

    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(false);
    const [token, setToken] = useState(localStorage.getItem('token') ? localStorage.getItem('token') : "");
    const [userData, setUserData] = useState(false);
    const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";

    useEffect(() => {
        if (token) {
            localStorage.setItem('token', token);
        } else {
            localStorage.removeItem('token');
        }
    }, [token]);

    const getDoctorsData = async (showLoading = false) => {
        try {
            if (showLoading) setLoading(true);
            const { data } = await axios.get(backendUrl + '/api/doctor/list');
            if (data.success) {
                setDoctors(data.doctors);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        } finally {
            if (showLoading) setLoading(false);
        }
    };

    // Load user profile data
    const loadUserProfileData = async () => {
        try {
            const { data } = await axios.get(backendUrl + '/api/user/get-profile', {
                headers: { token }
            });
            if (data.success) {
                let user = data.userData;
                if (user && typeof user.address === 'string') {
                    try {
                        user.address = JSON.parse(user.address);
                    } catch (e) {
                        user.address = { line1: user.address, line2: "" };
                    }
                }
                setUserData(user);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    };

    useEffect(() => {
        if (token) {
            loadUserProfileData();
        } else {
            setUserData(false);
        }
    }, [token]);

    useEffect(() => {
        // Initial load
        getDoctorsData(true);

        // Sync when user returns to this browser tab
        const handleFocus = () => {
            getDoctorsData(false);
        };
        window.addEventListener('focus', handleFocus);

        // Periodic background poll every 10 seconds so changes in database update automatically
        const interval = setInterval(() => {
            getDoctorsData(false);
        }, 10000);

        return () => {
            window.removeEventListener('focus', handleFocus);
            clearInterval(interval);
        };
    }, []);

    const values = {
        doctors,
        token,
        setToken,
        getDoctorsData,
        currency,
        backendUrl,
        loading,
        userData,
        setUserData,
        loadUserProfileData
    };

    return (
        <AppContext.Provider value={values}>
            {props.children}
        </AppContext.Provider>
    );
};

export default AppContextProvider;