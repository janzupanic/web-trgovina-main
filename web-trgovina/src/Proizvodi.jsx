import { createSignal, onMount, For, Show } from "solid-js";
import { supabase } from "./supabase";
import { useNavigate } from "@solidjs/router";

export default function Products() {
  const [products, setProducts] = createSignal([]);
  const [success, setSuccess] = createSignal(false);
  const navigate = useNavigate();

  onMount(async () => {
      await loadProducts();
  });

  async function loadProducts() {
      const { data, error } = await supabase
          .from("Proizvodi")
          .select();
      if (error) {
          alert("Greška pri dohvaćanju proizvoda.");
          return;
      }
      setProducts(data);
  }

  async function formSubmit(event) {
      setSuccess(false);
      event.preventDefault();
      const formData = new FormData(event.target);
      const naziv = formData.get("naziv");
      const opis = formData.get("opis");
      const cijena = parseFloat(formData.get("cijena"));

      const { error } = await supabase
          .from("Proizvodi")
          .insert({
              Naziv: naziv,
              Opis: opis,
              Cijena: cijena
          });

      if (error) {
          alert("Spremanje proizvoda nije uspjelo.");
      } else {
          setSuccess(true);
          event.target.reset();
          await loadProducts();
      }
  }

  return (
    <div class="p-5">
        
        <div class=" bg-white p-5 shadow-2xl ">
            <button
              onClick={() => navigate("/home")}
              class="bg-blue-500 text-white p-3 rounded-xl hover:bg-blue-600 transition duration-300"
            >
                Povratak na naslovnicu
            </button>
        </div>

        <h1 class="text-4xl font-bold mb-4">Proizvodi</h1>

        <Show when={success()}>
            <div class="bg-green-400 text-white p-2 rounded mb-4">
                Proizvod uspješno dodan!
            </div>
        </Show>

        <form onSubmit={formSubmit} class="mb-6 bg-gray-100 p-4 rounded shadow">
            <div class="p-2 flex flex-col gap-1">
                <label>Naziv:</label>
                <input type="text" name="naziv" required class="border p-2 rounded" />
            </div>

            <div class="p-2 flex flex-col gap-1">
                <label>Opis:</label>
                <textarea name="opis" class="border p-2 rounded"></textarea>
            </div>

            <div class="p-2 flex flex-col gap-1">
                <label>Cijena:</label>
                <input type="number" step="0.01" name="cijena" required class="border p-2 rounded" />
            </div>

            <div class="p-2 flex flex-col gap-1">
                <input type="submit" value="Dodaj Proizvod" class="bg-blue-500 text-white p-2 rounded cursor-pointer" />
            </div>
        </form>

        <For each={products()} fallback={<div>Nema dostupnih proizvoda.</div>}>
            {(product) => (
                <div class="flex flex-col bg-gray-100 p-4 rounded mb-4 shadow">
                    <div class="text-xl font-semibold">{product.Naziv}</div>
                    <div class="text-gray-600">{product.Opis}</div>
                    <div class="text-lg text-gray-700 mt-2">Cijena: {product.Cijena} €</div>
                </div>
            )}
        </For>
    </div>
  );
}
