import { createSignal, onMount } from "solid-js";
import { supabase } from "./supabase";
import { useAuth } from "./AuthProvider";

export default function Recenzije({ proizvodId }) {
  const [prosjekOcjena, setProsjekOcjena] = createSignal(null);
  const [ocjena, setOcjena] = createSignal(0);
  const [loading, setLoading] = createSignal(false);
  const session = useAuth();

  // Funkcija za dohvaćanje prosječne ocjene
  async function loadProsjekOcjena() {
    const { data, error } = await supabase
      .from("Recenzije")
      .select("ocjena")
      .eq("proizvod_id", proizvodId);

    if (!error && data.length > 0) {
      const ukupanZbroj = data.reduce((sum, recenzija) => sum + recenzija.ocjena, 0);
      const prosjek = ukupanZbroj / data.length;
      setProsjekOcjena(prosjek.toFixed(1)); // Zaokruži na jednu decimalu
    } else {
      setProsjekOcjena(null); // Ako nema ocjena
    }
  }

  // Funkcija za dodavanje nove ocjene
  async function dodajOcjenu() {
    setLoading(true);

    // Provjeri je li korisnik prijavljen
    if (!session()) {
      alert("Morate biti prijavljeni da biste ostavili ocjenu.");
      setLoading(false);
      return;
    }

    // Validacija ocjene
    if (parseInt(ocjena()) < 1 || parseInt(ocjena()) > 5) {
      alert("Ocjena mora biti između 1 i 5.");
      setLoading(false);
      return;
    }

    const korisnikId = session().user?.id;

    // Provjeri je li korisnikId valjan
    if (!korisnikId) {
      alert("Neispravan ID korisnika.");
      setLoading(false);
      return;
    }

    console.log("Podaci za unos:", {
      proizvod_id: proizvodId,
      korisnik_id: korisnikId,
      ocjena: parseInt(ocjena()),
      created_at: new Date().toISOString(),
    });

    const { error } = await supabase.from("Recenzije").insert({
      proizvod_id: proizvodId,
      korisnik_id: korisnikId,
      ocjena: parseInt(ocjena()),
      created_at: new Date().toISOString(),
    });

    if (!error) {
      setOcjena(0); // Resetiraj unos
      await loadProsjekOcjena(); // Ažuriraj prosječnu ocjenu
    } else {
      console.error("Greška pri dodavanju ocjene:", error.message); // Ispis greške u konzoli
      alert("Greška pri dodavanju ocjene: " + error.message);
    }

    setLoading(false);
  }

  // Učitaj prosječnu ocjenu prilikom mountanja komponente
  onMount(() => {
    loadProsjekOcjena();
  });

  return (
    <div>
      <h3 class="font-bold text-lg">Prosječna ocjena:</h3>
      <p>{prosjekOcjena() ? `${prosjekOcjena()}/5` : "Još nema ocjena."}</p>

      <h4 class="font-semibold mt-4">Dodajte svoju ocjenu</h4>
      <div>
        <input
          type="number"
          min="1"
          max="5"
          value={ocjena()}
          onInput={(e) => setOcjena(e.target.value)}
          class="border p-2 rounded w-full"
        />
        <button
          onClick={dodajOcjenu}
          disabled={loading()}
          class="mt-2 bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition duration-300 w-full"
        >
          {loading() ? "Spremanje..." : "Dodaj ocjenu"}
        </button>
      </div>
    </div>
  );
}
