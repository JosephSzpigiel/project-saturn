import React, { useEffect, useState } from "react";
import { ChakraProvider } from '@chakra-ui/react'
import {Outlet} from 'react-router-dom';
import Header from "./Header";
import SignUp from "./SignUp";




function App() {

  const [user, setUser] = useState(null)
  const [loaded, setLoaded] = useState(false)
  const context = {user}

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
          <Outlet context={context}/>
        </ChakraProvider>
      )
  }

}

export default App;
