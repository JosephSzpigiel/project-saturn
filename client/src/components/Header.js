import { Flex, Spacer, ButtonGroup, Button, Box, Heading, Avatar,  AvatarBadge, Menu, MenuButton, MenuItem, MenuList, HStack, MenuDivider } from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'

function Header({user, setUser}) {

    const nav = useNavigate()

    function handleLogout() {
        fetch('/logout', {
            method: 'DELETE'
        }).then((resp) => {
            if (resp.ok) {
                setUser(null)
                nav('/')
            }
        })
    }

    const [notes, setNotes] = useState([])

    useEffect(()=> {
        if(user){
            setNotes(user.notifications)
        }
    },[user])

    const noteItems = notes.map(note => <MenuItem key={note.id}>{note.content}</MenuItem>)
    
    return(
        <Flex as="header" zIndex={100} position="fixed" w="100%" top={0} alignItems='center' gap='2' bg='blue' height='60px'>
            <Box p='2'>
                <Heading size='md' textColor={'white'}>Registr</Heading>
            </Box>
            <Spacer />
            <div>
                {user ? 
                <HStack>
                    <ButtonGroup gap='2' m='11px'>
                        <Button onClick={()=>nav('/addevent')}>Create Event</Button>
                    </ButtonGroup>
                    <Menu id='profile_menu'>
                        <MenuButton>
                            <Avatar marginRight='15px' size='md' name={user.first_name} src={user.img_url}>
                                <AvatarBadge boxSize='1em' bg='green.500' border={'2px solid white'} />
                            </Avatar>
                        </MenuButton>
                        <MenuList>
                            <MenuItem onClick={()=>nav('/myprofile')}>My Profile</MenuItem>
                            <MenuItem onClick={handleLogout}>Log out</MenuItem>
                            <MenuItem>Notificationsficati</MenuItem>
                        </MenuList>
                        
                    </Menu>
                </HStack>
                :
                null}
            </div>
        </Flex>
    )
}

export default Header