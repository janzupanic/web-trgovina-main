import { createSignal, onMount, For, Show } from "solid-js";
import { supabase } from "./supabase";
import { useNavigate } from "@solidjs/router";

export default function Products() {
  const [products, setProducts] = createSignal([]);
  const [filteredProducts, setFilteredProducts] = createSignal([]);
  const [searchQuery, setSearchQuery] = createSignal('');
  const [success, setSuccess] = createSignal(false);
  const [cartMessage, setCartMessage] = createSignal(false);
  const [kolicina, setKolicina] = createSignal(false);
  const [prosjekOcjena, setProsjekOcjena] = createSignal({});
  const [ocjena, setOcjena] = createSignal(0);
  const [loading, setLoading] = createSignal(false);
  const navigate = useNavigate();

  onMount(async () => {
    await loadProducts();
    await loadSveProsjeke(); 
  });

  async function loadProducts() {
    const { data, error } = await supabase.from("Proizvodi").select();
    if (error) {
      alert("Greška pri dohvaćanju proizvoda.");
      return;
    }
    setProducts(data);
    setFilteredProducts(data);
  }

  function handleSearch(event) {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = products().filter((product) =>
      product.Naziv.toLowerCase().includes(query)
    );
    setFilteredProducts(filtered);
  }

  async function loadSveProsjeke() {
    for (const product of products()) {
      await loadProsjekOcjena(product.id);
    }
  }

  async function loadProsjekOcjena(proizvodId) {
    const { data, error } = await supabase
      .from("Recenzije")
      .select("ocjena")
      .eq("proizvod_id", proizvodId);

    if (!error && data.length > 0) {
      const ukupanZbroj = data.reduce((sum, recenzija) => sum + recenzija.ocjena, 0);
      const prosjek = ukupanZbroj / data.length;
      setProsjekOcjena((prev) => ({ ...prev, [proizvodId]: prosjek.toFixed(1) }));
    } else {
      setProsjekOcjena((prev) => ({ ...prev, [proizvodId]: null }));
    }
  }

  async function dodajOcjenu(proizvodId) {
    setLoading(true);

    if (parseInt(ocjena()) < 1 || parseInt(ocjena()) > 5) {
      alert("Ocjena mora biti između 1 i 5.");
      setLoading(false);
      return;
    }

    const { error } = await supabase
    .from("Recenzije")
    .insert({
      proizvod_id: proizvodId,
      ocjena: parseInt(ocjena()),
      created_at: new Date().toISOString(),
    });

    if (!error) {
      setOcjena(0); 
      await loadProsjekOcjena(proizvodId); 
    } else {
      alert("Greška pri dodavanju ocjene.");
    }

    setLoading(false);
  }

  async function formSubmit(event) {
    setSuccess(false);
    event.preventDefault();
    const formData = new FormData(event.target);
    const naziv = formData.get("naziv");
    const opis = formData.get("opis");
    const cijena = parseFloat(formData.get("cijena"));

    const { error } = await supabase.from("Proizvodi").insert({
      Naziv: naziv,
      Opis: opis,
      Cijena: cijena,
    });

    if (error) {
      alert("Spremanje proizvoda nije uspjelo.");
    } else {
      setSuccess(true);
      event.target.reset();
      await loadProducts();
    }
  }

  async function addToCart(product) {
    const { data, error: fetchError } = await supabase
      .from("Košarica")
      .select("id, količina")
      .eq("proizvod_id", product.id);

  

    if (data.length > 0) {
      const existingProduct = data[0];

      const { error: updateError } = await supabase
        .from("Košarica")
        .update({
          količina: existingProduct.količina + 1,
        })
        .eq("id", existingProduct.id);

      if (updateError) {
        alert("Greška pri ažuriranju košarice.");
      } else {
        setKolicina("Količina proizvoda je povećana.");
      }
      
    } else {
      const { error: insertError } = await supabase
        .from("Košarica")
        .insert({
          proizvod_id: product.id,
          naziv: product.Naziv,
          cijena: product.Cijena,
          količina: 1,
        });

      if (insertError) {
        alert("Dodavanje proizvoda u košaricu nije uspjelo.");
    } else {
        setCartMessage("Proizvod je dodan u košaricu."); 
      }
    
    }
  }

  return (
    <div class="p-5">
      <div class="bg-white p-5 shadow-2xl rounded-2xl">
        <button
          onClick={() => navigate("/home")}
          class="font-bold bg-linear-65 from-purple-500 to-pink-500 text-white p-3 rounded-xl hover:bg-linear-70 transition duration-300 ease-in-out hover:-translate-y-1 hover:scale-110 hover:bg-indigo-500"
        >
          Povratak na naslovnicu
        </button>
      </div>

      <h1 class="text-center text-4xl font-bold mb-4">Proizvodi</h1>

      <Show when={success()}>
        <div class="bg-green-400 text-white p-3 rounded mb-4">
          Proizvod uspješno dodan!
        </div>
      </Show>


      <Show when={cartMessage()}>
        <div class="bg-yellow-500 text-white p-3 rounded mb-4">
          {cartMessage()}
        </div>
      </Show>

      <Show when={kolicina()}>
        <div class="bg-yellow-500 text-white p-3 rounded mb-4">
          {kolicina()}
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
          <input type="number" min="0" step="0.01" name="cijena" required class="border p-2 rounded" />
        </div>

        <div class="p-2 flex flex-col gap-1">
          <input
            type="submit"
            value="Dodaj Proizvod"
            class="bg-blue-500 text-white p-2 rounded cursor-pointer"
          />
        </div>
      </form>


      <div class="mb-4 flex flex-col gap-2">
        <input
          type="text"
          placeholder="Pretraži proizvode..."
          value={searchQuery()}
          onInput={handleSearch}
          class="border p-2 rounded"
        />
      </div>
      
      <For each={filteredProducts()} fallback={<div>Nema dostupnih proizvoda.</div>}>
        {(product) => (
          <div class="flex flex-col bg-gray-100 p-4 rounded mb-4 shadow">
            <div class="text-xl font-semibold">{product.Naziv}</div>
            <div class="text-gray-600">{product.Opis}</div>
            <div class="text-lg text-gray-700 mt-2">Cijena: {product.Cijena} €</div>
            
           
            <h3>Prosječna ocjena:</h3>
            <p>{prosjekOcjena()[product.id] ? `${prosjekOcjena()[product.id]}/5` : "Još nema ocjena."}</p>

            
            <h4>Dodajte svoju ocjenu</h4>
            <input
              type="number"
              min="1"
              max="5"
              value={ocjena()}
              onInput={(e) => setOcjena(e.target.value)}
              class="border p-2 rounded w-full"
            />
            <button
              onClick={() => dodajOcjenu(product.id)}
              disabled={loading()}
              class="mt-2 bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition duration-300 w-full"
            >
              {loading() ? "Spremanje..." : "Dodaj ocjenu"}
            </button>

            
            <button
              onClick={() => addToCart(product)}
              class="mt-2 bg-yellow-500 text-white p-2 rounded hover:bg-yellow-600 transition duration-300"
            >
              Dodaj u košaricu
            </button>
          </div>
        )}
      </For>
    </div>
  );
}