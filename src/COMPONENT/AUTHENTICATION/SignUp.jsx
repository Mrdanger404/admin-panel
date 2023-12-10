import { createUserWithEmailAndPassword } from "firebase/auth";
import { useEffect, useState } from "react"
import { auth, database, storage } from "../DATABASE/Config";
import { ref, set } from "firebase/database";
import {getDownloadURL, ref as stRef, uploadBytesResumable} from 'firebase/storage'
import { useNavigate } from "react-router-dom";


const SignUp = () => {

  const homeNavigate = useNavigate()
  const [user, setUser] = useState({
    name: '',
    phone: '',
    email: '',
    password: '',
    picture: '',
  })

  
  useEffect(()=>{
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if(authUser){
        homeNavigate(`/${authUser.uid}`)
      }
    })

    return () => unsubscribe()
  },[homeNavigate])
  const signup = (e) => {
    e.preventDefault();

    createUserWithEmailAndPassword(auth, user.email, user.password)
    .then((userCredential) => {

      const userId = userCredential.user;

      if(userId.uid){
        const storageRef = stRef(storage, `user/${userId.uid}/`);
        const uploadTask = uploadBytesResumable(storageRef, user.picture);

        uploadTask.on('state_changed',
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
              set(ref(database, `adminInfo/${userId.uid}`),{
                name: user.name,
                phone: user.phone,
                email: user.email,
                password: user.password,
                uid: userId.uid,
                picture: downloadUrl
              })
            })
          }
        )
      }

    alert(`${user.name} is signup successful`)
      homeNavigate(`/${userId.uid}`)
  })
  }
  return (
    <div className="h-screen bg-slate-600 flex items-center justify-center">
      <div className="w-[250px] p-5 bg-orange-400 rounded-3xl">
        <form className="flex flex-col" onSubmit={signup}>
          <input type="text" required placeholder="Enter your Full name" onChange={(e) => setUser({...user, name: e.target.value})} className="h-10 my-2 p-5 rounded-3xl" />
          <input type="tel" required placeholder="Enter Your Phone number" onChange={(e) => setUser({...user, phone: e.target.value})} className="h-10 my-2 p-5 rounded-3xl" />
          <input type="email" required placeholder="Enter your Email address" onChange={(e) => setUser({...user, email: e.target.value})} className="h-10 my-2 p-5 rounded-3xl" />
          <input type="password" required placeholder="Enter your Password" onChange={(e) => setUser({...user, password: e.target.value})} className="h-10 my-2 p-5 rounded-3xl" />
          <label>Choose your Picture</label>
          <input type="file" required className="h-10 my-2" onChange={(e) => setUser({...user, picture: e.target.files[0]})} />
          <button className="h-10 my-2 rounded-3xl bg-black text-white font-bold transition hover:bg-green-700 hover:shadow-2xl duration-500">SignUp</button>
        </form>
      </div>
    </div>
  )
}

export default SignUp