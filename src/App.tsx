import { useState } from 'react'
import './App.css'
import Lift from './views/Lift'
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

const queryClient = new QueryClient();

function App() {
  const [authorized] = useState<boolean>(true)

  return (
    <QueryClientProvider client={queryClient}>
      {!authorized &&
        <div>
          <p>to do: setup login</p>
        </div>
      }
      {authorized &&
        <Lift />
      }
      <ReactQueryDevtools initialIsOpen={false} buttonPosition='bottom-left' position='bottom'/>
    </QueryClientProvider>
  )
}

export default App
