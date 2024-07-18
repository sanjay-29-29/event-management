import axios from "axios";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

import { useState, useEffect } from "react";

export default function Event() {
    const [events, setEvents] = useState([]);

    useEffect(() => {
        async function getRegisteredEvents() {
            try {
                const res = await axios.get('http://localhost:5000/event/registered');
                setEvents(res.data);
            } catch (e) {
                console.log(e);
            }
        }
        getRegisteredEvents();
    }, [])
    console.log(events);
    return (
        <>
            <div className='flex-col w-[70vw]'>
                    <Table className="mt-2">
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Time</TableHead>
                                <TableHead>Team Size</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {events.length>0 ? events.map((data, index) => (
                                <TableRow key={index}>
                                    <TableCell className="font-medium">{data.name}</TableCell>
                                    <TableCell>{new Date(data.date_time).toLocaleDateString()}</TableCell>
                                    <TableCell>{new Date(data.date_time).toLocaleTimeString()}</TableCell>
                                    <TableCell className="">{data.team_size}</TableCell>
                                </TableRow>
                            ))
                            :
                            <TableCell className="text-center" colSpan={4}>Not Registered for any Events</TableCell>
                        }
                        </TableBody>
                    </Table>
            </div>
        </>
    );
}