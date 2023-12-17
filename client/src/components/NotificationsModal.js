import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    NumberIncrementStepper,
    NumberDecrementStepper,
    List,
    ListItem,
    ListIcon
} from "@chakra-ui/react";

import {CheckCircleIcon, SmallCloseIcon} from "@chakra-ui/icons"

function NotificationsModal({user, setUser, notes, isOpen, onClose}){

    const noteList = notes.map(note => {
        const NoteIcon = note.type === 'registration' && <ListIcon as={CheckCircleIcon} color='green.500'/> ||
                        note.type === 'cancellation' && <ListIcon as={SmallCloseIcon} color='red.500'/>

        return(
            <ListItem key={note.id}>
                {NoteIcon}
                {note.content}
            </ListItem>
        )
    })

    function handleClear(){
        fetch(`/notificationsbyuser/${user.id}`,{
            method: 'DELETE'
        }).then(resp => {
            if(resp.ok){
                setUser(curr => {return({...curr, 'notifications':[]})})
                onClose()
            }
        })
    }

    return(
        <Modal isOpen={isOpen} onClose={onClose} isCentered>
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