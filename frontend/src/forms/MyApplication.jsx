import React, { useEffect, useState } from 'react'
import api from '../lib/api';
import FormData from '../ui/FormData';
import { Download, Printer } from 'lucide-react';
import { motion } from 'framer-motion';


const MyApplication = () => {
    const currentPath = window.location.pathname
    const formId = currentPath.split('/')[currentPath.split('/').length - 1];
    const formName = currentPath.split('/')[currentPath.split('/').length - 2];
    const [loading, setLoading] = useState(false)
    const [form, setForm] = useState([]);
    const fetchForm = async () => {
        try {
            setLoading(true)
            const res = await api.get(`/api/admin/${formName}/${formId}`)
            const result = res.data.data
            setForm(result)
        } catch (error) {
            console.log(JSON.stringify(error))
        }
        finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchForm()
    }, [])

    const formatAddress = () => {
        const parts = [
            form?.personalInfo?.address,
            form?.personalInfo?.city,
            form?.personalInfo?.state
        ];
        const validParts = parts.filter(Boolean); // Removes any null/undefined parts
        const addressString = validParts.join(', ');
        return form?.personalInfo?.pincode ? `${addressString} - ${form.personalInfo.pincode}` : addressString;
    };

    const formData = {
        "Application ID": form?.applicationId,
        "Submission Date": new Date(form?.createdAt).toLocaleString('en-GB'), // e.g., 11/10/2025, 09:34:55
        "Form Name": (form?.formType)?.toUpperCase(),

        // --- Personal Information ---
        "Full Name": form?.personalInfo?.fullName,
        "Email Address": form?.personalInfo?.email,
        "Phone Number": form?.personalInfo?.phone,
        "Date of Birth": form?.personalInfo?.dateOfBirth, // Assumes 'YYYY-MM-DD' format
        "Gender": form?.personalInfo?.gender,
        "Full Address": formatAddress(),

        // --- Academic Information ---
        "Current Class": form?.academicInfo?.currentClass,
        "School / College": form?.academicInfo?.school,
        "Board / University": form?.academicInfo?.board,
        "Previous Score (%)": form?.academicInfo?.previousScore + "%",

        // --- Guardian Information ---
        "Guardian's Name": form?.guardianInfo?.guardianName,
        "Relationship to Applicant": form?.guardianInfo?.relationship,
        "Guardian's Phone": form?.guardianInfo?.guardianPhone,
        "Guardian's Email": form?.guardianInfo?.guardianEmail,

        // --- Additional Information ---
        "Relevant Experience": form?.additionalInfo?.experience,
        "Expectations from Program": form?.additionalInfo?.expectations,
        "Special Needs or Requests": form?.additionalInfo?.specialNeeds,

        "Photo": form?.documents?.photo ? "Uploaded" : "Not Uploaded",
        "ID Proof": form?.documents?.idProof ? "Uploaded" : "Not Uploaded",
        "Academic Records": form?.documents?.academicRecords ? "Uploaded" : "Not Uploaded",
    }

    return (
        <section className='min-h-screen py-10 bg-gray-50 px-4'>
            <div className="max-w-4xl mx-auto">
                {/* Card Container */}
                <div className="bg-white shadow-xl rounded-2xl overflow-hidden">

                    {/* Header Section */}
                    <div className="px-6 py-5 bg-gradient-to-r from-gray-700 via-gray-900 to-black text-white">
                        <h1 className="text-2xl font-bold">Application Details of {(form?.formType)?.toUpperCase()}</h1>
                        <p className="text-gray-300 mt-1">Review the applicant's submitted information below.</p>
                    </div>

                    {/* Form Data Rows */}
                    <div className="divide-y divide-gray-200">
                        {Object.entries(formData)
                            .filter(([key, value]) => value) // Optional: Hide rows with no value
                            .map(([key, value]) => (
                                <FormData key={key} header={key} value={value} />
                            ))}
                    </div>

                    {/* Footer Section */}
                    <div className="px-6 py-4 bg-gray-50 text-right">
                        <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2" onClick={() => window.location.href = form?.applicationForm[1]}>
                            <Download size={18} /> Download Form
                        </button>
                    </div>
                </div>
            </div>
            {loading && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex flex-col items-center justify-center text-center space-y-4"
                >
                    {/* Spinner */}
                    <motion.div
                        className="h-16 w-16 border-4 border-t-transparent border-primary rounded-full animate-spin"
                        initial={{ rotate: 0 }}
                        transition={{ duration: 0.5, repeat: Infinity, repeatType: "mirror" }}
                    />

                    {/* Text */}
                    <motion.p
                        className="text-white font-semibold text-xl tracking-wide"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        Fetching your application...
                    </motion.p>

                    {/* Subtext shimmer */}
                    <motion.div
                        className="text-sm text-white/70"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                    >
                        Please wait while we process your documents ✨
                    </motion.div>
                </motion.div>
            )}
        </section>
    )
}

export default MyApplication