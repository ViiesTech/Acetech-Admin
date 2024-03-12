import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
import { clearToken } from '../redux/authSlice';
import axios from 'axios'
import Loader from "react-js-loader";
import { FaSearch } from "react-icons/fa";
import { Images } from '../assets/Images/Appassets';

const containerStyle = {

  width: '80vw',
  height: '80vh',
};



const Home = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const token = useSelector(state => state.user.token);
  const [allCoordinates, setAllCordinates] = useState([]);

  const [state, setState] = useState(false)

 
  const [longitude, setLongitude] = useState()
  const [latitude, setLatitude] = useState()
  const inputRef = useRef();
  const [center, setCenter] = useState(null);
  const [zoom, setZoom] = useState(10);

  useEffect(() => {
    //updated
    // Fetch data or perform any necessary operations here
    getData();
    getUserLocation();
  }, []);

const getData = async () => {
    try {
      const response = await axios.get('https://appsdemo.pro/AceTech/user/all-vehicle', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      console.log('all coordinates', response.data.data);
      setAllCordinates(response.data.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        const userLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        setCenter(userLocation);
        setZoom(12); // Adjust zoom level as needed
      }, error => {
        console.error('Error getting user location:', error);
      });
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  };

  useEffect(() => {
    getData()
  }, [allCoordinates]);

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: "AIzaSyA61MyjhJtAzwgtuEd9AL_vDu6_1MWrpSE"
  });

  const [map, setMap] = React.useState(null);

  const onLoad = React.useCallback(function callback(map) {
    setMap(map);
  }, [state]);


  const onUnmount = React.useCallback(function callback(map) {
    setMap(null);
  }, []);

  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [token]);

  const handleLogout = () => {
    setLoading(true);
    setTimeout(() => {
      dispatch(clearToken());
      setLoading(false);
    }, 2000);
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    const inputValue = inputRef.current.value;

    let config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `https://appsdemo.pro/AceTech/user/truck-number/${inputValue}`,
      headers: {
        'Authorization': `Bearer ${token}`
      }
    };

  await axios.request(config)
      .then((response) => {
        console.log("longs", response?.data?.data[0]?.location?.coordinates)
        const truckData = response?.data?.data[0]?.location?.coordinates;
        if (truckData) {
          // const long = truckData.location.coordinates[0];
          // const lat = truckData.location.coordinates[1];
          // setLatitude(lat);
          // setLongitude(long);
          setCenter({ lat: truckData[1], lng: truckData[0] });
          setZoom(200)
          // console.log('Truck ID:', truckData._id);
          // console.log('Long:', long);
          // console.log('lat:', lat);
        } else {
          console.log('Truck data not found');
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };


  return (
    isLoaded ? (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', height: '100vh' }}>
        <div style={{ margin: 10, width: '80vw', position: 'absolute', top: 0 }} >
          <button onClick={handleLogout} style={{ backgroundColor: '#01138F', marginTop: 5, position: 'absolute', right: 0, cursor: 'pointer', color: '#FFFFFF', borderRadius: 30, border: 'none', height: 40, width: 180 }}>Logout</button>
        </div>

        {loading && (
          <div className='item' style={{ position: 'absolute', zIndex: 45, top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
            <Loader type="spinner-default" bgColor={'gray'} color={"gray"} size={80} />
          </div>
        )}
        <div style={{ position: 'absolute', zIndex: 24, top: '5.5rem' }}>
          <div style={{ display: 'flex', position: 'relative' }}>
            <form onSubmit={handleSearch}>
              <input ref={inputRef} className='searchInput' placeholder='Enter a truck number here' style={{ height: 40, width: '17rem', borderRadius: 25, padding: '5px 0px 5px 15px', border: '1px solid white' }} />
              <div onClick={handleSearch} style={{ position: 'absolute', alignSelf: 'center', right: 20, top: 17 }}>
                <FaSearch color='gray' size={18} />
              </div>
            </form>
          </div>
        </div>


        {console.log('center', center)}

        <GoogleMap
          mapContainerStyle={containerStyle}

          center={center}
          zoom={zoom || 10}
          onLoad={onLoad}
          onUnmount={onUnmount}
        >
          {allCoordinates?.map((area, index) => (
            area?.location && (
              <Marker
                key={index}
                icon={{
                  url: Images.truck2,
                  scaledSize: new window.google.maps.Size(80, 80)
                }}
                position={{
                  lat: area?.location?.coordinates[1],
                  lng: area?.location?.coordinates[0]
                }}
              />
            )
          ))}
        </GoogleMap>
      </div>
    ) : (<></>)
  );
};

export default React.memo(Home);