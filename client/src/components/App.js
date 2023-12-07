import React, { useEffect, useState } from "react";
import { ChakraProvider } from '@chakra-ui/react'
import {Outlet} from 'react-router-dom';
import Header from "./Header";
import SignUp from "./SignUp";




function App() {

  const [user, setUser] = useState(null)

  useEffect(() => {
    fetch('http://localhost:5555/api/v1/users')
        .then((r) => r.json())
        .then((users) => {
            console.log(users);
        });
  }, []);

  const context = {}

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

export default App;
