import axios from "axios";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  TrashIcon,
  CaretSortIcon,
  ChevronDownIcon,
  DotsHorizontalIcon,
  CrossCircledIcon
} from "@radix-ui/react-icons"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
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
import { useState, useEffect } from "react";
import { Button } from '@/components/ui/button';
import { useUser } from '../UserContext/Context'

const columns  = [
  {
    accessorKey: "event.name",
    header: "Event Name",
  },
  {
    accessorKey: "event.date_time",
    header: "Time",
    cell: (info) => formatDate(info.getValue()),
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const [team,setTeam] = useState([]);
      const data = row.original;

      const handleRemoveTeammate = (teamMemberId) => {
        const updatedTeam = team.filter(member => member.id !== teamMemberId);
        setTeam(updatedTeam);
      };
    
      useEffect(() => {
        if (data.event.team_size > 1) {
          setTeam(data.team_members);
        }
      }, [data.event.team_size, data.team_members]); 

      if (data.event.team_size > 1) {
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <DotsHorizontalIcon className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent >

              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(data.team_id)}
              >
                Copy TeamID
              </DropdownMenuItem>
              <Dialog>
                <DialogTrigger asChild>
                  {
                    data.team_lead.id === data.userId ?
                      <button className="relative flex cursor-default hover:bg-accent hover:text-accent-foreground select-none items-center rounded-sm w-full px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50">Manage Team</button>
                      :
                      <button className="relative flex cursor-default hover:bg-accent hover:text-accent-foreground select-none items-center rounded-sm w-full px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50">View Team</button>
                  }
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    {data.team_lead.id === data.userId ?
                      <DialogTitle>Manage Team</DialogTitle>
                      :
                      <DialogTitle>View Team</DialogTitle>
                    }
                    {data.team_lead.id === data.userId ?
                      <DialogDescription>
                        Make changes to your team here. Click save when you're done.
                      </DialogDescription>
                      :
                      <DialogDescription>
                        View your team here.
                      </DialogDescription>
                    }
                  </DialogHeader>
                  <div className="grid gap-3">
                    <div className="grid w-full max-w-sm items-center gap-1.5">
                      Team Name
                      <Input disabled type="email" placeholder={data.team_name} />
                    </div>
                    <div className="font-light">Team Lead</div>
                    <div className="flex p-2 rounded-lg">
                      <Avatar>
                        <AvatarImage />
                        <AvatarFallback>{data.team_lead.name.slice(0, 1)}</AvatarFallback>
                      </Avatar>
                      <div className="px-4 flex-row text-sm ">
                        {data.team_lead.name}
                        <div className="text-xs text-muted-foreground">
                          {data.team_lead.id}
                        </div>
                      </div>
                      <div className="flex flex-col text-xl justify-center items-center text-destructive p-2">
                        <svg width="15" height="15" xmlns="http://www.w3.org/2000/svg"></svg>
                      </div>
                    </div>
                    <div className="">Members</div>
                    {team && team.length > 0 ?
                      (team.map((d, key) => (
                        <div key={key} className="flex p-2 rounded-lg relative">
                          <Avatar>
                            <AvatarImage />
                            <AvatarFallback>{d.name.slice(0, 1)}</AvatarFallback>
                          </Avatar>
                          <div className="px-4 flex-row text-sm">
                            <div>{d.name}</div>
                            <div className="text-xs text-muted-foreground">
                              {d.id}
                            </div>
                          </div>
                          {data.team_lead.id === data.userId ?
                            <div className="absolute inset-y-0 right-0 flex items-center justify-end">    
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <TrashIcon className="text-destructive rounded-sm m-2 hover:text-white hover:bg-destructive w-5 h-5" />
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      This action cannot be undone.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={async()=>{
                                      try{
                                        const res = await axios.post('/team/remove_teamate',{
                                        teamId: data.team_id,
                                        teamMateId: d.id
                                        });
                                      handleRemoveTeammate(d.id);
                                      console.log(res);
                                      }catch(e){
                                      console.log(e);
                                      }
                                    }}>Continue</AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                            :
                            <div className="absolute top-0 right-0 p-1">
                              <svg width="15" height="15" xmlns="http://www.w3.org/2000/svg"></svg>
                            </div>
                          }
                        </div>
                      )))
                      :
                      <div className="flex w-full justify-center text-sm text-muted-foreground">No data</div>
                    }
                  </div>
               </DialogContent>
              </Dialog>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      } else {
        return (
          <div className="h-8 w-8 opacity-0">
          </div>
        )
      }
    },
  },
]

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}

function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })
  const { Auth } = useUser();
  return (
    <div className="border overflow-x-auto">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                  </TableHead>
                )
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {(table.getRowModel().rows?.length && Auth) ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
        </TableBody>
      </Table>
    </div>
  )
}

const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true };
  return new Intl.DateTimeFormat('en-US', options).format(new Date(dateString));
};

export default function Event() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    async function getDetails() {
      const res = await axios.get('/team/user');
      console.log(res.data);
      setEvents(res.data);
    }
    getDetails();
  }, []);

  console.log(events);
  return (
    <>
      <div className="w-[70vw]">
        <DataTable columns={columns} data={events} />
      </div>
    </>
  );
}
