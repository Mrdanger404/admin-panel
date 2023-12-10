import { onValue, ref, remove, set } from "firebase/database";
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { database } from "../../DATABASE/Config";
import 'react-toastify/dist/ReactToastify.css'
import { ToastContainer, toast } from "react-toastify";


const Bin = () => {
    const {uid} = useParams();
    const [info, setInfo] = useState({
      name: '',
      subject: '',
      bin: '',
      date: '',
      country: '',
      comment: ''
    })
    const [bins, setBins] = useState([]);


    useEffect(() => {
        const dbRef = ref(database, "forum/bins")

        onValue(dbRef, (snapshot) => {
            const binArray = [];

            snapshot.forEach((items) => {
                binArray.push(items.val())
            })

            setBins(binArray)
        })
    },[])

    const path = Date.now()
      
    const handleSubmit = (e) => {
      e.preventDefault();
      toast.success(`${info.bin} is adding...`)
      set(ref(database, `forum/bins/${path}`), {
        uid,
        name: info.name,
        subject: info.subject,
        bin: info.bin,
        date: info.date,
        country: info.country,
        comment: info.comment,
        currentDate: Date(),
        path
      }).then(() => {
        toast.success(`${info.bin} Added successfully`)
      }).catch(() => {
        toast.error(`${info.bin} adding failed`)
      })
    }
    const handleDelete = (path,bin) => {
      remove(ref(database, `forum/bins/${path}`))
      toast.success(`${bin} has been deleted`)
    }
  return (
    <div className="h-screen">
      <ToastContainer />
      <div className="h-[350px] flex flex-col items-center justify-center">
          <form onSubmit={handleSubmit} className="flex flex-col">
            <input type="text" placeholder="Enter your name " required onChange={(e) => setInfo({...info, name: e.target.value})} className="border border-black px-3 py-1 my-1 rounded-2xl" />
            <input type="text" placeholder="Enter subject" required onChange={(e) => setInfo({...info, subject: e.target.value})} className="border border-black px-3 py-1 my-1 rounded-2xl" />
            <input type="text" placeholder="Enter valid bin" required onChange={(e) => setInfo({...info, bin: e.target.value})} className="border border-black px-3 py-1 my-1 rounded-2xl" />
            <input type="text" placeholder="Enter date " required onChange={(e) => setInfo({...info, date: e.target.value})} className="border border-black px-3 py-1 my-1 rounded-2xl" />
            <input type="text" placeholder="Enter country " required onChange={(e) => setInfo({...info, country: e.target.value})} className="border border-black px-3 py-1 my-1 rounded-2xl" />
            <input type="text" placeholder="Enter your comment " required onChange={(e) => setInfo({...info, comment: e.target.value})} className="border border-black px-3 py-1 my-1 rounded-2xl" />
            <button type="submit" className="bg-blue-700 py-2 m-2 rounded-2xl focus:bg-rose-800">Submit</button>
          </form>
      </div>
      <div className="flex flex-wrap">
        {bins.map((data, index) => {
          const {name, subject, bin, date, country, comment, currentDate, path} = data;
          return <div key={index} className="group m-4 p-4 border border-black w-full">
              <p>Posted by : {name}</p>
              <p>Subject : {subject}</p>
              <p>Bin : {bin}</p>
              <p>Date : {date}</p>
              <p>Country : {country}</p>
              <p className="break-words">Comment : {comment}</p>
              <p>Create at : {currentDate}</p>
              <button onClick={() => handleDelete(path, bin)} className="hidden group-hover:block bg-blue-700 p-2 m-2 hover:bg-red-700 font-bold text-white" >Delete</button>
          </div>
        })}
      </div>
    </div>
  )
}

export default Bin