import React, { useEffect, useState } from "react";
import { Box, ChakraProvider, Container, Flex } from '@chakra-ui/react'
import {Outlet} from 'react-router-dom';
import Header from "./Header";
import SignUp from "./SignUp";
import {Cloudinary} from "@cloudinary/url-gen";





function App() {

  const [user, setUser] = useState(null)
  const [events, setEvents] = useState([])
  const [myRegisteredIds, setMyRegisteredIds]  = useState([])
  const [myCreatedIds, setMyCreatedIds]  = useState([])
  const [myGroups, setMyGroups] = useState([])
  const [groups, setGroups]  = useState([])
  const [notes, setNotes] = useState([])


  const [loaded, setLoaded] = useState(false)
  const cld = new Cloudinary({cloud: {cloudName: 'dtzlah962'}});
  const context = {user, notes, setNotes, myGroups, setGroups, setMyGroups, groups, setUser, events, setEvents, myRegisteredIds, setMyRegisteredIds, myCreatedIds, setMyCreatedIds, cld}


  useEffect(() => {
    fetch('/authorized')
    .then((resp) => {
      if (resp.ok) {
        resp.json().then(
          (userObj) => {
            console.log(userObj)
            setUser(userObj)
            console.log(userObj['events_created'])
            setMyCreatedIds(userObj['events_created'].map(e => e.id))
            setMyRegisteredIds(userObj['registrations'].map(r => r.event_id))
            console.log(userObj['user_groups'])
            setMyGroups(userObj['user_groups'])
            setNotes(userObj['notifications'])
          }
          )
      } else {
        // handle what should happen if not logged in
        console.log('No login')
        setLoaded(true)
      }
    }).then(()=>{
      fetch('/events')
      .then((resp)=>{
        if (resp.ok) {
          resp.json().then((events)=> {
            setEvents(events)
          })
        }
      })
    }).then(()=>{
      fetch('/groups')
      .then((resp)=>{
        if (resp.ok) {
          resp.json().then((groups)=> {
            setGroups(groups)
          })
          setLoaded(true)
        }
      })
    })
  },[])

  if(loaded){
    if(!user){
      return(
        <ChakraProvider>
          <Header user={user} setUser={setUser} notes={notes} setNotes={setNotes} />
          <div style={{'transparency':'1', 'marginTop':'70px', 'marginLeft':'10px', 'marginRight':'10px', 'width':'1fr'}}>
            <SignUp setNotes={setNotes} setUser={setUser} setMyGroups={setMyGroups} setMyCreatedIds={setMyCreatedIds} setMyRegisteredIds={setMyRegisteredIds}/>          
          </div>
      </ChakraProvider>
      )
    }
    console.log(myGroups)
    return(
        <ChakraProvider>
          <Header user={user} setUser= {setUser} notes={notes} setNotes={setNotes}/>
          <Box  marginTop='70px' paddingLeft='10px' paddingRight='10px' width='1fr'>
            <Outlet marginTop='70px' paddingLeft='10px' paddingRight='10px' width='1fr' context={context}/>
          </Box>
        </ChakraProvider>
      )
  }

}

export default App;
