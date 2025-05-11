import { createSignal, onMount } from "solid-js";
import { pb } from "./pocketbase";
import { useAuth } from "./AuthProvider";

export default function Recenzije({ proizvodId }) {
  const [prosjekOcjena, setProsjekOcjena] = createSignal(null);
  const [ocjena, setOcjena] = createSignal(0);
  const [loading, setLoading] = createSignal(false);
  const { user } = useAuth();

  async function loadProsjekOcjena() {
    const result = await pb.collection('Recenzije').getFullList({
      filter: `proizvod_id="${proizvodId}"`
    });
    if (result.length > 0) {
      const ukupanZbroj = result.reduce((sum, recenzija) => sum + recenzija.ocjena, 0);
      const prosjek = ukupanZbroj / result.length;
      setProsjekOcjena(prosjek.toFixed(1));
    } else {
      setProsjekOcjena(null);
    }
  }

  async function dodajOcjenu() {
    setLoading(true);
    if (!user()) {
      alert("Morate biti prijavljeni da biste ostavili ocjenu.");
      setLoading(false);
      return;
    }
    if (parseInt(ocjena()) < 1 || parseInt(ocjena()) > 5) {
      alert("Ocjena mora biti između 1 i 5.");
      setLoading(false);
      return;
    }
    try {
      await pb.collection('Recenzije').create({
        proizvod_id: proizvodId,
        korisnik_id: user().id,
        ocjena: parseInt(ocjena()),
        created_at: new Date().toISOString(),
      });
      setOcjena(0);
      await loadProsjekOcjena();
    } catch (error) {
      alert("Greška pri dodavanju ocjene: " + error.message);
    }
    setLoading(false);
  }

  onMount(() => {
    loadProsjekOcjena();
  });

  return (
    <div>
      <div>
        {prosjekOcjena() ? `${prosjekOcjena()}/5` : "Još nema ocjena."}
      </div>
      <input
        type="number"
        min="1"
        max="5"
        value={ocjena()}
        onInput={e => setOcjena(e.target.value)}
        disabled={loading()}
      />
      <button onClick={dodajOcjenu} disabled={loading()}>Ocijeni</button>
    </div>
  );
}
