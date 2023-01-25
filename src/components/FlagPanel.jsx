import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const lazyLoad = (target) => {
  const io = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target;
        const src = img.getAttribute("lazy");
        img.setAttribute("src", src);
        img.classList.add("fade");
        observer.disconnect();
      }
    });
  });
  io.observe(target);
};

const FlagPanel = (props) => {
  const [countries, setCountries] = useState([]);
  const [currents, setCurrents] = useState([]);
  const { name, region } = props;
  useEffect(() => {
    getFlagsFromApi(setCountries, name);
  }, [name]);
  useEffect(() => {
    updateResults(setCurrents, countries, region);
  }, [name, region, countries]);
  const arts = getFlags(currents);
  useEffect(()=>{
    document.querySelectorAll("img").forEach(lazyLoad);

  },[arts])
  return <section>{arts}</section>;
};

const FlagItem = ({ name, population, region, capital, flag }, index) => {
  const args = [population, region];
  const image = <img className="image-top" lazy={flag} alt="flag-image" />;

  return (
    <article
      style={{
        animationDelay: `${100 * index}ms`,
        border: "none",
      }}
      className="card paper-switch-tile-card border"
      key={`flag-${index}`}
    >
      <Link to={`/flag/${name}`}>
        {image}

        <div className="card-body">
          <h4 className="card-title">{name}</h4>
          <h5 class="card-subtitle" style={{ color: "#8849FD" }}>
            {capital}
          </h5>
          <div className="card-info">
            {["Population", "Region"].map((attr, index) => (
              <p className="card-text">
                <strong>{attr}: </strong>
                <span>{args[index]}</span>
              </p>
            ))}
          </div>
        </div>
      </Link>
    </article>
  );
};

function getFlags(countries) {
  return countries.map((element, index) => FlagItem(element, index));
}

const getFlagsFromApi = async (setCountries, name) => {
  const url = name
    ? `https://restcountries.com/v3.1/name/${name}`
    : "https://restcountries.com/v3.1/all";
  fetch(url)
    .then((res) => res.json())
    .then((response) => {
      const data = response.map(toObject);
      setCountries(data);
    });
};

function updateResults(setCurrents, countries, region) {
  const fun = region ? (e) => e.region == region : () => true;
  setCurrents(countries.filter(fun));
}

const toObject = (e) => ({
  name: e.name.common,
  population: e.population,
  region: e.region,
  capital: e.capital,
  flag: e.flags.svg,
});

export default FlagPanel;
