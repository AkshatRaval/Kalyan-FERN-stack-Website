import React from 'react'
import { useAuth } from '../utils/AuthProvider'
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Cards';
import { useEffect } from 'react';
import { FileText, Users } from 'lucide-react';
import api from '../lib/api.js';
import { useState } from 'react';
import toast from 'react-hot-toast';
import DocumentLinks from '../ui/DocumentLinks.jsx';
import { activities } from '../constants/Apply.js';

const Admin = () => {
    document.title = "Kalyan | Admin"
    const navigate = useNavigate();
    const { currentUser, userData } = useAuth();
    
    const [forms, setForms] = useState([]);
    const [loadingForms, setLoadingForms] = useState(false);
    const [formName, setFormName] = useState('')

    async function fetchForms(formName) {
        try {
            setLoadingForms(true);
            const res = await api.get(`/api/admin/getforms`);
            // console.log(res)
            const result = res.data;
            // console.log(result)
            setForms(result.data[formName]); // result.data is the object
            setLoadingForms(false);
            // console.log(forms)
        } catch (err) {
            console.error('Failed to fetch forms', JSON.stringify(err));
            toast.error('Could not load forms.');
        } finally {
            setLoadingForms(false);
        }
    }

    const userStats = [
        {
            icon: Users,
            title: "Total Users",
            value: 8,
        },
    ]

    return (
        <div className='min-h-screen sm:px-10 px-5'>
            {/* Quick Data */}
            <section className='my-5 mx-auto max-w-7xl'>
                <div className='grid md:grid-cols-4 s-4 gap-5'>
                    {userStats.map((stat, index) => (
                        <Card key={index} className='shadow p-4'>
                            <CardTitle className='font-bold flex items-center justify-between px-1 '>
                                {stat.title}
                                <stat.icon size={18} />
                            </CardTitle>
                            <div className='font-black text-3xl px-4'>
                                {stat.value}
                            </div>
                        </Card>
                    ))}
                </div>
            </section>

            <section className='max-w-7xl mx-auto py-10'>
                <div className='grid md:grid-cols-4 sm:grid-cols-2 gap-5'>
                    {activities.map((form) => (
                        <Card key={form.id} className='shadow p-4 flex flex-col justify-between'>
                            <div>
                                <CardHeader className="p-2">
                                    <CardTitle className='font-bold flex items-center justify-between text-lg'>
                                        {form.title}
                                        <FileText size={20} className="text-gray-500" />
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-2">
                                    <p className="text-sm text-gray-600">
                                        Click the button below to view details and manage this form.
                                    </p>
                                </CardContent>
                            </div>
                            <div className="p-2 mt-4">
                                <button
                                    onClick={() => fetchForms(form.link)}
                                    className="w-full bg-primary hover:bg-primary/80 p-2 text-primary-foreground rounded-xl"
                                >
                                    Get Data
                                </button>
                            </div>
                        </Card>
                    ))}
                </div>
            </section>

            {/* Exam Details */}
            <section className="p-4 sm:p-6 lg:p-8 bg-gray-50 rounded-lg my-10">
                <div className="overflow-x-auto relative rounded-lg border">
                    <table className="w-full text-sm text-left text-gray-700">
                        <thead className="text-xs text-gray-800 uppercase bg-gray-100 sticky top-0">
                            <tr>
                                <th scope="col" className="py-3 px-6 whitespace-nowrap">Application ID</th>
                                <th scope="col" className="py-3 px-6 whitespace-nowrap">Application View</th>
                                <th scope="col" className="py-3 px-6 whitespace-nowrap">Full Name</th>
                                <th scope="col" className="py-3 px-6 whitespace-nowrap">Email</th>
                                <th scope="col" className="py-3 px-6 whitespace-nowrap">Phone</th>
                                <th scope="col" className="py-3 px-6 whitespace-nowrap">Date of Birth</th>
                                <th scope="col" className="py-3 px-6 whitespace-nowrap">Full Address</th>
                                <th scope="col" className="py-3 px-6 whitespace-nowrap">Aadhar</th>
                                <th scope="col" className="py-3 px-6 whitespace-nowrap">Current Class</th>
                                <th scope="col" className="py-3 px-6 whitespace-nowrap">School</th>
                                <th scope="col" className="py-3 px-6 whitespace-nowrap">Guardian Name</th>
                                <th scope="col" className="py-3 px-6 whitespace-nowrap">Guardian Phone</th>
                                <th scope="col" className="py-3 px-6 whitespace-nowrap">Photo</th>
                                <th scope="col" className="py-3 px-6 whitespace-nowrap">ID Proof</th>
                                <th scope="col" className="py-3 px-6 whitespace-nowrap">Academic Records</th>
                                <th scope="col" className="py-3 px-6 whitespace-nowrap">Submitted On</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white">
                            {forms.map((form, index) => (
                                <tr key={form.id || index} className="border-b hover:bg-gray-50 transition-colors duration-200">
                                    <td className="py-4 px-6 font-medium text-gray-900 whitespace-nowrap">{form.applicationId}</td>

                                    <td className="py-4 flex gap-2 px-6 whitespace-nowrap">
                                        <button className='cursor-pointer underline text-blue-600' onClick={() => navigate(`/application/${formName}/${form.id}`)}>View</button>
                                        <p>|</p>
                                        <button className='cursor-pointer underline text-green-600' onClick={() => window.location.href = form.applicationForm[1]}>Download</button>
                                    </td>

                                    <td className="py-4 px-6 whitespace-nowrap">{form.personalInfo.fullName}</td>
                                    <td className="py-4 px-6 whitespace-nowrap">{form.personalInfo.email}</td>
                                    <td className="py-4 px-6 whitespace-nowrap">{form.personalInfo.phone}</td>
                                    <td className="py-4 px-6 whitespace-nowrap">
                                        {new Date(form.personalInfo.dateOfBirth).toLocaleDateString('en-GB')}
                                    </td>
                                    <td className="py-4 px-6 whitespace-nowrap min-w-[20rem]">
                                        {`${form.personalInfo.address}, ${form.personalInfo.city}, ${form.personalInfo.state} - ${form.personalInfo.pincode}`}
                                    </td>
                                    <td className="py-4 px-6 whitespace-nowrap">{form.personalInfo.aadhar}</td>
                                    <td className="py-4 px-6 whitespace-nowrap">{form.academicInfo.currentClass}</td>
                                    <td className="py-4 px-6 whitespace-nowrap">{form.academicInfo.school}</td>
                                    <td className="py-4 px-6 whitespace-nowrap">{form.guardianInfo.guardianName}</td>
                                    <td className="py-4 px-6 whitespace-nowrap">{form.guardianInfo.guardianPhone}</td>
                                    <td className="py-4 px-6 whitespace-nowrap">
                                        <DocumentLinks doc={form.documents.photo} />
                                    </td>
                                    <td className="py-4 px-6 whitespace-nowrap">
                                        <DocumentLinks doc={form.documents.idProof} />
                                    </td>
                                    <td className="py-4 px-6 whitespace-nowrap">
                                        <DocumentLinks doc={form.documents.academicRecords} />
                                    </td>
                                    <td className="py-4 px-6 whitespace-nowrap">
                                        {new Date(form.createdAt).toLocaleString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                                    </td>
                                </tr>
                            ))}
                            {forms.length === 0 && (
                                <tr>
                                    <td colSpan="15" className="text-center py-8 text-gray-500">
                                        No application data available.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    )
}

export default Admin