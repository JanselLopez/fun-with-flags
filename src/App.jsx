import "./App.css";
import Switcher from "./components/Switcher";
import Content from "./components/Content";
import Detail from "./components/Detail";
import { useState } from "react";
import { Switch, Route, BrowserRouter as Router } from "react-router-dom";

const App = () => {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  const toLight = () => {
    setTheme("light");
    localStorage.setItem("theme", "light");
  };
  const toDark = () => {
    setTheme("dark");
    localStorage.setItem("theme", "dark");
  };

  document.querySelector("body").className = theme;

  return (
    <>
      <header className="fixed split-nav">
        <h1>
          <a href="/">Fun with Flags</a>
        </h1>
        <Switcher
          value={theme}
          onChange={() => (theme == "light" ? toDark : toLight)}
        />
      </header>

      <Router>
        <Switch>
          <Route exact path="/">
            <Content />
          </Route>
          <Route path="/flag/:name">
            <Detail></Detail>
          </Route>
        </Switch>
      </Router>
    </>
  );
};

export default App;
