import { useParams } from "react-router-dom/cjs/react-router-dom";
import { useState, useEffect, useMemo } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Link } from "react-router-dom";
const Detail = () => {
  const { code } = useParams();
  const [country, setCountry] = useState({});
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetch(`https://restcountries.com/v2/alpha/${code}`)
      .then((res) => res.json())
      .then((response) => {
        setCountry({
          nativeName: response.nativeName || "-",
          capital: response.capital ? response.capital : "-",
          region: response.region,
          subregion: response.subregion,
          population: response.population,
          languages: response.languages,
          currencies: response.currencies,
          borders: response.borders,
          name: response.name,
          flag: response.flags.png,
          lat: response.latlng[0],
          lng: response.latlng[1],
        });
        setLoading(false);
      });
    // .catch((error) => {
    //   console.log("Error", error.stack);
    //   alert(error);
    // });
  }, [code]);

  if (!loading) {
    return <Home country={country}></Home>;
  } else {
    return (
      <section>
        <h1>Loading...</h1>
      </section>
    );
  }
};
const Home = ({ country }) => {
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    function handleResize() {
      setWidth(window.innerWidth);
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [width]);

  const table = (
    <div className="content" id="content1" style={{height:'100%', width:'100%'}}>
      <Table country={country} />
    </div>
  );
  const map = (
    <div className="content" id="content2" style={{height:'100%', width:'100%'}}>
      <Map latlng={[country.lat, country.lng]} />
    </div>
  );

  const taps = (
    <div className="row flex-spaces tabs" style={{
      width:'90vw',
      height:'100%',
      paddingTop:20
    }}>
      <input id="tab1" type="radio" name="tabs" checked />
      <label for="tab1">Details</label>

      <input id="tab2" type="radio" name="tabs" />
      <label for="tab2">Map</label>

      {table}
      {map}
    </div>
  );

  return (
    <section id="section-detail">
      {width > 428 ? (
        <>
          {table}
          {map}
        </>
      ) : (
        taps
      )}
    </section>
  );
};

const Table = (props) => {
  const { country } = props;
  return (
    <table className="table-hover table">
      <thead>
        <tr>
          <th>{country.name}</th>
          <th>
            {console.log(country.flag)}
            <div style={{ width: "50px", height: "38px" }}>
              <img
                style={{ opacity: 1, width: "auto", height: "100%" }}
                src={country.flag}
                alt="flag"
              />
            </div>
          </th>
        </tr>
      </thead>
      <tbody>
        {Object.keys(country).map((key, index) => {
          if (index < 5) {
            return (
              <tr key={key}>
                <td>{key}</td>
                <td>{country[key]}</td>
              </tr>
            );
          }
        })}
        <tr>
          <td>currencies</td>
          <td>
            {Object.keys(country.currencies).map((coin) => {
              if (coin) {
                const c = country.currencies[coin];
                return (
                  <div
                    key={coin}
                    className="coinItem badge"
                    popover-top={c.name}
                  >
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
                key={lang}
                className="coinItem badge"
                popover-top={country.languages[lang].name}
              >
                {country.languages[lang].iso639_2}
              </div>
            ))}
          </td>
        </tr>
        {country.borders && (
          <tr>
            <td>borders</td>
            <td>
              {Object.keys(country.borders).map((item) => (
                <Link to={`/fun-with-flags/${country.borders[item]}`}>
                  <button
                    style={{ cursor: "pointer" }}
                    key={item}
                    className="coinItem btn-small"
                  >
                    {country.borders[item]}
                  </button>
                </Link>
              ))}
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};
function ChangeView({ center }) {
  const map = useMap();
  map.setView(center, 7);
  return null;
}
const Map = ({ latlng }) => {
  console.log(latlng);
  const map = useMemo(
    () => (
      <MapContainer
        style={{ height: "100%", width: "100%" }}
        center={latlng}
        zoom={7}
        scrollWheelZoom={false}
      >
        <ChangeView center={latlng} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
      </MapContainer>
    ),
    [latlng]
  );
  return <div className="card map" >{map}</div>;
};

export default Detail;
