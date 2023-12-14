import {useOutletContext} from 'react-router-dom';
import { Flex, Spacer, ButtonGroup, Button, Box, Heading, Center, BreadcrumbItem, BreadcrumbLink, Breadcrumb} from '@chakra-ui/react'
import { useNavigate, NavLink } from "react-router-dom";


function HomePage(){
    const navigate = useNavigate()
    return(
        <>
            <Breadcrumb m='10px' fontWeight='medium' fontSize='lg'>
                <BreadcrumbItem isCurrentPage>
                    <BreadcrumbLink>
                    Home
                    </BreadcrumbLink>
                </BreadcrumbItem>
            </Breadcrumb>
            <Center height='80vh'>
                <ButtonGroup spacing='7px'>
                    <Button onClick={()=>navigate('/addevent')}> Event Form</Button>
                    <Button onClick={()=> navigate('/events')}> Event List</Button>
                </ButtonGroup>
            </Center>
        </>
    )
}

export default HomePage