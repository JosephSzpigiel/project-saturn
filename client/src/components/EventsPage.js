import { useOutletContext, NavLink, useNavigate } from "react-router-dom";
import EventCard from "./EventCard";
import { Checkbox, Wrap, Text, useDisclosure, Select, Center, Popover, PopoverBody, PopoverTrigger, PopoverContent, PopoverArrow, PopoverCloseButton, Button, Heading,Breadcrumb, BreadcrumbItem, BreadcrumbLink, Flex, Input, InputGroup, InputLeftElement, Spacer, PopoverHeader, HStack, FormLabel, FormControl } from "@chakra-ui/react";
import { useState } from "react";
import { SearchIcon } from "@chakra-ui/icons";

function EventsPage(){
    const {groups, myGroups, user, setUser, events, setEvents, setMyCreatedIds, setMyRegisteredIds} = useOutletContext()
    const [upcoming, setUpcoming] = useState(true)
    const [usersEventsFilter, setUsersEventsFitler] = useState(false)
    const [search, setSearch] = useState('')
    const [groupFilter, setGroupFilter] = useState(0)
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

    const myGroupIds = myGroups.map(group => group.group_id)

    const groupEvents = sortedEvents.filter(event => myGroupIds.includes(event.group_id))

    const filteredEvents = upcoming ? groupEvents.filter((event)=>{ return new Date(event.start_time) > today}) : groupEvents

    const userEvents = usersEventsFilter ? filteredEvents.filter((event)=>{ return event.created_by_id === user.id}) : filteredEvents

    const finalEvents = groupFilter !== 0 ? userEvents.filter((event) => event.group_id === groupFilter) : userEvents

    const activeGroups = groups.filter(group => {
        if(myGroupIds.includes(group.id)){
            return group
        }
    })

    const groupOptions = activeGroups.map(group => {
        return <option key={group.id} value={group.id}>{group.name}</option>
    })


    const eventCards = finalEvents.map(event => <EventCard groups={groups} setMyRegisteredIds={setMyRegisteredIds} setMyCreatedIds={setMyCreatedIds} key={event.id} setUser={setUser} event={event} setEvents={setEvents} user={user}/>)

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
            <Text size='md' align='center' marginBottom='10px'>Events for your groups</Text>
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
                                Only Show My Events
                            </Checkbox>
                            <FormControl>
                                <FormLabel>Filter by Group:</FormLabel>
                            <Select value={groupFilter} onChange={e => setGroupFilter(parseInt(e.target.value))}>
                                <option value={0}> All Groups</option>
                                {groupOptions}
                            </Select>
                            </FormControl>
                        </PopoverBody>
                    </PopoverContent>
                </Popover>
            </Center>
            <Center width='100%' marginBottom='15px'>
                <Wrap justify='center' paddingTop={'10px'}>
                    {eventCards}
                </Wrap>
            </Center>
        </>

    )
}

export default EventsPage