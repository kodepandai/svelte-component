<script lang="ts">
    import Select from "svelte-select";
    import { createEventDispatcher, onMount } from "svelte";
    import type { InputType, Option } from "./Contracts";
    import Wysiwyg from "./lib/Wysiwyg.svelte";

    let DropZone = null;
    const emit = createEventDispatcher();
  
    export let type: InputType = "text",
      info:string|null=null,
      name: string = "",
      label = "",
      placeholder = "",
      value = null,
      options: Option[] = [], //for select
      accept = "*",
      required = false,
      progress = 0,
      error=null,
      multiple = false; // for file
  
    let defaultType;
    let mode = "text";
    let maskedValue = value;
  
    $:if (type === "currency") {
      defaultType = "text";
      mode = "numeric";
    } else {
      defaultType = type;
    }
  
    const formatNumber = (value, revert = false) => {
      if (value == undefined) return 0;
      let _value;
      if (revert) {
        _value = value
          .toString()
          .replace(/[^0-9.]/g, "")
          .replace(/\,/g, "")
          .split(".");
      } else {
        _value = value
          .toString()
          .replace(/[^0-9,]/g, "")
          .replace(/\./g, "")
          .split(",");
      }
      _value[0] = Number(_value[0]).toLocaleString("id").toString();
      return _value.slice(0, 2).join(",");
    };
  
    // DROPZONE
    function handleFilesSelect(e) {
      const { acceptedFiles } = e.detail;
      value = acceptedFiles;
    }
  
    $: if (type == "currency" || type == "decimal") {
      maskedValue = formatNumber(value, true);
    } else {
      maskedValue = value;
    }
  
    const handleInput = (e) => {
      if (type === "currency" || type === "decimal") {
        value = formatNumber(e.target.value);
        maskedValue = e.target.value = value; // set masked value to input field
        value = Number(value.replace(/\./g, "").replace(/\,/g, ".")); // set real value to state
      } else {
        maskedValue = value = e.target.value;
      }
    };
    const handleSelect = (e: { detail: any }) => {
      value = e.detail.value;
      emit("change", { target: { name, value } });
    };
    const handleClear = () => {
      value = null;
      emit("change", { target: { name, value: null } });
    };
  
    onMount(async () => {
      if (type == "file") {
        DropZone = await import("svelte-file-dropzone");
      }
    });
  </script>
  
  <div class="flex flex-col w-full mb-2">
    {#if label && defaultType!='hidden'}<label for="" class="text-sm text-dark"
        >{label}{#if required}<span class="text-danger">*</span>{/if}</label
      >{/if}
    {#if type == "select"}
      <div class="rounded themed">
        <Select
          items={options}
          on:select={handleSelect}
          on:clear={handleClear}
          selectedValue={options.find((x) => x.value == value)}
          placeholder={placeholder ? placeholder : label}
          inputAttributes={{
            required: value ? false : required,
            autocomplete: "orasusah",
            name: $$props.name,
            class: `border text-black ${
              error ? "border-danger" : "focus:border-highlight"
            } text-sm py-1 ${$$props.class}`,
          }}
        />
      </div>
    {:else if type == "file" && DropZone}
      <svelte:component this={DropZone.default} on:drop={handleFilesSelect} {multiple} {accept} />
      {#if progress > 0}<small class="text-info">uploading {progress}%</small>{/if}
    {:else if type == "html"}
      <Wysiwyg {placeholder} bind:value />
    {:else}
      <input
        {required}
        autocomplete="orasusah"
        id={$$props.id}
        name={$$props.name}
        type={defaultType}
        placeholder={placeholder ? placeholder : label}
        value={maskedValue}
        inputmode={mode}
        on:input={handleInput}
        class="border rounded text-black {error
          ? 'border-danger'
          : 'focus:border-highlight'} text-sm px-2 py-1 bg-white {$$props.class}"
      />
    {/if}
    {#if error}
      <label for="error" class="text-xs text-danger font-primary">{error}</label>
    {:else}
      {#if info}<span class="block ml-32 text-xs">{info}</span>{/if}
    {/if}
  </div>
  
  <style>
    *, :after, :before {
    box-sizing: border-box;
    border: 0 solid #e5e7eb;
}
    input {
      appearance: none;
      outline: none;
    }
    .block {
      display: block;
    }
    .border {
      border-width: 1px;
    }
    .border-danger {
      border-color: var(--danger,rgb(185, 39, 39));
    }
    .focus\:border-highlight:focus {
      border-color: var(--highligt, rgb(19, 223, 172));
    }
    .px-2 {
      padding-left: .5rem;
      padding-right: .5rem;
    }
    .py-1 {
      padding-top: .25rem;
      padding-bottom: .25rem;
    }
    .bg-white {
      background-color: var(--white, #fff);
    }
    .flex {
      display: flex;
    }
    .flex-col {
      flex-direction: column;
    }
    .font-primary {
      font-family: var(--font-primary, "Sans");
    }
    .mb-2 {
      margin-bottom: .25rem;
    }
    .ml-32 {
      margin-left: 8rem;
    }
    .rounded {
      border-radius: .25rem;
    }
    .text-black {
      color: var(--black, rgb(8, 8, 8));
    }
    .text-dark {
      color: var(--dark,rgb(14, 17, 34) )
    }
    .text-danger {
      color: var(--danger, rgb(185, 39, 39));
    }
    .text-info {
      color: var(--info, rgb(21, 78, 184));
    }
    .text-sm {
     font-size: .875rem;
     line-height: 1.25rem; 
    }
    .text-xs {
      font-size: .75rem;
      line-height: 1rem;
    }
    .themed {
      --inputColor: #000;
      --itemColor: #000;
      --inputPadding: 0 0.5rem;
      --height: 30px;
      --border: 0;
      --background: transparent;
      --clearSelectTop: 0;
      --clearSelectBottom: 0;
    }
    .w-full {
      width: 100%;
    }
    :global(.themed .selectContainer) {
      --padding: 0 9px !important;
    }
    :global(.themed .selection) {
      color: #000;
    }
  </style>
  