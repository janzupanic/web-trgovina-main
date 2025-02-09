import { Router, Route } from "@solidjs/router";
import { AuthProvider } from "./AuthProvider";

import SignIn from "./SignIn";

function App() {

  return (
    <AuthProvider>
      <Router>
        <Route path="/" component={SignIn} />
      
      </Router>
    </AuthProvider>

  );
}

export default App;
