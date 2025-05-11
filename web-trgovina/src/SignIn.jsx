import { createSignal } from "solid-js";
import { useNavigate } from "@solidjs/router";
import { pb } from "./pocketbase";

export default function SignIn() {
  const navigate = useNavigate();
  const [result, setResult] = createSignal(null);
  const [isRegistering, setIsRegistering] = createSignal(false);

  async function formSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const email = formData.get("email");
    const password = formData.get("password");

    if (isRegistering()) {
      try {
        await pb.collection('users').create({
          email,
          password,
          passwordConfirm: password
        });
        setResult("Registracija je uspješna! Provjerite svoju email adresu.");
        navigate("/SignIn");
      } catch (error) {
        setResult(error.message);
      }
    } else {
      try {
        await pb.collection('users').authWithPassword(email, password);
        setResult("Prijava je uspjela.");
        navigate("/Home", { replace: true });
      } catch (error) {
        setResult("Pogrešna e-mail adresa i/ili zaporka.");
      }
    }
  }

  return (
    <form onSubmit={formSubmit}>
      <input name="email" type="email" placeholder="Email" required />
      <input name="password" type="password" placeholder="Lozinka" required />
      <button type="submit">{isRegistering() ? "Registracija" : "Prijava"}</button>
      <div>
        {isRegistering() ? "Već imate račun?" : "Nemate račun?"}{" "}
        <button type="button" onClick={() => setIsRegistering(!isRegistering())}>
          {isRegistering() ? "Prijava" : "Registracija"}
        </button>
      </div>
      <div>{result()}</div>
    </form>
  );
}
