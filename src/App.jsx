//import './css/all.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import RootLayout from './layout/RootLayout'
import Home from './pages/Home'
import Favoritos from './pages/Favoritos'

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RootLayout />}>
          <Route index element={<Home />} />
          <Route path="Favoritos" element={<Favoritos />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
