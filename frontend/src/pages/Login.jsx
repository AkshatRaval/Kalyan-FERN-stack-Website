import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { FaGoogle } from "react-icons/fa";
import { Eye, EyeClosed, Lock, Mail } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { motion } from 'framer-motion'
import { auth } from '../../firebase';
import { useAuth } from '../utils/AuthProvider';
import { GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";


const Login = () => {
  document.title = "Login | Kalyan Trust"
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  useEffect(() => {
    if (currentUser) {
      toast('You Are Already Logged In!', {
        icon: '👤',
        style: {
          borderRadius: '10px',
          background: '#030213',
          color: '#fff',
        }
      });
      navigate('/')
    }
  }, [])

  const [loading, setLoading] = useState(false)
  const [view, setView] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  // console.log(currentUser)

  const handleSignin = async (email, password) => {
    if (!email || !password) {
      toast.error("Please enter both email and password.", {
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
      await signInWithEmailAndPassword(auth, email, password);
      toast.success("Successfully Logged In!", {
        style: {
          borderRadius: '10px',
          background: '#030213',
          color: '#fff',
        }
      });
      setTimeout(() => {
        navigate('/')
      }, 1500);

    } catch (error) {
      setLoading(false)
      let errorMessage = "An error occurred during sign-in.";
      if (error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential') {
        errorMessage = "Invalid email or password.";
      }

      console.error("Firebase Sign-in Error:", error.code, error.message);

      toast.error(errorMessage, {
        style: {
          borderRadius: '10px',
          background: '#030213',
          color: '#fff',
        }
      });
    }
  };

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const idToken = await user.getIdToken();

      toast.success("Successfully Logged In!", {
        style: {
          borderRadius: '10px',
          background: '#030213',
          color: '#fff',
        }
      });
      setTimeout(() => {
        navigate('/')
      }, 1500);


    } catch (error) {
      // --- Handle Errors ---
      console.error('Error during Google sign-in:', error.code, error.message);

      // Handle specific errors if needed
      if (error.code === 'auth/popup-closed-by-user') {
        console.warn('Sign-in popup closed by user.');
      }
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
            <h1 className='font-bold text-3xl m-0'>Welcome Back!</h1>
            <p className='text-md text-muted-foreground'>Sign in to your Kalyan Trust account</p>
          </div>
          <form>
            <div className='mb-4'>
              <label htmlFor="email" className='font-semibold'>Email</label>
              <div className='relative'>
                <Mail className='text-muted-foreground absolute transform -translate-[50%] top-[50%] left-5' size={18} />
                <input type="email" id='email' placeholder='Email' className='w-full p-3 rounded-md bg-secondary border border-border focus:border-primary outline-none pl-10' onChange={(e) => setEmail(e.target.value)} />
              </div>
            </div>
            <div className='mb-4'>
              <label htmlFor="password" className='font-semibold'>Password</label>
              <div className='relative'>
                <Lock className='text-muted-foreground absolute transform -translate-[50%] top-[50%] left-5' size={18} />
                <input type={view ? 'text' : 'password'} id='password' placeholder='Password' className='w-full p-3 rounded-md bg-secondary border 
            border-border focus:border-primary outline-none pl-10' onChange={(e) => setPassword(e.target.value)} />
                <div onClick={() => setView(!view)} className='cursor-pointer'>{view ? <Eye className='text-muted-foreground absolute transform -translate-[50%] top-[50%] right-3' size={18} /> : <EyeClosed className='text-muted-foreground absolute transform -translate-[50%] top-[50%] right-3' size={18} />}</div>
              </div>
            </div>
          </form>
          <div className='my-3 text-center w-full hover:underline'>
            <a href="#">Forgot Password?</a>
          </div>
          <div>
            <button className='w-full bg-primary text-primary-foreground p-3 rounded-md font-semibold hover:bg-primary/90 transition cursor-pointer' onClick={() => handleSignin(email, password)}>{loading ? "Signing In..." : "Sign In"}</button>
          </div>
          <div className='flex my-5 items-center gap-3'>
            <div className='h-0.5 w-full bg-border' />
            <p className='text-muted-foreground'>OR</p>
            <div className='h-0.5 w-full bg-border' />
          </div>
          <div>
            <button className='w-full border border-border text-primary p-3 rounded-md font-semibold hover:bg-secondary transition flex items-center justify-center gap-3 cursor-pointer' onClick={handleGoogleLogin}><FaGoogle /> Sign in with Google</button>
          </div>
          <div>
            <p className='text-center mt-4'>Don't have an account? <Link to={'/signup'} className='text-primary font-semibold hover:underline'>Sign Up</Link></p>
          </div>
        </motion.div>
      </div>
      <Toaster
        position="bottom-right"
        reverseOrder={false}
      />
    </section>
  )
}

export default Login