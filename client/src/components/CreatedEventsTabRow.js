import { useDisclosure, Tr, Td, Button } from "@chakra-ui/react"
import { useState } from "react";
import EditEventModal from "./EditEventModal";
import RegistrationsModal from "./RegistrationsModal";
import { useNavigate } from "react-router-dom";

function CreatedEventsTabRow({event, setEvents, user, setUser}){

    const { isOpen: isEditOpen , onOpen: onEditOpen, onClose: onEditClose } = useDisclosure()
    const { isOpen: isRegistrationsOpen , onOpen: onRegistrationsOpen, onClose: onRegistrationsClose } = useDisclosure()

    const [date, setDate] = useState(new Date(event.start_time))
    const [ticketsLeft, setTicketsLeft] = useState(100000000000)
    const [eventInfo, setEventInfo] = useState(event)
    const [registered, setRegistered] = useState(false)
    const nav = useNavigate()


    const ticketsSold = event.registrations.map(r => r.tickets).reduce((a,b) => a+b,0)

    function handleDelete(event){
        fetch(`/events/${event.id}`, {
            method: 'DELETE'
        }).then((resp) => {
            if (resp.ok) {
                setUser(curr => {return({...curr, 'events_created': curr['events_created'].filter(listEvent => listEvent.id !== event.id)})})
                setEvents(curr => {return([...curr.filter(listEvent => listEvent.id !== event.id)])})
            }
        })
    }

    function handleShowRegistrations(event){
        fetch(`/events/${event.id}`)
        .then(r =>{
            if(r.ok){
                r.json().then(eventObj => setEventInfo(eventObj))
            }
        }).then(onRegistrationsOpen)
    }
    
    return(
            <Tr>
                <Td>{eventInfo.name}</Td>
                <Td>{date.toString().split(' ').slice(0,5).join(' ').split(':').slice(0,2).join(':')}</Td>
                <Td><Button onClick={()=>handleShowRegistrations(event)}>Registrations</Button></Td>
                <Td><Button onClick={()=> nav(`/events/${event.id}`)}>View</Button></Td>
                <Td><Button onClick={onEditOpen}>Edit</Button></Td>
                <Td><Button onClick={()=>handleDelete(event)}>Cancel</Button></Td>
                <RegistrationsModal user={user} setTicketsLeft={setTicketsLeft} setRegistered={setRegistered}eventInfo={eventInfo} setEventInfo={setEventInfo} isRegistrationsOpen={isRegistrationsOpen} onRegistrationsClose={onRegistrationsClose}/>
                <EditEventModal ticketsSold={ticketsSold} isEditOpen={isEditOpen} onEditClose={onEditClose} eventInfo={eventInfo} setDate={setDate} setTicketsLeft={setTicketsLeft} setEventInfo={setEventInfo}/>
            </Tr>
    )
}

export default CreatedEventsTabRow