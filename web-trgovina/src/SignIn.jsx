import { createSignal } from "solid-js";
import { useNavigate } from "@solidjs/router";
import { supabase } from "./supabase";

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
      
            const { user, error } = await supabase.auth.signUp({
                email: email,
                password: password,
            });

            if (error) {
                setResult(error.message);
            } else {
                setResult("Registracija je uspješna! Provjerite svoju email adresu.");
               
                navigate("/Home");
            }
        } else {
           
            const result = await supabase.auth.signInWithPassword({
                email: email,
                password: password
            });

            if (result.error?.code === "invalid_credentials") {
                setResult("Pogrešna e-mail adresa i/ili zaporka.");
            } else if (result.error) {
                setResult("Dogodila se greška prilikom prijave.");
            } else {
                setResult("Prijava je uspjela.");
                navigate("/Home", { replace: true });
            }
        }
    }

    return (
        <div class="flex flex-col items-center justify-center min-h-screen bg-gray-800">
            <div class="p-8 bg-gray-500 rounded-2xl shadow-lg max-w-sm w-full">
                <h2 class="text-3xl font-semibold text-center text-white mb-6">
                    {isRegistering() ? "Registracija" : "Prijava"}
                </h2>

                <form onSubmit={formSubmit}>
                    <input
                        type="email"
                        placeholder="Email"
                        name="email"
                        class="border-3 border-gray-300 p-3 mb-4 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />

                    <input
                        type="password"
                        placeholder="Lozinka"
                        name="password"
                        class="border-3 border-gray-300 p-3 mb-6 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />

                   
                    {result() && <div class="text-red-500 text-center mb-4">{result()}</div>}

                    <div class="p-2 mt-5">
                        <input
                            type="submit"
                            value={isRegistering() ? "Registriraj se" : "Prijavi se"}
                            class="bg-green-500 text-black p-3 w-full rounded-lg hover:bg-green-700 transition duration-300"
                        />
                    </div>
                </form>

             
                <div class="text-center mt-4">
                    <p class="text-white">
                        {isRegistering() ? "Već imate račun?" : "Nemate račun?"}{" "}
                        <button
                            onClick={() => setIsRegistering(!isRegistering())}
                            class="text-blue-500 hover:underline"
                        >
                            {isRegistering() ? "Prijavite se" : "Registrirajte se"}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
}
