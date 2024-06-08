import React from 'react'
import Home from './Home'
import Form from './Form'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

function App() {
  return (
    <div id="app">
      <nav>
        <Link to="/">Home</Link>
        <Link to="/Form">Orders</Link>
      </nav>
      <Routes>
        <Route path='/' element ={<Home />}/>
        <Route path='/Form' element ={<Form />}/>
      </Routes>
      
      
    </div>
  )
}

export default App
