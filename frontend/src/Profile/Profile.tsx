import { useUser } from '../UserContext/Context';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Account from './Account';
import Navbar from '../Navbar';
import Event from './Events';
import Team from './Team';

export default function Profile() {
    const { setUserInfo, userInfo, Auth, setAuth, setToken } = useUser();
    const [selectedTab, setSelectedTab] = useState('Account');
    const [events, setEvents] = useState([]);

    const nav = useNavigate();
    console.log(userInfo)

    useEffect(() => {
        if (!Auth) {
            nav('/');
        }
    }, [Auth]);

    const handleTabChange = (tabName) => {
        setSelectedTab(tabName);
    };

    const handleSignout = async () => {
        setUserInfo(null);
        setAuth(null);
        setToken('');
        nav('/');
    }

    return (
        <>
            <Navbar />
            <div className='flex justify-start h-full'>
                <div className='flex flex-col border-r h-[94vh]'>
                    <button className={`px-4 py-2 ${selectedTab === 'Account' ? 'bg-accent ' : ''}`} onClick={() => handleTabChange('Account')}>Account</button>
                    <button className={`px-4 py-2 ${selectedTab === 'Events' ? 'bg-accent' : ''}`} onClick={() => handleTabChange('Events')}>Events</button>
                    <div className='flex justify-center'>
                        <button className='text-destructive m-2 px-2 py-2 hover:bg-accent' onClick={handleSignout}>
                            <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 1C2.44771 1 2 1.44772 2 2V13C2 13.5523 2.44772 14 3 14H10.5C10.7761 14 11 13.7761 11 13.5C11 13.2239 10.7761 13 10.5 13H3V2L10.5 2C10.7761 2 11 1.77614 11 1.5C11 1.22386 10.7761 1 10.5 1H3ZM12.6036 4.89645C12.4083 4.70118 12.0917 4.70118 11.8964 4.89645C11.7012 5.09171 11.7012 5.40829 11.8964 5.60355L13.2929 7H6.5C6.22386 7 6 7.22386 6 7.5C6 7.77614 6.22386 8 6.5 8H13.2929L11.8964 9.39645C11.7012 9.59171 11.7012 9.90829 11.8964 10.1036C12.0917 10.2988 12.4083 10.2988 12.6036 10.1036L14.8536 7.85355C15.0488 7.65829 15.0488 7.34171 14.8536 7.14645L12.6036 4.89645Z" fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"></path></svg>
                        </button>
                    </div>
                </div>
                <div className='flex flex-1 justify-center mt-4 '>
                    {selectedTab === 'Account' && <Account />}
                    {selectedTab === 'Events' && <Event />}
                    {selectedTab === 'Team' && <Team />}
                </div>
            </div>
        </>
    );
}

{/*<div className='flex justify-center m-[10vh]'></div>
                    <div className='flex flex-col justify-center items-center h-full'>
                    {selectedTab === 'Account' && <Account />}
                    {selectedTab === 'Events' && <Event />}
                    {selectedTab === 'Team' && <Team />}
                </div>*/ }