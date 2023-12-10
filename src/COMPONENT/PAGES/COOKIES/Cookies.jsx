import { onValue, ref, remove, set } from "firebase/database";
import {getDownloadURL, ref as stRef, uploadBytesResumable} from "firebase/storage"
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom"
import { auth, database, storage } from "../../DATABASE/Config";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css'

const Cookies = () => {
    const {uid} = useParams()
    const loginNavigate = useNavigate();
    const [cookies, setCookies] = useState([]);
    const [File, setFile] = useState({
      name: '',
      title: '',
      comment: '',
      file: null
    })



    useEffect(() => {
        const dbRef = ref(database, "forum/cookies");

        onValue(dbRef, (snapshot) => {
            const cookieArray = [];
            snapshot.forEach((item) => {
                cookieArray.push(item.val())
            });
            setCookies(cookieArray)
        })
    },[])

    useEffect(() => {
      const unsubscribe = auth.onAuthStateChanged((authUser) => {
        if(!authUser){
          loginNavigate('/')
        }
      })
      return () => unsubscribe()
    },[loginNavigate])

    const path = Date.now()

    const handleSubmit = async (e) => {
      e.preventDefault();

      const cookieFile = stRef(storage, `cookies/${path}`);

      try{
        if(File.file) {
          const uploadTask = uploadBytesResumable(cookieFile, File.file);

          await uploadTask
          const fileUrl = await getDownloadURL(uploadTask.snapshot.ref);

          if(fileUrl) {
            await set(ref(database, `forum/cookies/${path}`),{
              name: File.name,
              title: File.title,
              comment: File.comment,
              fileUrl,
              uid,
              path
            })
            await toast.success('Cookies is updated')
          }
        }
      } catch (error) {
        console.log(error)
      }
    }

    const handleDelete = (path) => {
      remove(ref(database, `forum/cookies/${path}`)).then(() => {
        toast.success(`${File.title} is deleted successful`)
      }).catch((error) => {
        toast.error(error)
      })
    }
  return (
    <div className="h-screen">
      <ToastContainer />
      <div>
        <div className="flex h-[300px] border items-center justify-center">
          <form onSubmit={handleSubmit} className="flex flex-col">
            <input type="text" onChange={(e) => setFile({...File, name: e.target.value})} placeholder="Enter your name " className="rounded-2xl h-10 px-2 m-2 border border-black" />
            <input type="text" required onChange={(e) => setFile({...File, title: e.target.value})} placeholder="Enter cookie file title " className="rounded-2xl h-10 px-2 m-2 border border-black" />
            <input type="text" onChange={(e) => setFile({...File, comment: e.target.value})} placeholder="Type your comment " className="rounded-2xl h-10 px-2 m-2 border border-black" />
            <input type="file" required onChange={(e) => setFile({...File, file: e.target.files[0]})} className="h-10 px-2 m-2" />
            <button type="submit" className="bg-blue-700 py-2 rounded-2xl focus:bg-rose-800">Submit</button>
          </form>
        </div>
        <div className="flex flex-wrap">
          {cookies.map((data, index) => {
            const {name, title, comment, fileUrl, path} = data;
            return <div key={index} className="border p-4 m-2 group flex flex-col w-full h-min">
              <p className="my-2">uploader : <span className="font-bold">{name}</span></p>
              <p className="my-2 break-words">title : {title}</p>
              <p className="my-2 break-words">Comment : <span className="font-semibold text-red-600">{comment}</span></p>
              <a href={fileUrl} className="bg-blue-700 my-2 px-2 py-1  hover:bg-orange-400 focus:bg-red-500 text-white mx-2 rounded-3xl text-center">Download file</a>
              <button onClick={() => handleDelete(path)} className="bg-red-500 py-1 px-2 m-1 rounded-3xl font-bold hover:bg-red-800 hover:text-white hidden group-hover:block">Delete</button>
            </div>
          })}
        </div>
      </div>
    </div>
  )
}

export default Cookies