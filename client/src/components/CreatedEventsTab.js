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
    Button
} from '@chakra-ui/react'

function CreatedEventsTab({user}){

    return(
        <Table  size='sm'>
            <Thead>
                <Tr>
                    <Th>Event Name</Th>
                    <Th>Date</Th>
                    <Th>Tickets Sold</Th>
                    <Th>View</Th>
                    <Th>Edit</Th>
                    <Th>Cancel</Th>
                </Tr>
            </Thead>
            <Tbody>
                <Tr>
                    <Td>Test</Td>
                    <Td>3/16/1992</Td>
                    <Td>4</Td>
                    <Td><Button>View</Button></Td>
                    <Td><Button>Edit</Button></Td>
                    <Td><Button>Cancel</Button></Td>
                </Tr>
            </Tbody>
        </Table>
    )
}

export default CreatedEventsTab