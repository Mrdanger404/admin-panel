import { onValue, ref, remove } from "firebase/database";
import { useEffect, useState } from "react"
import { database } from "../../DATABASE/Config";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css'


const Reports = () => {
    const [reports, setReports] = useState([]);

    useEffect(() => {
        const dbRef = ref(database, 'reports');

        onValue(dbRef, (snapshot) => {
            const dataArray = [];
            snapshot.forEach((data) =>{
                dataArray.push(data.val())
            });
            setReports(dataArray)
        })
    },[])
    const handleDelete = (path) => {
        remove(ref(database, `reports/${path}`)).then(()=> {
            toast.success('Report delete successful')
        })
    }
  return (
    <>
    <ToastContainer />
    <div className="flex flex-wrap">
        {reports.map((data, index) => (
            <div key={index} className="m-2 p-3 group">
                <h1 className="font-bold">{data.email}</h1>
                <h2 className="font-semibold">{data.subject}</h2>
                <p className="break-words text-red-600">{data.reports}</p>
                <p>{data.date}</p>
                <button onClick={() => handleDelete(data.path)} className="font-bold bg-blue-600 px-2 my-2 rounded-3xl text-white">Delete</button>
            </div>
        ))}
    </div>
    </>
  )
}

export default Reports