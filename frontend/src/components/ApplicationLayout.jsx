import React from 'react'
import { Outlet } from 'react-router-dom'
import Navigation from './Navigation'
import Footer from './Footer'

const ApplicationLayout = () => {
    return (
        <div className='bg-background'>
            <Navigation />
            <main className='flex-1 overflow-y-auto'>
                <Outlet />
            </main>
            <Footer />
        </div>
    )
}

export default ApplicationLayout