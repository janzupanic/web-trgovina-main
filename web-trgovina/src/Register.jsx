import { createSignal } from "solid-js";
import { useNavigate } from "@solidjs/router";
import { pb } from "./pocketbase";

export default function Register() {
  const navigate = useNavigate();
  const [result, setResult] = createSignal(null);

  async function formSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const email = formData.get("email");
    const password = formData.get("password");
    try {
      await pb.collection('users').create({
        email,
        password,
        passwordConfirm: password
      });
      setResult("Uspješno ste registrirani.");
      navigate("/SignIn", { replace: true });
    } catch (error) {
      setResult("Dogodila se greška prilikom registracije.");
    }
  }

  return (
    <form onSubmit={formSubmit}>
      <input name="email" type="email" placeholder="Email" required />
      <input name="password" type="password" placeholder="Lozinka" required />
      <button type="submit">Registracija</button>
      <div>{result()}</div>
    </form>
  );
}
