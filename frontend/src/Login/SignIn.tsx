import { useRef, useEffect } from 'react';
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { error } from './StatusComponent'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useUser } from '../UserContext/Context';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"

export default function SignIn({ setMessage }) {
    const { setToken, setAuth } = useUser();
    const intervalRef = useRef();
    const nav = useNavigate();

    useEffect(() => {
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, []);

    const formSchema = z.object({
        email: z.string().min(1, { message: "Email is required." })
            .email({ message: "Invalid email format." }),
        password: z.string()
            .min(8, { message: "Password must be at least 8 characters." })
            .regex(/[\s\S]*[^A-Za-z0-9][\s\S]*/, { message: "Password must contain at least one symbol." }),
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema)
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            const res = await axios.post('/login', {
                "email": values.email,
                "password": values.password
            });
            if (res.status === 200) {
                console.log(res);
                setAuth(true);
                setToken(res.data.token);
                nav('/');
            }
        } catch (e) {
            const message = e.response && e.response.status === 401 ? "Invalid Credentials" : "Internal Server Error";
            setMessage(error(message));
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
            intervalRef.current = setInterval(() => {
                setMessage(null);
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }, 2000);
        }
    }

    return (
        <>
            <Form {...form}>
                <div className='font-bold text-3xl py-4'>SignIn</div>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input placeholder="Email" {...field} />
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
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                    <Input type="password" placeholder="Password" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit">Submit</Button>
                </form>
            </Form >
        </>
    );
}

{/*    useEffect(() => {

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const email = e.target.email.value;
        const password = e.target.password.value;
        if(email === '' || password ===''){
            setMessage(error('Please enter email and password'));
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
            intervalRef.current = setInterval(() => {
                setMessage(null);
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }, 2000);
            return;
        }
        try {
            const response = await axios.post("http://localhost:5000/login", {
                email: email,
                password: password
            });
            if (response.status === 200) {
                console.log(response);
                setToken(response.data.token);
                setAuth(true);
                nav('/');
            }
        } catch (e) {
            const message = e.response && e.response.status === 401 ? "Invalid Credentials" : "Internal Server Error";
            setMessage(error(message));
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
            intervalRef.current = setInterval(() => {
                setMessage(null);
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }, 2000);
        }
    };*/}