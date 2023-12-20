import { useOutletContext, NavLink, useNavigate } from "react-router-dom";
import EventCard from "./EventCard";
import { Checkbox, Wrap, useDisclosure, Center, Popover, PopoverBody, PopoverTrigger, PopoverContent, PopoverArrow, PopoverCloseButton, Button, Heading,Breadcrumb, BreadcrumbItem, BreadcrumbLink, Flex, Input, InputGroup, InputLeftElement, Spacer, PopoverHeader, HStack } from "@chakra-ui/react";
import { useState } from "react";
import { SearchIcon } from "@chakra-ui/icons";

function EventsPage(){
    const {user, setUser, events, setEvents, setMyCreatedIds, setMyRegisteredIds} = useOutletContext()
    const [upcoming, setUpcoming] = useState(true)
    const [usersEventsFilter, setUsersEventsFitler] = useState(false)
    const [search, setSearch] = useState('')
    const { isOpen, onOpen, onClose } = useDisclosure()

    const nav = useNavigate()

    const sortedEvents = events.sort((a,b) => new Date(a.start_time) - new Date(b.start_time)).filter((event) => event.name.toLowerCase().includes(search.toLowerCase()))
    console.log(sortedEvents)
    const today = new Date()

    function toggleUpcoming(){
        setUpcoming(curr => !curr)
    }

    function toggleUsersFilter(){
        setUsersEventsFitler(curr => !curr)
    }

    function handleSearch(e) {
        setSearch(e.target.value)
    }

    const filteredEvents = upcoming ? sortedEvents.filter((event)=>{ return new Date(event.start_time) > today}) : sortedEvents

    const finalEvents = usersEventsFilter ? filteredEvents.filter((event)=>{ return event.created_by_id === user.id}) : filteredEvents


    const eventCards = finalEvents.map(event => <EventCard setMyRegisteredIds={setMyRegisteredIds} setMyCreatedIds={setMyCreatedIds} key={event.id} setUser={setUser} event={event} setEvents={setEvents} user={user}/>)

    return(
        <>
            <HStack>
                <Breadcrumb m='10px' fontWeight='medium' fontSize='lg'>
                    <BreadcrumbItem>
                        <BreadcrumbLink as={NavLink} to='/'>
                        Home
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbItem isCurrentPage>
                        <BreadcrumbLink>Events</BreadcrumbLink>
                    </BreadcrumbItem>
                </Breadcrumb>
                <Spacer/>
                <Button onClick={()=>nav('/events/new')}>Create Event</Button>
            </HStack>
            <Heading width='100%' textAlign='center' m='5px'>Events</Heading>
            <Center width='100%' marginBottom={'10px'}>
                <InputGroup width='60%' marginRight={'10px'}>
                    <InputLeftElement pointerEvents='none'>
                        <SearchIcon color='gray.300'/>
                    </InputLeftElement>
                    <Input placeholder='Search By Event Name' value={search} onChange={handleSearch} ></Input>
                </InputGroup>
                <Popover>
                    <PopoverTrigger>
                        <Button>Filters</Button>
                    </PopoverTrigger>
                    <PopoverContent>
                        <PopoverArrow />
                        <PopoverCloseButton />
                        <PopoverHeader>Filters</PopoverHeader>
                        <PopoverBody>
                            <Checkbox isChecked={upcoming} onChange={toggleUpcoming} marginRight={'10px'}>
                                Only Show Upcoming
                            </Checkbox>
                            <Checkbox isChecked={usersEventsFilter} onChange={toggleUsersFilter} marginRight={'10px'}>
                                Only Show Users Events
                            </Checkbox>
                        </PopoverBody>
                    </PopoverContent>
                </Popover>
            </Center>
            <Center width='100%'>
                <Wrap justify='center' paddingTop={'10px'}>
                    {eventCards}
                </Wrap>
            </Center>
        </>

    )
}

export default EventsPage