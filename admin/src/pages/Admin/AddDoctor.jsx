
import React, { useContext, useState } from 'react'
import { assets } from '../../assets/assets'
import { AdminContext } from '../../context/AdminContext';
import Loading from '../../components/Loading';

import { toast } from 'react-toastify';
import axios from 'axios';

const AddDoctor = () => {

    const [docImg, setDocImg] = useState(false);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [experience, setExperience] = useState("1 Year");
    const [fees, setFees] = useState("");
    const [speciality, setSpeciality] = useState("General physician");
    const [education, setEducation] = useState("");
    const [address1, setAddress1] = useState("");
    const [address2, setAddress2] = useState("");
    const [about, setAbout] = useState("");

    const { backenedUrl, aToken, loading, setLoading } = useContext(AdminContext);

    const onSubmitHandler = async (event) => {
        event.preventDefault();

        try {
            if (!docImg) { return toast.error("Doctor Image required") }

            setLoading(true);
            const formData = new FormData();
            formData.append("name", name);
            formData.append("email", email);
            formData.append("password", password);
            formData.append("experience", experience);
            formData.append("fees", fees);
            formData.append("speciality", speciality);
            formData.append("degree", education);
            formData.append("address", JSON.stringify({ line1: address1, line2: address2 }));
            formData.append("about", about);
            formData.append("image", docImg);

            //console log formdata
            // formData.forEach((val, key) => console.log(key, val));

            const { data } = await axios.post(backenedUrl + '/api/admin/add-doctor', formData, { headers: { aToken } });

            if (data.success) {
                toast.success(data.message);
                setDocImg(false);
                setName("");
                setEmail("");
                setPassword("");
                setAddress1("");
                setAddress2("");
                setEducation("");
                setAbout("");
                setFees("");
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            {loading && <Loading fullScreen message="Adding doctor, please wait..." />}
            <form onSubmit={onSubmitHandler} className='m-5 w-full'>
            <p className='mb-4 text-xl font-semibold text-gray-800'>Add Doctor</p>
            <div className='bg-white px-8 py-8 border border-gray-200 shadow-sm rounded-xl w-full max-w-4xl max-h-[82vh] overflow-y-auto'>
                <div className='flex items-center gap-4 mb-8 text-gray-500'>
                    <label htmlFor="doc-image" className='cursor-pointer group'>
                        <img
                            className='w-20 h-20 bg-gray-100 rounded-full object-cover border-2 border-dashed border-gray-300 group-hover:border-primary transition-all p-1'
                            src={docImg ? URL.createObjectURL(docImg) : assets.upload_area}
                            alt=""
                        />
                    </label>
                    <input onChange={(e) => setDocImg(e.target.files[0])} type="file" hidden id='doc-image' />
                    <p className='text-sm text-gray-600 font-medium leading-snug'>
                        Upload Doctor <br />
                        <span className='text-xs text-gray-400 font-normal'>Picture (PNG, JPG)</span>
                    </p>
                </div>

                <div className='flex flex-col lg:flex-row items-start gap-10 text-gray-600'>
                    <div className='w-full lg:flex-1 flex flex-col gap-4'>

                        <div className='flex-1 flex flex-col gap-1.5'>
                            <p className='text-sm font-medium text-gray-700'>Doctor Name</p>
                            <input value={name} onChange={(e) => setName(e.target.value)} className='border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm text-gray-700 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all bg-gray-50/50 hover:bg-white focus:bg-white placeholder:text-gray-400' type="text" placeholder='Name' required />
                        </div>

                        <div className='flex-1 flex flex-col gap-1.5'>
                            <p className='text-sm font-medium text-gray-700'>Doctor Email</p>
                            <input value={email} onChange={(e) => setEmail(e.target.value)} className='border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm text-gray-700 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all bg-gray-50/50 hover:bg-white focus:bg-white placeholder:text-gray-400' type="email" placeholder='Email address' required />
                        </div>

                        <div className='flex-1 flex flex-col gap-1.5'>
                            <p className='text-sm font-medium text-gray-700'>Doctor Password</p>
                            <input value={password} onChange={(e) => setPassword(e.target.value)} className='border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm text-gray-700 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all bg-gray-50/50 hover:bg-white focus:bg-white placeholder:text-gray-400' type="password" placeholder='Password (min 8 chars)' required />
                        </div>

                        <div className='flex-1 flex flex-col gap-1.5'>
                            <p className='text-sm font-medium text-gray-700'>Doctor Experience</p>
                            <select value={experience} onChange={(e) => setExperience(e.target.value)} className='border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm text-gray-700 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all bg-gray-50/50 hover:bg-white focus:bg-white cursor-pointer' name="" id="">
                                <option value="1 Year">1 Year</option>
                                <option value="2 Year">2 Year</option>
                                <option value="3 Year">3 Year</option>
                                <option value="4 Year">4 Year</option>
                                <option value="5 Year">5 Year</option>
                                <option value="6 Year">6 Year</option>
                                <option value="7 Year">7 Year</option>
                                <option value="8 Year">8 Year</option>
                                <option value="9 Year">9 Year</option>
                                <option value="10 Year">10 Year</option>
                            </select>
                        </div>

                        <div className='flex-1 flex flex-col gap-1.5'>
                            <p className='text-sm font-medium text-gray-700'>Fees</p>
                            <input value={fees} onChange={(e) => setFees(e.target.value)} className='border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm text-gray-700 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all bg-gray-50/50 hover:bg-white focus:bg-white placeholder:text-gray-400' type="number" required placeholder='Consultation fees' />
                        </div>

                    </div>

                    <div className='w-full lg:flex-1 flex flex-col gap-4'>
                        <div className='flex-1 flex flex-col gap-1.5'>
                            <p className='text-sm font-medium text-gray-700'>Speciality</p>
                            <select value={speciality} onChange={(e) => setSpeciality(e.target.value)} className='border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm text-gray-700 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all bg-gray-50/50 hover:bg-white focus:bg-white cursor-pointer' name="" id="">
                                <option value="General physician">General physician</option>
                                <option value="Gastroenterologist">Gastroenterologist</option>
                                <option value="Gynecologist">Gynecologist</option>
                                <option value="Pediatricians">Pediatricians</option>
                                <option value="Dermatologist">Dermatologist</option>
                                <option value="Neurologist">Neurologist</option>
                            </select>
                        </div>

                        <div className='flex-1 flex flex-col gap-1.5'>
                            <p className='text-sm font-medium text-gray-700'>Education</p>
                            <input value={education} onChange={(e) => setEducation(e.target.value)} className='border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm text-gray-700 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all bg-gray-50/50 hover:bg-white focus:bg-white placeholder:text-gray-400' type="text" required placeholder='e.g. MBBS, MD' />
                        </div>

                        <div className='flex-1 flex flex-col gap-2'>
                            <p className='text-sm font-medium text-gray-700'>Address</p>
                            <input value={address1} onChange={(e) => setAddress1(e.target.value)} className='border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm text-gray-700 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all bg-gray-50/50 hover:bg-white focus:bg-white placeholder:text-gray-400' type="text" placeholder='Address line 1' required />
                            <input value={address2} onChange={(e) => setAddress2(e.target.value)} className='border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm text-gray-700 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all bg-gray-50/50 hover:bg-white focus:bg-white placeholder:text-gray-400' type="text" placeholder='Address line 2' required />
                        </div>
                    </div>
                </div>

                <div>
                    <p className='mt-6 mb-2 text-sm font-medium text-gray-700'>About Doctor</p>
                    <textarea value={about} onChange={(e) => setAbout(e.target.value)} className='w-full px-4 py-3 border border-gray-300 rounded-lg text-sm text-gray-700 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all bg-gray-50/50 hover:bg-white focus:bg-white placeholder:text-gray-400 resize-none' placeholder='Write a brief description about doctor experience and background...' rows={5} required></textarea>
                </div>

                <button type='submit' className='bg-primary text-white font-medium text-sm px-10 py-3 mt-6 rounded-full cursor-pointer shadow-md shadow-primary/20 hover:bg-opacity-90 hover:shadow-lg hover:shadow-primary/30 transition-all duration-200 active:scale-[0.99]'>Add Doctor</button>
            </div>
        </form>
        </>
    )
}

export default AddDoctor