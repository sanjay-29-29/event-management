import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUser } from '../UserContext/Context';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { faL } from "@fortawesome/free-solid-svg-icons";


export default function Account() {
    const { userInfo, Auth, setAuth, setToken } = useUser();
    const [error1, setError1] = useState(false);
    const [error2, setError2] = useState(false);
    const intervalRef = useRef();

    const formSchema = z.object({
        current_password: z.string()
            .min(8, { message: "Password must be at least 8 characters." })
            .regex(/[\s\S]*[^A-Za-z0-9][\s\S]*/, { message: "Password must contain at least one symbol." }),
        password: z.string()
            .min(8, { message: "New Password must be at least 8 characters." })
            .regex(/[\s\S]*[^A-Za-z0-9][\s\S]*/, { message: "Password must contain at least one symbol." }),
        confirmPassword: z.string().min(1, { message: "Confirming password is required." })
    }).refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match.",
        path: ["confirmPassword"],
    }).refine((data) => data.current_password !== data.password, {
        message: "New password must be different from the old password.",
        path: ["password"],
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema)
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            const res = await axios.post('/user/change_password', {
                currentPassword: values.current_password,
                newPassword: values.password
            });
            setAuth(false);
            setToken('');
            
        } catch (error) {
            if (error.response.status === 409) {
                setError1(true);
                if (intervalRef.current) {
                    clearInterval(intervalRef.current);
                }
                intervalRef.current = setInterval(() => {
                    setError1(false);
                    clearInterval(intervalRef.current);
                    intervalRef.current = null;
                }, 2000);
            } else {
                setError2(true);
                if (intervalRef.current) {
                    clearInterval(intervalRef.current);
                }
                intervalRef.current = setInterval(() => {
                    setError2(false);
                    clearInterval(intervalRef.current);
                    intervalRef.current = null;
                }, 2000);
            }
        }
    }
    return (
        <>{Auth ?
            (
                <div className='flex w-[70vw] justify-center'>
                    <Avatar>
                        <AvatarImage src="" />
                        <AvatarFallback>{userInfo.name.slice(0, 1)}</AvatarFallback>
                    </Avatar>

                    <div className='ml-4 flex flex-col'>
                        <div className='font-medium'>{userInfo.name}</div>
                        <div className='text-xs text-muted-foreground font-thin'>{userInfo.id}</div>
                        <div className="mt-[10%] mr-4">
                            <div className="grid w-full max-w-sm items-center gap-1.5">
                                <Label htmlFor="email">Email</Label>
                                <Input disabled type="email" placeholder={userInfo.email} />
                            </div>
                            <div className="mt-[10%] text-lg">Reset Password<hr />
                                <p className="font-thin text-xs text-muted-foreground my-2">Change your password here. After saving, you'll be logged out.</p>
                            </div>
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 mt-4">
                                    <FormField
                                        control={form.control}
                                        name="current_password"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Current Password</FormLabel>
                                                <FormControl>
                                                    <Input type="password" placeholder="Current Password" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="password"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>New Password</FormLabel>
                                                <FormControl>
                                                    <Input type="password" placeholder="New Password" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="confirmPassword"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Retype New Password</FormLabel>
                                                <FormControl>
                                                    <Input type="password" placeholder="Retype New Password" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    {error1 && <p className="text-sm font-medium text-destructive">The current password doesnt match</p>}
                                    {error2 && <p className="text-sm font-medium text-destructive">Internal Server Error</p>}
                                    <Button type="submit">Save Password</Button>
                                </form>
                            </Form>
                        </div>
                    </div>
                </div>
            )
            :
            (
                <div>
                    Not logged in
                </div>
            )
        }
        </>
    )
}


{/*
<div className='mt-5'>
    Registered Events
    <hr />
</div>
<div className=''>
    {events.length > 0 ?
        events.map(data => (
            <div>
                <div className='text-sm font-bold'>{data.name}</div>
                <div className='text-sm'>Date: {new Date(data.date_time).toLocaleDateString()}</div>
                <div className='text-sm'>Time: {new Date(data.date_time).toLocaleTimeString()}</div>
                <div className='text-sm'>Team Size: {data.team_size}</div>
                <br />
            </div>
        ))
        : <div> Not registered for any events.</div>
    }
</div>*/}