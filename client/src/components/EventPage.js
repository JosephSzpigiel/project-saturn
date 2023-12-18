import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
    Wrap,
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    useDisclosure, Image, Heading, Divider, Center, Badge, Text, Card, CardBody, CardFooter, CardHeader, Stack, Button, ButtonGroup, Skeleton, Alert, AlertIcon} from "@chakra-ui/react";
import { useOutletContext, NavLink } from "react-router-dom";
import EditEventModal from "./EditEventModal";
import RegisterModal from "./RegisterModal";
import RegistrationsModal from "./RegistrationsModal"
import square from '../images/blue_square.jpeg'


function EventPage(){
    const {eventId} = useParams()
    const [eventInfo, setEventInfo] = useState({created_by:{first_name: '', last_name: ''}, event_type:{type_name: ''}, registrations:[]})
    const {user, setUser, setEvents, myRegisteredIds, setMyRegisteredIds} = useOutletContext()
    const [loaded, setLoaded] = useState(false)
    const [registered, setRegistered] = useState(false)
    const [ticketsLeft, setTicketsLeft] = useState(100000000000)
    const [ticketsSold, setTicketsSold] = useState(0)
    const { isOpen, onOpen, onClose } = useDisclosure()
    const { isOpen: isEditOpen , onOpen: onEditOpen, onClose: onEditClose } = useDisclosure()
    const { isOpen: isRegistrationsOpen , onOpen: onRegistrationsOpen, onClose: onRegistrationsClose } = useDisclosure()
    const today = new Date()


    useEffect(() => {
        fetch(`/events/${eventId}`)
        .then((resp) => {
            if (resp.ok) {
                resp.json()
                .then((event) => {
                    setEventInfo(event)
                    console.log(myRegisteredIds)
                    if( myRegisteredIds.filter(id => id === event.id).length !== 0){
                        setRegistered(true)
                    }
                    const ticketList = event.registrations.map(r => r.tickets)
                    const ticketsSoldInit = ticketList.reduce((a,b) => a+b,0)
                    if(event.max_tickets){
                        setTicketsLeft(event.max_tickets - ticketsSoldInit)
                    }
                    setLoaded(true)
                })
                }
            else {
                // handle what should happen if not logged in
                console.log('Error')
            }})},[])


    function handleCancel(){
        fetch(`/registrations/${eventInfo.id}/${user.id}`, {
            method: 'DELETE'
        }).then((resp) => {
            if (resp.ok) {
                setEventInfo(curr => {return({...curr, 'registrations': curr['registrations'].filter(r => r.user_id !== user.id) })})
                setRegistered(false)
                setMyRegisteredIds(curr=> [...curr].filter(id => id !== eventInfo.id))
                const ticketList = eventInfo.registrations.filter(r => r.user_id !== user.id).map(r => r.tickets)
                const ticketsSold = ticketList.reduce((a,b) => a+b,0)
                if(eventInfo.max_tickets){
                    setTicketsLeft(eventInfo.max_tickets - ticketsSold)
                }
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

    function handleEdit(){
        const ticketList = eventInfo.registrations.map(r => r.tickets)
        setTicketsSold(ticketList.reduce((a,b) => a+b,0))
        console.log(ticketsSold)
        onEditOpen()
    }

    function handleRegistrations(){
        console.log(eventInfo)
        onRegistrationsOpen()
    }
    
    const registerButton = (ticketsLeft ? 
        <Button onClick={onOpen} variant='solid' colorScheme='blue'>
            Register
        </Button>: 
        <Button variant='solid' colorScheme='blue' isDisabled={true}>
            Sold Out
        </Button>)

    const registerButtonOptions = (
        !registered ? 
        registerButton:
        <>
        <Button onClick={handleCancel} variant='solid' colorScheme='blue'>
            Cancel Registration
        </Button> 
        </>
    )

    let dateString = ``
    let timeString = ``
    let dateObj = null

    if(loaded){
        dateObj = new Date(eventInfo.start_time)
        const date = dateObj.toString().split(' ')
        const weekday = date[0]
        const month = date[1]
        const day = date[2]
        const year = date[3]
        const time = date[4].split(':')
        const hour = time[0]
        const amPmHour = hour > 12 ? hour - 12 : hour
        const amPmHourNonZero = amPmHour === '00' ? 12 : amPmHour
        const amPm = hour > 12 ? 'PM' : 'AM'
        const minutes = time[1]
        dateString = `Date: ${weekday} ${month} ${day}, ${year}`
        timeString = `Time: ${amPmHourNonZero}:${minutes} ${amPm}`
    }

    const fallbackOption = eventInfo['img_url'] ? <Skeleton height={'250px'} width={'250px'}/> : null

    return (
        <>
        <Breadcrumb m='10px' fontWeight='medium' fontSize='lg'>
            <BreadcrumbItem>
                <BreadcrumbLink as={NavLink} to='/'>
                Home
                </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem>
                <BreadcrumbLink as={NavLink} to='/events'>
                    Events
                </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem isCurrentPage>
                <BreadcrumbLink>
                    {eventInfo.name}
                </BreadcrumbLink>
            </BreadcrumbItem>
        </Breadcrumb>

        <Center>
        <Card width = '90%' maxWidth={'600px'}>
            <Heading m={3} size='lg' align='center'>{eventInfo.name}</Heading>
            <Divider/>
            <Heading m={3} size='sm' align='center'>{dateString}</Heading>
            <Heading m={3} size='sm' align='center'>{timeString}</Heading>

            <CardBody>
                <Center>
                    <Center width='80%'>
                            <Image
                                src={eventInfo.img_url}
                                alt={eventInfo.name}
                                maxHeight={'30vh'}
                                borderRadius='lg'
                                fallback={fallbackOption}
                            />
                    </Center>
                </Center>

                <Stack mt='6' spacing='3' wrap={true}>
                    <Wrap justify='center'>
                        <Badge borderRadius='full' px='5' colorScheme='teal'>
                            {eventInfo.event_type.type_name}
                        </Badge>
                        <Badge borderRadius='full' px='5' colorScheme='green'>
                            Host: {eventInfo.created_by.first_name} {eventInfo.created_by.last_name}
                        </Badge>
                        {eventInfo.max_tickets ? <Badge borderRadius='full' px='5' colorScheme='blue'>
                            Tickets Left: {ticketsLeft} of {eventInfo.max_tickets}
                        </Badge>:null}
                    </Wrap>
                    <Text>
                        {eventInfo.description}
                    </Text>
                </Stack>
            </CardBody>
            <Divider />
            <CardFooter justify='center'>
                <Wrap spacing='2' justify='center'>
                    {registered ? 
                        <Alert status='success'marginBottom={'5px'}>
                            <AlertIcon/>
                            You are registered for {eventInfo.name}!
                        </Alert>: null
                    }
                    {dateObj > today ? registerButtonOptions : <Button isDisabled={true}>Event Passed</Button>}

                {user.id === eventInfo.created_by_id ?
                    <ButtonGroup spacing='2'>
                        <Button variant='outline' colorScheme='blue' onClick={handleRegistrations}>
                            View Registered
                        </Button>
                        <Button variant='outline' colorScheme='blue' onClick={handleEdit}>
                            Edit Event Info
                        </Button>
                    </ButtonGroup>: null}
                </Wrap>                  
            </CardFooter>
        </Card>
        </Center>

        <EditEventModal setEvents={setEvents} ticketsSold={ticketsSold} isEditOpen={isEditOpen} onEditClose={onEditClose} eventInfo={eventInfo} setTicketsLeft={setTicketsLeft} setEventInfo={setEventInfo}/>
        <RegisterModal setEvents={setEvents} setMyRegisteredIds={setMyRegisteredIds} ticketsLeft={ticketsLeft} setEventInfo={setEventInfo} isOpen={isOpen} onClose={onClose} eventInfo={eventInfo} user={user} setRegistered={setRegistered} setTicketsLeft={setTicketsLeft}/>
        <RegistrationsModal user={user} setMyRegisteredIds={setMyRegisteredIds} setTicketsLeft={setTicketsLeft} setRegistered={setRegistered}eventInfo={eventInfo} setEventInfo={setEventInfo} isRegistrationsOpen={isRegistrationsOpen} onRegistrationsClose={onRegistrationsClose}/>
        </>
        )        
    }

export default EventPage