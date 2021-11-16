const EditableListItem = ({place,onItemClick,deletePlace})=>{
    // converting CSS to JS style
    const userNameStyle={
        fontWeight: "bold"
    }
    const coordinatesStyle={
        fontFamily: "'Courier New', Courier, monospace"
    }
    const listItemStyle={
        fontFamily: "Arial, Helvetica, sans-serif",
        padding: "5px",
        backgroundColor: "rgb(167, 35, 31)",
        margin: "5px",
        borderRadius: "5px",
        color: "white",
        cursor: "pointer"
    }
  
    return(<div onClick={()=>onItemClick(place.ID)} 
                id={"place_"+place.ID}
                style={listItemStyle}>
        <div>
            <span style={userNameStyle}>
                {place.ID}. {place.UserName}'s
            </span> {place.Name}
        </div>
        <div style={coordinatesStyle}>
            {
                place.Latitude.toFixed(3)+", "+
                place.Longitude.toFixed(3)
            }
        </div>
        <button onClick={()=>deletePlace(place.ID)}>Delete</button>
    </div>)
}

export default EditableListItem