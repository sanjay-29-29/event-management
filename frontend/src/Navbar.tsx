import { Button } from "@/components/ui/button"
import { useNavigate } from 'react-router-dom';
import { useUser } from './UserContext/Context';
import axios from "axios";
import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function Navbar() {
    const { Auth, userInfo, setUserInfo, token } = useUser();
    const nav = useNavigate();

    useEffect(() => {
        async function getDetails() {
            if (Auth) {
                const data = await axios.post("/user/getinfo");
                setUserInfo(data.data);
            }
        }
        getDetails();
    }, [Auth]);

    return (
        <>
            <div className='flex flex-row p-1'>
                <button onClick={() => { nav('/') }} className="font-semibold text-base p-2 hover:bg-slate-50">Home</button>
                <button className="font-semibold text-base p-2 hover:bg-slate-50">Events</button>
                {Auth && userInfo ?
                    <div onClick={() => nav('/profile')} className="flex-grow justify-end flex">
                        <Avatar>
                            <AvatarImage src="" />
                            <AvatarFallback className='text-sm'>{userInfo.name.slice(0, 1)}</AvatarFallback>
                        </Avatar>
                        <Button className="pl-2" variant="link">{userInfo.name}</Button>
                    </div>
                    :
                    <div className="flex-grow justify-end flex">
                        <Button onClick={() => nav('/login')} variant="link">Login</Button>
                    </div>
                }
            </div>
            <hr />
        </>
    )
}