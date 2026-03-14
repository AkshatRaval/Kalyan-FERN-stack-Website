import React, { useEffect } from 'react'
import './index.css'
import { AuthProvider } from './utils/AuthProvider';
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import NotFound from './pages/NotFound';
import Home from './pages/Home';
import Layout from './components/Layout';
import Login from './pages/Login';
import Signup from './pages/Signup';
import About from './pages/About';
import Activities from './pages/Activities';
import Apply from './pages/Apply';
import ApplicationLayout from './components/ApplicationLayout';
import Profile from './pages/Profile';
import Admin from './pages/Admin';
import MyApplication from './forms/MyApplication';
import BasicForm from './pages/BasicForm';
import FormRenderer from './forms/FormRenderer';
import { activities } from './constants/Apply';
import AdminRoute from './utils/AdminRoute';
import { lazy, Suspense } from 'react';
import BudgetQuiz from './forms/Quiz';
// const QuizLayout = lazy(() => import('./forms/Quiz'))


const App = () => {

  const allLinks = activities.map(activity => activity.link);
  const distinctLinks = [...new Set(allLinks)];

  return (
    <AuthProvider>
      <BrowserRouter>
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path="*" element={<NotFound />} />
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path='userform' element={<BasicForm />} />
              <Route path='profile' element={<Profile />} />
              <Route path='about' element={<About />} />
              <Route path='admin' element={
                <AdminRoute>
                  <Admin />
                </AdminRoute>
              } />
              <Route path='activities' element={<Activities />} />
              <Route path='apply' element={<Apply />} />
              <Route path='login' element={<Login />} />
              <Route path='signup' element={<Signup />} />
              <Route path='quiz' element={<BudgetQuiz />} />
            </Route>
            <Route path="/application" element={<ApplicationLayout />}>
              {distinctLinks.map((route) => (
                <Route path={route} element={<FormRenderer />} />
              ))
              }
              <Route path="*" element={<MyApplication />} />
            </Route>
          </Routes>
        </Suspense>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App