"use client"
import React, { useState, useEffect } from 'react';

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [shouldRenderMenu, setShouldRenderMenu] = useState(false);


    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const toggleMenu = () => {
        if (!isMenuOpen) {
            document.body.style.overflow = 'hidden';
            setShouldRenderMenu(true);
            setTimeout(() => setIsMenuOpen(true), 10);
        } else {
            closeMenu();
        }
    };


    const closeMenu = () => {
        setIsMenuOpen(false);
        setTimeout(() => {
            setShouldRenderMenu(false);
        }, 300);
        document.body.style.overflow = '';
    };


    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercent = Math.min(scrollTop / docHeight, 1);

            const menu = document.getElementById('scroll-menu');
            if (menu) {
                const maxTranslate = 100;
                const currentTranslate = (1 - scrollPercent) * maxTranslate;
                menu.style.transform = `translateX(-${currentTranslate}%)`;
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);


    return (
        <>
            {/* Main Navbar */}
            <div className={`
                tw:fixed tw:top-0 tw:left-0 tw:right-0 tw:z-40
                tw:flex tw:items-center tw:justify-between 
                tw:px-6 tw:py-2 tw:bg-white
                tw:transition-all tw:duration-300
                ${isScrolled ? 'tw:shadow-md' : 'tw:shadow-none'}
            `}>
                {/* Logo */}
                <div className="tw:px-8">
                    <img
                        src="/assets/logo.png"
                        alt="workerhomes"
                        className="tw:w-[200px] tw:h-[41px]"
                    />
                </div>

                {/* Desktop Navigation */}
                <div className="tw:hidden tw:md:flex tw:text-[var(--color-font-dark)] tw:font-normal tw:items-center tw:gap-6 tw:text-[14px]">
                    <a href="#" className="tw:hover:text-[var(--color-primary)] tw:hover:font-medium">Home</a>
                    <a href="#" className="tw:hover:text-[var(--color-primary)] tw:hover:font-medium">Pricing</a>
                    <a href="#" className="tw:hover:text-[var(--color-primary)] tw:hover:font-medium">Bookmarks</a>
                    <a href="#" className="tw:hover:text-[var(--color-primary)] tw:hover:font-medium">Blogs</a>
                    <a href="#" className="tw:hover:text-[var(--color-primary)] tw:hover:font-medium">Contact</a>

                    <button className="tw:relative tw:w-[150px] tw:h-[33px] tw:text-sm tw:font-medium tw:text-[var(--color-primary)] tw:bg-white tw:z-10 tw:overflow-hidden animated-border">
                        List your property
                    </button>
                </div>

                {/* Desktop Right Section */}
                <div className="tw:hidden tw:md:flex tw:items-center tw:gap-4">
                    <button className="tw:bg-[#040342] tw:text-white tw:text-[14px] tw:w-[150px] tw:h-[33px] tw:text-sm tw:font-medium tw:hover:bg-orange-600">
                        Sign In / Register
                    </button>

                    <div className="tw:flex tw:items-center tw:gap-2 tw:cursor-pointer">
                        <img src="/assets/flag1.png" alt="UK Flag" className="tw:w-[32px] tw:h-[32px] tw:rounded-full" />
                        <img src="/assets/dropdown.png" alt="icon" className="tw:w-[13px] tw:h-[8px] tw:rounded-full" />
                    </div>
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="tw:md:hidden tw:p-2 tw:text-gray-700"
                    onClick={toggleMenu}
                    aria-label="Toggle menu"
                >
                    <svg className="tw:w-6 tw:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>
            </div>

            {/* Mobile Menu Overlay */}
            {shouldRenderMenu && (
                <div className="tw:fixed tw:inset-0 tw:z-50 tw:overflow-hidden">
                    {/* Backdrop */}
                    <div className={`
                    tw:absolute tw:inset-0 tw:bg-black 
                    ${isMenuOpen ? 'tw:opacity-50' : 'tw:opacity-0'}
                    tw:transition-opacity tw:duration-300
                    `} onClick={closeMenu}
                    />

                    {/* Menu Content */}
                    <div
                        id="scroll-menu"
                        className={`
                        tw:absolute tw:top-0 tw:left-0 tw:h-full tw:bg-white tw:shadow-xl
                        tw:transform tw:transition-transform tw:duration-300 tw:ease-out
                        ${isMenuOpen ? 'tw:translate-x-0' : '-tw:translate-x-[90vw]'}
                        tw:overflow-y-auto
                    `}
                        style={{ width: '90vw', maxWidth: '90vw' }}
                    >
                        <div className="tw:px-8">
                            <img
                                src="/assets/logo.png"
                                alt="workerhomes"
                                className="tw:w-[200px] tw:h-[41px]"
                            />
                        </div>
                        {/* Close Button */}
                        <button
                            className="tw:absolute tw:top-4 tw:right-4 tw:p-2 tw:text-gray-700"
                            onClick={closeMenu}
                            aria-label="Close menu"
                        >
                            <svg className="tw:w-6 tw:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                        {/* Scrollable Menu Content */}
                        <div className="tw:flex tw:flex-col tw:p-6 tw:space-y-6 tw:mt-16">
                            <a href="#" className="tw:text-[var(--color-font-dark)] tw:hover:text-[var(--color-primary)] tw:hover:font-medium tw:text-lg" onClick={closeMenu}>
                                Home
                            </a>
                            <a href="#" className="tw:text-[var(--color-font-dark)] tw:hover:text-[var(--color-primary)] tw:text-lg" onClick={closeMenu}>
                                Pricing
                            </a>
                            <a href="#" className="tw:text-[var(--color-font-dark)] tw:hover:text-[var(--color-primary)] tw:text-lg" onClick={closeMenu}>
                                Bookmarks
                            </a>
                            <a href="#" className="tw:text-[var(--color-font-dark)] tw:hover:text-[var(--color-primary)] tw:text-lg" onClick={closeMenu}>
                                Blogs
                            </a>
                            <a href="#" className="tw:text-[var(--color-font-dark)] tw:hover:text-[var(--color-primary)] tw:text-lg" onClick={closeMenu}>
                                Contact
                            </a>

                            <button className="tw:w-full tw:py-3 tw:text-sm tw:font-medium tw:text-[var(--color-primary)] tw:border tw:border-[var(--color-primary)] animated-border  tw:mt-4">
                                List your property
                            </button>

                            <button className="tw:w-full tw:py-3 tw:text-sm tw:font-medium tw:text-white tw:bg-[#040342] ">
                                Sign In / Register
                            </button>

                            <div className="tw:flex tw:items-center tw:gap-2 tw:cursor-pointer tw:mt-4">
                                <img src="/assets/flag1.png" alt="UK Flag" className="tw:w-[32px] tw:h-[32px] tw:rounded-full" />
                                <span className="tw:text-[var(--color-font-dark)] tw:text-lg">Language</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Navbar;
