import React, {useState, useEffect} from "react";
import PlacesList from "./components/PlacesList";
import Loading from "./components/Loading";
import Map from "./components/Map";
import Header from "./components/Header";
import Login from "./components/Login";

const App = () => {
    const [isLoading,setIsLoading]=useState(false);
    const [places, setPlaces] = useState([]);
    const [center, setCenter] = useState([62.6,29.77])
    const [user,setUser]=useState(null)
    const [auth,setAuth]=useState(false)
    const url = process.env.PUBLIC_URL

    //will be incremented by 1, when it changes it retriggers getAllPlaces
    const [rerender,setRerender]=useState(0);

    const getAllPlaces = () => {
        setIsLoading(true);
        
        setTimeout(()=>
            fetch(`${url}/api/places`)
            .then((response) => {
                return response.json(); // returns another promise
            })
            .then((placesData) => {
                setPlaces(placesData);
                setIsLoading(false);
            })
            .catch((err) => {
                alert("Something went bad");
                console.log("Error: ", err);
                setIsLoading(false);
            }),1000); // artificially slowing down by 1 second
    };

    const doAutoLogin = () => {
        const userInfo = localStorage.getItem("user");
        if(userInfo!=null){
            setUser(JSON.parse(userInfo))
        }
    }

    useEffect(()=>getAllPlaces(),[rerender]);
    useEffect(doAutoLogin,[]);

    const listItemClick=(id)=>{
        const place = places.find(p=>p.ID===id);
        setCenter([place.Latitude,place.Longitude]);
    }

    const doLogout=()=>{
        alert("You will be logged out");
        localStorage.removeItem("user")
        setUser(null);
    }

    // should open window
    const openLogin=()=>{
        setAuth("Login");
    }

    const closeLogin=()=>{
        setAuth(false);
    }

    return (
        <>
            <Header user={user} doLogout={doLogout}
                openLogin={openLogin}/>
            {isLoading && <Loading/>}
            <div id="content">
                <PlacesList itemClick={listItemClick} 
                    loggedInUser={user} places={places}
                    setIsLoading={setIsLoading}
                    setRerender={setRerender}/>
                <Map center={center} places={places}/>
            </div>
            
            {auth && <Login 
                setIsLoading={setIsLoading}
                closeLogin={closeLogin}
                setUser={setUser}/>}
        </>
    );
};

export default App;
