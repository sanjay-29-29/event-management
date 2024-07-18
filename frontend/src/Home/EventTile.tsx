import { Button } from "@/components/ui/button"
import {
    Card,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { CopyIcon } from "@radix-ui/react-icons"
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogClose,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { useUser } from '../UserContext/Context';
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import axios from 'axios';
import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormDescription,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from "@/components/ui/input-otp"
import { useNavigate } from "react-router-dom"

export default function EventTile({ data, registeredEvents }) {
    const { Auth } = useUser();
    const [isRegistered, setIsRegistered] = useState(false);
    const nav = useNavigate();
    const [option, setOption] = useState('initial');
    const [response, setResponse] = useState([]);

    useEffect(()=>{
        if(Auth){
            setIsRegistered(registeredEvents.some(e => e.event.id === data.id));
        }
    },[Auth, registeredEvents])

    // Define schemas for form validation using Zod
    const teamNameSchema = z.object({
        team_name: z.string().min(5, "Team name must be at least 5 characters."),
    });

    const teamIdSchema = z.object({
        team_id: z.string().min(6, "TeamID must be 6 characters."),
    });

    // Use forms with React Hook Form and Zod for validation
    const createTeamForm = useForm({
        resolver: zodResolver(teamNameSchema),
    });

    const joinTeamForm = useForm({
        resolver: zodResolver(teamIdSchema),
        defaultValues: {
            team_id: "",
        },
    });

    // Function to handle creating a team
    async function onSubmitCreate(values: z.infer<typeof teamNameSchema>) {
        try {
            const response = await axios.post('/team', {
                eventId: data.id,
                team_name: values.team_name,
            });
            setResponse(response.data);
            setOption('create_final');
        } catch (error) {
            console.error(error);
        }
    }

    // Function to handle joining a team
    async function onSubmitJoin(values: z.infer<typeof teamIdSchema>) {
        try {
            console.log(values);
        } catch (error) {
            console.error(error);
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
                <CardFooter>
                    <Dialog>
                        <DialogTrigger asChild>
                            {!isRegistered ? 
                            <Button onClick={() => { 
                                setOption('initial')
                                if(!Auth){
                                    nav('/login')
                                }
                            }} >Register
                            </Button>
                            :
                            <Button disabled>Registered</Button>
                            }
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogTitle />
                            {option === 'initial' && (
                                <div className="w-full">
                                    <div className="flex">
                                        <button onClick={() => { setOption('create') }}><div className="text-2xl border-r p-4">
                                            Create a Team
                                            <p className="text-muted-foreground text-sm">This event can have a maxiumum of {data.team_size} members</p>
                                        </div></button>
                                        <button onClick={() => { setOption('join') }}><div className="text-2xl p-4">
                                            Join a Team
                                            <p className="text-muted-foreground font-normal text-sm">If you have a team code then you can join a team</p>
                                        </div></button>
                                    </div>
                                </div>
                            )}
                            {option === 'create' && (
                                <>
                                    <DialogHeader>
                                        <DialogTitle>Create a Team</DialogTitle>
                                        <DialogDescription>
                                            Enter your team name. Click save when you're done. A team ID will be generated for you.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className="grid">
                                        <div className="grid grid-cols-4 items-center">
                                            <Form {...createTeamForm}>
                                                <form onSubmit={createTeamForm.handleSubmit(onSubmitCreate)} className="space-y-8 col-span-3">
                                                    <FormField
                                                        control={createTeamForm.control}
                                                        name="team_name"
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel>Team Name</FormLabel>
                                                                <FormControl>
                                                                    <Input placeholder="Team Name" {...field} />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                    <Button type="submit">Submit</Button>
                                                </form>
                                            </Form >
                                        </div>
                                    </div>
                                </>
                            )}
                            {option === 'create_final' && (
                                <>
                                    <DialogHeader>
                                        <DialogTitle>TeamID</DialogTitle>
                                        <DialogDescription>formSchema
                                            Anyone who has this code will be able to join your team.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className="flex items-center space-x-2">
                                        <div className="grid flex-1 gap-2">
                                            <Label htmlFor="link" className="sr-only">
                                                Link
                                            </Label>
                                            <Input
                                                defaultValue={response.team_id.toUpperCase()}
                                                readOnly
                                            />
                                        </div>
                                        <Button type="submit" size="sm" className="px-3">
                                            <span className="sr-only">Copy</span>
                                            <CopyIcon className="h-4 w-4" />
                                        </Button>
                                    </div>
                                    <DialogFooter className="sm:justify-start">
                                        <DialogClose asChild>
                                            <Button type="button" variant="secondary">
                                                Close
                                            </Button>
                                        </DialogClose>
                                    </DialogFooter>
                                </>
                            )}
                            {option === 'join' && (
                                <>
                                    <Form {...joinTeamForm}>
                                        <form onSubmit={joinTeamForm.handleSubmit(onSubmitJoin)} className="w-2/3 space-y-6">
                                            <FormField
                                                control={joinTeamForm.control}
                                                name="team_id"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel><div className="text-2xl">TeamID</div></FormLabel>
                                                        <FormControl>
                                                            <InputOTP maxLength={6} {...field}
                                                                pattern={REGEXP_ONLY_DIGITS_AND_CHARS}>
                                                                <InputOTPGroup>
                                                                    <InputOTPSlot index={0} />
                                                                    <InputOTPSlot index={1} />
                                                                    <InputOTPSlot index={2} />
                                                                    <InputOTPSlot index={3} />
                                                                    <InputOTPSlot index={4} />
                                                                    <InputOTPSlot index={5} />
                                                                </InputOTPGroup>
                                                            </InputOTP>
                                                        </FormControl>
                                                        <FormDescription>
                                                            Please enter the TeamID.
                                                        </FormDescription>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <Button type="submit">Submit</Button>
                                        </form>
                                    </Form>
                                </>
                            )}
                        </DialogContent>
                    </Dialog>
                </CardFooter>
            </Card >

        </>
    )
}



