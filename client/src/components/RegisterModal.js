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
    NumberDecrementStepper
} from "@chakra-ui/react";
import { Field, Form, Formik} from 'formik'
import * as yup from 'yup'

function RegisterModal({isOpen, setEvents, ticketsLeft, setEventInfo, onClose, eventInfo, user, setRegistered, setTicketsLeft, setMyRegisteredIds}){
    return(
        <Modal isOpen={isOpen} onClose={onClose} isCentered>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Register for {eventInfo.name}</ModalHeader>
                <ModalCloseButton />
                <ModalBody pb={6}>
                <Formik
                        initialValues={{
                            event_id: eventInfo['id'],
                            user_id: user['id'],
                            tickets: 1,
                        }}
                        onSubmit={values => {
                            console.log(values)
                            fetch('/registrations', {
                                method: 'POST',
                                headers: {
                                    "Content-Type": 'application/json'
                                },
                                body: JSON.stringify(values)
                            }).then(resp => {
                                    if (resp.ok) {
                                        resp.json().then(( registration ) => {
                                            console.log(registration)
                                            setEventInfo(curr => {
                                                return {...curr, 'registrations':[...curr.registrations, registration]}
                                            }
                                            )
                                            setEvents(curr => {return([...curr.map(listEvent => {
                                                if(listEvent.id == eventInfo.id){
                                                    return (
                                                        {...listEvent, 'registrations': [...listEvent['registrations'], registration]}
                                                    )
                                                }else{
                                                    return listEvent
                                                }
                                            })])})
                                            setRegistered(true)
                                            setMyRegisteredIds(curr => [...curr, eventInfo.id])
                                            setTicketsLeft(curr => curr - registration.tickets)
                                            fetch('/notifications',{
                                                method: 'POST',
                                                headers: {
                                                    "Content-Type": 'application/json'
                                                },
                                                body: JSON.stringify({
                                                    'user_id': eventInfo.created_by.id, 
                                                    'content': `${user.first_name} registered for ${eventInfo.name}`
                                                })
                                            })
                    
                                            onClose()
                                    })
                                }
                            }
                            )
                        }}
                    >
                        {({ errors, isSubmitting }) => (
                            <Form>
                                <Field name='tickets'>
                                    {({ field, form }) => (
                                        <NumberInput onChange={(val) =>
                                            form.setFieldValue(field.name, val)
                                        } defaultValue={1} min={1} max={ticketsLeft} precision={0}>
                                            <NumberInputField readOnly {...field}/>
                                                <NumberInputStepper>
                                                    <NumberIncrementStepper />
                                                    <NumberDecrementStepper />
                                                </NumberInputStepper>
                                        </NumberInput>                
                                    )}
                                </Field>
                            <ModalFooter>
                                <Button type='submit' colorScheme='blue' mr={3}>
                                    Register
                                </Button>
                                <Button onClick={onClose}>Cancel</Button>
                            </ModalFooter>
                            </Form>)}
                </Formik>
                </ModalBody>

            </ModalContent>
        </Modal>
    )
}

export default RegisterModal