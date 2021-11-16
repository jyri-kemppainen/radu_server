const ListItem = ({place,onItemClick})=>{
    return(<div onClick={()=>onItemClick(place.ID)} 
                id={"place_"+place.ID}
                className="listItem">
        <div>
            <span className="userName">
                {place.ID}. {place.UserName}'s
            </span> {place.Name}
        </div>
        <div className="coordinates">
            {
                place.Latitude.toFixed(3)+", "+
                place.Longitude.toFixed(3)
            }
        </div>
    </div>)
}

export default ListItem