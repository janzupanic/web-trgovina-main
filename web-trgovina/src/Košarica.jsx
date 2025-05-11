import { createSignal, onMount, For } from "solid-js";
import { pb } from "./pocketbase";

export default function Košarica() {
  const [cartItems, setCartItems] = createSignal([]);

  onMount(async () => {
    await loadCartItems();
  });

  async function loadCartItems() {
    const items = await pb.collection("Košarica").getFullList();
    setCartItems(items);
  }

  async function removeFromCart(id) {
    await pb.collection("Košarica").delete(id);
    setCartItems(cartItems().filter(item => item.id !== id));
  }

  return (
    <div>
      <h2>Košarica</h2>
      <For each={cartItems()}>
        {(item) => (
          <div>
            <span>{item.naziv} ({item.količina} kom) - {item.cijena} kn</span>
            <button onClick={() => removeFromCart(item.id)}>Ukloni</button>
          </div>
        )}
      </For>
    </div>
  );
}
