import { Tr, Td, Button } from "@chakra-ui/react"
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function RegisteredEventsTabRow({event, setEvents, user, setUser, setMyCreated, setMyRegisteredIds}){

    const [eventInfo, setEventInfo] = useState(event)
    const nav = useNavigate()

    const date = new Date(event.start_time)

    function handleCancel(){
        fetch(`/registrations/${eventInfo.id}/${user.id}`, {
            method: 'DELETE'
        }).then((resp) => {
            if (resp.ok) {
                setEventInfo(curr => {return({...curr, 'registrations': curr['registrations'].filter(r => r.user_id !== user.id) })})
                setEvents(curr => {return([...curr.map(listEvent => {
                    if(listEvent.id === eventInfo.id){
                        return (
                            {...listEvent, 'registrations': listEvent['registrations'].filter(r => user.id !== r.user_id)}
                        )
                    }else{
                        return listEvent
                    }
                })])})
                setMyRegisteredIds(curr => [...curr].filter(id => id !== eventInfo.id))
                fetch('/notifications',{
                    method: 'POST',
                    headers: {
                        "Content-Type": 'application/json'
                    },
                    body: JSON.stringify({
                        'user_id': eventInfo.created_by.id, 
                        'content': `${user.first_name} cancelled for ${eventInfo.name}`,
                        'type': 'cancellation'
                    })
                })
            }
        })
    }

    const registration = eventInfo.registrations.filter(r => r.user_id === user.id)[0]
    
    return(
            <Tr>
                <Td>{eventInfo.name}</Td>
                <Td>{date.toString().split(' ').slice(0,5).join(' ').split(':').slice(0,2).join(':')}</Td>
                <Td>{registration.tickets}</Td>
                <Td><Button onClick={()=> nav(`/events/${event.id}`)}>View</Button></Td>
                <Td><Button onClick={handleCancel}>Cancel</Button></Td>
            </Tr>
    )
}

export default RegisteredEventsTabRow