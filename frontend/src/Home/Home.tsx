import EventTile from './EventTile';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useUser } from '../UserContext/Context';
import Navbar from '../Navbar';
export default function Home() {
    const { Auth, token } = useUser();
    const [event, setEvent] = useState([]);
    const [registeredEvents, setRegisteredEvents] = useState([]);
    
    useEffect(()=>{
        async function fetchEvent() {
            const data = await axios.get("/event");
            setEvent(data.data);
        }
        fetchEvent();
    },[])

    useEffect(() => {
        async function getRegisteredEvents() {
            if (Auth) {
                try {
                    const res = await axios.get('/team/user');
                    setRegisteredEvents(res.data);
                } catch (e) {
                    console.log(e);
                }
            }
        }
        getRegisteredEvents();
    }, [Auth]);

    console.log(registeredEvents);
    
    return (
        <>
            <Navbar/>
            <div className='grid md:grid-cols-2 lg:grid-cols-3 grid-auto-cols 2xl:grid-cols-5 xl:grid-cols-3 gap-3 lg:m-2 justify-center'>
                {event.map((data,index) => (<EventTile key={index} data={data} registeredEvents={registeredEvents}/>))}
            </div>
        </>
    )
}
