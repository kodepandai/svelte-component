import svelte from 'rollup-plugin-svelte';
import resolve from 'rollup-plugin-node-resolve';
import autoPreprocess from 'svelte-preprocess';
import typescript from '@rollup/plugin-typescript';
import css from 'rollup-plugin-css-only';

export default [{
    input: 'src/components/input/index.ts',
    output: [
        { dir: 'src/components/input/dist', 'format': 'es' },
    ],
    plugins: [
        svelte({
            preprocess: autoPreprocess(),
        }),
        typescript({ sourceMap: false }),
        resolve(),
        css({ output: 'input.css' }),
    ],
}];