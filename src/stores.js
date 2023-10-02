import { writable } from "svelte/store";

export const scripts = writable(
  JSON.parse(window.localStorage.getItem("scripts")) || [
    { text: "return input+1" },
  ]
);
scripts.subscribe((value) => {
  window.localStorage.setItem("scripts", JSON.stringify(value));
});

export const inputs = writable(
  JSON.parse(window.localStorage.getItem("inputs")) || [""]
);
inputs.subscribe((value) => {
  window.localStorage.setItem("inputs", JSON.stringify(value));
});
