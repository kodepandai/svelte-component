# Svelte Component / Input

## How To Install

`npm i @svelte-component/input`

## How To Use

``` js
<script>

import Input from "@svelte-component/input";
let html

</script>

<main>
	<Input 
        type="html" 
        bind:value={input} 
        />
	<pre>
		{input}
	</pre>
</main>
```