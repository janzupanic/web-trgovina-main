import { createSignal } from "solid-js";
import { useNavigate } from "@solidjs/router";
import { supabase } from "./supabase";

export default function SignIn() {

    const navigate = useNavigate();

    const [result, setResult] = createSignal(null);

    async function formSubmit(event) {
        event.preventDefault();
        const formData = new FormData(event.target);
        const email = formData.get("email");
        const password = formData.get("password");

        const result = await supabase.auth.signInWithPassword({
            email: email,
            password: password
        });

        console.log(result);
        if (result.error?.code === "invalid_credentials") {
            setResult("Pogrešna e-mail adresa i/ili zaporka.");
        } else if (result.error) {
            setResult("Dogodila se greška prilikom prijave.");
        } else {
            setResult("Prijava je uspjela.");
            navigate("/Home", { replace: true });
        }
    }

    return (
        <form onSubmit={formSubmit}>
            <div class="flex flex-col items-center justify-center min-h-screen bg-gray-800">
                <div class="p-8 bg-gray-900 rounded-2xl shadow-lg max-w-sm w-full">
                    <h2 class="text-3xl font-semibold text-center text-white mb-6">Prijava</h2>

                    <input
                        type="email"
                        placeholder="Email"
                        name="email"
                        class="border-2 border-gray-300 p-3 mb-4 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />

                    <input
                        type="password"
                        placeholder="Lozinka"
                        name="password"
                        class="border-2 border-gray-300 p-3 mb-6 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />

                    <p class="text-sm font-light text-gray-400">
                        Nemate račun? <a href="/signup" class="font-medium  hover:underline text-primary-500 text-white hover:text-info ">Registracija</a>
                    </p>

                    <div class="p-2 mt-5">
                        <input
                            type="submit"
                            value="Prijavi se"
                            class="bg-yellow-500 text-black p-3 w-full rounded-lg hover:bg-yellow-600 transition duration-300"
                        />
                    </div>
                </div>
            </div>
        </form>
    );
}