import { Card, Badge, Image, Stack, Text, CardBody,CardFooter,Button, Heading, Skeleton, ButtonGroup, VStack } from "@chakra-ui/react"
import GroupPic from '../images/GroupPic.png'
import { useState, useEffect } from "react"


function GroupCard({user, group, myGroups, setMyGroups, setGroups, setEvents, events}){

    const [joined, setJoined] = useState(false)
    const [admin, setAdmin] = useState(false)
    const [loaded, setLoaded] = useState(false)

    const eventCount = events.filter(event => event.group_id === group.id).length

    const memberCount = group.user_groups.length

    useEffect(()=>{
        try{
            console.log(myGroups)
            if(myGroups.filter(listGroup => listGroup.group_id === group.id).length == 1){
                setJoined(true)
                if(myGroups.filter(listGroup => listGroup.group_id === group.id)[0]['admin'] == true){
                    setAdmin(true)
                }
            }
        }catch{}
        setLoaded(true)
    })    

    function handleDelete(){
        fetch(`/groups/${group.id}`, {
            method: 'DELETE'
        }).then((resp) => {
            if (resp.ok) {
                setGroups(curr => {return([...curr.filter(listGroup => listGroup.id !== group.id)])})
                setMyGroups(curr => [...curr].filter(mygroup => mygroup.group_id !== group.id))
                setEvents(curr=> [...curr].filter(event => event.group_id !== group.id))
            }
        })
    }

    function handleJoin(){
        fetch(`/usergroups`,{
            method: 'POST',
            headers: {
                "Content-Type": 'application/json'
            },
            body: JSON.stringify({'user_id': user.id, 'group_id': group.id, 'admin':0})
        }).then(resp => {
            if(resp.ok){
                resp.json().then((userGroup)=>{
                    setJoined(true)
                    setMyGroups(curr => [...curr, userGroup])
                    setGroups(curr => [...curr].map(liGroup => {
                        if(liGroup.id === group.id){
                            liGroup['user_groups'] = [...liGroup['user_groups'], userGroup]
                            return liGroup
                        }else{
                            return liGroup
                        }
                    }))
                })
            }
        })
    }

    function handleLeave(){
        const userGroupId = myGroups.filter(listGroup => listGroup.group_id === group.id)[0].id
        fetch(`/usergroups/${userGroupId}`,{
            method: 'DELETE'
        }).then(()=>{
            setJoined(false)
            setAdmin(false)
            setMyGroups(curr => [...curr].filter(listGroup => listGroup.group_id !== group.id))
        })
    }

    return(
        <Skeleton isLoaded={loaded}>
            <Card
                direction={{ base: 'column', sm: 'row' }}
                overflow='hidden'
                variant='outline'
                width={'700px'}
            >
                <Image
                    objectFit='cover'
                    maxW={{ base: '100%', sm: '200px' }}
                    src={group.img_url}
                    fallbackSrc= {GroupPic}
                    alt={group.name}
                />

                <Stack>
                    <CardBody width={'500px'}>
                    <Heading size='md'>{group.name}</Heading>

                        <Text py='2' width={'100%'}>
                            {group.description}
                        </Text>
                        <VStack align={'left'} width={'100%'}>
                            <Badge textAlign={'center'} bg={'lightblue'}>Number of Events: {eventCount}</Badge>
                            <Badge textAlign={'center'} bg={'blue.200'}>Number of Members: {memberCount}</Badge>
                        </VStack>
                    </CardBody>

                    <CardFooter>
                        <ButtonGroup>
                            {!joined ? <Button variant='solid' colorScheme='blue' onClick={handleJoin}>
                                Join
                            </Button>:
                            <Button variant='solid' isDisabled={true} colorScheme='green' onClick={handleLeave}>
                                Joined!
                            </Button>
                            }
                            {admin ? <Button variant={'solid'} colorScheme="blue" onClick={handleDelete}>
                                Delete
                            </Button>: null}
                        </ButtonGroup>
                    </CardFooter>
                </Stack>
            </Card>
        </Skeleton>
    )

}

export default GroupCard