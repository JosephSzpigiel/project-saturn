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


function CreatedEventsTab({user, setUser, setEvents}){

    console.log(user.events_created)

    const createdRows = user.events_created.map(event =>  {
        return (<CreatedEventsTabRow key={event.id} event={event} user={user} setUser={setUser} setEvents={setEvents}/>)
    })

    console.log(createdRows)

    return(
        <Table  size='sm'>
            <Thead>
                <Tr>
                    <Th>Event Name</Th>
                    <Th>Start Time</Th>
                    <Th>Registrations</Th>
                    <Th>View</Th>
                    <Th>Edit</Th>
                    <Th>Cancel</Th>
                </Tr>
            </Thead>
            <Tbody>
                {createdRows}
            </Tbody>
        </Table>
    )
}

export default CreatedEventsTab