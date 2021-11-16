import React,{useState} from "react"

const AddPlace =(props)=>{
    const [placeToAdd, setPlaceToAdd] = useState({
        name:"",
        userId:props.loggedInUser.ID,
        lat:0,
        lon:0
    });
    
    const addPlace=()=>{
        props.setIsLoading(true)
        const url = process.env.PUBLIC_URL

        setTimeout(()=>
            fetch(`${url}/api/places`,{
                method:'POST',
                headers:{
                    Authorization: "bearer "+props.loggedInUser.Token,
                    'Content-Type':'application/json'
                },
                body:JSON.stringify(placeToAdd)
            })
            .then(response => {
                console.log("Success");
                props.setRerender(prev=>prev+1)
                props.setIsLoading(false)
                return response.json(); // returns another promise
            })
            .catch(err=>{
                alert("Something went bad");
                props.setIsLoading(false)
                console.log("Error: ",err)
            }),1000);
    }

    return (
        <div className='addPlace'>
            <label htmlFor="placeName">Place name</label>
            <input onInput={e=>setPlaceToAdd(
                prev => {
                    return {...prev, name:e.target.value}
                })
            } 
                type="text" name="placeName" id="placeName" />
            <br />
            <label htmlFor="latitude">Latitude</label>
            <input onInput={e=>setPlaceToAdd(
                prev => {
                    return {...prev, lat:Number(e.target.value)}
                })
            } 
                type="number" name="latitude" id="latitude" />
            <br />
            <label htmlFor="longitude">Longitude</label>
            <input onInput={e=>setPlaceToAdd(
                prev => {
                    return {...prev, lon:Number(e.target.value)}
                })
            } 
                type="number" name="longitude" id="longitude" />
            <br /><br />

            <button id="addPlaceBtn" onClick={addPlace}>
                Add Place
            </button>
        </div>
    );
}
export default AddPlace;