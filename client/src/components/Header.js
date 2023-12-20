import { Flex,Popover, useDisclosure, PopoverContent, PopoverArrow, PopoverCloseButton, PopoverBody, PopoverHeader, Spacer, ButtonGroup, Button, Box, Heading, Avatar,  AvatarBadge, Menu, MenuButton, MenuItem, MenuList, HStack, MenuDivider } from '@chakra-ui/react'
import { useNavigate, useOutletContext } from 'react-router-dom'
import { useState, useEffect } from 'react'

import NotificationsModal from './NotificationsModal'

function Header({user, setUser, notes, setNotes}) {
    const { onOpen, onClose, isOpen } = useDisclosure()
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
                        <Button onClick={()=>nav('/groups')}>Groups</Button>
                        <Button onClick={()=>nav('/events')}>Events</Button>
                    </ButtonGroup>
                    <Menu id='profile_menu'>
                        <MenuButton>
                            <Avatar marginRight='15px' size='md' name={user.first_name} src={user.img_url}>
                                {notes.length != 0 ? <AvatarBadge boxSize='1em' bg='green.500' border={'2px solid white'}/>:null}
                            </Avatar>
                        </MenuButton>
                        <MenuList>
                            <MenuItem onClick={()=>nav('/myprofile')}>My Profile</MenuItem>
                            <MenuItem onClick={handleLogout}>Log out</MenuItem>
                            {notes.length != 0 ? <MenuItem onClick={onOpen}>Notifications</MenuItem>: null}
                        </MenuList>
                    </Menu>
                </HStack>
                :
                null}
            </div>
            <NotificationsModal user={user} setNotes={setNotes} setUser={setUser} notes={notes} onClose={onClose} isOpen={isOpen}/>
        </Flex>
    )
}

export default Header