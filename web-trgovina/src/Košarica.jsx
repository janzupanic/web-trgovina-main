import { createSignal, onMount, For } from "solid-js";
import { supabase } from "./supabase";
import { useNavigate } from "@solidjs/router";

export default function Kosarica() {
  const [cartItems, setCartItems] = createSignal([]);
  const navigate = useNavigate();

  onMount(async () => {
    await loadCartItems();
  });

  async function loadCartItems() {
    const { data, error } = await supabase
          .from("Košarica")
          .select();
    if (error) {
      alert("Greška pri dohvaćanju košarice.");
      return;
    }
    setCartItems(data);
  }

  async function removeFromCart(id) {
    const { error } = await supabase.from("Košarica").delete().eq("id", id);
    if (error) {
      alert("Greška pri uklanjanju proizvoda.");
    } else {
      setCartItems(cartItems().filter(item => item.id !== id));
    }
  }

  return (
    <div class="p-5">
      <div class="bg-white p-5 shadow-2xl rounded-2xl mb-4">

        <button
        onClick={() => navigate("/home")}
          class="font-bold bg-linear-65 from-purple-500 to-pink-500 text-white p-3 rounded-xl hover:bg-linear-70 transition duration-300 ease-in-out hover:-translate-y-1 hover:scale-110 hover:bg-indigo-500">
          Povratak na naslovnicu
        </button>

        <button
          onClick={() => navigate("/proizvodi")}
          class="ml-2 px font-bold bg-linear-65 from-blue-500 to-blue-600 text-white p-3 rounded-xl hover:bg-linear-70 transition duration-300 ease-in-out hover:-translate-y-1 hover:scale-110 hover:bg-indigo-500">
          Proizvodi
        </button>
        
      </div>
      <h1 class="text-4xl font-bold mb-4">Košarica</h1>
      <For each={cartItems()} fallback={<div>Košarica je prazna ili se podaci ne dohvaćaju ispravno.</div>}>
        {(item) => (
          <div class="flex flex-col bg-gray-100 p-4 rounded mb-4 shadow">
            <div class="text-xl font-semibold">{item.naziv}</div>
            <div class="text-gray-600">Cijena: {item.cijena?.toFixed(2)} €</div>
            <div class="text-gray-700">Količina: {item.količina}</div>
            <button
              onClick={() => removeFromCart(item.id)}
              class="mt-2 bg-red-500 text-white p-2 rounded hover:bg-red-700 transition duration-300">
              Ukloni iz košarice
            </button>
          </div>
        )}
      </For>
    </div>
  );
}

