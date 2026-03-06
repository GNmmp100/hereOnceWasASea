import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Chapter from './pages/Chapter'
import NotFound from './pages/NotFound'

export default function App() {
  return (
    <BrowserRouter basename="/sea">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/chapter/:slug" element={<Chapter />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}
