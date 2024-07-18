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
                <Button variant="ghost" onClick={() => { nav('/') }} className="font-md text-lg">Home</Button>
                <Button variant="ghost" className="font-md text-lg">Events</Button>
                <Button variant="ghost" className="font-md text-lg"></Button>
                {Auth && userInfo ?
                    <div onClick={() => nav('/profile')} className="flex-grow justify-end flex">
                        <Avatar>
                            <AvatarImage src="" />
                            <AvatarFallback>{userInfo.name.slice(0, 1)}</AvatarFallback>
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