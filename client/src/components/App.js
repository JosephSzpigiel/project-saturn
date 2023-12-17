import React, { useEffect, useState } from "react";
import { ChakraProvider, Container, Flex } from '@chakra-ui/react'
import {Outlet} from 'react-router-dom';
import Header from "./Header";
import SignUp from "./SignUp";
import {Cloudinary} from "@cloudinary/url-gen";





function App() {

  const [user, setUser] = useState(null)
  const [events, setEvents] = useState([])
  const [myRegisteredIds, setMyRegisteredIds]  = useState([])
  const [myCreatedIds, setMyCreatedIds]  = useState([])

  const [loaded, setLoaded] = useState(false)
  const cld = new Cloudinary({cloud: {cloudName: 'dtzlah962'}});
  const context = {user, setUser, events, setEvents, myRegisteredIds, setMyRegisteredIds, myCreatedIds, setMyCreatedIds, cld}


  useEffect(() => {
    fetch('/authorized')
    .then((resp) => {
      if (resp.ok) {
        resp.json().then(
          (userObj) => {
            setUser(userObj)
            console.log(userObj['events_created'])
            setMyCreatedIds(userObj['events_created'].map(e => e.id))
            setMyRegisteredIds(userObj['registrations'].map(r => r.event_id))
          }
          )
      } else {
        // handle what should happen if not logged in
        console.log('No login')
      }
    }).then(()=>{
      fetch('/events')
      .then((resp)=>{
        if (resp.ok) {
          resp.json().then((events)=> {
            setEvents(events)
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
          <Header user={user} setUser={setUser} />
          <div style={{'marginTop':'70px', 'marginLeft':'10px', 'marginRight':'10px', 'width':'1fr'}}>
            <SignUp setUser={setUser} />          
          </div>
      </ChakraProvider>
      )
    }
    return(
        <ChakraProvider>
          <Header user={user} setUser= {setUser}/>
          <div style={{'marginTop':'70px', 'marginLeft':'10px', 'marginRight':'10px', 'width':'1fr'}}>
            <Outlet context={context}/>
          </div>
        </ChakraProvider>
      )
  }

}

export default App;
