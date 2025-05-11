import { createSignal, onMount } from "solid-js";
import { pb } from "./pocketbase";

export default function SignOut() {
  const [result, setResult] = createSignal(null);

  onMount(async () => {
    try {
      pb.authStore.clear();
      setResult("Odjava je uspjela.");
    } catch {
      setResult("Odjava nije uspjela!");
    }
  });

  return (
    <>
      {result()}
    </>
  );
}
