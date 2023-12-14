import { useOutletContext, NavLink } from "react-router-dom";
import EventCard from "./EventCard";
import { Container, Wrap, Center, Heading,Breadcrumb, BreadcrumbItem, BreadcrumbLink } from "@chakra-ui/react";

function EventsPage(){
    const {user, setUser, events, setEvents} = useOutletContext()

    const eventCards = events.map(event => <EventCard key={event.id} setUser={setUser} event={event} setEvents={setEvents} user={user}/>)

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
            <Center width='100%'>
                <Wrap justify='center'>
                    {eventCards}
                </Wrap>
            </Center>
        </>

    )
}

export default EventsPage