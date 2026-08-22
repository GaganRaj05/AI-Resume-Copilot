import { useState } from 'react'
import './App.css'
import Home from './pages/Home';
import LandingPage from './LandingPage';

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <Home/>
    </>
  )
}

export default App
