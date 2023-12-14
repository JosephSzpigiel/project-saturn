import React, { useEffect, useState } from "react";
import { ChakraProvider, Container, Flex } from '@chakra-ui/react'
import {Outlet} from 'react-router-dom';
import Header from "./Header";
import SignUp from "./SignUp";




function App() {

  const [user, setUser] = useState(null)
  const [events, setEvents] = useState([])
  const [loaded, setLoaded] = useState(false)
  const context = {user, events, setEvents}

  useEffect(() => {
    fetch('/authorized')
    .then((resp) => {
      if (resp.ok) {
        resp.json().then((user) => setUser(user))
        setLoaded(true)
      } else {
        // handle what should happen if not logged in
        console.log('No login')
        setLoaded(true)
      }
    }).then(()=>{
      fetch('/events')
      .then((resp)=>{
        if (resp.ok) {
          resp.json().then((events)=> setEvents(events))
        }
      })
    })
  },[])

  if(loaded){
    if(!user){
      return(
        <ChakraProvider>
          <Header user={user} setUser={setUser} />
          <SignUp setUser={setUser} />
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
