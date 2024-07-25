import { useState } from 'react'
import './App.css'
import Lift from './Lift'

function App() {
  const [authorized] = useState<boolean>(true)

  return (
    <>
      {!authorized &&
        <div>
          <p>to do: setup login</p>
        </div>
      }
      {authorized &&
        <Lift />
      }
    </>
  )
}

export default App
