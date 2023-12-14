import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton,
    Button,
    Table,
    Thead,
    Tbody,
    Tfoot,
    Tr,
    Th,
    Td,
} from "@chakra-ui/react";

function RegistrationsModal({user, setTicketsLeft, setRegistered, eventInfo, setEventInfo, isRegistrationsOpen, onRegistrationsClose}){
    
    function handleCancel(registrationId,userId){
        fetch(`/registrations/${registrationId}`, {
            method: 'DELETE'
        }).then(resp => {
            if (resp.ok){
                setEventInfo(curr => {return({...curr, 'registrations': curr['registrations'].filter(r => r.id !== registrationId)})})
                if(user.id === userId){
                    setRegistered(false)
                }
                const ticketList = eventInfo.registrations.filter(r => r.id !== registrationId).map(r => r.tickets)
                const ticketsSold = ticketList.reduce((a,b) => a+b,0)
                if(eventInfo.max_tickets){
                    setTicketsLeft(eventInfo.max_tickets - ticketsSold)
                }
            }
        })
    }

    const registrationRows = eventInfo['registrations'].map(r =>{
        return(
            <Tr key={r.id}>
                <Td>{r.user.first_name} {r.user.last_name}</Td>
                <Td>{r.created_at}</Td>
                <Td>{r.tickets}</Td>
                <Td><Button onClick={() => handleCancel(r.id, r.user.id)}>Cancel</Button></Td>
            </Tr>
        )
    })

    return(
        <Modal size='xl' isOpen={isRegistrationsOpen} onClose={onRegistrationsClose} isCentered>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Registrations for {eventInfo.name}</ModalHeader>
                <ModalCloseButton />
                <ModalBody pb={6}>
                    <Table size='sm'>
                        <Thead>
                            <Tr>
                                <Th>Name</Th>
                                <Th>Registration Date</Th>
                                <Th>Tickets</Th>
                                <Th>Cancel</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {registrationRows}
                        </Tbody>
                    </Table>
                
                </ModalBody>

            </ModalContent>
        </Modal>
    )
}

export default RegistrationsModal