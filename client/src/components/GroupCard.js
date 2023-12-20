import { Card, Image, Stack, Text, CardBody,CardFooter,Button, Heading, Skeleton, ButtonGroup } from "@chakra-ui/react"
import GroupPic from '../images/GroupPic.png'
import { useState, useEffect } from "react"


function GroupCard({user, group, myGroups, setMyGroups, setGroups, setEvents}){

    const [joined, setJoined] = useState(false)
    const [admin, setAdmin] = useState(false)
    const [loaded, setLoaded] = useState(false)

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
                width={'55vw'}
            >
                <Image
                    objectFit='cover'
                    maxW={{ base: '100%', sm: '200px' }}
                    src={group.img_url}
                    fallbackSrc= {GroupPic}
                    alt={group.name}
                />

                <Stack>
                    <CardBody>
                    <Heading size='md'>{group.name}</Heading>

                    <Text py='2'>
                        {group.description}
                    </Text>
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