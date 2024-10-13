import { useState, useRef } from 'react'
import Navbar from "./Navbar"
import {
    useMutation,
} from '@tanstack/react-query'
import { addPerson } from '../apiHooks/ProfileHooks';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function AddPerson() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        about: '',
        image: '',
    });
    const [error, setError] = useState({})
    const [avatarSrc, setAvatarSrc] = useState(null)
    const fileInputRef = useRef(null)

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };
    const handleAvatarClick = () => {
        fileInputRef.current?.click()
    }

    const handleFileChange = (event) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setAvatarSrc(e.target?.result);
            };
            reader.readAsDataURL(file);
            setFormData({ ...formData, image: file }); // Update formData with the selected file object
        }
    };    

    const mutation = useMutation({
        mutationFn: (formDataToSend) => addPerson(formDataToSend),
        onSuccess: (data) => {
            toast("🦄 Person Added");
            setFormData({
                name: '',
                email: '',
                about: '',
                image: '',
            });
            setAvatarSrc(null);
        },
        onError: (error) => {
            toast.error(`${error.response?.data?.message || 'An error occurred'}`);
        },
    });
    

    const handleSubmit = (e) => {
        e.preventDefault();
        const errorValidation = {};
        if (!formData.name.trim()) {
            errorValidation.name = "Name is required!";
        }
        if (!formData.email.trim()) {
            errorValidation.email = "Email is required!";
        }
        if (!formData.about.trim()) {
            errorValidation.about = "Abount is required!";
        }
        if (!formData.image) {
            errorValidation.image = "Image is required!";
        }
        if (Object.keys(errorValidation).length > 0) {
            setError(errorValidation);
            return;
        }
        setError({});
        const formDataToSend = new FormData();
        formDataToSend.append("name", formData.name);
        formDataToSend.append("email", formData.email);
        formDataToSend.append("about", formData.about);
        formDataToSend.append("image", formData.image);
    
        mutation.mutate(formDataToSend);
    };
    return (
        <>
            <Navbar />
            <ToastContainer />
            <div className="bg-sky-200 min-h-screen flex items-center justify-center p-4">
                <div className="bg-white rounded-3xl shadow-lg overflow-hidden max-w-6xl w-full mt-[-100px]">
                    <main className="p-6">
                        <form className="space-y-6" onSubmit={handleSubmit}>
                            <div className="flex flex-col items-center">
                                <label htmlFor="avatar" className="text-sm font-medium text-gray-700 mb-2">
                                    Profile Picture
                                </label>
                                <div
                                    className="h-32 w-32 rounded-full bg-gray-200 flex items-center justify-center cursor-pointer overflow-hidden"
                                    onClick={handleAvatarClick}
                                >
                                    {avatarSrc ? (
                                        <img src={avatarSrc} alt="Profile picture" className="h-full w-full object-cover" />
                                    ) : (
                                        <span className="text-gray-500">Upload</span>
                                    )}
                                </div>
                                <input
                                    type="file"
                                    id="avatar"
                                    name="image"
                                    ref={fileInputRef}
                                    className="hidden"
                                    onChange={handleFileChange}
                                    accept="image/*"
                                />

                                {error.image && <span className="text-red-500">{error.image}</span>}
                            </div>
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                                    Name
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    placeholder="Name"
                                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500"
                                />
                                {error.name && <span className="text-red-500">{error.name}</span>}
                            </div>
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        placeholder="Email"
                                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500"
                                    />
                                    {error.email && <span className="text-red-500">{error.email}</span>}
                                </div>
                                <div>
                                    <label htmlFor="about" className="block text-sm font-medium text-gray-700 mb-1">
                                        About
                                    </label>
                                    <input
                                        type="text"
                                        name="about"
                                        placeholder="About"
                                        value={formData.about}
                                        onChange={handleInputChange}
                                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500"
                                    />
                                    {error.about && <span className="text-red-500">{error.about}</span>}
                                </div>
                            </div>
                            <div>
                                <button
                                    type="submit"
                                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
                                >
                                    Save Person Information
                                </button>
                            </div>
                        </form>
                    </main>
                </div>
            </div>
        </>
    )
}