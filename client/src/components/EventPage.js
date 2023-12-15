import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
    Wrap,
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    useDisclosure, Image, Heading, Divider, Center, Badge, Text, Card, CardBody, CardFooter, CardHeader, Stack, Button, ButtonGroup, Skeleton} from "@chakra-ui/react";
import { useOutletContext, NavLink } from "react-router-dom";
import EditEventModal from "./EditEventModal";
import RegisterModal from "./RegisterModal";
import RegistrationsModal from "./RegistrationsModal"

function EventPage(){
    const {eventId} = useParams()
    const [eventInfo, setEventInfo] = useState({created_by:{first_name: '', last_name: ''}, event_type:{type_name: ''}, registrations:[]})
    const [date, setDate] = useState('')
    const {user, setUser, setEvents, myRegisteredIds, setMyRegisteredIds} = useOutletContext()
    const [registered, setRegistered] = useState(false)
    const [ticketsLeft, setTicketsLeft] = useState(100000000000)
    const [ticketsSold, setTicketsSold] = useState(0)
    const { isOpen, onOpen, onClose } = useDisclosure()
    const { isOpen: isEditOpen , onOpen: onEditOpen, onClose: onEditClose } = useDisclosure()
    const { isOpen: isRegistrationsOpen , onOpen: onRegistrationsOpen, onClose: onRegistrationsClose } = useDisclosure()


    useEffect(() => {
        fetch(`/events/${eventId}`)
        .then((resp) => {
            if (resp.ok) {
                resp.json()
                .then((event) => {
                    setEventInfo(event)
                    setDate(new Date(event.start_time))
                    console.log(myRegisteredIds)
                    if( myRegisteredIds.filter(id => id === event.id).length !== 0){
                        setRegistered(true)
                    }
                    const ticketList = event.registrations.map(r => r.tickets)
                    const ticketsSoldInit = ticketList.reduce((a,b) => a+b,0)
                    if(event.max_tickets){
                        setTicketsLeft(event.max_tickets - ticketsSoldInit)
                    }
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
        <Card width = '70%'>
            <Skeleton fitContent={false} isLoaded>
            <Heading m={3} size='lg' align='center'>{eventInfo.name}</Heading>
            <Divider/>
            <Heading m={3} size='sm' align='center'>{date.toString().split(' ').slice(0,5).join(' ').split(':').slice(0,2).join(':')}</Heading>
            <CardBody>
                <Center>
                    <Center width='80%'>
                        <Image
                        src={eventInfo.img_url}
                        alt={eventInfo.name}
                        borderRadius='lg'
                        fallbackSrc='https://via.placeholder.com/300'
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
                    {
                        !registered ? 
                        registerButton:
                        <Button onClick={handleCancel} variant='solid' colorScheme='blue'>
                            Cancel Registration
                        </Button> 
                    }

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
        </Skeleton>
        </Card>
        </Center>

        <EditEventModal ticketsSold={ticketsSold} isEditOpen={isEditOpen} onEditClose={onEditClose} eventInfo={eventInfo} setDate={setDate} setTicketsLeft={setTicketsLeft} setEventInfo={setEventInfo}/>
        <RegisterModal setEvents={setEvents} setMyRegisteredIds={setMyRegisteredIds} ticketsLeft={ticketsLeft} setEventInfo={setEventInfo} isOpen={isOpen} onClose={onClose} eventInfo={eventInfo} user={user} setRegistered={setRegistered} setTicketsLeft={setTicketsLeft}/>
        <RegistrationsModal user={user} setMyRegisteredIds={setMyRegisteredIds} setTicketsLeft={setTicketsLeft} setRegistered={setRegistered}eventInfo={eventInfo} setEventInfo={setEventInfo} isRegistrationsOpen={isRegistrationsOpen} onRegistrationsClose={onRegistrationsClose}/>
        </>
        )        
    }

export default EventPage