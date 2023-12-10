import { onValue, ref } from "firebase/database"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { auth, database } from "../../../DATABASE/Config"
import { signOut } from "firebase/auth"


const AdminProfile = (props) => {
    const [admin, setAdmin] = useState({
        name: '',
        email: '',
        password: '',
        phone: '',
        picture: ''
    })

    const loginNavigate = useNavigate()
    useEffect(() => {
        const dbRef = ref(database, `adminInfo/${props.uid}`);

        onValue(dbRef, (snapshot) => {
            setAdmin({
                name: snapshot.val().name,
                email: snapshot.val().email,
                password: snapshot.val().password,
                phone: snapshot.val().phone,
                picture: snapshot.val().picture
            })
        })
    },[props.uid])

    const handleSignOut = (e) =>{
        e.preventDefault();

        signOut(auth).then(() => {
            loginNavigate('/')
        })

    }
  return (
    <div className="justify-between flex p-2 items-center fixed w-full">
        <div className="cursor-pointer group">
            <div className="flex items-center">
                <img src={admin.picture} alt="image not found" className="h-14 p-2 rounded-full" />
                <p className="font-bold">{admin.name}</p>
            </div>
            <div className="hidden group-hover:block z-10 fixed">
                <img src={admin.picture} alt="image not found" className="h-32" />
                <p className="font-bold">{admin.name}</p>
                <p>Email : {admin.email}</p>
                <p>Phone : {admin.phone}</p>
                <p>Password : {admin.password}</p>
            </div>
        </div>
        
        <button onClick={handleSignOut} className="shadow-2xl px-4 font-bold border border-black rounded-xl h-10 focus:bg-rose-800">Sign out</button>
    </div>
  )
}

export default AdminProfile