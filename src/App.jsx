import React from 'react'
import Sidebar from './components/sidebar/Sidebar'
import DashLayout from './components/dash/DashLayout'

const App = ({url}) => {
  return (
    <div className='w-full h-screen max-h-screen bg-white flex'>
      <Sidebar />
      <DashLayout url={url} />
    </div>
  )
}

export default App
