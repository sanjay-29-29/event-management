import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUser } from '../UserContext/Context';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Account() {
    const { userInfo, Auth } = useUser();
    return (
        <>
            <div className='flex w-[70vw] justify-center'>
                <Avatar>
                    <AvatarImage src="" />
                    <AvatarFallback>{userInfo.name.slice(0, 1)}</AvatarFallback>
                </Avatar>
                <div className='ml-4 flex flex-col'>
                    <div className='font-medium'>{userInfo.name}</div>
                    <div className='text-sm font-thin'>{userInfo.id}</div>
                    <div className="mt-[10%] mr-4">
                        <div className="grid w-full max-w-sm items-center gap-1.5">
                            <Label htmlFor="email">Email</Label>
                            <Input disabled type="email" placeholder={userInfo.email} />
                        </div>
                        <div className="mt-[10%] text-lg">Reset Password<hr />
                        </div>
                        <form className="mt-3">
                            <Label htmlFor="email" >Current Password</Label>
                            <Input type="password" id="email" placeholder="" />
                            <Label htmlFor="email">New Password</Label>
                            <Input type="password" id="new_password" placeholder="" />
                            <Label htmlFor="email">Re-enter New Password</Label>
                            <Input type="password" id="re_new_password" placeholder="" />
                            <Button className="mt-4">Submit</Button>
                        </form>
                    </div>
                </div>
            </div>
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