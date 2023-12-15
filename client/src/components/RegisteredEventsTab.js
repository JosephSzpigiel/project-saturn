import {
    Table,
    Thead,
    Tbody,
    Tfoot,
    Tr,
    Th,
    Td,
    TableCaption,
    TableContainer,
    Button,
    useDisclosure
} from '@chakra-ui/react'
import CreatedEventsTabRow from './CreatedEventsTabRow'
import RegisteredEventsTabRow from './RegisteredEventsTabRow'


function RegisteredEventsTab({user, setUser, events, setEvents, myRegisteredIds, setMyRegisteredIds}){



    const registeredRows = myRegisteredIds.map(id =>  {
        const event = events.filter(e => e.id === id)[0]
        if(event){
            return (<RegisteredEventsTabRow key={event.id} event={event} user={user} setUser={setUser} setEvents={setEvents} myRegisteredIds={myRegisteredIds} setMyRegisteredIds={setMyRegisteredIds}/>)
        }
    })

    return(
        <Table  size='sm'>
            <Thead>
                <Tr>
                    <Th>Event Name</Th>
                    <Th>Start Time</Th>
                    <Th>Tickets</Th>
                    <Th>View</Th>
                    <Th>Cancel</Th>
                </Tr>
            </Thead>
            <Tbody>
                {registeredRows}
            </Tbody>
        </Table>
    )
}

export default RegisteredEventsTab