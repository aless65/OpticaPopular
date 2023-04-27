import React, { Component } from "react";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: []
    }

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    var jsonData = {
      "usua_NombreUsuario": "alan",
      "usua_Contrasena": "contra123",
      "usua_EsAdmin": false,
      "role_Id": 1,
      "empe_Id": 0,
      "usua_UsuCreacion": 1,
    }

    // Send data to the backend via POST
    fetch('http://opticapopular.somee.com/api/Usuarios/Insertar', {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(jsonData)
  })
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error(error));

  }

  componentDidMount() {
    const url = "http://opticapopular.somee.com/api/Usuarios/Listado";
    fetch(url)
      .then(response => response.json())
      .then(json => this.setState({ posts: json.data }))
  }

  handleSubmit = (event) => {
    event.preventDefault();
    alert("subió");
  }

  render() {
    const { posts } = this.state;

    return (
      <div className="container">
        <h1>La primera apli papá</h1>

        <button onClick={this.handleClick} style={{
          textAlign: 'center',
          width: '100px',
          border: '1px solid gray',
          borderRadius: '5px'
        }}>
          Send data to backend
        </button>
        <form action="submit" onSubmit={this.handleSubmit}>
          <input type="text" className="form-control" placeholder="Nombre de usuario" />
          <input type="password" className="form-control" placeholder="Contraseña" />
          <button className="btn btn-primary">Ajouter</button>
        </form>

        {posts.map((post) => (
          <div className="card" key={post.usua_Id}>
            ID: {post.usua_Id} TITULO: {post.usua_NombreUsuario}
            <div className="card-header">
              <div className="card-body">
                <img src="https://pbs.twimg.com/media/Dca9i1rUQAEUkTL?format=jpg&name=small" alt="deja de chingar porfa"></img>
              </div>
            </div>
          </div>

        ))}
      </div>
    )
  }
}

export default App;

