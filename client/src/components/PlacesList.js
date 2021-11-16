import ListItem from "./ListItem";
import EditableListItem from "./EditableListItem";
import AddPlace from "./AddPlace";

const PlacesList = ({loggedInUser,places,itemClick,
        setIsLoading,setRerender}) => {
    
    const deletePlace=(id) => {
        setIsLoading(true)
        const url = process.env.PUBLIC_URL
                
        setTimeout(()=>
            fetch(`${url}/api/places/${id}`,{
                method:'DELETE',
                headers:{
                    Authorization: "bearer "+loggedInUser.Token,
                    'Content-Type':'application/json'
                }
            })
            .then(response => {
                console.log("Success");
                setRerender(prev=>prev+1)
                setIsLoading(false)
                return response.json(); // returns another promise
            })
            .catch(err=>{
                alert("Something went bad");
                setIsLoading(false)
                console.log("Error: ",err)
            }),1000);
    }
    return(
        <div id="placesResult">
            {loggedInUser && <AddPlace loggedInUser={loggedInUser}
                setIsLoading={setIsLoading}
                setRerender={setRerender}/>}
            
            {
                places.map(p=>{
                    if(loggedInUser && 
                        p.UserID ===loggedInUser.ID){
                        return <EditableListItem 
                        onItemClick={itemClick} 
                        deletePlace={deletePlace}
                        key={"place_"+p.ID} place={p}/>
                    }else{
                        return <ListItem 
                        onItemClick={itemClick} 
                        key={"place_"+p.ID} place={p}/>
                    }
                    
                }
                )
            }
        </div>
    )
}

export default PlacesList;