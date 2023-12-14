import { Card, CardHeader, CardBody, CardFooter, Image, Stack, Text, Divider, Button, ButtonGroup, Heading } from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'

function EventCard({event, user, setEvents}){

    const nav = useNavigate()

    function handleDelete(){
        fetch(`/events/${event.id}`, {
            method: 'DELETE'
        }).then((resp) => {
            if (resp.ok) {
                setEvents(curr => {return([...curr.filter(listEvent => listEvent.id !== event.id)])})
            }
        })
    }

    return(
        <Card maxW='sm'>
            <CardBody>
                <Image
                    src={event['img_url']}
                    alt={event['name']}
                    borderRadius='lg'
                    fallbackSrc='https://via.placeholder.com/300'
                />
                <Stack mt='6' spacing='3'>
                    <Heading size='md'>{event['name']}</Heading>
                    <Text>
                        {event['description']}
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
