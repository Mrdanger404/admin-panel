import { useEffect, useRef, useState } from "react"
import { auth, database, storage } from "../../DATABASE/Config";
import { onValue, ref, remove, set } from "firebase/database";
import { getDownloadURL, ref as stRef, uploadBytesResumable } from "firebase/storage";
import 'react-toastify/dist/ReactToastify.css'
import { ToastContainer, toast } from "react-toastify";


const Chat = () => {
  const [uid, setUid] = useState('');
  const [users, setUsers] = useState([]);
  const [user, setUser] = useState([]);
  const [image, setImage] = useState(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [progress, setProgress] = useState('');
  

  const chatContainer = useRef(null)

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      setUid(authUser.uid)
    })
    return () => unsubscribe()
  },[])

  useEffect(() => {
    const dbRef = ref(database, "userInfo");

    onValue(dbRef, (snapshot) => {
      const userArray = [];
      snapshot.forEach((data) => {
        userArray.push(data.val())
      })
      setUsers(userArray)
    })
    
  },[])

  useEffect(() => {
    const data = users.find((user) => user.uid == uid);

    if(data) {
      setUser(data.name)
    }

  },[users,uid]);

  useEffect(() => {
    const dbRef = ref(database, 'userMessage');

    onValue(dbRef, (snapshot) => {
      const messageArray = [];
      snapshot.forEach((data) => {
        messageArray.push(data.val())
      })
      setMessages(messageArray)

      chatContainer.current.scrollTop = chatContainer.current.scrollHeight
    })

    
  },[])

  useEffect(() => {
    chatContainer.current.scrollTop = chatContainer.current.scrollHeight
  },[])
  const path = Date.now()
  const sendMessage = async (e) => {
    e.preventDefault();

    const userImage = stRef(storage, `userImage/${path}`)

    try{
      if(image) {
        const uploadTask = uploadBytesResumable(userImage, image);

        uploadTask.on('state_changed',
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setProgress(progress)
          }
        )
        
        await uploadTask
        const mediaUrl = await getDownloadURL(uploadTask.snapshot.ref);
        
        if(mediaUrl) {
          await set(ref(database, `userMessage/${path}`), {
            message,
            user,
            mediaUrl,
            uid,
            date: path
          })
          setMessage('');
          setImage(null)
        }
      } else {
        await set(ref(database, `userMessage/${path}`), {
          message,
          user,
          uid,
          date: path
        })
        setMessage('')
      }
      
    } catch(error) {
      console.log(error)
    }
  }

  const handledelete = (date) => {
    remove(ref(database, `userMessage/${date}`));
    toast.success('Message is deleted')
  }

  const index = messages.length - 1;
  const item = index - 7;
  const items = index - item;
  console.log(items)
  return (
    <>
    <ToastContainer />
    <div className="h-screen mt-20 ">
      <div className="h-screen flex flex-col items-center justify-center">
        <div className="w-100 h-screen flex flex-col">
            <div className="h-screen overflow-auto  flex flex-col py-5 pb-5" ref={chatContainer} >
            {messages.map((item, index) => {
              return <div key={index} className="flex flex-col w-full box-border">
                {uid == item.uid ? (
                  <div className=" text-right group flex flex-col p-5  ">
                    {item.message && item.message !== '' && (
                    <div className="m-2">
                      <p className="w-56  bg-green-700 p-4 float-right break-words rounded-3xl">{item.message}</p>
                    </div>
                    )}
                    <div className="w-full">
                    {item.mediaUrl && <img src={item.mediaUrl} alt="image" className="h-40 w-40 float-right bg-green-700 p-5 m-2 rounded-3xl"/>}
                    </div>
                    
                    <div className="m-auto">
                      <button className="hidden group-hover:block bg-blue-700 px-5 py-1 rounded-3xl text-white font-bold focus:bg-red-500" onClick={() => handledelete(item.date)} >Delete</button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col p-5">
                    <div className="m-2">
                      <p className="w-56 bg-orange-600 p-4 float-left break-words rounded-3xl">{item.user} : {item.message}</p>
                    </div>
                    <div className="w-full">
                      {item.mediaUrl && <img src={item.mediaUrl} alt="image" className="h-40 w-40 float-left bg-orange-600 p-5 m-2 rounded-3xl"/>}
                    </div>
                  </div>
                )}
              </div>
              
            })}
            </div>
          <div className="w-full flex flex-col items-center m-5" >
            
            <div className="w-full">
              {progress && progress<100 && (
                <div className="h-5 bg-blue-700 my-2 rounded-xl z-10 p-2" style={{width: `${progress}%`}}></div>
              ) }
            </div>
            <form onSubmit={sendMessage} className="flex" >
            <input type="text" placeholder="Enter your text" value={message} onChange={(e) => setMessage(e.target.value)} className="pl-3 rounded-xl mx-2 border border-black" />
            <input type="file"  onChange={(e) => setImage(e.target.files[0])} className="w-32 sm:w-min " />
            <button className="bg-red-500 px-3 rounded-xl font-bold">Send</button>
            </form>
          </div>
        </div>
      </div>
    </div>
    </>
  )
}

export default Chat