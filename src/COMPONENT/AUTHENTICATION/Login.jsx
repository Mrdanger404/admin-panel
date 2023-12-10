import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { useEffect, useState } from "react"
import { auth, database } from "../DATABASE/Config";
import { useNavigate } from "react-router-dom";
import { onValue, ref } from "firebase/database";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css'


const Login = () => {
  const homeNavigate = useNavigate();
  const loginNavigate = useNavigate()
  const signUpNavigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [adminUid, setAdminUid] = useState([]);
  const [addAdmin, setAddAdmin] = useState(false)

  useEffect(() => {
    const uniqueId = `${window.screen.colorDepth}${window.navigator.deviceMemory}${window.screen.height}${window.screen.width}`
    if(uniqueId){
      
      const id = parseInt(uniqueId)

      if(id === 2421114501 || id === 2488641536 ){
        setAddAdmin(true)
      }
    }
  },[])

  useEffect(() => {
    const dbRef = ref(database, 'adminInfo');

    onValue(dbRef, (snapshot) => {
      const adminArray = [];
      snapshot.forEach((data) => {
        adminArray.push(data.val());
      });
      setAdminUid(adminArray)
    })
  },[])

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if(authUser) {

        homeNavigate(`/${authUser.uid}`)
      }
    })
    return () => unsubscribe()
  },[homeNavigate])
  const login = (e) => {

    e.preventDefault()
    
    signInWithEmailAndPassword(auth, email, password)
    .then(() => {
      if(auth.currentUser.uid){
        const data = adminUid.find((admin) => admin.uid == auth.currentUser.uid);

        if(data){
          homeNavigate(`/${auth.currentUser.uid}`)
        }else{
          signOut(auth)
          toast.error('You are not admin',{
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          })
          loginNavigate('/')
        }
      }
    })
    .catch((error) => {
      alert(error.code)
    })
  }
  return (
    <>
    <ToastContainer
      position="top-center"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
    />
    <div className="h-screen bg-slate-600 flex items-center justify-center">
      <div className="p-5 bg-rose-500 w-[300px] flex flex-col items-center justify-center rounded-3xl shadow-2xl">
        <form onSubmit={login} className="flex flex-col w-[250px] ">
          <input type="email" required placeholder="Enter your email" onChange={(e) => setEmail(e.target.value)} className="my-2 p-2 rounded-3xl"/>
          <input type="password" required placeholder="Enter your password" onChange={(e) => setPassword(e.target.value)} className="my-2 p-2 rounded-3xl" />
          <button type="submit" className="my-2 bg-black text-white h-10 rounded-3xl transition hover:bg-green-600 hover:shadow-2xl duration-500">Login</button>
        </form>
        {addAdmin && <button className="my-2 bg-black text-white h-10 rounded-3xl transition hover:bg-green-600 hover:shadow-2xl duration-500 w-full" onClick={() => signUpNavigate('/signup')}>SingUp</button>}
      </div>
    </div>
    </>
  )
}

export default Login