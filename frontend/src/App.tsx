import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { SignUp } from './pages/signup'
import { SignIn } from './pages/signin'
import { Blog } from './pages/blog'
function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/signup" element={<SignUp />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/blog" element={<Blog />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App