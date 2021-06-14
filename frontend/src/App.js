import Header from "./components/layouts/Header";
import Footer from "./components/layouts/Footer";
import Home from "./components/Home";
import { BrowserRouter as Router, Route } from "react-router-dom";
import ProductDetails from "./components/product/ProductDetails";
import Login from "./components/user/Login";
import Register from "./components/user/Register";

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <div className="container container-fluid">
          <Route path="/" component = {Home} exact />
          <Route path="/search/:keyword" component = {Home}  />
          <Route path="/product/:id" component = {ProductDetails} exact />
          <Route path="/login" component = {Login} />
          <Route path="/register" component = {Register} />
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
