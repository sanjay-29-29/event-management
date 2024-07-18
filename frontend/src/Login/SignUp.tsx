import { Button } from "@/components/ui/button"
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
import { Input } from "@/components/ui/input"
import { error, SignUpSucess } from './StatusComponent';
import axios from "axios"
import { useRef } from "react"

export default function SignUp({ setMessage }) {

    const formSchema = z.object({
        name: z.string().min(2, { message: "Name must be at least 2 characters." }),
        email: z.string().min(1, { message: "Email is required." })
            .email({ message: "Invalid email format." }),
        password: z.string()
            .min(8, { message: "Password must be at least 8 characters." })
            .regex(/[\s\S]*[^A-Za-z0-9][\s\S]*/, { message: "Password must contain at least one symbol." }),
        confirmPassword: z.string().min(1, { message: "Confirming password is required." })
    }).refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match.",
        path: ["confirmPassword"],
    });

    const intervalRef = useRef();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema)
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            const res = await axios.post('/signup', {
                "name": values.name,
                "email": values.email,
                "password": values.password
            });
            if (res.status === 200) {
                setMessage(SignUpSucess);
                if (intervalRef.current) {
                    clearInterval(intervalRef.current);
                }
                intervalRef.current = setInterval(() => {
                    setMessage(null);
                    clearInterval(intervalRef.current);
                    intervalRef.current = null;
                }, 2000);
            }
        } catch (e) {
            const message = e.response && e.response.status === 409 ? "User Already Exists" : "Internal Server Error";
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
                <div className='font-bold text-3xl py-4'>SignUp</div>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="Name" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
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
                    <FormField
                        control={form.control}
                        name="confirmPassword"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Confirm Password</FormLabel>
                                <FormControl>
                                    <Input type="password" placeholder="Confirm Password" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <Button type="submit">Submit</Button>
                </form>
            </Form>
        </>
    )
}

{/*    



        const handleSubmit = async (e) => {
            e.preventDefault();
    
            const name = e.target.name.value;
            const email = e.target.email.value;
            const pwrd = e.target.password.value;
            const repass = e.target.repassword.value;
    
            if (pwrd !== repass) {
                setMessage(error("The entered passwords doesnt match"))
                setTimeout(()=>{
                    setMessage(null);
                },2000)
                return;
            }
            try {
                const res = await axios.post("http://localhost:5000/signup", {
                    name: name,
                    email: email,
                    password: pwrd,
                });
                if (res.status === 200) {
                    setMessage(signup_success);
                    setTimeout(() => {
                        setMessage(null);
                    }, 2000);
                }
            } catch (e) {
                if (e.response && e.response.status === 409) {
                    setMessage(error("User already exists"));
                    setTimeout(()=>{
                        setMessage(null);
                    },2000);
                } else {
                    setMessage(error("Internal Server Error"));
                    setTimeout(()=>{
                        setMessage(null);
                    },2000);
                }
            }
        }
*/}