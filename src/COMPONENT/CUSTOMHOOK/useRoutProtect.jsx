import { onAuthStateChanged } from "firebase/auth"
import { useEffect, useState } from "react"
import { auth, database } from "../DATABASE/Config"
import { onValue, ref } from "firebase/database"
import { useNavigate } from "react-router-dom"


const useRoutProtect = () => {
    const [admins,setAdmins] = useState([]);

    useEffect(() => {
        const dbRef = ref(database, 'adminInfo');

        onValue(dbRef, (data) => {
            const adminArray = [];
            data.forEach((item) => {
                adminArray.push(item.val())
            });
            setAdmins(adminArray)
        })
    },[])

    

  return {admins}
}

export default useRoutProtect