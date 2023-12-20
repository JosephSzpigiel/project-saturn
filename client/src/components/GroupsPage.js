import { useOutletContext, NavLink, useNavigate } from "react-router-dom"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, HStack,  Button, Spacer, useDisclosure, Center, Wrap, VStack } from "@chakra-ui/react"
import GroupForm from "./GroupForm"
import GroupCard from "./GroupCard"



function GroupsPage(){

    const { isOpen: isFormOpen , onOpen: onFormOpen, onClose: onFormClose } = useDisclosure()

    const {user, setUser, groups, setGroups, setMyGroups, myGroups} =useOutletContext()


    const nav = useNavigate()

    const groupCards = groups.map(group => {
        return <GroupCard key ={group.id} user={user} group={group} myGroups={myGroups} setMyGroups={setMyGroups} setGroups={setGroups} />
    })
    
    return(
        <>
            <HStack>
                <Breadcrumb m='10px' fontWeight='medium' fontSize='lg'>
                    <BreadcrumbItem>
                        <BreadcrumbLink as={NavLink} to='/'>
                        Home
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbItem isCurrentPage>
                        <BreadcrumbLink>Groups</BreadcrumbLink>
                    </BreadcrumbItem>
                </Breadcrumb>
                <Spacer/>
                <Button onClick={onFormOpen}>Create Group</Button>
            </HStack>
            <GroupForm user={user} setMyGroups={setMyGroups} setGroups={setGroups} setUser={setUser} isOpen={isFormOpen} onClose={onFormClose}/>
            <Center width='100%'>
                <VStack justify='center' paddingTop={'10px'}>
                    {groupCards}
                </VStack>
            </Center>
        </>
    )
}

export default GroupsPage