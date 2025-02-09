import { createSignal } from "solid-js";
import { useAuth } from "./AuthProvider";
import { useNavigate } from "@solidjs/router";
import SignOut from "./SignOut";

export default function Home() {
    const session = useAuth();
    const [showSignOut, setShowSignOut] = createSignal(false);
    const navigate = useNavigate();

    const handleSignOutClick = () => {
        setShowSignOut(true);
    };

    const redirectToHome = () => {
        navigate("/SignIn"); 
    };

    return (
        <div class="min-h-screen flex items-center justify-center bg-gray-100">
            <div class="border-5 border-black-300 bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md">
                <h1 class="text-4xl font-bold text-center text-gray-800 mb-6">Web Trgovina</h1>
                
                {session() ? (
                    <div class="text-center">
                        <p class="text-lg text-gray-600 mb-4">
                           
                        </p>
                        <div class="flex flex-col gap-4">
                            <a href="/proizvodi">
                                <button
                                  onClick={() => navigate("/proizvodi")} class="bg-blue-500 text-white p-3 rounded-xl w-full hover:bg-blue-600 transition duration-300">
                                    Pregledaj Proizvode
                                </button>
                            </a>
                            <a href="/narudžbe">
                                <button class="bg-purple-500 text-white p-3 rounded-xl w-full hover:bg-purple-600 transition duration-300">
                                    Moje Narudžbe
                                </button>
                            </a>
                            <a href="/košarica">
                                <button class="bg-yellow-500 text-white p-3 rounded-xl w-full hover:bg-yellow-600 transition duration-300">
                                    Košarica
                                </button>
                            </a>
                        </div>

                        <button
                            onClick={handleSignOutClick}
                            class="bg-red-500 text-white p-2 rounded-xl w-full hover:bg-red-600 transition duration-300 mt-6">
                            Odjavi se
                        </button>

                        {showSignOut() && <SignOut />}
                    </div>
                ) : (
                    <div class="text-center">
                    <p class="text-gray-500 mb-4">Niste prijavljeni! Prijavite se za pristup.</p>
                    <button
                        onClick={redirectToHome}
                        class="bg-green-500 text-white p-2 rounded-xl w-full hover:bg-green-700 transition duration-300">
                        Prijavite se
                    </button>
                </div>
            )}
        </div>
    </div>
);
}
