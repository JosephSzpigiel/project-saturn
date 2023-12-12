import { Flex, Spacer, ButtonGroup, Button, Box, Heading, Avatar } from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'

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
    
    return(
        <Flex minWidth='max-content' alignItems='center' gap='2' bg='blue' height='60px'>
            <Box p='2'>
                <Heading size='md' textColor={'white'}>Registr</Heading>
            </Box>
            <Spacer />
            <div>
                {user ? 
                <div>
                    <ButtonGroup gap='2' m='11px'>
                        <Button onClick={()=>nav('/addevent')}>Create Event</Button>
                        <Button onClick={handleLogout} colorScheme='teal'>Log out</Button>
                    </ButtonGroup>
                    <Avatar as='button' onClick={()=>nav('/myprofile')} m='8px' size='md' name={user.first_name} src={user.img_url} />
                </div>
                :
                <Button m='11px' colorScheme='teal'>Log in</Button>}
            </div>
        </Flex>
    )
}

export default Header