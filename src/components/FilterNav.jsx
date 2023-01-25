const FilterNav = (props) => {
  const { name, setName, region, setRegion } = props.info;
  return (
    <nav className="form-group">
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        type={"text"}
        placeholder="Search for a country..."
      />
      <DropDown info={{ region, setRegion }} />
    </nav>
  );
};

const DropDown = (props) => {
  const { region, setRegion } = props.info;
  const regions = ["Africa", "Americas", "Asia", "Europe", "Oceania"];
  return (<>
    <select
      onChange={(e) => {
        console.log(e);
        setRegion(e.target.value);
      }}
    >
      <option value="" disabled hidden selected>
        Filter by Region
      </option>
      {regions.map((r) => (
        <option value={r}>{r}</option>
      ))}
    </select>
    </>)
  ;
};

export default FilterNav;
