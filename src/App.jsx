import { useState } from 'react'
import './App.css'
import { FaSearchengin } from "react-icons/fa6";
import { FaWind } from "react-icons/fa";
import { WiHumidity } from "react-icons/wi";
import { FaCloudShowersHeavy } from "react-icons/fa";
import { CgLaptop } from 'react-icons/cg';

function App() {

   const [yourWeather, setYourWeather] = useState(true);
   const [cityName, setCityName] = useState("");
   const [loading, setLoading] = useState(false);
   const [weatherData, setWeatherData] = useState({
      temp: "",
      windSpeed: "",
      humidity: "",
      clouds: "",
      sign: "",
      name: "",
   })

   const wetherAPI = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKEY}`;

   const searchForCity = async () => {
      if (cityName.length) {
         setLoading(true);
         const res = await fetch(wetherAPI);
         const result = await res.json();

         weatherData.temp = result.main.temp;
         weatherData.humidity = result.main.humidity;
         weatherData.clouds = result.clouds.all;
         weatherData.sign = result.weather?.[0]?.description;
         weatherData.windSpeed = result?.wind?.speed
         weatherData.name = result?.name
         setLoading(false);
      }
   }

   const giveAccess = async () => {
      if (navigator.geolocation) {
         navigator.geolocation.getCurrentPosition(async (position) => {
            const latitude = position?.coords?.latitude;
            const longitude = position?.coords?.longitude;
            setLoading(true); // Set loading to true before the API call

            try {
               // Fetch weather data using the coordinates
               const res = await fetch(
                  `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKEY}`
               );
               const result = await res.json();

               // Destructure and assign data to weatherData
               weatherData.temp = result.main.temp;
               weatherData.humidity = result.main.humidity;
               weatherData.clouds = result.clouds.all;
               weatherData.sign = result.weather?.[0]?.description;
               weatherData.windSpeed = result?.wind?.speed;
               weatherData.name = result?.name;

               console.log(weatherData); // For debugging
            } catch (error) {
               console.error("Error fetching weather data:", error);
            } finally {
               setLoading(false); // Set loading to false after the API call
            }
         },
            (error) => {
               console.error("Geolocation error:", error);
               alert("Unable to retrieve location. Please enable location access.");
            });
      } else {
         alert("Geolocation is not supported by this browser.");
      }
   };


   const handleEnterClick = (e) => {
      if (e.key === 'Enter' && cityName.length) {
         searchForCity();
      }
   }

   return (
      <div className='w-screen h-screen bg-cyan-500 text-center'>
         <h1 className='w-full mb-10 pt-5 text-4xl text-white font-serif'>WEATHER_APP</h1>

         <div className='w-[40%] flex flex-col mx-auto gap-y-10'>

            <div className='flex items-center text-xl justify-between'>
               <div
                  onClick={() => setYourWeather(true)}
                  className={`${yourWeather ? 'bg-gray-300' : ''} p-2 rounded-lg cursor-pointer`}
               >
                  Your Weather</div>
               <div
                  onClick={() => setYourWeather(false)}
                  className={`${!yourWeather ? 'bg-gray-300' : ''} p-2 rounded-lg cursor-pointer`}
               >
                  Search Weather</div>
            </div>

            {/* search bar */}
            <div className='flex w-full items-center justify-center'>
               <input
                  className='rounded-md w-[80%] bg-stone-300 py-2 px-2 text-xl outline-none shadow-2xl'
                  placeholder='Search for City...'
                  onChange={(e) => setCityName(e.target.value)}
                  onKeyDown={handleEnterClick}
               />
               <FaSearchengin
                  fontSize={39}
                  className='rounded-full cursor-pointer ml-6 text-center hover:scale-125 transition-all duration-100'
                  onClick={searchForCity}
               />
            </div>
            {
               weatherData.temp !== "" ?
                  (
                     <div className='flex flex-col'>

                        <div className='text-3xl text-white'>
                           {weatherData.name}
                        </div>

                        <div className='mt-4 text-white text-xl'>{weatherData?.sign}</div>

                        <div className='font-bold text-4xl mt-6'>
                           {weatherData?.temp}
                        </div>


                        <div className='flex items-center justify-evenly mt-20 gap-x-2'>

                           <div className='flex flex-col items-center gap-y-1 text-2xl  w-full bg-slate-500 p-8 rounded-md'>
                              <div className='text-blue-700'><FaWind /></div>
                              <p className='font-bold text-white'>WINDSPEED</p>
                              <span className='text-lg text-white'>{weatherData?.windSpeed} m/s</span>
                           </div>

                           <div className='flex flex-col items-center gap-y-1 text-2xl w-full bg-slate-500 p-8 rounded-md'>
                              <div className='text-blue-700'><WiHumidity /></div>
                              <p className='font-bold text-white'>HUMIDITY</p>
                              <span className='text-lg text-white'>{weatherData?.humidity} m/s</span>
                           </div>

                           <div className='flex flex-col items-center gap-y-1 text-2xl w-full bg-slate-500 p-8 rounded-md'>
                              <div className='text-blue-700'><FaCloudShowersHeavy /></div>
                              <p className='font-bold text-white'>CLOUDS</p>
                              <span className='text-lg text-white'>{weatherData?.clouds} m/s</span>
                           </div>

                        </div>

                     </div>
                  ) :
                  (
                     yourWeather &&
                     <button
                        className='rounded-md bg-slate-500 w-fit mx-auto p-2 text-xl text-orange-500'
                        onClick={giveAccess}
                     >Give Your Access</button>
                  )
            }
         </div>

      </div >
   )
}

export default App
