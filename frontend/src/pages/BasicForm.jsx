import React, { useState } from 'react'
import { Card, CardContent, CardHeader } from '../ui/Cards'
import { motion } from 'framer-motion'
import { CheckCircle, Notebook, Phone, User } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../utils/AuthProvider'
import { doc, setDoc } from 'firebase/firestore'
import { db } from '../../firebase'
import toast, { Toaster } from 'react-hot-toast'
import { Input, Textarea } from '../ui/input'
import { Label } from '../ui/label'

const BasicForm = () => {

    document.title = "Kalyan | User Form"

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [displayName, setDisplayName] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [waPhone, setWaPhone] = useState('');
    const [address, setAddress] = useState('')
    const [city, setCity] = useState('')
    const [state, setState] = useState('')
    const [pincode, setPincode] = useState('')
    const [schoolName, setSchoolName] = useState('')
    const [dateOfBirth, setDateOfBirth] = useState('')
    const [aadhar, setAadhar] = useState('')
    const navigate = useNavigate();

    const { currentUser } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!currentUser || !aadhar || !displayName || !dateOfBirth || !userEmail || !phone || !address || !city || !state || !pincode || !schoolName) {
            toast.error("Fill Each Field", {
                style: {
                    borderRadius: '10px',
                    background: '#030213',
                    color: '#fff',
                }
            })
            return
        }
        const timeStamp = new Date().toISOString()
        try {
            setIsSubmitting(true)
            await setDoc(doc(db, "users", currentUser.uid), {
                displayName: displayName,
                aadhar: aadhar,
                userId: currentUser.uid,
                userEmail: userEmail,
                dob: dateOfBirth,
                phone: phone,
                waPhone: waPhone,
                address: address,
                city: city,
                state: state,
                pincode: pincode,
                schoolName: schoolName,
                role: "user",
                timeStamp: timeStamp
            });
            toast.success("User Information Updated!", {
                icon: "👤",
                style: {
                    borderRadius: '10px',
                    background: '#030213',
                    color: '#fff',
                }
            })
            setTimeout(() => {
                navigate('/profile')
            }, 1000);

        } catch (error) {
            console.log(error)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (

        <section className='min-h-screen bg-secondary py-10 ' >
            <div className='max-w-7xl mx-auto'>
                <motion.form
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className='space-y-5'
                >
                    <Card className='shadow-xl'>
                        <CardHeader className='flex items-center text-xl mt-3 font-bold'>
                            <User size={18} />
                            <p>User Information</p>
                        </CardHeader>
                        <CardContent>
                            <div className='grid md:grid-cols-2 gap-4'>
                                <div className='space-y-2 flex flex-col'>
                                    <Label htmlFor="displayName" className='font-semibold text-sm'>Display Name <span className='text-destructive'>*</span></Label>
                                    <Input type="text"
                                        name="displayName"
                                        id="displayName"
                                        onChange={(e) => setDisplayName(e.target.value)}
                                        placeholder="Full Name"
                                        required
                                    />
                                </div>
                                <div className='space-y-2 flex flex-col'>
                                    <Label htmlFor="userEmail" className='font-semibold text-sm'>Email <span className='text-destructive'>*</span></Label>
                                    <Input type="email"
                                        name="userEmail"
                                        id="userEmail"
                                        onChange={(e) => setUserEmail(e.target.value)}
                                        placeholder="Email Address"
                                        required
                                    />
                                </div>
                                <div className="space-y-2 flex flex-col">
                                    <Label htmlFor="dateOfBirth" className='font-semibold text-sm'>Date of Birth <span className='text-destructive'>*</span></Label>
                                    <Input
                                        id="dateOfBirth"
                                        type="date"
                                        onChange={(e) => setDateOfBirth(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="space-y-2 flex flex-col">
                                    <Label htmlFor="dateOfBirth" className='font-semibold text-sm'>Date of Birth <span className='text-destructive'>*</span></Label>
                                    <Input
                                        id="aadhar"
                                        type="text"
                                        onChange={(e) => setAadhar(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className='space-y-2 flex flex-col'>
                                    <Label htmlFor="phone" className='font-semibold text-sm'>Phone Number <span className='text-destructive'>*</span></Label>
                                    <Input type="text"
                                        onChange={(e) => setPhone(e.target.value)}
                                        name="phone"
                                        id="phone"
                                        placeholder="Phone Number"
                                        required
                                    />
                                </div>
                                <div className='space-y-2 flex flex-col'>
                                    <Label htmlFor="waNumber" className='font-semibold text-sm'>Whatsapp Number</Label>
                                    <Input type="text"
                                        name="waNumber"
                                        id="waNumber"
                                        onChange={(e) => setWaPhone(e.target.value)}
                                        placeholder="Whatsapp Number"
                                    />
                                </div>
                                <div className='space-y-2 flex flex-col'>
                                    <Label htmlFor="schoolName" className='font-semibold text-sm'>School Name</Label>
                                    <Input type="text"
                                        name="schoolName"
                                        id="schoolName"
                                        onChange={(e) => setSchoolName(e.target.value)}
                                        placeholder="School Name"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2 mt-4">
                                <Label htmlFor="address">Address <span className='text-destructive'>*</span></Label>
                                <Textarea
                                    id="address"
                                    onChange={(e) => setAddress(e.target.value)}
                                    required
                                    placeholder="Address"
                                />
                            </div>
                            <div className="grid md:grid-cols-3 gap-4 mt-4">
                                <div className="space-y-2 flex flex-col">
                                    <Label htmlFor="city" className='font-semibold text-sm'>City <span className='text-destructive'>*</span></Label>
                                    <Input
                                        placeholder="City"
                                        id="city"
                                        onChange={(e) => setCity(e.target.value)}
                                        required
                                        type="text"
                                    />
                                </div>
                                <div className="space-y-2 flex flex-col">
                                    <Label htmlFor="state" className='font-semibold text-sm'>State <span className='text-destructive'>*</span></Label>
                                    <Input
                                        placeholder="State"
                                        onChange={(e) => setState(e.target.value)}
                                        id="state"
                                        type="text"
                                        required
                                    />
                                </div>
                                <div className="space-y-2 flex flex-col">
                                    <Label htmlFor="pincode" className='font-semibold text-sm'>Pincode <span className='text-destructive'>*</span></Label>
                                    <Input
                                        placeholder="Pincode"
                                        id="pincode"
                                        type="text"
                                        onChange={(e) => setPincode(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent>
                            <div className="flex flex-col sm:flex-row gap-4 pt-4 mt-5">
                                <button
                                    onClick={handleSubmit}
                                    className={`${isSubmitting ? "cursor-not-allowed" : "cursor-pointer"} flex-1 h-14 rounded-xl bg-primary hover:bg-primary/90 shadow-lg text-primary-foreground flex items-center justify-center`}
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
                <Toaster
                    position='bottom-right'
                />
            </div>
        </section >
    )
}

export default BasicForm