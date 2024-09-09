
import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents, Circle } from 'react-leaflet';
import './MapView.css';
import L, { Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { AddressInterface, AddressResultInterface } from '../../Database';
import { Host } from '../../Config';




const fillBlueOptions = { fillColor: 'blue' }
const defaultZoom = 13;

let lastPlace = 0


const GetCoordinates = ({ setPosition }: { setPosition: (position: [number, number]) => any }) => {
  const map = useMap();
  // const [p, setP] = useState([40, 0]);
  useEffect(() => {
    if (!map) return;
    const info = L.DomUtil.create('div', 'legend');

    const positon = L.Control.extend({
      options: {
        position: 'bottomleft'
      },

      onAdd: function () {
        // info.textContent = 'Click on map';
        return info;
      }
    })

    map.on('click', (e) => {
      const target = e.originalEvent.target;
      if ((target as HTMLDivElement).classList.contains('leaflet-container')) {
        const _p = [e.latlng.lat, e.latlng.lng]
        setPosition(_p as any);
        // setP(_p);
      }
    })

    map.addControl(new positon());

  }, [map])




  return null

}

function Home({ address }: { address: AddressInterface }) {

  const map = useMap()

  return <div className="home" onClick={() => {
    map.setZoom(17)
    map.flyTo([parseFloat(address.latitude), parseFloat(address.longitude)], map.getZoom())
  }}>
    <Marker position={[parseFloat(address.latitude), parseFloat(address.longitude)]} icon={new Icon({
      iconUrl: `${Host}/src/res/pet-boarding.png`,
      iconSize: [50, 58], // size of the icon
      iconAnchor: [20, 58], // changed marker icon position
      popupAnchor: [0, -60],
    })}>
      <Popup>Current Position</Popup>
    </Marker>
  </div>
}

function Focus({ setPosition }: { position?: [number, number], setPosition: (position: [number, number]) => any }) {
  const [center, setCenter] = useState<[number, number]>()
  const map = useMapEvents({
    click() {
      // map.locate()
    },
    locationfound(e) {
      setPosition([e.latlng.lat, e.latlng.lng])
      setCenter([e.latlng.lat, e.latlng.lng])
      map.setZoom(17)
      map.flyTo(e.latlng, map.getZoom())
    },
  })

  return <>
    <div className="focus" onClick={() => {
      map.locate();
    }}></div>
    {
      center && <Circle center={center} pathOptions={fillBlueOptions} radius={50}>
        <Popup>Current Position</Popup>
      </Circle>
    }
  </>

}

function UserMaker({ position, children }: { children: JSX.Element[], position: [number, number] }) {
  const map = useMap();

  useEffect(() => {
    map.flyTo({ lat: position[0], lng: position[1] })
  }, [position])

  return <Marker position={position}>{children}</Marker>
}

function MapView({ address, setAddress, canChange, home }: { home?: AddressInterface, address?: AddressInterface, setAddress?: (address: AddressInterface) => any, canChange?: boolean }) {
  const [position, setPosition] = useState([parseFloat(home?.latitude || '5.9856274'), parseFloat(home?.longitude || '-6.061912026961075')])

  const [search, setSearch] = useState(address?.address || '');
  const [openList, setOpenList] = useState(false)
  const [listAddress, setListAddress] = useState<AddressResultInterface[]>([])

  useEffect(() => {

    if (address) {
      setPosition([parseFloat(address?.latitude || '40'), parseFloat(address?.longitude || '0')])
      setSearch(address?.address || '');
    }
  }, [address])


  useEffect(() => {
    openList && fetch(`https://nominatim.openstreetmap.org/search?q=${search}&format=json&polygon=1&addressdetails=1`).then(async (response) => {
      try {
        return await response.json() as AddressResultInterface[]
      } catch (error) {
        return undefined
      }
    }).then((list) => {
      setListAddress(list || [])
    })
  }, [search]);
  return (
    <div className="map-view">
      <div className="search-zoon">
        {
          canChange && <label htmlFor="search-address">
            <div className="close" onClick={(e)=>{
              e.stopPropagation();
              e.preventDefault();
              setOpenList(false)
            }}></div>
            <input id='search-address' type="text" value={search} onChange={(e) => setSearch(e.currentTarget.value)} onFocus={() => setOpenList(true)} />
          </label>
        }

        {
          openList && <div className="list">
            {
              canChange && listAddress.map(a => (
                <div key={a.place_id} className="address" onClick={() => {
                  setOpenList(false);
                  setPosition([parseFloat(a.lat), parseFloat(a.lon)]);
                  setAddress?.({
                    address: a.display_name,
                    id: '',
                    latitude: a.lat,
                    longitude: a.lon
                  })
                }}>{a.display_name}</div>
              ))
            }
          </div>
        }
      </div>
      <MapContainer {...{ center: position as any, zoom: defaultZoom }}   >
        <UserMaker position={position as [number, number]}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy; <a href=&quot;https://www.openstreetmap.org/copyright&quot;>OpenStreetMap</a> contributors" />
          <Popup>
            <b>Kouassi Noga Wilfried Lemuel..</b><br />Lopie is here
          </Popup>
        </UserMaker>
        {
          home && <Home address={home} />
        }
        <GetCoordinates setPosition={async (p) => {

          if (canChange) {

            setPosition(p);

            try {
              const response = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${p[0]}&lon=${p[1]}&format=json`)
              const a = await response.json() as AddressResultInterface
              
              if (!a) return
              if (a.place_id !== lastPlace) {
                console.log(a);
                lastPlace = a.place_id;
                setSearch(a.display_name,)
                setAddress?.({
                  address: a.display_name,
                  id: '',
                  latitude: p[0] + '',
                  longitude: p[1] + ''
                })
              }
            } catch (error) {
              console.log(error);
            }
          }
        }}/>
        <Focus position={position as any} setPosition={async(p) => {
          
          if (canChange) {

            setPosition(p);

            try {
              const response = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${p[0]}&lon=${p[1]}&format=json`)
              const a = await response.json() as AddressResultInterface

              if (!a) return
              if (a.place_id !== lastPlace) {
                lastPlace = a.place_id;
                setSearch(a.display_name)
                setAddress?.({
                  address: a.display_name,
                  id: '',
                  latitude: p[0] + '',
                  longitude: p[1] + ''
                })
              }
            } catch (error) {
              console.log(error);
            }
          }
        }} />
      </MapContainer>
    </div>
  );
}

export default MapView;
