import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Login from './components/Login'
import Signup from './components/Signup'
import Feed from './components/Feed'
import Profile from './components/Profile'
import Connections from './components/Connections'
import Chat from './components/Chat'
import Messages from './components/Messages'


const App = () => {
  return (
    <>
     <BrowserRouter>
     <Routes>
      <Route path='/' element = {<Login />} />
      <Route path='/login' element = {<Login />} />
        <Route path='/signup' element = {<Signup />} />
        <Route path='/feed' element = {<Feed />} />
        <Route path='/profile' element = {<Profile />} />
         <Route path='/connections' element = {<Connections />} />
         <Route path = '/chat/:userId' element={<Chat />} />
         <Route path = '/messages' element={<Messages />} />
     </Routes>
     </BrowserRouter> 
    </>
  )
}

export default App

