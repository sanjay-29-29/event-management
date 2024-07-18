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

    const handleSignout = () => {
        setUserInfo(null);
        setAuth(null);
        setToken('');
        nav('/');
    }

    return (
        <>
            <Navbar />
            <div className='flex justify-start'>
                <div className='flex flex-col border-r h-[94vh] space-y-2'>
                    <Button variant="ghost" className='h-[4vh] ' onClick={() => handleTabChange('Account')}>Account</Button>
                    <Button variant="ghost" className='h-[4vh]' onClick={() => handleTabChange('Events')}>Events</Button>
                    <Button variant="ghost" className='h-[4vh]' onClick={() => handleTabChange('Team')}>Team</Button>
                    <Button variant="destructive" className='h-[4vh]' onClick={handleSignout}>Signout</Button>
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