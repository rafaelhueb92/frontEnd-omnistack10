import React, { useState, useEffect } from "react";
import "./global.css";
import "./App.css";
import "./Sidebar.css";
import "./Main.css";
import api from "./services/api.services";

function App() {
  const [devs, setDevs] = useState([]);
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [github_username, setGithub_username] = useState("");
  const [techs, setTechs] = useState("");

  async function handleAddDev(e) {
    e.preventDefault();

    const args = {
      github_username,
      techs,
      latitude,
      longitude
    };

    const response = await api.post("/devs", args);

    setGithub_username("");
    setTechs("");
    setDevs([...devs, response.data]);
  }

  useEffect(() => {
    async function loadDevs() {
      try {
        const response = await api.get("/devs");
        setDevs(response.data);
      } catch (ex) {
        console.error("err", ex);
      }
    }
    loadDevs();
  }, []);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      position => {
        const { latitude, longitude } = position.coords;
        setLatitude(latitude);
        setLongitude(longitude);
      },
      err => console.log("Location Error", err),
      {
        timeout: 30000
      }
    );
  }, []); /*
Executado toda vez que uma informação for alterada ou 
somente no carregamento do componente (callback, array do que será alterado)
vazio no array significa que só vai ser rodado uma vez
*/

  return (
    <div id="app">
      <aside>
        <strong className="">Cadastrar</strong>
        <form onSubmit={handleAddDev}>
          <div className="input-block">
            <label htmlFor="github_username">Usuário do Github</label>
            <input
              name="github_username"
              id="github_username"
              required
              value={github_username}
              onChange={e => setGithub_username(e.target.value)}
            />
          </div>

          <div className="input-block">
            <label htmlFor="techs">Tecnologias</label>
            <input
              name="techs"
              id="techs"
              required
              value={techs}
              onChange={e => setTechs(e.target.value)}
            />
          </div>

          <div className="input-group">
            <div className="input-block">
              <label htmlFor="latitude">Latitude</label>
              <input
                type="number"
                name="latitude"
                id="latitude"
                required
                value={latitude}
                onChange={e => setLatitude(e.target.value)}
              />
            </div>
            <div className="input-block">
              <label htmlFor="longitude">Longitude</label>
              <input
                type="number"
                name="longitude"
                id="longitude"
                required
                value={longitude}
                onChange={e => setLongitude(e.target.value)}
              />
            </div>
          </div>

          <button type="submit">Salvar</button>
        </form>
      </aside>
      <main>
        <ul>
          {devs.map(dev => (
            <li key={dev._id} className="dev-item">
              <header>
                <img src={dev.avatar_url} alt={dev.name} />
                <div className="user-info">
                  <strong>{dev.name}</strong>
                  <span>{dev.techs.join(", ")}</span>
                </div>
              </header>
              <p>{dev.bio}</p>
              <a href={`https://github.com/${dev.github_username}`}>
                Acessar Perfil no Github{" "}
              </a>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}

export default App;
