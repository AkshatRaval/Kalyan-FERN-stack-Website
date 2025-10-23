import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Banknote, CheckCircle, Lock, Upload } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Cards';
import { activities } from '../constants/Apply';
import { Label } from '../ui/Label';
import { Checkbox, Input, Textarea } from '../ui/Input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/Select';
import toast, { Toaster } from 'react-hot-toast';
import api from '../lib/api';
import { useAuth } from '../utils/AuthProvider';
import emailjs from '@emailjs/browser';


const FormRenderer = () => {

    const formName = window.location.pathname.split('/')[2]
    const currentActivity = activities.filter((e) => e.link === formName)[0]

    const navigate = useNavigate();

    if (!currentActivity) {
        useEffect(() => {
            navigate('/');
        }, []);
        return null; // Render nothing while redirecting
    }

    document.title = `Kalyan | ${currentActivity.title}`

    const { currentUser, userData } = useAuth()
    // console.log(currentUser)

    if (!currentUser) {
        toast.error("You're not Logged In!", {
            style: {
                borderRadius: '10px',
                background: '#030213',
                color: '#fff',
            }
        })

        useEffect(() => {
            navigate('/login')
        }, [])
        return
    }

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        personalInfo: {
            fullName: '',
            email: '',
            phone: '',
            dateOfBirth: '',
            gender: '',
            aadhar: '',
            address: '',
            city: '',
            state: '',
            pincode: ''
        },
        academicInfo: {
            currentClass: '',
            school: '',
            board: '',
            previousScore: ''
        },
        guardianInfo: {
            guardianName: '',
            guardianPhone: '',
            guardianEmail: '',
            relationship: ''
        },
        teamInfo: {
            teamName: '',
            members: []
        },
        additionalInfo: {
            experience: '',
            expectations: '',
            specialNeeds: ''
        },
        documents: {
            photo: null,
            idProof: null,
            academicRecords: null
        },
        payments: {
            paymentRequired: currentActivity.fee != 0,
            paymentStatus: false,
            paymentId: ''
        },
        consent: false
    });

    useEffect(() => {
        if (!currentUser) {
            toast.error("You're not Logged In!", {
                style: {
                    borderRadius: '10px', background: '#030213', color: '#fff',
                }
            });
            navigate('/login');
        }
    }, [currentUser]);

    // console.log(formData)

    const handleInputChange = (section, field, value) => {
        setFormData(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [field]: value
            }
        }));
        // console.log(formData)
    };
    const handleFileUpload = (field, file) => {
        setFormData(prev => ({
            ...prev,
            documents: {
                ...prev.documents,
                [field]: file
            }
        }));
        // console.log(formData)
    };

    const handleTeamInfoChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            teamInfo: { ...prev.teamInfo, [field]: value }
        }));
    };
    const handleTeamMemberChange = (index, value) => {
        const updatedMembers = [...formData.teamInfo.members];
        updatedMembers[index] = { name: value };
        setFormData(prev => ({
            ...prev,
            teamInfo: { ...prev.teamInfo, members: updatedMembers }
        }));
    };

    const addTeamMember = () => {
        if (formData.teamInfo.members.length < (currentActivity.maxTeamSize - 1)) {
            setFormData(prev => ({
                ...prev,
                teamInfo: {
                    ...prev.teamInfo,
                    members: [...prev.teamInfo.members, { name: '' }]
                }
            }));
        } else {
            toast.error(`You can add a maximum of ${currentActivity.maxTeamSize - 1} members.`);
        }
    };

    const removeTeamMember = (index) => {
        const updatedMembers = formData.teamInfo.members.filter((_, i) => i !== index);
        setFormData(prev => ({
            ...prev,
            teamInfo: { ...prev.teamInfo, members: updatedMembers }
        }));
    };

    function validateAadhaar(input) {
        if (input.length !== 12) {
            return false;
        } else {
            return true;
        }
    }
    const serviceId = 'service_h7x526j';
    const templateId = 'template_v87pkxg';
    const publicId = 'AVIwzEQbBV_Q4mLkn';

    const sendEmail = (templateParams) => {
        emailjs.send(
            serviceId,
            templateId,
            templateParams,
            {
                publicKey: publicId,
            }).then(
                () => {
                    toast.success("Email Sent Successfully!")
                },
                (error) => {
                    console.log(error)
                    toast.error("Some Error Occured!" + error.text)
                },
            );
    };

    const handlePayment = async (amount, receiptId) => {

        try {
            const body = {
                "amount": parseInt(amount) * 100,
                "currency": "INR",
                "receipt": receiptId
            }
            const res = await api.post('/pay/order', body)
            const order = res.data

            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID,
                amount: order.amount,
                currency: order.currency,
                name: "Kalyan Education Trust",
                description: `Payment for ${currentActivity.title}`,
                image: "/assets/KalyanLogo.svg",
                order_id: order.id,

                handler: async function (response) {
                    // console.log('Payment successful:', response);
                    const verificationPayload = {
                        razorpay_order_id: response.razorpay_order_id,
                        razorpay_payment_id: response.razorpay_payment_id,
                        razorpay_signature: response.razorpay_signature,
                    };
                    const verificationResult = await api.post('/pay/verify', verificationPayload);
                    toast.success("Payment Done Successfully", {
                        style: {
                            borderRadius: '10px', background: '#030213', color: '#fff',
                        }
                    })
                    handleInputChange('payments', 'paymentStatus', true);
                    handleInputChange('payments', 'paymentId', response.razorpay_payment_id);

                    const amountValue = (order.amount / 100);
                    const formattedAmount = new Intl.NumberFormat('en-IN', {
                        style: 'currency', currency: 'INR'
                    }).format(amountValue);

                    // Date in Asia/Kolkata timezone
                    const paymentDate = new Date().toLocaleString('en-IN', {
                        day: 'numeric', month: 'short', year: 'numeric',
                        hour: '2-digit', minute: '2-digit', hour12: true,
                        timeZone: 'Asia/Kolkata'
                    });

                    const templateParams = {
                        customer_name: userData?.displayName,
                        amount: formattedAmount,
                        order_id: order.id || receiptId,
                        date: paymentDate,
                        payment_method: 'Razorpay',
                        payment_id: response.razorpay_payment_id,
                        billing_email: currentUser?.email || '',
                        support_email: 'kalyanconsultancy6800@gmail.com',
                        company_name: 'Kalyan Education Trust',
                        company_logo_url: '/assets/KalyanLogo.svg',
                        company_address: 'Wankaner, Gujrat',
                        year: new Date().getFullYear().toString(),
                    };

                    sendEmail(templateParams)
                },
                prefill: {
                    name: userData?.displayName,
                    email: currentUser.email,
                    contact: userData?.phone
                },
                notes: {
                    address: ""
                },
                theme: {
                    color: "#3399cc"
                }
            };
            const paymentObject = new window.Razorpay(options);
            paymentObject.open();

        } catch (error) {
            console.log(error)
        }
    }


    const validate = () => {
        for (const categoryKey in formData) {
            if (categoryKey === 'consent') {
                if (!formData.consent) {
                    return 'You must agree to the terms and conditions.';
                }
                continue;
            }

            if (!currentActivity.isTeamBased) {
                if (categoryKey === 'teamInfo') {
                    continue
                }
            }

            if (categoryKey === 'payments' || categoryKey === 'additionalInfo') {
                continue;
            }

            const categoryValue = formData[categoryKey];


            if (typeof categoryValue === 'object' && categoryValue !== null) {
                for (const inputKey in categoryValue) {
                    const value = categoryValue[inputKey];

                    if (!value) {
                        const fieldName = inputKey.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
                        return `${fieldName} is required.`;
                    }
                }
            }
        }

        return null;
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        setIsSubmitting(true)
        if (!validateAadhaar(formData.personalInfo.aadhar)) {
            toast.error("Aadhaar Is Invalid!", {
                style: {
                    borderRadius: '10px',
                    background: '#030213',
                    color: '#fff',
                }
            })
        }
        const errorMessage = validate()

        if (formData.academicInfo.previousScore <= 0 || formData.academicInfo.previousScore >= 100) {
            toast.error("Your Previous Score is invalid!", {
                style: {
                    borderRadius: '10px',
                    background: '#030213',
                    color: '#fff',
                }
            });
            setIsSubmitting(false)
            return;
        }

        if (errorMessage) {
            toast.error(errorMessage, {
                style: {
                    borderRadius: '10px',
                    background: '#030213',
                    color: '#fff',
                }
            });
            setIsSubmitting(false)
            return;
        }

        if (!formData.paymentStatus && formData.paymentRequired) {
            toast.error("Payment Is Required!", {
                style: {
                    borderRadius: '10px',
                    background: '#030213',
                    color: '#fff',
                }
            });
            setIsSubmitting(false)
            return;
        }

        try {
            const fd = new FormData();

            fd.append('personalInfo', JSON.stringify(formData.personalInfo));
            fd.append('academicInfo', JSON.stringify(formData.academicInfo));
            fd.append('guardianInfo', JSON.stringify(formData.guardianInfo));
            fd.append('additionalInfo', JSON.stringify(formData.additionalInfo));
            fd.append('payments', JSON.stringify(formData.payments));
            fd.append('teamInfo', JSON.stringify(formData.teamInfo));

            if (formData.documents.photo) fd.append('photo', formData.documents.photo);
            if (formData.documents.idProof) fd.append('idProof', formData.documents.idProof);
            if (formData.documents.academicRecords) fd.append('academicRecords', formData.documents.academicRecords)

            const res = await api.post(`/api/user/submit/${currentActivity.link}`, fd)
            const result = res.data;
            console.log(result)
            toast.success("Your Form is submitted Successfully!", {
                style: {
                    borderRadius: '10px',
                    background: '#030213',
                    color: '#fff',
                }
            })
            
            navigate(`/application/${currentActivity.link}/${result.id}`);
        } catch (error) {
            toast.error(JSON.stringify(error), {
                style: {
                    borderRadius: '10px',
                    background: '#030213',
                    color: '#fff',
                }
            })
        } finally {
            setIsSubmitting(false)
        }
    }
    return (
        <div className="relative min-h-screen bg-gradient-to-br from-background via-accent/20 to-secondary/30">
            <div className="max-w-4xl mx-auto px-6 lg:px-8 py-8">
                <motion.div className="mb-8"
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3 }}
                >
                    <Link to={'/'} className='text-sm flex gap-1 items-center px-5 p-3 hover:bg-accent w-fit rounded-lg border bg-secondary/10 transition-all'> <ArrowLeft size={15} /> Back to Home</Link>
                </motion.div>

                <Card className="border-none shadow-xl bg-background/60 backdrop-blur-sm py-5">
                    <CardHeader className="text-center">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2, duration: 0.6 }}
                        >
                            <CardTitle className="text-3xl lg:text-4xl font-black mb-4 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                                Apply For {currentActivity.title}
                            </CardTitle>
                            <div className="w-24 h-1 bg-gradient-to-r from-primary to-primary/50 mx-auto rounded-full mb-4" />
                            <p className="text-lg text-muted-foreground mb-6">
                                {currentActivity.description}
                            </p>
                            <div className="inline-flex items-center space-x-4 bg-primary/5 px-6 py-3 rounded-2xl">
                                <span className="text-muted-foreground">Registration Fee:</span>
                                <span className="font-black text-2xl text-primary">{currentActivity.fee == 0 ? "Free" : `₹${currentActivity.fee}`}</span>
                            </div>
                        </motion.div>
                    </CardHeader>
                </Card>

                {/* Form Start */}
                <motion.form
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    onSubmit={handleSubmit}
                    className="space-y-8 mt-8"
                    encType="multipart/form-data"
                >
                    {/* Personal Information */}
                    <Card className="border-none shadow-xl bg-background/60 backdrop-blur-sm py-5">
                        <CardHeader className="text-xl font-bold">
                            {currentActivity.isTeamBased ? "Team Leader Information" : "Personal Information"}
                        </CardHeader>
                        <CardContent className='space-y-4'>
                            <div className='grid md:grid-cols-2 gap-4'>
                                <div className="space-y-2 flex flex-col">
                                    <Label htmlFor="fullName" className='font-semibold text-sm'>Full Name <span className='text-destructive'>*</span></Label>
                                    <Input type="text"
                                        name="fullName"
                                        id="fullName"
                                        value={formData.personalInfo.fullName}
                                        onChange={(e) => handleInputChange('personalInfo', 'fullName', e.target.value)}
                                        placeholder="Full Name"
                                    />
                                </div>
                                <div className="space-y-2 flex flex-col">
                                    <Label htmlFor="email" className='font-semibold text-sm'>Email Address <span className='text-destructive'>*</span></Label>
                                    <Input type="email"
                                        name="email"
                                        id="email"
                                        value={formData.personalInfo.email}
                                        onChange={(e) => handleInputChange('personalInfo', 'email', e.target.value)}
                                        placeholder="Email Address"
                                    />
                                </div>
                                <div className="space-y-2 flex flex-col">
                                    <Label htmlFor="phone" className='font-semibold text-sm'>Phone Number <span className='text-destructive'>*</span></Label>
                                    <Input
                                        name="phone"
                                        id="phone"
                                        value={formData.personalInfo.phone}
                                        onChange={(e) => handleInputChange('personalInfo', 'phone', e.target.value)}
                                        placeholder="Phone Number"
                                    />
                                </div>
                                <div className="space-y-2 flex flex-col">
                                    <Label htmlFor="dateOfBirth" className='font-semibold text-sm'>Date of Birth <span className='text-destructive'>*</span></Label>
                                    <Input

                                        id="dateOfBirth"
                                        type="date"
                                        value={formData.personalInfo.dateOfBirth}
                                        onChange={(e) => handleInputChange('personalInfo', 'dateOfBirth', e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2 flex flex-col">
                                    <Label htmlFor="gender" className='font-semibold text-sm'>Gender <span className='text-destructive'>*</span></Label>
                                    <Select onValueChange={(value) => handleInputChange('personalInfo', 'gender', value)} id="gender">
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select gender" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="male">Male</SelectItem>
                                            <SelectItem value="female">Female</SelectItem>
                                            <SelectItem value="other">Other</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2 flex flex-col">
                                    <Label htmlFor="aadhar" className='font-semibold text-sm'>Aadhar Number <span className='text-destructive'>*</span></Label>
                                    <Input

                                        id="aadhar"
                                        type="text"
                                        placeholder='Aadhar Number'
                                        value={formData.personalInfo.aadhar}
                                        onChange={(e) => handleInputChange('personalInfo', 'aadhar', e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="address">Address <span className='text-destructive'>*</span></Label>
                                <Textarea
                                    id="address"
                                    placeholder="Address"
                                    value={formData.personalInfo.address}
                                    onChange={(e) => handleInputChange('personalInfo', 'address', e.target.value)}
                                />
                            </div>
                            <div className="grid md:grid-cols-3 gap-4">
                                <div className="space-y-2 flex flex-col">
                                    <Label htmlFor="city" className='font-semibold text-sm'>City <span className='text-destructive'>*</span></Label>
                                    <Input
                                        placeholder="City"
                                        id="city"
                                        type="text"
                                        value={formData.personalInfo.city}
                                        onChange={(e) => handleInputChange('personalInfo', 'city', e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2 flex flex-col">
                                    <Label htmlFor="state" className='font-semibold text-sm'>State <span className='text-destructive'>*</span></Label>
                                    <Input
                                        placeholder="State"
                                        id="state"
                                        type="text"
                                        value={formData.personalInfo.state}
                                        onChange={(e) => handleInputChange('personalInfo', 'state', e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2 flex flex-col">
                                    <Label htmlFor="pincode" className='font-semibold text-sm'>Pincode <span className='text-destructive'>*</span></Label>
                                    <Input
                                        placeholder="Pincode"
                                        id="pincode"
                                        type="text"
                                        value={formData.personalInfo.pincode}
                                        onChange={(e) => handleInputChange('personalInfo', 'pincode', e.target.value)}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {currentActivity.isTeamBased && (
                        <Card className="border-none shadow-xl bg-background/60 backdrop-blur-sm">
                            <CardHeader>
                                <CardTitle className="text-xl font-bold">Team Information</CardTitle>
                                <p className="text-sm text-muted-foreground">The person filling this form is the team leader.</p>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="teamName">Team Name <span className='text-destructive'>*</span></Label>
                                    <Input
                                        id="teamName"
                                        placeholder="e.g., The Innovators"
                                        value={formData.teamInfo.teamName}
                                        onChange={(e) => handleTeamInfoChange('teamName', e.target.value)}
                                    />
                                </div>

                                <Label>Team Members (excluding leader)</Label>
                                {formData.teamInfo.members.map((member, index) => (
                                    <div key={index} className="flex items-center gap-2">
                                        <Input
                                            type="text"
                                            placeholder={`Member ${index + 1} Name`}
                                            value={member.name}
                                            onChange={(e) => handleTeamMemberChange(index, e.target.value)}
                                            className="flex-grow"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeTeamMember(index)}
                                            className="p-2 bg-destructive/10 text-destructive rounded-md hover:bg-destructive/20"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                ))}

                                {/* Add Member Button */}
                                {formData.teamInfo.members.length < (currentActivity.maxTeamSize - 1) && (
                                    <button
                                        type="button"
                                        onClick={addTeamMember}
                                        className="w-full mt-2 p-2 border-2 border-dashed rounded-lg hover:bg-accent transition-colors"
                                    >
                                        + Add Team Member
                                    </button>
                                )}
                            </CardContent>
                        </Card>
                    )}

                    {/* Academic Information  */}
                    <Card className="border-none shadow-xl bg-background/60 backdrop-blur-sm py-5">
                        <CardHeader className="text-xl font-bold">
                            Academic Information
                        </CardHeader>
                        <CardContent className='space-y-4'>
                            <div className='grid md:grid-cols-2 gap-4'>
                                <div className="space-y-2 flex flex-col">
                                    <Label htmlFor="currentClass" className='font-semibold text-sm'>Current Class/Grade <span className='text-destructive'>*</span></Label>
                                    <Select onValueChange={(value) => handleInputChange('academicInfo', 'currentClass', value)} id="currentClass">
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select Class/Grade" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="5">5</SelectItem>
                                            <SelectItem value="6">6</SelectItem>
                                            <SelectItem value="7">7</SelectItem>
                                            <SelectItem value="8">8</SelectItem>
                                            <SelectItem value="9">9</SelectItem>
                                            <SelectItem value="10">10</SelectItem>
                                            <SelectItem value="11">11</SelectItem>
                                            <SelectItem value="12">12</SelectItem>
                                            <SelectItem value="Graduate">Graduate</SelectItem>
                                            <SelectItem value="Other">Other</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2 flex flex-col">
                                    <Label htmlFor="school" className='font-semibold text-sm'>School/Institution <span className='text-destructive'>*</span></Label>
                                    <Input type="text"
                                        name="school"
                                        id="school"
                                        value={formData.academicInfo.school}
                                        onChange={(e) => handleInputChange('academicInfo', 'school', e.target.value)}
                                        placeholder="School"
                                    />
                                </div>
                                <div className="space-y-2 flex flex-col">
                                    <Label htmlFor="board" className='font-semibold text-sm'>Board/University <span className='text-destructive'>*</span></Label>
                                    <Input
                                        name="board"
                                        id="board"
                                        value={formData.academicInfo.board}
                                        onChange={(e) => handleInputChange('academicInfo', 'board', e.target.value)}
                                        placeholder="Board/University"
                                    />
                                </div>
                                <div className="space-y-2 flex flex-col">
                                    <Label htmlFor="previousScore" className='font-semibold text-sm'> Previous Academic Score (%) <span className='text-destructive'>*</span></Label>
                                    <Input

                                        id="previousScore"
                                        type="number"
                                        value={formData.academicInfo.previousScore}
                                        onChange={(e) => handleInputChange('academicInfo', 'previousScore', e.target.value)}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Parents Information  */}
                    <Card className="border-none shadow-xl bg-background/60 backdrop-blur-sm">
                        <CardHeader>
                            <CardTitle className="text-xl font-bold">Guardian Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="guardianName">Guardian Name *</Label>
                                    <Input
                                        id="guardianName"
                                        value={formData.guardianInfo.guardianName}
                                        onChange={(e) => handleInputChange('guardianInfo', 'guardianName', e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="guardianPhone">Guardian Phone *</Label>
                                    <Input
                                        id="guardianPhone"
                                        value={formData.guardianInfo.guardianPhone}
                                        onChange={(e) => handleInputChange('guardianInfo', 'guardianPhone', e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="guardianEmail">Guardian Email</Label>
                                    <Input
                                        id="guardianEmail"
                                        type="email"
                                        value={formData.guardianInfo.guardianEmail}
                                        onChange={(e) => handleInputChange('guardianInfo', 'guardianEmail', e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="relationship">Relationship *</Label>
                                    <Select onValueChange={(value) => handleInputChange('guardianInfo', 'relationship', value)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select relationship" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="father">Father</SelectItem>
                                            <SelectItem value="mother">Mother</SelectItem>
                                            <SelectItem value="guardian">Guardian</SelectItem>
                                            <SelectItem value="other">Other</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Additional Information */}
                    <Card className="border-none shadow-xl bg-background/60 backdrop-blur-sm">
                        <CardHeader>
                            <CardTitle className="text-xl font-bold">Additional Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="experience">Previous Experience (if any)</Label>
                                <Textarea
                                    id="experience"
                                    value={formData.additionalInfo.experience}
                                    onChange={(e) => handleInputChange('additionalInfo', 'experience', e.target.value)}
                                    placeholder="Tell us about any relevant experience or achievements"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="expectations">What do you expect from this program?</Label>
                                <Textarea
                                    id="expectations"
                                    value={formData.additionalInfo.expectations}
                                    onChange={(e) => handleInputChange('additionalInfo', 'expectations', e.target.value)}
                                    placeholder="Share your goals and expectations"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="specialNeeds">Special Needs or Accommodations</Label>
                                <Textarea
                                    id="specialNeeds"
                                    value={formData.additionalInfo.specialNeeds}
                                    onChange={(e) => handleInputChange('additionalInfo', 'specialNeeds', e.target.value)}
                                    placeholder="Any special requirements or accommodations needed"
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Document */}
                    <Card className="border-none shadow-xl bg-background/60 backdrop-blur-sm">
                        <CardHeader>
                            <CardTitle className="text-xl font-bold">Document Upload</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid md:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="photo" className='flex flex-col items-start'>Recent Photo *
                                        <div className="border-2 border-dashed w-full border-muted-foreground/25 rounded-lg p-4 text-center">
                                            <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                                            <p className="text-sm text-muted-foreground">Click to upload photo</p>
                                        </div>
                                    </Label>
                                    <input
                                        id='photo'
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={(e) => handleFileUpload('photo', e.target.files?.[0] || null)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="idProof" className='flex flex-col items-start'>ID Proof *
                                        <div className="border-2 border-dashed w-full border-muted-foreground/25 rounded-lg p-4 text-center">
                                            <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                                            <p className="text-sm text-muted-foreground">Upload ID proof</p>
                                        </div>
                                    </Label>
                                    <input
                                        id='idProof'
                                        type="file"
                                        accept=".pdf,.jpg,.jpeg,.png"
                                        className="hidden"
                                        onChange={(e) => handleFileUpload('idProof', e.target.files?.[0] || null)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="academicRecords" className='flex flex-col items-start'>Academic Records
                                        <div className="border-2 border-dashed w-full border-muted-foreground/25 rounded-lg p-4 text-center">
                                            <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                                            <p className="text-sm text-muted-foreground">Upload mark sheets</p>
                                        </div>
                                    </Label>
                                    <input
                                        id='academicRecords'
                                        type="file"
                                        accept=".pdf,.jpg,.jpeg,.png"
                                        className="hidden"
                                        onChange={(e) => handleFileUpload('academicRecords', e.target.files?.[0] || null)}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {formData.payments.paymentRequired && <Card className="w-full p-5 shadow-2xl">
                        <CardContent className="flex flex-col md:flex-row items-center justify-between gap-6">
                            <div className="flex items-center gap-4">
                                <div className="bg-accent p-3 rounded-full">
                                    <Banknote className="w-6 h-6 text-accent-foreground" />
                                </div>
                                <div>
                                    <p className="text-base font-semibold text-gray-800">Registration Fee</p>
                                    <p className="text-sm text-gray-500">One-time payment for processing.</p>
                                </div>
                            </div>
                            <div className="flex flex-col items-stretch text-center md:text-right md:items-end gap-3 w-full md:w-auto">
                                <p className="text-3xl font-extrabold text-gray-800">₹{currentActivity?.fee}</p>
                                <button type="button" onClick={() => handlePayment(currentActivity?.fee, currentUser.uid)} className="w-full md:w-auto whitespace-nowrap flex items-center gap-1 bg-primary text-primary-foreground p-2 px-3 rounded-lg text-sm mt-1 cursor-pointer hover:bg-primary/80 transition-all">
                                    <Lock size={16} />
                                    Pay Fee Securely
                                </button>
                            </div>
                        </CardContent>
                    </Card>}

                    <Card className="border-none shadow-xl bg-background/60 backdrop-blur-sm">
                        <CardContent className="p-6 space-y-6">
                            <div className="flex items-start space-x-2">
                                <Checkbox
                                    id="consent"
                                    checked={formData.consent}
                                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, consent: checked }))}
                                />
                                <Label htmlFor="consent" className="text-sm leading-relaxed">
                                    I hereby declare that the information provided above is true and correct to the best of my knowledge. I agree to the terms and conditions of Kalyan Trust and understand that providing false information may lead to disqualification.
                                </Label>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4 pt-4">
                                <button
                                    onClick={handleSubmit}
                                    type='submit'
                                    className="flex-1 min-h-14  rounded-xl bg-primary hover:bg-primary/90 shadow-lg text-primary-foreground flex items-center justify-center"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                            Submitting...
                                        </>
                                    ) : (
                                        <>
                                            <CheckCircle className="h-4 w-4 mr-2" />
                                            Submit Application
                                        </>
                                    )}
                                </button>
                                <Link
                                    className="h-14 rounded-xl flex items-center justify-center border px-5"
                                    to={'/'}
                                >
                                    Cancel
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                </motion.form>
            </div>
            <Toaster
                position='bottom-right'
            />


            {isSubmitting && (
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
                        Submitting your application...
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

        </div >
    )
}

export default FormRenderer
