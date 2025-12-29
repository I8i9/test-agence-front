import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Logo  from '../../../assets/logos/rod_logo_1.svg';
import Logo_Dark from '../../../assets/logos/rod_logo_1_dark.svg';
import { Separator } from "@/components/ui/separator";
// Icons
import {
    LayoutDashboard,
    Car,
    ShoppingCart,
    Handshake,
    ReceiptText,
    ChartNoAxesCombined,
    HandCoins,
    Users,
    History,
    Moon,
    Sun,
    CircleQuestionMark,
    Archive,
    PercentDiamond,
} from 'lucide-react';
import User from "./user.jsx";
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import DemandeCount from '../demande/demandeCount.jsx';
import GarageCount from '../garage/garageCount.jsx';
import DepenseCount from '../depense/depenseCount.jsx';
import ToolTipCustom from '../../customUi/tooltip.jsx';


    const navitems = [
    { name: 'Dashboard', link: '/dashboard', icon: LayoutDashboard },
    { name: 'Garage', link: '/dashboard/garage', icon: Car },
    { name: 'Offres', link: '/dashboard/offres', icon: ShoppingCart },
    { name: 'Demandes', link: '/dashboard/demandes', icon: Handshake },
    { name: 'Contrats', link: '/dashboard/contrats', icon: ReceiptText },
    { name: 'Dépenses', link: '/dashboard/depenses', icon: HandCoins },
    { name: 'Partenaires', link: '/dashboard/partenaires', icon: Users },
    { name: 'Journal', link: '/dashboard/journal', icon:History },
    { name: 'Comptabilité', link: '/dashboard/archive', icon: PercentDiamond },
    { name: 'Performance', link: '/dashboard/performance', icon: ChartNoAxesCombined },

    
];
    

const SideBar = () => {
    const location = useLocation();

    const [selected, setSelected] = useState(() => {
        const currentPath = location.pathname;
        const cleanPath = currentPath.replace(/\/+$/, '');
        const foundIndex = navitems.findIndex(item => (item.link === cleanPath ));
        return foundIndex !== -1 ? foundIndex : -1;
    });

    

    useEffect(() => {
        const cleanPath = location.pathname.replace(/\/+$/, '');
        const foundIndex = navitems.findIndex(item => item.link === cleanPath);
        setSelected(foundIndex !== -1 ? foundIndex : -1);
    }, [location.pathname]);

    const [DarkMode, setDarkMode] = useState(localStorage.getItem('theme') === "dark" || false);
    // Toggle Dark Mode
    // This will toggle the dark mode state and save it to localStorage
    const toggleDarkMode = () => {
        localStorage.setItem('theme', DarkMode ? 'light' : 'dark');
        setDarkMode(!DarkMode);
    }

    const renderCounts = (item) => {
        switch (item.name) {
            case "Demandes":
                return (<DemandeCount />);
            case "Garage":
                return (<GarageCount isSelected={selected === 1} />);
            case "Dépenses":
                return (<DepenseCount isSelected={selected === 6} />);
            default:
                return null;
        }
    }
    
    return (
        <div className={`flex text-rod-primary flex-col items-center justify-between border-r-1 w-full transition-colors duration-500 ease-in-out laptop:pb-2 desktop:pb-3 desktop-lg:pb-4 desktop-xl:pb-6 pb-2   ${DarkMode ? 'bg-zinc-950 text-white border-transparent' : 'bg-white text-rod-primary'}`}>
            <div id="navigation" className="flex flex-col gap-2 w-full">
                {/* Logo Section */}
                <div id='logo' className='w-full flex justify-center items-center h-[9vh]'>
                    <img src={DarkMode ? Logo_Dark : Logo } alt="rod logo" className=' laptop:h-8 desktop:h-8 desktop-lg:h-10 desktop-xl:h-12 h-8' />
                </div>
                
                {/* Navigation Items */}
                <div className='w-full  flex flex-col gap-0.5 px-4 laptop:mt-5 desktop:mt-6 desktop-lg:mt-8 desktop-xl:mt-10 mt-6'>
                {navitems.slice(0,8).map((item, i) => {
                    const IconComponent = item.icon;
                    return (
                        <Link
                            key={i}
                            to={item.link}
                            onClick={() => setSelected(i)}
                            className={`flex items-center justify-between font-medium  px-2 py-2 rounded-sm w-full ${
                                selected === i ? 'bg-rod-accent text-white' : DarkMode ? 'hover:bg-zinc-900' : 'hover:bg-rod-foreground'
                            }`}
                        >
                            <div className='flex items-center gap-3 font-medium w-full'>
                                <IconComponent className='size-5 desktop:size-5 desktop-lg:size-6 desktop-xl:size-7  shrink-0' />
                                {
                                    item.name === "Clients & Fournisseurs" ?
                                    <ToolTipCustom 
                                        trigger={<span className=' leading-none text-nowrap  overflow-hidden max-w-full'>Clients & Fournisseur</span>} 
                                        message="Clients & Fournisseurs"
                                    
                                    />
                                    :
                                    <span className=' leading-none '>{item.name}</span>
                                }
                            </div>
                            {
                                renderCounts(item)
                            }
                           
                        </Link>
                    );
                })}
                </div>
            </div>

            {/* Footer Section */}

            <div id="footer" className="flex flex-col w-full gap-4 px-4">
                {/* Dark Mode Toggle Button */}
                <div className='w-full  flex flex-col gap-0.5 '>

                     
                   
                    {/* Help Link */}

                    {navitems.slice(8,10).map((item, i) => {
                    const IconComponent = item.icon;
                    return (
                        <Link
                            key={i+8}
                            to={item.link}
                            onClick={() => setSelected(i+8)}
                            className={`flex items-center justify-between font-medium  px-2 py-2 rounded-sm w-full ${
                                selected === i+8 ? 'bg-rod-accent text-white' : DarkMode ? 'hover:bg-zinc-900' : 'hover:bg-rod-foreground'
                            }`}
                        >
                            <div className='flex items-center gap-3 font-medium w-full'>
                                <IconComponent className='size-5 desktop:size-5 desktop-lg:size-6 desktop-xl:size-7  shrink-0' />
                                {
                                    item.name === "Clients & Fournisseurs" ?
                                    <ToolTipCustom 
                                        trigger={<span className=' leading-none text-nowrap  overflow-hidden max-w-full'>Clients & Fournisseur</span>} 
                                        message="Clients & Fournisseurs"
                                    
                                    />
                                    :
                                    <span className=' leading-none '>{item.name}</span>
                                }
                            </div>
                            {
                                renderCounts(item)
                            }
                           
                        </Link>
                    );
                })}

                <button
                        onClick={toggleDarkMode}
                        className={`flex items-center gap-3 font-medium  pl-2 py-2 rounded-sm w-full cursor-pointer   ${DarkMode ? 'hover:bg-zinc-900 text-white' : 'hover:bg-rod-foreground'}`}
                    >
                        {DarkMode ? (
                            <Sun className='size-5 desktop:size-5 desktop-lg:size-6 desktop-xl:size-7' />
                        ) : (
                            <Moon className='size-5 desktop:size-5 desktop-lg:size-6 desktop-xl:size-7' />
                        )}
                        <span className=' leading-none truncate'>{DarkMode ? 'Mode Clair' : 'Mode Sombre'}</span>
                </button>

                

                </div>

                <Separator />

                <User DarkMode={DarkMode} />
                
            </div>

        </div>
    );
};

export default SideBar;