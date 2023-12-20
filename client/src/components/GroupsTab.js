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


function GroupsTab({groups, myGroups}){

    const myGroupsInfo = groups.filter(group => myGroups.map(myGroup => myGroup.group_id).includes(group.id))

    const groupsRows = myGroupsInfo.map(group =>  {
            return (
                <Tr key={group.id}>
                    <Td>{group.name}</Td>
                    <Td>{group.id}</Td>
                    <Td>{group.description}</Td>
                </Tr>
            )
        }
    )

    return(
        <Table  size='sm'>
            <Thead>
                <Tr>
                    <Th>Group Name</Th>
                    <Th>Group Id</Th>
                    <Th>Description</Th>
                </Tr>
            </Thead>
            <Tbody>
                {groupsRows}
            </Tbody>
        </Table>
    )
}

export default GroupsTab