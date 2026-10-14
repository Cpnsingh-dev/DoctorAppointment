import React, { useContext, useEffect, useState } from 'react';
import { DoctorContext } from '../../context/DoctorContext';
import Loading from '../../components/Loading';
import axios from 'axios';
import { toast } from 'react-toastify';

const DoctorProfile = () => {

    const { dToken, profileData, setProfileData, getProfileData, backenedUrl, loading } = useContext(DoctorContext);
    const [isEdit, setIsEdit] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (dToken) {
            getProfileData();
        }
    }, [dToken]);

    const updateProfile = async () => {
        try {
            setSubmitting(true);
            const updatePayload = {
                address: profileData.address,
                fees: profileData.fees,
                available: profileData.available,
                about: profileData.about
            };

            const { data } = await axios.post(
                `${backenedUrl}/api/doctor/update-profile`,
                updatePayload,
                {
                    headers: {
                        authtoken: dToken
                    }
                }
            );

            if (data.success) {
                toast.success(data.message || 'Profile updated successfully');
                setIsEdit(false);
                getProfileData();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || error.message);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading && !profileData) {
        return <Loading message="Loading your profile..." />;
    }

    if (!profileData) {
        return (
            <div className='m-5 w-full flex flex-col items-center justify-center min-h-[50vh] text-center'>
                <p className='text-gray-600 text-base font-medium'>No profile data available.</p>
                <button
                    onClick={() => getProfileData()}
                    className='mt-3 text-xs bg-primary text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-opacity-90 transition-all'
                >
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className='m-2.5 sm:m-5 w-full max-h-[90vh] overflow-y-auto pr-1 sm:pr-2'>
            {/* Header Section */}
            <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5'>
                <div>
                    <h1 className='text-lg sm:text-2xl font-bold text-gray-800 tracking-tight'>Doctor Profile</h1>
                    <p className='text-xs sm:text-sm text-gray-500 mt-0.5'>
                        Manage your professional credentials, consultation fees, and schedule availability
                    </p>
                </div>

                <div className='flex items-center gap-2 self-start sm:self-auto'>
                    {isEdit ? (
                        <>
                            <button
                                onClick={() => {
                                    setIsEdit(false);
                                    getProfileData();
                                }}
                                disabled={submitting}
                                className='text-xs bg-white hover:bg-gray-50 text-gray-700 font-medium px-4 py-2 rounded-lg border border-gray-300 transition-all cursor-pointer'
                            >
                                Cancel
                            </button>
                            <button
                                onClick={updateProfile}
                                disabled={submitting}
                                className='text-xs bg-primary hover:bg-opacity-90 text-white font-medium px-5 py-2 rounded-lg shadow-sm transition-all cursor-pointer flex items-center gap-1.5'
                            >
                                {submitting && (
                                    <svg className='w-3.5 h-3.5 animate-spin' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15' />
                                    </svg>
                                )}
                                Save Changes
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={() => setIsEdit(true)}
                            className='text-xs bg-primary hover:bg-opacity-90 text-white font-medium px-5 py-2 rounded-lg shadow-sm transition-all cursor-pointer flex items-center gap-1.5'
                        >
                            <svg className='w-3.5 h-3.5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z' />
                            </svg>
                            Edit Profile
                        </button>
                    )}
                </div>
            </div>

            {/* Main Profile Card */}
            <div className='bg-white border border-gray-200 rounded-xl shadow-xs overflow-hidden'>
                {/* Doctor Banner / Header Card */}
                <div className='p-6 sm:p-8 bg-gradient-to-r from-indigo-50/60 via-purple-50/30 to-white border-b border-gray-100 flex flex-col md:flex-row items-start md:items-center gap-6'>
                    {/* Doctor Avatar */}
                    <div className='relative shrink-0'>
                        {profileData.image ? (
                            <img
                                className='w-28 h-28 sm:w-32 sm:h-32 rounded-2xl object-cover border-4 border-white shadow-md bg-indigo-50'
                                src={profileData.image}
                                alt={profileData.name}
                            />
                        ) : (
                            <div className='w-28 h-28 sm:w-32 sm:h-32 rounded-2xl bg-indigo-100 text-primary flex items-center justify-center font-bold text-3xl border-4 border-white shadow-md'>
                                {profileData.name?.charAt(0) || 'D'}
                            </div>
                        )}
                        <span
                            className={`absolute bottom-2 right-2 w-4 h-4 rounded-full border-2 border-white ${
                                profileData.available ? 'bg-emerald-500' : 'bg-gray-400'
                            }`}
                            title={profileData.available ? 'Available' : 'Unavailable'}
                        />
                    </div>

                    {/* Basic Meta */}
                    <div className='flex-1 min-w-0'>
                        <div className='flex flex-wrap items-center gap-2.5 mb-1.5'>
                            <h2 className='text-xl sm:text-2xl font-bold text-gray-800 tracking-tight'>
                                {profileData.name}
                            </h2>
                            <span className='text-xs bg-indigo-50 text-primary font-semibold px-2.5 py-0.5 rounded-full border border-indigo-100'>
                                {profileData.degree}
                            </span>
                            <span className='text-xs bg-purple-50 text-purple-700 font-semibold px-2.5 py-0.5 rounded-full border border-purple-100'>
                                {profileData.speciality}
                            </span>
                        </div>

                        <p className='text-xs sm:text-sm text-gray-500 flex items-center gap-2 mb-3'>
                            <span>{profileData.experience} Experience</span>
                            <span>•</span>
                            <span className='text-gray-400'>{profileData.email}</span>
                        </p>

                        {/* Availability Toggle / Pill */}
                        <div className='inline-flex items-center gap-2'>
                            {isEdit ? (
                                <label className='flex items-center gap-2 text-xs sm:text-sm font-medium text-gray-700 cursor-pointer select-none'>
                                    <input
                                        type='checkbox'
                                        checked={Boolean(profileData.available)}
                                        onChange={(e) =>
                                            setProfileData((prev) => ({
                                                ...prev,
                                                available: e.target.checked
                                            }))
                                        }
                                        className='w-4 h-4 rounded text-primary focus:ring-primary border-gray-300 cursor-pointer'
                                    />
                                    <span>Accepting Patient Appointments</span>
                                </label>
                            ) : (
                                <span
                                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${
                                        profileData.available
                                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                            : 'bg-gray-100 text-gray-600 border-gray-300'
                                    }`}
                                >
                                    <span
                                        className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                                            profileData.available ? 'bg-emerald-500' : 'bg-gray-400'
                                        }`}
                                    />
                                    {profileData.available ? 'Available for Appointments' : 'Currently Unavailable'}
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Profile Fields Section */}
                <div className='p-6 sm:p-8 space-y-6'>
                    {/* About Section */}
                    <div>
                        <h3 className='text-sm font-semibold text-gray-800 uppercase tracking-wider mb-2'>
                            About Doctor
                        </h3>
                        {isEdit ? (
                            <textarea
                                rows={4}
                                value={profileData.about || ''}
                                onChange={(e) =>
                                    setProfileData((prev) => ({
                                        ...prev,
                                        about: e.target.value
                                    }))
                                }
                                className='w-full border border-gray-300 rounded-lg p-3 text-sm text-gray-700 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all resize-none'
                                placeholder='Write about your medical background and experience...'
                            />
                        ) : (
                            <p className='text-sm text-gray-600 leading-relaxed max-w-3xl'>
                                {profileData.about || 'No description provided.'}
                            </p>
                        )}
                    </div>

                    <hr className='border-gray-100' />

                    {/* Fees & Contact Grid */}
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                        {/* Consultation Fee */}
                        <div className='bg-gray-50/70 p-4 rounded-xl border border-gray-100'>
                            <p className='text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1'>
                                Consultation Fee
                            </p>
                            {isEdit ? (
                                <div className='flex items-center gap-2 mt-1'>
                                    <span className='text-base font-bold text-gray-700'>$</span>
                                    <input
                                        type='number'
                                        value={profileData.fees || ''}
                                        onChange={(e) =>
                                            setProfileData((prev) => ({
                                                ...prev,
                                                fees: e.target.value
                                            }))
                                        }
                                        className='border border-gray-300 rounded-lg px-3 py-1.5 text-sm font-semibold text-gray-800 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary w-32 bg-white'
                                        placeholder='Fee'
                                        min={0}
                                    />
                                </div>
                            ) : (
                                <p className='text-lg font-bold text-gray-800'>
                                    ${profileData.fees ?? 0}
                                    <span className='text-xs text-gray-400 font-normal ml-1.5'>/ session</span>
                                </p>
                            )}
                        </div>

                        {/* Clinic / Practice Address */}
                        <div className='bg-gray-50/70 p-4 rounded-xl border border-gray-100'>
                            <p className='text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1'>
                                Clinic Address
                            </p>
                            {isEdit ? (
                                <div className='space-y-2 mt-1.5'>
                                    <input
                                        type='text'
                                        value={profileData.address?.line1 || ''}
                                        onChange={(e) =>
                                            setProfileData((prev) => ({
                                                ...prev,
                                                address: {
                                                    ...(prev.address || {}),
                                                    line1: e.target.value
                                                }
                                            }))
                                        }
                                        placeholder='Address line 1'
                                        className='w-full border border-gray-300 rounded-lg px-3 py-1.5 text-xs sm:text-sm text-gray-800 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-white'
                                    />
                                    <input
                                        type='text'
                                        value={profileData.address?.line2 || ''}
                                        onChange={(e) =>
                                            setProfileData((prev) => ({
                                                ...prev,
                                                address: {
                                                    ...(prev.address || {}),
                                                    line2: e.target.value
                                                }
                                            }))
                                        }
                                        placeholder='Address line 2'
                                        className='w-full border border-gray-300 rounded-lg px-3 py-1.5 text-xs sm:text-sm text-gray-800 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-white'
                                    />
                                </div>
                            ) : (
                                <div className='text-xs sm:text-sm text-gray-700 leading-snug mt-1'>
                                    <p>{profileData.address?.line1 || 'No address line 1'}</p>
                                    {profileData.address?.line2 && <p>{profileData.address?.line2}</p>}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Account Security Info Note */}
                    <div className='flex items-center gap-2 p-3 bg-indigo-50/40 border border-indigo-100 rounded-lg text-xs text-gray-500'>
                        <svg className='w-4 h-4 text-primary shrink-0' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' />
                        </svg>
                        <span>
                            To update your registered email, doctor qualifications, or profile picture, please contact your clinic administrator.
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DoctorProfile;