import { useEffect } from "react"
import { useNavigate } from "react-router-dom"

const CreateTeam = ({ Auth }) => {
  const nav = useNavigate();

  useEffect(() => {
    if (!Auth) {
      nav('/login');
    }
  }, []);

  return (
    <>
    </>
  )
}

const JoinTeam = () => {
  return (<>
  </>)
}

const Initial = ({data, setOption}) => {
  return (
    <>
      <div className="w-full ">
        <div className="flex p-4">
          <button><div className="text-2xl border-r w-[50%] p-4">
            Create a Team
            <p className="text-muted-foreground text-sm">This event can have a maxiumum of {data.team_size} members</p>
          </div></button>
          <button><div className="text-2xl p-4">
            Join a Team
            <p className="text-muted-foreground font-normal text-sm">If you have a team code then you can join a team</p>
          </div></button>
        </div>
      </div>
    </>
  )
}

export { CreateTeam, JoinTeam, Initial };