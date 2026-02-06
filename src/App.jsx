import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Body from '../components/Body'


const App = () => {
  return (
    <>
     <BrowserRouter>
     <Routes>
      <Route path='/' element = {<Body />} />
      
     </Routes>
     </BrowserRouter> 
    </>
  )
}

export default App
