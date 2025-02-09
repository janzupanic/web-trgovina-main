import { createSignal, onMount, Show } from "solid-js";
import { supabase } from "./supabase";

export default function SignOut() {
    const [result, setResult] = createSignal(null);

    onMount(async () => {
        const result = supabase.auth.signOut();
        if (result.error) {
            setResult("Odjava nije uspjela!");
        } else {
            setResult("Odjava je uspjela.");
        }
    });

    return (
        <>
            <Show when={result()}>
                <div class="bg-slate-300 p-4 rounded">
                    {result()}
                </div>
            </Show>
        </>
    );
}