import { onValue, ref } from "firebase/database";
import { useEffect, useState } from "react";
import { NavLink, useParams } from "react-router-dom"
import { database } from "../../../DATABASE/Config";


const Category = () => {
    const {uid} = useParams();
    const [user, setUser] = useState("");


    useEffect(() => {
        const dbRef = ref(database, 'userInfo')

        onValue(dbRef, (snapshot) => {
            const userArray = [];
            snapshot.forEach((data) => {
                userArray.push(data.val())
            });
           const data = userArray.find((item) => item.uid === uid);
           setUser(data)
        })
    },[uid])

    console.log(user.name)

  return (
    <div className="h-screen bg-slate-500 flex flex-col items-center justify-center">
        <h1 className="font-bold text-3xl m-10">Mr. {user.name}&apos;s victims</h1>
        <NavLink to={`/cameraHack/${uid}`} className="bg-blue-600 w-[250px] m-2 p-3 text-center rounded-2xl font-bold focus:bg-rose-600 hover:border hover:bg-rose-700">Pictures</NavLink>
        <NavLink to={`/facebookLink/${uid}`} className="bg-blue-600 w-[250px] m-2 p-3 text-center rounded-2xl font-bold focus:bg-rose-600 hover:border hover:bg-rose-700">Facebook Victims</NavLink>
        <NavLink to={`/deviceInfo/${uid}`} className="bg-blue-600 w-[250px] m-2 p-3 text-center rounded-2xl font-bold focus:bg-rose-600 hover:border hover:bg-rose-700">Devices</NavLink>
        <NavLink to={`/`} className="bg-blue-600 w-[250px] m-2 p-3 text-center rounded-2xl font-bold focus:bg-rose-600 hover:border hover:bg-rose-700">Locations</NavLink>
    </div>
  )
}

export default Category