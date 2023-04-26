import React, { Component } from "react";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: []
    }
  }

  componentDidMount() {
    const url = "http://www.opticapopular.somee.com/api/Usuarios/Listado";
    fetch(url)
      .then(response => response.json())
      .then(json => this.setState({ posts: json.data}))
  }

  render() {
    const { posts } = this.state;
    return (
      <div className="container">
        <h1>La primera apli papá</h1>

        {posts.map((post) => (
          <div className="card" key={post.usua_Id}>
            ID: {post.usua_Id} TITULO: {post.usua_Contrasena}
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

