import { divIcon } from "leaflet";
import "leaflet/dist/leaflet.css"
import { useState } from "react";
import {MapContainer, Marker, Popup, TileLayer} from "react-leaflet"

const Map = ({places,center})=>{
    const [map,setMap]=useState(null)
    if(map){
        map.flyTo(center);
    }

    return <MapContainer
        id="map"
        zoom={12}
        center={center}
        whenCreated={setMap}
        >
            <TileLayer
                attribution= '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {
            places.map(p=>
                <Marker key={p.ID}
                    position={[p.Latitude,p.Longitude]}
                    icon={divIcon(
                        {
                            html:"<div class='markerIcon'>"+
                            p.ID
                            +"</div>"
                        }
                    )}
                >
                    <Popup>
                        <span className="userName">
                            {p.UserName}'s
                        </span> {p.Name}
                    </Popup>
                </Marker>
            )
            }
    </MapContainer>
}
export default Map;