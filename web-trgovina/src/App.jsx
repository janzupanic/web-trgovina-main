import { Router, Route } from "@solidjs/router";
import { AuthProvider } from "./AuthProvider";

import SignIn from "./SignIn";
import Home from "./Home";
import Proizvodi from "./Proizvodi"; 
import Register from "./Register";

function App() {

  return (
    <AuthProvider>
      <Router>
      <Route path="/" component={Register} />
      <Route path="/Home" component={Home} />    
        <Route path="/SignIn" component={SignIn} />
        <Route path="/proizvodi" component={Proizvodi} /> 
        
      </Router>
    </AuthProvider>

  );
}

export default App;
