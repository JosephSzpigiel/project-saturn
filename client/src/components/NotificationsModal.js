import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
    List,
    ListItem,
    ListIcon,
    Alert,
    AlertIcon
} from "@chakra-ui/react";

import {CheckCircleIcon, SmallCloseIcon} from "@chakra-ui/icons"

function NotificationsModal({user, setUser, notes, setNotes, isOpen, onClose}){

    const noteList = notes.map(note => {
        const NoteStatus = note.type === 'registration' && 'success' ||
                        note.type === 'cancellation' && 'error'

        return(
            <ListItem key={note.id}>
                <Alert status={NoteStatus}>
                    <AlertIcon/>
                    {note.content}
                </Alert>
            </ListItem>
        )
    })

    function handleClear(){
        fetch(`/notificationsbyuser/${user.id}`,{
            method: 'DELETE'
        }).then(resp => {
            if(resp.ok){
                setUser(curr => {return({...curr, 'notifications':[]})})
                setNotes([])
                onClose()
            }
        })
    }

    return(
        <Modal scrollBehavior='inside' isOpen={isOpen} onClose={onClose} isCentered>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Notifications</ModalHeader>
                <ModalCloseButton />
                <ModalBody pb={6}>
                    <List>
                        {noteList}
                    </List>
                </ModalBody>
                <ModalFooter>
                    <Button onClick={handleClear} colorScheme='blue' mr={3}>
                        Clear Notifications
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )

}

export default NotificationsModal