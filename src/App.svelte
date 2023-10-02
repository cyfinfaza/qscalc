<script>
  import { scripts, inputs } from "./stores";

  let inputElements = [];

  $: $scripts = $scripts.map((script) => {
    try {
      script.function = new Function("input", script.text);
      script.isGood = true;
    } catch (e) {
      console.error(e);
      script.isGood = false;
    }
    return script;
  });

  $: console.log($scripts);
  $: console.log($inputs);

  function callScript(script, input) {
    let output = undefined;
    let isGood = false;
    if (!isNaN(parseFloat(input))) {
      input = parseFloat(input);
    }
    if (script.isGood) {
      try {
        output = script.function(input);
        isGood = true;
      } catch (e) {
        console.error(e);
      }
    }
    return { output, isGood };
  }
</script>

<table>
  <tr class="scriptRow">
    <td />
    {#each $scripts as script, i}
      <td>
        <textarea
          style:border-color={script.isGood ? null : "red"}
          bind:value={$scripts[i].text}
        />
      </td>
    {/each}
    <td
      ><button on:click={() => ($scripts = [...$scripts, { text: "return " }])}
        >+ New Script</button
      ></td
    >
  </tr>
  {#each $inputs as input, i}
    <tr>
      <td>
        <input
          type="text"
          style="width: 200px; text-align: right;"
          bind:this={inputElements[i]}
          bind:value={$inputs[i]}
          on:keydown={(e) => {
            if (e.key === "Enter") {
              let newArr = [...$inputs];
              newArr.splice(i + 1, 0, "");
              $inputs = newArr;
              setTimeout(() => {
                inputElements[i + 1].focus();
              });
            }
            if (e.key === "Delete" && e.ctrlKey) {
              let newArr = [...$inputs];
              newArr.splice(i, 1);
              $inputs = newArr;
              setTimeout(() => {
                inputElements[i - 1].focus();
              });
            }
          }}
        />
      </td>
      {#each $scripts.map((script) => callScript(script, input)) as result}
        <td
          ><p style:border-color={result.isGood ? null : "red"}>
            {result.output}
          </p></td
        >
      {/each}
    </tr>
  {/each}
  <tr>
    <td>
      <button on:click={() => ($inputs = [...$inputs, ""])}>+ New Input</button>
    </td>
  </tr>
</table>

<style lang="scss">
  * {
    margin: 0;
  }
  table {
    border-collapse: collapse;
  }
  .scriptRow {
    button,
    textarea {
      // height: 64px;
      padding: 8px;
      box-sizing: content-box;
      vertical-align: top;
    }
  }

  input,
  p {
    height: 48px;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    padding: 8px;
  }

  textarea {
    font-family: monospace;
  }
</style>
