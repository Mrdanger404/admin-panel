import { onValue, ref, remove, set } from "firebase/database";
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom";
import { database } from "../../DATABASE/Config";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css'


const Notice = () => {
    const [notice, setNotice] = useState('');
    const [incomingNotice, setIncomingNotice] = useState('')
    const {uid} = useParams();

    useEffect(() => {
        const dbRef = ref(database, 'notice');
        onValue(dbRef, (snapshot) => {
            setIncomingNotice(snapshot.val())
        })
    },[])

    const handleNotice = (e) => {
        e.preventDefault();

        const dbRef = ref(database, 'notice/');
        set(dbRef,{
            notice: notice,
            uid: uid
        }).then(() => {
            setNotice('')
            toast.success('New notice posted')
        })
    }

    const handleDelete = (e) => {
        e.preventDefault();
        remove(ref(database, 'notice'))
    }
  return (
    <div className="h-screen">
        <ToastContainer />
        <div className="flex justify-center">
            <form onSubmit={handleNotice} className="flex flex-col items-center border border-black p-10 m-5 rounded-3xl shadow-lg shadow-black" >
                <input type="text" value={notice} onChange={(e) => setNotice(e.target.value)} placeholder="write notice for user ..." className="border border-black p-2 m-5 rounded-xl font-lobster" />
                <button type="submit" className="border border-black w-min px-5 py-1 rounded-3xl font-bold hover:bg-green-600 focus:bg-blue-600">Submit</button>
            </form>
        </div>
        <div className="flex flex-col items-center m-10">
            <h1 className="font-bold text-lg">Last notice</h1>
            {incomingNotice && <div className="flex flex-col group items-center justify-center w-full">
                <p className="font-lobster text-2xl text-red-700 break-words m-2 w-full text-center">{incomingNotice.notice}</p>
                <button onClick={handleDelete} className="border border-black px-3 m-2 rounded-3xl w-40 bg-blue-600 hover:bg-rose-700 focus:bg-red-500 group-hover:block hidden">Delete notice</button>
            </div>}
            
        </div>
    </div>
  )
}

export default Notice