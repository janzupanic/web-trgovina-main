import { createContext, createSignal, useContext, onCleanup } from "solid-js";
import { pb } from "./pocketbase";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider(props) {
  const [user, setUser] = createSignal(pb.authStore.model);
  const [loading, setLoading] = createSignal(true);

  const unsubscribe = pb.authStore.onChange(() => {
    setUser(pb.authStore.model);
    setLoading(false);
  });

  onCleanup(() => unsubscribe());

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {props.children}
    </AuthContext.Provider>
  );
}
