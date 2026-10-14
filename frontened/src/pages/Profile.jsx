import React, { useContext, useState } from 'react'
import { AppContext } from '../context/AppContext'
import { assets } from '../assets/assets'
import axios from 'axios'
import { toast } from 'react-toastify'

const Profile = () => {

    const { userData, setUserData, token, backendUrl, loadUserProfileData } = useContext(AppContext);
    const [isEdit, setIsEdit] = useState(false);
    const [image, setImage] = useState(false);
    const [loading, setLoading] = useState(false);

    const updateUserProfileData = async () => {
        try {
            setLoading(true);
            const formData = new FormData();
            formData.append('name', userData.name || '');
            formData.append('phone', userData.phone || '');
            formData.append('gender', userData.gender || 'Not Selected');
            formData.append('dob', userData.dob || 'Not Selected');
            formData.append('address', JSON.stringify(userData.address || { line1: '', line2: '' }));

            if (image) {
                formData.append('image', image);
            }

            const { data } = await axios.post(
                `${backendUrl}/api/user/update-profile`,
                formData,
                { headers: { token } }
            );

            if (data.success) {
                toast.success(data.message);
                await loadUserProfileData();
                setIsEdit(false);
                setImage(false);
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

    if (!token) {
        return (
            <div className='min-h-[50vh] flex flex-col items-center justify-center gap-4 text-center'>
                <p className='text-lg font-medium text-gray-700'>Please login to view and update your profile</p>
            </div>
        );
    }

    if (!userData) {
        return (
            <div className='min-h-[50vh] flex items-center justify-center'>
                <div className='w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin'></div>
            </div>
        );
    }

    return (
        <div className='max-w-lg flex flex-col gap-2 text-sm pt-5'>
            {isEdit ? (
                <label htmlFor="image" className='relative cursor-pointer inline-block w-36 h-36'>
                    <img
                        src={image ? URL.createObjectURL(image) : (userData.image || assets.profile_pic)}
                        className='w-36 h-36 rounded object-cover opacity-75'
                        alt="Profile"
                    />
                    <img
                        src={assets.upload_icon}
                        className='w-10 absolute inset-0 m-auto'
                        alt="Upload"
                    />
                    <input
                        onChange={(e) => setImage(e.target.files[0])}
                        type="file"
                        id="image"
                        hidden
                        accept="image/*"
                    />
                </label>
            ) : (
                <img
                    src={userData.image || assets.profile_pic}
                    className='w-36 h-36 rounded object-cover'
                    alt="Profile"
                />
            )}

            {isEdit ? (
                <input
                    className='bg-gray-50 text-3xl font-medium max-w-60 mt-4 border border-gray-300 rounded px-2 py-1 focus:outline-primary'
                    type='text'
                    value={userData.name || ''}
                    onChange={e => setUserData(prev => ({ ...prev, name: e.target.value }))}
                />
            ) : (
                <p className='font-medium text-3xl text-neutral-800 mt-4'>{userData.name}</p>
            )}

            <hr className='bg-zinc-400 h-[1px] border-none my-2' />

            <div>
                <p className='text-neutral-500 underline mt-3'>CONTACT INFORMATION</p>
                <div className='grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-neutral-700'>
                    <p className='font-medium'>EMAIL id:</p>
                    <p className='text-blue-500'>{userData.email}</p>

                    <p className='font-medium'>Phone :</p>
                    {isEdit ? (
                        <input
                            className='bg-gray-100 max-w-52 border border-gray-300 rounded px-2 py-0.5 focus:outline-primary'
                            type='text'
                            value={userData.phone || ''}
                            onChange={e => setUserData(prev => ({ ...prev, phone: e.target.value }))}
                        />
                    ) : (
                        <p className='text-blue-400'>{userData.phone}</p>
                    )}

                    <p className='font-medium'>Address :</p>
                    {isEdit ? (
                        <div className='flex flex-col gap-1'>
                            <input
                                className='bg-gray-50 border border-gray-300 rounded px-2 py-0.5 focus:outline-primary'
                                onChange={(e) => setUserData(prev => ({
                                    ...prev,
                                    address: { ...(prev?.address || {}), line1: e.target.value }
                                }))}
                                value={userData.address?.line1 || ''}
                                type="text"
                                placeholder="Address line 1"
                            />
                            <input
                                className='bg-gray-50 border border-gray-300 rounded px-2 py-0.5 focus:outline-primary'
                                onChange={(e) => setUserData(prev => ({
                                    ...prev,
                                    address: { ...(prev?.address || {}), line2: e.target.value }
                                }))}
                                value={userData.address?.line2 || ''}
                                type="text"
                                placeholder="Address line 2"
                            />
                        </div>
                    ) : (
                        <p className='text-gray-500'>
                            {userData.address?.line1 || 'No address added'}<br />
                            {userData.address?.line2 || ''}
                        </p>
                    )}
                </div>
            </div>

            <div>
                <p className='text-neutral-500 underline mt-3'>BASIC INFORMATION</p>
                <div className='grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-neutral-700'>
                    <p className='font-medium'>GENDER:</p>
                    {isEdit ? (
                        <select
                            className='max-w-28 bg-gray-100 border border-gray-300 rounded px-2 py-0.5 focus:outline-primary'
                            value={userData.gender || 'Not Selected'}
                            onChange={e => setUserData(prev => ({ ...prev, gender: e.target.value }))}
                        >
                            <option value="Not Selected">Not Selected</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                        </select>
                    ) : (
                        <p className='text-gray-400'>{userData.gender}</p>
                    )}

                    <p className='font-medium'>Birthday :</p>
                    {isEdit ? (
                        <input
                            className='max-w-36 bg-gray-100 border border-gray-300 rounded px-2 py-0.5 focus:outline-primary'
                            type='date'
                            value={userData.dob && userData.dob !== 'Not Selected' ? userData.dob : ''}
                            onChange={e => setUserData(prev => ({ ...prev, dob: e.target.value }))}
                        />
                    ) : (
                        <p className='text-gray-400'>{userData.dob || 'Not Selected'}</p>
                    )}
                </div>
            </div>

            <div className='mt-10 flex gap-4'>
                {isEdit ? (
                    <>
                        <button
                            disabled={loading}
                            className='border border-primary bg-primary text-white px-8 py-2 rounded-full hover:bg-opacity-90 transition-all cursor-pointer disabled:opacity-50'
                            onClick={updateUserProfileData}
                        >
                            {loading ? 'Saving...' : 'Save information'}
                        </button>
                        <button
                            disabled={loading}
                            className='border border-gray-400 text-gray-600 px-6 py-2 rounded-full hover:bg-gray-100 transition-all cursor-pointer'
                            onClick={() => {
                                setIsEdit(false);
                                setImage(false);
                                loadUserProfileData();
                            }}
                        >
                            Cancel
                        </button>
                    </>
                ) : (
                    <button
                        className='border border-primary px-8 py-2 rounded-full hover:bg-primary hover:text-white transition-all cursor-pointer'
                        onClick={() => setIsEdit(true)}
                    >
                        Edit
                    </button>
                )}
            </div>

        </div>
    )
}

export default Profile