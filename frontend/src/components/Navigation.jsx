import { motion } from 'framer-motion';
import React, { useEffect, useState } from 'react'
import { useAuth } from '../utils/AuthProvider';
import { LogOut, Menu, User, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/DropDown';

const Navigation = () => {

    const navigate = useNavigate()
    const currentPath = window.location.pathname;
    const [currentPage, setCurrentPage] = useState(currentPath === '/' ? 'home' : currentPath.slice(1));
    
    
    useEffect(() => {
        window.scrollTo(0, 0);
        setCurrentPage(currentPath.slice(1))
    }, [currentPath])

    

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { currentUser, userData, logout } = useAuth();

    const displayName = userData?.displayName
  

    const navigation = [
        { name: 'Home', page: 'home', current: currentPage === 'home' },
        { name: 'About', page: 'about', current: currentPage === 'about' },
        { name: 'Activities', page: 'activities', current: currentPage === 'activities' },
        { name: 'Apply', page: 'apply', current: currentPage === 'apply' },
        { name: 'Get Cerificate', page: 'quizCerti', current: currentPage === 'quizCerti' },
    ];
    // console.log(currentUser)

    return (

        <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50 shadow-sm">
            <nav className="w-full mx-auto px-6 lg:px-30 xl:px-50">
                <div className="flex justify-between h-20">
                    <div className="flex items-center">
                        <motion.button
                            onClick={() => setCurrentPage('home')}
                            className="flex items-center space-x-3 group"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <div className="relative">
                                <motion.div
                                    className="w-12 h-12 bg-secondary rounded-xl flex items-center justify-center shadow-lg"
                                    whileHover={{ rotate: 5 }}
                                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                                >
                                    <img src='/assets/KalyanLogo.svg' className="w-10 h-10 rounded-xl bg-secondary" />
                                </motion.div>
                            </div>
                            <div className="flex flex-col items-start">
                                <span className="text-xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
                                    Kalyan Trust
                                </span>
                                <span className="text-xs text-muted-foreground -mt-1">Educational & Charitable Trust</span>
                            </div>
                        </motion.button>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center">
                        <div className="flex items-center space-x-1 bg-muted/30 rounded-2xl p-1">
                            {navigation.map((item) => (
                                <Link
                                    to={item.page === 'home' ? '/' : `/${item.page}`}
                                    key={item.name}
                                    onClick={() => setCurrentPage(item.page)}
                                    className={`relative px-6 py-2.5 rounded-xl transition-all duration-200 ${item.current
                                        ? 'bg-background shadow-md'
                                        : 'hover:bg-background/50'
                                        }`}
                                >
                                    <span className={`relative z-10 font-medium ${item.current ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                                        }`}>
                                        {item.name}
                                    </span>
                                    {item.current && (
                                        <motion.div
                                            layoutId="activeTab"
                                            className="absolute inset-0 bg-background rounded-xl shadow-md border border-border/50"
                                            initial={false}
                                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                        />
                                    )}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Desktop Auth */}
                    <div className="hidden md:flex items-center space-x-3">
                        {currentUser ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <button className="flex items-center justify-center space-x-2 h-11 px-4 rounded-xl hover:bg-accent/50 cursor-pointer">
                                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                                            <User className="h-4 w-4 text-primary" />
                                        </div>
                                        <span className="font-medium">{displayName}</span>
                                    </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-56 p-2">
                                    <DropdownMenuItem
                                        onClick={() => navigate('/profile')}
                                        className="rounded-lg p-3 cursor-pointer"
                                    >
                                        <User className="h-4 w-4 mr-3" />
                                        Profile
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        onClick={logout}
                                        className="rounded-lg p-3 cursor-pointer"
                                    >
                                        <LogOut className="h-4 w-4 mr-3" />
                                        Logout
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            <div className="flex items-center space-x-2">
                                <Link
                                    onClick={() => setCurrentPage('login')}
                                    to={'/login'}
                                    className="h-11 px-6 flex items-center justify-center rounded-xl hover:bg-accent/50 cursor-pointer"
                                >
                                    Login
                                </Link>
                                <Link
                                    onClick={() => setCurrentPage('signup')}
                                    to={'/signup'}
                                    className="h-11 px-6 flex items-center justify-center rounded-xl bg-primary hover:bg-primary/90 shadow-lg text-primary-foreground cursor-pointer"
                                >
                                    Sign Up
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden flex items-center">
                        <button
                            size="sm"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="h-11 w-11 rounded-xl flex items-center justify-center"
                        >
                            <motion.div
                                animate={{ rotate: isMenuOpen ? 180 : 0 }}
                                transition={{ duration: 0.2 }}
                            >
                                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                            </motion.div>
                        </button>
                    </div>
                </div>

                {/* Mobile Navigation */}
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="md:hidden py-6 border-t border-border/50 mt-4"
                    >
                        <div className="space-y-4 flex flex-col">
                            {navigation.map((item, index) => (
                                <Link
                                    to={item.page === 'home' ? '/' : `/${item.page}`}
                                    key={item.name}
                                    onClick={() => {
                                        setCurrentPage(item.page);
                                        setIsMenuOpen(false);
                                    }}
                                    className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-200 ${item.current
                                        ? 'bg-primary/10 text-primary border border-primary/20'
                                        : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                                        }`}>
                                    <span className="font-medium">{item.name}</span>
                                </Link>
                            ))}

                            <div className="pt-4 border-t border-border/50 space-y-3">
                                {currentUser ? (
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <button className="flex items-center justify-center space-x-2 h-11 px-4 rounded-xl hover:bg-accent/50 cursor-pointer">
                                                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                                                    <User className="h-4 w-4 text-primary" />
                                                </div>
                                                <span className="font-medium">{displayName}</span>
                                            </button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="w-56 p-2">
                                            <DropdownMenuItem
                                                onClick={() => navigate('/profile')}
                                                className="rounded-lg p-3 cursor-pointer"
                                            >
                                                <User className="h-4 w-4 mr-3" />
                                                Profile
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                onClick={logout}
                                                className="rounded-lg p-3 cursor-pointer"
                                            >
                                                <LogOut className="h-4 w-4 mr-3" />
                                                Logout
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                ) : (
                                    <div className="space-y-3 flex flex-col px-4">
                                        <Link
                                            to={'/login'}
                                            className="w-full h-12 rounded-xl hover:bg-accent/50 flex items-center justify-center"
                                            onClick={() => {
                                                setCurrentPage('login');
                                                setIsMenuOpen(false);
                                            }}>
                                            Login
                                        </Link>
                                        <Link
                                            to={'/signup'}
                                            className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90 shadow-lg text-primary-foreground flex items-center justify-center"
                                            onClick={() => {
                                                setCurrentPage('signup');
                                                setIsMenuOpen(false);
                                            }}>
                                            Sign Up
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </nav>

        </header>
    )
}

export default Navigation