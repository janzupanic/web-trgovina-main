import { Router, Route } from "@solidjs/router";
import { AuthProvider } from "./AuthProvider";

import SignIn from "./SignIn";
import Home from "./Home";
import Register from "./Register";
import Proizvodi from "./Proizvodi"; 
import Košarica from "./Košarica";

function App() {

  return (
    <AuthProvider>
      <Router>
      <Route path="/" component={Register} />
      <Route path="/Home" component={Home} />    
        <Route path="/SignIn" component={SignIn} />
        <Route path="/Proizvodi" component={Proizvodi} /> 
        <Route path="/Košarica" component={Košarica} /> 
      </Router>
    </AuthProvider>

  );
}

export default App;
