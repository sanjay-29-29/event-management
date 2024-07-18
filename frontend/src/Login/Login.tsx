import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import SignUp from "./SignUp";
import SignIn from "./SignIn";
import { useState } from "react";
import Navbar from "../Navbar";

export default function Login() {
    const [message, setMessage] = useState(null);

    return (
        <>
        <Navbar/>
            <div className='flex mt-[10vh] items-center'>
                <div className='mx-auto'>
                    <div className="border-2 rounded-lg p-4">
                        <Tabs defaultValue="signin" className="w-[350px]">
                            <TabsList>
                                <TabsTrigger value="signup">SignUp</TabsTrigger>
                                <TabsTrigger value="signin">SignIn</TabsTrigger>
                            </TabsList>
                            <TabsContent value="signup"><SignUp setMessage={setMessage} /></TabsContent>
                            <TabsContent value="signin"><SignIn setMessage={setMessage} /></TabsContent>
                        </Tabs>
                    </div>
                    {!message ?
                        <div className="h-[3vh] mt-3"></div>
                        :
                        <div className="flex flex-row justify-center h-[3vh] mt-3">
                            {message}
                        </div>
                    }
                </div>
            </div>
        </>
    )
}