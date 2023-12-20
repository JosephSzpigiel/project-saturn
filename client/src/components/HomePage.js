import { Flex, Spacer, Text, List, ListItem, Alert, AlertIcon, Grid, GridItem, ButtonGroup, Button, Box, Heading, Center, BreadcrumbItem, BreadcrumbLink, Breadcrumb, VStack, UnorderedList, Square, Avatar} from '@chakra-ui/react'
import { useNavigate, NavLink, useOutletContext } from "react-router-dom";
import { center } from '@cloudinary/url-gen/qualifiers/textAlignment';
import { blue } from '@cloudinary/url-gen/actions/adjust';


function HomePage(){
    const nav = useNavigate()
    const { notes, groups, myGroups, events } = useOutletContext()

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

    const sortedEvents = events.sort((a,b) => new Date(a.start_time) - new Date(b.start_time))
    const today = new Date()

    const filteredEvents = sortedEvents.filter((event)=>{ return new Date(event.start_time) > today})


    const eventList = filteredEvents.filter(event => myGroups.map(group => group.group_id).includes(event.group_id)).slice(0,8).map(event2 =>{

        const date = new Date(event2.start_time).toString().split(' ')
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
    
        const dateString = `${weekday}, ${month} ${day}, ${year}`
        const timeString = `${amPmHourNonZero}:${minutes} ${amPm}`


        return(
            <ListItem key={event2.id}>
                <Alert as='button' onClick={()=>nav(`/events/${event2.id}`)}>
                    <Avatar name={event2.name} src={event2.img_url} marginRight={'8px'}/><b>{dateString} at {timeString}</b> - {event2.name}
                </Alert>
            </ListItem>
        )
    })




    return(
        <>
            <Grid
                h='90vh'
                templateRows='repeat(2, 1fr)'
                templateColumns='repeat(2, 1fr)'
                gap={2}

                >
                <GridItem bg = 'blue.300' rowSpan={1} colSpan={2}padding={'5px'} height={'15vh'}>
                    <VStack height='100%'>
                        <Spacer/>
                            <Heading size={'2xl'}>Registr</Heading>
                        <Spacer/>
                        {/* <UnorderedList flexWrap={true}>
                            <ListItem><b>Join a group to find events</b></ListItem>
                            <ListItem><b>Register for any events you want to attend</b></ListItem>
                            <ListItem><b>Can't find something for you? Create your own group and events to share with the world!</b></ListItem>
                        </UnorderedList> */}
                        {/* <Spacer/> */}
                    </VStack>
                </GridItem>
                <GridItem colSpan={1} bg='skyblue' height='74vh' marginBottom={'10px'}>
                    <VStack height='100%' paddingTop={'40px'} paddingBottom={'10px'} paddingLeft={'10px'} paddingRight={'10px'}>
                        <Heading>Upcoming Events:</Heading>
                            <Box overflowY="auto" maxHeight="80%">
                                <List>
                                    {eventList}
                                </List>
                            </Box>
                    </VStack>

                </GridItem>
                <GridItem colSpan={1} bg='skyblue' height='74vh' marginBottom={'10px'}>
                    <VStack height='100%' paddingTop={'40px'} paddingBottom={'10px'} paddingLeft={'10px'} paddingRight={'10px'}>
                            <Heading>Notifications:</Heading>
                            { noteList.length === 0 ? <Text as='b' fontSize={'20px'}>No Notifications</Text>:
                            <Box overflowY="auto" maxHeight="80%">
                                <List>
                                    {noteList}
                                </List>
                            </Box>
                            }
                    </VStack>
                </GridItem>
            </Grid>
        </>
    )
}

export default HomePage