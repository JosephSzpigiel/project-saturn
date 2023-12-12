import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {   Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    NumberIncrementStepper,
    NumberDecrementStepper,
    ModalCloseButton, useDisclosure, Image, Flex, Spacer, Box, Heading, Divider, Center, Badge, Text, Card, CardBody, CardFooter, CardHeader, Stack, Button, ButtonGroup, Skeleton, HStack, Input } from "@chakra-ui/react";
import { useOutletContext } from "react-router-dom";
import { Field, Form, Formik} from 'formik'
import * as yup from 'yup'

function EventPage(){
    const {eventId} = useParams()
    const [eventInfo, setEventInfo] = useState({created_by:{first_name: '', last_name: ''}, event_type:{type_name: ''}})
    const [date, setDate] = useState('')
    const location = useLocation()
    const {user} = useOutletContext()
    const [registered, setRegistered] = useState(false)
    const [ticketsLeft, setTicketsLeft] = useState(0)
    const { isOpen, onOpen, onClose } = useDisclosure()
    const nav = useNavigate()


    useEffect(() => {
        fetch(`/events/${eventId}`)
        .then((resp) => {
            if (resp.ok) {
                resp.json()
                .then((event) => {
                    setEventInfo(event)
                    setDate(new Date(event.start_time))
                    const registeredIds = event.registrations.map(r => r.user_id)
                    console.log(registeredIds)
                    if( registeredIds.filter(id => id === user.id).length !== 0){
                        setRegistered(true)
                    }
                    console.log(event.registrations)
                    const ticketList = event.registrations.map(r => r.tickets)
                    const ticketsSold = ticketList.reduce((a,b) => a+b,0)
                    setTicketsLeft(event.max_tickets - ticketsSold)
                })
                }
            else {
                // handle what should happen if not logged in
                console.log('Error')
            }})},[])


        function handleCancel(){
            fetch(`/registrations/${user.id}`, {
                method: 'DELETE'
            }).then((resp) => {
                if (resp.ok) {
                    nav(0)
                }
            })
        }
    
    const registerButton = (ticketsLeft ? 
        <Button onClick={onOpen} variant='solid' colorScheme='blue'>
            Register
        </Button>: 
        <Button variant='solid' colorScheme='blue' isDisabled={true}>
            Sold Out
        </Button>)


    return (
        <>
        <Center>
        <Card width = '70%'>
            <Skeleton fitContent={false} isLoaded>
            <Heading m={3} size='lg' align='center'>{eventInfo.name}</Heading>
            <Divider/>
            <Heading m={3} size='sm' align='center'>{date.toString()}</Heading>
            <CardBody>
                <Center>
                    <Center width='80%'>
                        <Image
                        src={eventInfo.img_url}
                        alt={eventInfo.name}
                        borderRadius='lg'
                        />
                    </Center>
                </Center>

                <Stack mt='6' spacing='3'>
                    <HStack>
                        <Badge borderRadius='full' px='5' colorScheme='teal'>
                            {eventInfo.event_type.type_name}
                        </Badge>
                        <Badge borderRadius='full' px='5' colorScheme='green'>
                            Host: {eventInfo.created_by.first_name} {eventInfo.created_by.last_name}
                        </Badge>
                        <Badge borderRadius='full' px='5' colorScheme='blue'>
                            Tickets Left: {ticketsLeft} of {eventInfo.max_tickets}
                        </Badge>
                    </HStack>
                    <Text>
                        {eventInfo.description}
                    </Text>
                    <Text color='blue.600' fontSize='2xl'>
                        $450
                    </Text>
                </Stack>
            </CardBody>
            <Divider />
            <CardFooter>
                <ButtonGroup spacing='2'>
                    {
                        !registered ? 
                        registerButton:
                        <Button onClick={handleCancel} variant='solid' colorScheme='blue'>
                            Cancel Registration
                        </Button> 
                    }

                {user.id === eventInfo.created_by_id ?
                    <ButtonGroup spacing='2'>
                        <Button variant='ghost' colorScheme='blue'>
                            View Attending
                        </Button>
                        <Button>
                            Edit Event Info
                        </Button>
                    </ButtonGroup>: null}
                </ButtonGroup>                  
            </CardFooter>
        </Skeleton>
        </Card>
        </Center>

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
                                            setRegistered(true)
                                            setTicketsLeft(curr => curr - registration.tickets)
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
                                            <NumberInputField {...field}/>
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
        </>
        )        
    }

export default EventPage