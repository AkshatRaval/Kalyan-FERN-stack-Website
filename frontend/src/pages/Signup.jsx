import { Eye, EyeClosed, Lock, Mail, User } from 'lucide-react'
import React, { useState } from 'react'
import { FaGoogle } from 'react-icons/fa'
import { Link, useNavigate } from 'react-router-dom'
import toast, { Toaster } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../../firebase';

const Signup = () => {

    document.title = "Signup | Kalyan Trust"
    const [loading, setLoading] = useState(false)
    const [view, setView] = useState(false)
    const [cView, setCView] = useState(false)
    const navigate = useNavigate();
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    const handleSignup = async (name, email, password, confirmPassword) => {
        if (!email || !password || !confirmPassword || !name) {
            toast.error("Please Fill All Fields!", {
                style: {
                    borderRadius: '10px',
                    background: '#030213',
                    color: '#fff',
                }
            });
            return;
        }

        if (confirmPassword != password) {
            toast.error("Passwords Does Not Match!", {
                style: {
                    borderRadius: '10px',
                    background: '#030213',
                    color: '#fff',
                }
            });
            return;
        }

        try {
            setLoading(true)
            const currentUser = await createUserWithEmailAndPassword(auth, email, password);
            // console.log(currentUser)
            const user = currentUser.user;
            // console.log(user)
            toast.success("Signed Up Successfully!", {
                style: {
                    borderRadius: '10px',
                    background: '#030213',
                    color: '#fff',
                }
            });
            toast.success("Welcome To Kalyan Education & Charitable Trust!", {
                icon: "💐",
                style: {
                    borderRadius: '10px',
                    background: '#030213',
                    color: '#fff',
                }
            });
            setTimeout(() => {
                navigate('/userform')
            }, 2000);


        } catch (error) {
            console.log(error)
            let errorMessage = "An error occurred during sign-Up.";

            toast.error(errorMessage, {
                style: {
                    borderRadius: '10px',
                    background: '#030213',
                    color: '#fff',
                }
            });
        } finally {
            setLoading(false)
        }
    };


    return (
        <section className='min-h-screen bg-secondary flex items-center justify-center'>
            <div className='bg-primary-foreground p-5 rounded-lg shadow-lg w-full max-w-md m-4'>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <div className='flex justify-center my-5'>
                        <img src="/assets/KalyanLogo.svg" alt="" className='w-20' />
                    </div>
                    <div className='text-center space-y-2 mb-5'>
                        <h1 className='font-bold text-3xl m-0'>Create Account</h1>
                        <p className='text-md text-muted-foreground'>Join Kalyan Trust and start your journey</p>
                    </div>
                    <form action="">
                        <div className='mb-4'>
                            <label htmlFor="name" className='font-semibold'>Name</label>
                            <div className='relative'>
                                <User className='text-muted-foreground absolute transform -translate-[50%] top-[50%] left-5' size={18} />
                                <input type="text" id='name' placeholder='Enter Your Name' className='w-full p-3 rounded-md bg-secondary border border-border focus:border-primary outline-none pl-10' onChange={(e) => setName(e.target.value)} />

                            </div>
                        </div>
                        <div className='mb-4'>
                            <label htmlFor="email" className='font-semibold'>Email</label>
                            <div className='relative'>
                                <Mail className='text-muted-foreground absolute transform -translate-[50%] top-[50%] left-5' size={18} />
                                <input type="email" id='email' placeholder='Enter Your Email' className='w-full p-3 rounded-md bg-secondary border border-border focus:border-primary outline-none pl-10' onChange={(e) => setEmail(e.target.value)} />
                            </div>
                        </div>
                        <div className='mb-4'>
                            <label htmlFor="password" className='font-semibold'>Password</label>
                            <div className='relative'>
                                <Lock className='text-muted-foreground absolute transform -translate-[50%] top-[50%] left-5' size={18} />
                                <input type={view ? 'text' : 'password'} id='password' placeholder='Create Your Password' className='w-full p-3 rounded-md bg-secondary border 
            border-border focus:border-primary outline-none px-10' onChange={(e) => setPassword(e.target.value)} />
                                <div onClick={() => setView(!view)} className='cursor-pointer'>{view ? <Eye className='text-muted-foreground absolute transform -translate-[50%] top-[50%] right-3' size={18} /> : <EyeClosed className='text-muted-foreground absolute transform -translate-[50%] top-[50%] right-3' size={18} />}</div>
                            </div>
                        </div>
                        <div className='mb-4'>
                            <label htmlFor="password" className='font-semibold'>Confirm Password</label>
                            <div className='relative'>
                                <Lock className='text-muted-foreground absolute transform -translate-[50%] top-[50%] left-5' size={18} />
                                <input type={cView ? 'text' : 'password'} id='confirmPassword' placeholder='Confirm Your Password' className='w-full p-3 rounded-md bg-secondary border 
            border-border focus:border-primary outline-none px-10' onChange={(e) => setConfirmPassword(e.target.value)} />
                                <div onClick={() => setCView(!cView)} className='cursor-pointer'>{cView ? <Eye className='text-muted-foreground absolute transform -translate-[50%] top-[50%] right-3' size={18} /> : <EyeClosed className='text-muted-foreground absolute transform -translate-[50%] top-[50%] right-3' size={18} />}</div>
                            </div>
                        </div>
                    </form>
                    <div>
                        <button className='w-full bg-primary mt-6 text-primary-foreground p-3 rounded-md font-semibold hover:bg-primary/90 transition cursor-pointer' onClick={() => handleSignup(name, email, password, confirmPassword)}>{loading ? "Signing Up..." : "Sign Up"}</button>
                    </div>
                    <div className='flex my-5 items-center gap-3'>
                        <div className='h-0.5 w-full bg-border' />
                        <p className='text-muted-foreground'>OR</p>
                        <div className='h-0.5 w-full bg-border' />
                    </div>
                    <div>
                        <button className='w-full border border-border text-primary p-3 rounded-md font-semibold hover:bg-secondary transition flex items-center justify-center gap-3 cursor-pointer'><FaGoogle />Sign up with Google</button>
                    </div>
                    <div>
                        <p className='text-center mt-4'>Already have an account? <Link to={'/login'} className='text-primary font-semibold hover:underline'>Sign In</Link></p>
                    </div>
                </motion.div>
                <Toaster
                    position="bottom-right"
                    reverseOrder={false}
                />
            </div>
        </section>
    )
}

export default Signup