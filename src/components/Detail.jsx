import { useParams } from "react-router-dom/cjs/react-router-dom";
import { useState, useEffect } from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
const Detail = () => {
  const { name } = useParams();
  const [country, setCountry] = useState({});
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetch(`https://restcountries.com/v3.1/name/${name}?fullText=true`)
      .then((res) => res.json())
      .then((response) => {
        setCountry({
          nativeName: response[0].name.nativeName
            ? Object.values(response[0].name.nativeName)[0].common
            : "-",
          capital: response[0].capital ? response[0].capital[0] : "-",
          region: response[0].region,
          subregion: response[0].subregion,
          population: response[0].population,
          languages: response[0].languages,
          currencies: [response[0].currencies],
          flag: response[0].flag,
          lat: response[0].latlng[0],
          lng: response[0].latlng[1],
        });
        setLoading(false);
      });
    // .catch((error) => {
    //   console.log("Error", error.stack);
    //   alert(error);
    // });
  }, []);

  console.table({ lat: country.lat, lng: country.lng });
  if (!loading)
    return (
      <section id="section-detail">
        <Table name={name} country={country} />
        <GoogleMap latlng={[country.lat, country.lng]} />
      </section>
    );
  else {
    return (
      <section>
        <h1>Loading...</h1>
      </section>
    );
  }
};

const Table = (props) => {
  const { name, country } = props;
  return (
    <table className="table-hover table">
      <thead>
        <tr>
          <th>
            {name} <span>{country.flag}</span>
          </th>
        </tr>
      </thead>
      <tbody>
        {Object.keys(country).map((key, index) => {
          if (index < 5) {
            return (
              <tr>
                <td>{key}</td>
                <td>{country[key]}</td>
              </tr>
            );
          }
        })}
        <tr>
          <td>currencies</td>
          <td>
            {country.currencies.map((coin) => {
              if (coin) {
                const c = Object.values(coin)[0];
                return (
                  <div className="coinItem badge" popover-top={c.name}>
                    {c.symbol}
                  </div>
                );
              }
            })}
          </td>
        </tr>
        <tr>
          <td>languages</td>
          <td>
            {Object.keys(country.languages).map((lang) => (
              <div
                className="coinItem badge"
                popover-top={country.languages[lang]}
              >
                {lang}
              </div>
            ))}
          </td>
        </tr>
      </tbody>
    </table>
  );
};

const GoogleMap = (props) => {
  return (
    <div className="card map">
      <MapContainer
        style={{ height: "100%", width: "100%" }}
        center={props.latlng}
        zoom={7}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={props.latlng}>
          <Popup>
            A pretty CSS3 popup. <br /> Easily customizable.
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default Detail;
