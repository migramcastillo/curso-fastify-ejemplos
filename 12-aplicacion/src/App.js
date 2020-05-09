import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Link,
  Switch,
  HashRouter,
} from "react-router-dom";
import Home from "./Home";
import CreateBook from "./CreateBook";
import EditBook from "./EditBook";

const App = () => {
  return (
    <HashRouter>
      <div>
        <header className="bg-gray-900 text-white">
          <nav className="container mx-auto py-4">
            <ul className="flex justify-between">
              <li className="text-lg font-semibold">
                <Link to="/">Mis Libros</Link>
              </li>
              <li>Fastify + React + Firebase</li>
            </ul>
          </nav>
        </header>

        <section className="container mx-auto my-4 p-4">
          <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/create-book" component={CreateBook} />
            <Route path="/edit-book/:key" component={EditBook} />
          </Switch>
        </section>
      </div>
    </HashRouter>
  );
};

export default App;
