import { Card, CardHeader, CardBody, CardFooter, Skeleton, Image, Stack, Text, Divider, Button, ButtonGroup, Heading, VStack } from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import square from '../images/blue_square.jpeg'

function EventCard({event, user, setUser,  setEvents, setMyCreatedIds, setMyRegisteredIds}){


    let loaded = false
    const nav = useNavigate()

    const date = new Date(event.start_time).toString().split(' ')
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

    function handleDelete(){
        fetch(`/events/${event.id}`, {
            method: 'DELETE'
        }).then((resp) => {
            if (resp.ok) {
                setEvents(curr => {return([...curr.filter(listEvent => listEvent.id !== event.id)])})
                setMyCreatedIds(curr => [...curr].filter(id => id !== event.id))
                setMyRegisteredIds(curr => [...curr].filter(id => id !== event.id))
            }
        })
    }

    const fallbackOption = event['img_url'] ? <Skeleton height={'250px'} width={'250px'}/> : null
    const fallbackSrcOption = !event['img_url'] ? square : null

    return(
        <Card width={'20%'} minW={'300px'}>
            <CardBody>
                {/* <Skeleton isLoaded= {loaded}> */}
                    <Image
                        src={event['img_url']}
                        alt={event['name']}
                        borderRadius='lg'
                        // fallbackSrc={square}
                        fallbackSrc={fallbackSrcOption}
                        fallback={fallbackOption}
                        boxSize='250px'
                        objectFit='cover'
                        onLoad={() => loaded = true}
                        />
                {/* </Skeleton> */}
                <Stack mt='6' spacing='3'>
                    <Heading size='md'>{event['name']}</Heading>
                        <Text>
                            Date: {dateString}
                        </Text>
                        <Text>
                            Time: {timeString}
                        </Text>
                </Stack>
            </CardBody>
            <Divider />
            <CardFooter>
                <ButtonGroup spacing='2'>
                    <Button variant='solid' colorScheme='blue' onClick={()=>nav(`/events/${event.id}`)}>
                        View
                    </Button>
                    {(event.created_by_id == user.id) ?                 
                    <Button onClick={handleDelete} variant='outline' colorScheme='red'>
                        Cancel Event
                    </Button>: null}
                </ButtonGroup>
            </CardFooter>
        </Card>
    )
}

export default EventCard
