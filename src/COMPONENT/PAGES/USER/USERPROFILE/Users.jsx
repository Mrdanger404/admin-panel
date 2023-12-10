import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom"
import { deleteUser, signOut } from "firebase/auth";
import { auth, database } from "../../../DATABASE/Config";
import { onValue, ref } from "firebase/database";


const Users = () => {
    const {uid} = useParams();
    const loginNavigate = useNavigate();
    const categoryNavigate = useNavigate();
    const [users, setUsers] = useState([])

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
    
    useEffect(() => {
        const dbRef = ref(database, 'userInfo');

        onValue(dbRef, (snapshot) => {
            const userArray = []
            snapshot.forEach((data) =>{
                userArray.push(data.val())
            });
            setUsers(userArray)
        })
    },[])

    const handleVictims = (uid) => {
      categoryNavigate(`/category/${uid}`)
    }


  return (
    <div className="flex flex-wrap">
        {users.map((data, index) => {
            const {email, name, password, phone, picture, uid} = data;
            return <div key={index} className="flex flex-col items-center justify-center  p-2 m-1">
                <div>
                    <img src={picture} alt="image not found" className="h-28" />
                </div>
                <div>
                    <p>Name : {name}</p>
                    <p>Email : {email}</p>
                    <p>Phone : {phone}</p>
                </div>
                <div className="flex flex-col p-2 w-full">
                    <button onClick={() => handleVictims(uid)} className="bg-blue-700 w-full m-1 text-center p-1 hover:bg-rose-700 rounded-md font-bold text-white">Victims</button>
                </div>
            </div>
        })}
    </div>
  )
}

export default Users