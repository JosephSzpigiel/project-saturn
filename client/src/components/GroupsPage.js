import { useOutletContext, NavLink, useNavigate } from "react-router-dom"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, HStack,  Button, Spacer, useDisclosure, Center, Wrap, VStack, InputGroup, Input, InputLeftElement } from "@chakra-ui/react"
import { SearchIcon } from "@chakra-ui/icons";
import { useState } from "react"

import GroupForm from "./GroupForm"
import GroupCard from "./GroupCard"



function GroupsPage(){

    const { isOpen: isFormOpen , onOpen: onFormOpen, onClose: onFormClose } = useDisclosure()

    const {user, setUser, groups, setGroups, setMyGroups, myGroups, setEvents, events} =useOutletContext()
    const [search, setSearch] = useState('')
    const nav = useNavigate()

    function handleSearch(e) {
        setSearch(e.target.value)
    }

    const groupCards = groups.filter(group => group.name.toLowerCase().includes(search.toLowerCase())).map(group => {
        return <GroupCard key ={group.id} events={events} setEvents={setEvents} user={user} group={group} myGroups={myGroups} setMyGroups={setMyGroups} setGroups={setGroups} />
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
            <Center width='100%' marginBottom={'10px'}>
                <InputGroup width='60%' marginRight={'10px'}>
                    <InputLeftElement pointerEvents='none'>
                        <SearchIcon color='gray.300'/>
                    </InputLeftElement>
                    <Input placeholder='Search By Group Name' value={search} onChange={handleSearch} ></Input>
                </InputGroup>
            </Center>
            <Center width='100%'>
                <VStack justify='center' paddingTop={'10px'}>
                    {groupCards}
                </VStack>
            </Center>
        </>
    )
}

export default GroupsPage