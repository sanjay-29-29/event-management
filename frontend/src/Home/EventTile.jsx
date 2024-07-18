import { Button } from "@/components/ui/button"
import {
    Card,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useUser } from '../UserContext/Context';
import { Link } from "react-router-dom";
import axios from 'axios';
import { useEffect, useState } from "react";

export default function EventTile({ data, registeredEvents }) {
    const { Auth } = useUser();
    const [isRegistered, setIsRegistered] = useState(false);

    useEffect(() => {
        if (Auth) {
            const eventIsRegistered = registeredEvents.some(event => event.id === data.id);
            setIsRegistered(eventIsRegistered);
        }
    }, [Auth, registeredEvents]);

    async function registerEvent() {
        try {
            const res = await axios.post('http://localhost:5000/event/link', {
                "eventId": data.id
            })
            setIsRegistered(true);
            console.log(res.data);
        } catch (e) {
            console.log(e);
        }
    }

    return (
        <>
            <Card className="m-2 w-[350px] ">
                <CardHeader>
                    <CardTitle>{data.name}</CardTitle>
                    <CardDescription>{data.details}</CardDescription>
                    <div className="flex flex-row"><div className="font-bold text-md mr-2">Time : </div>{new Date(data.date_time).toLocaleTimeString()}</div>
                    <div className="flex flex-row"><div className="font-bold text-md mr-2">Date :</div>{new Date(data.date_time).toLocaleDateString()}</div>
                    <div className="flex flex-row"><div className="font-bold text-md mr-2">Team Size :</div>{data.team_size}</div>
                    <div className="flex flex-row"><div className="font-bold text-md mr-2">Organizer :</div> {data.organizer}</div>
                </CardHeader>
                <CardFooter className="flex justify-between">
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            {isRegistered ?
                                <Button disabled>Registered</Button>
                                :
                                <Button>Register</Button>
                            }
                        </AlertDialogTrigger>
                        {Auth ?
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This action cannot be undone.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={registerEvent}>Continue</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                            :
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Please login to register</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Please login or create an acccount to register to this event.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction><Link to='/login'>Continue</Link></AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        }
                    </AlertDialog>
                </CardFooter>
            </Card>
        </>
    )
}