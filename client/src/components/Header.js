import { Flex, Spacer, ButtonGroup, Button, Box, Heading } from '@chakra-ui/react'

function Header() {
    return(
        <Flex minWidth='max-content' alignItems='center' gap='2' bg='blue'>
            <Box p='2'>
                <Heading size='md' textColor={'white'}>Registr</Heading>
            </Box>
            <Spacer />
            <ButtonGroup gap='2' m='5px'>
                <Button colorScheme='teal'>Log in</Button>
            </ButtonGroup>
        </Flex>
    )
}

export default Header