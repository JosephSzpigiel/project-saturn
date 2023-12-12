import {useOutletContext} from 'react-router-dom';
import { Flex, Spacer, ButtonGroup, Button, Box, Heading } from '@chakra-ui/react'
import { useNavigate } from "react-router-dom";


function HomePage(){
    const navigate = useNavigate()
    return(
        <Button onClick={()=>navigate('/addevent')}> Event Form</Button>
    )
}

export default HomePage