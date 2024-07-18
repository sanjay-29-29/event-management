import {BrowserRouter,Routes,Route} from 'react-router-dom'
import Login from './Login/Login'
import Home from './Home/Home'
import Profile from './Profile/Profile';
import AxiosSetup from './AxiosSetup';

function App() {
  return (
    <>
      <BrowserRouter>
      <AxiosSetup/>
        <Routes>
          <Route path='/login' element={<Login/>}/>
          <Route path='/' element={<Home/>} />
          <Route path='/profile' element={<Profile/>} />
        </Routes>
      </BrowserRouter>  
    </>
  )
}

export default App;