import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Login from './components/Login'
import Signup from './components/Signup'
import Feed from './components/Feed'
import Profile from './components/Profile'
import Connections from './components/Connections'


const App = () => {
  return (
    <>
     <BrowserRouter>
     <Routes>
      <Route path='/login' element = {<Login />} />
        <Route path='/signup' element = {<Signup />} />
        <Route path='/feed' element = {<Feed />} />
        <Route path='/profile' element = {<Profile />} />
         <Route path='/connections' element = {<Connections />} />
     </Routes>
     </BrowserRouter> 
    </>
  )
}

export default App
