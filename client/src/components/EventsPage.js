import { useOutletContext, NavLink } from "react-router-dom";
import EventCard from "./EventCard";
import { Checkbox, Wrap, Center, Heading,Breadcrumb, BreadcrumbItem, BreadcrumbLink, Flex, Input, InputGroup, InputLeftElement, Spacer } from "@chakra-ui/react";
import { useState } from "react";
import { SearchIcon } from "@chakra-ui/icons";

function EventsPage(){
    const {user, setUser, events, setEvents, setMyCreatedIds, setMyRegisteredIds} = useOutletContext()
    const [upcoming, setUpcoming] = useState(true)
    const [search, setSearch] = useState('')

    const sortedEvents = events.sort((a,b) => new Date(a.start_time) - new Date(b.start_time)).filter((event) => event.name.toLowerCase().includes(search.toLowerCase()))
    console.log(sortedEvents)
    const today = new Date()

    function toggleUpcoming(){
        setUpcoming(curr => !curr)
    }

    function handleSearch(e) {
        setSearch(e.target.value)
    }

    const filteredEvents = upcoming ? sortedEvents.filter((event)=>{ return new Date(event.start_time) > today}) : sortedEvents

    const eventCards = filteredEvents.map(event => <EventCard setMyRegisteredIds={setMyRegisteredIds} setMyCreatedIds={setMyCreatedIds} key={event.id} setUser={setUser} event={event} setEvents={setEvents} user={user}/>)

    return(
        <>
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
            <Heading width='100%' textAlign='center' m='5px'>Events</Heading>
            <Center width='100%' marginBottom={'10px'}>
                <Checkbox isChecked={upcoming} onChange={toggleUpcoming} marginRight={'10px'}>
                    Only Show Upcoming
                </Checkbox>
                <InputGroup width='60%'>
                    <InputLeftElement pointerEvents='none'>
                        <SearchIcon color='gray.300'/>
                    </InputLeftElement>
                    <Input placeholder='Search By Event Name' value={search} onChange={handleSearch} ></Input>
                </InputGroup>
            </Center>
            <Center width='100%'>
                <Wrap justify='center'>
                    {eventCards}
                </Wrap>
            </Center>
        </>

    )
}

export default EventsPage