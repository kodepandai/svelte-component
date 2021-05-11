<script>
    import '../asset/quill.css'
    import { onMount } from "svelte";
    export let value = null;
    export let placeholder = "Type here...";
    let ready = false;
    let editor, quill;
    let options = {
        modules: {
            toolbar: [
                [{ font: [] }, { size: [] }],
                ["bold", "italic", "underline", "strike"],
                [{ color: [] }, { background: [] }],
                [{ script: "super" }, { script: "sub" }],
                [{ header: ["1", "2", "3"] }, "blockquote", "code-block"],
                [{ list: "ordered" }, { list: "bullet" }, { indent: "-1" }, { indent: "+1" }],
                [{ align: [] }],
                ["link", "image", "video"],
                ["clean"],
            ],
        },
        placeholder,
        theme: "snow",
    };
    const initQuill = async () => {
        const { default: Quill } = await import("quill");
        quill = new Quill(editor, options);
        quill.root.innerHTML = value;
        quill.on("text-change", () => {
            value = quill.root.innerHTML;
        });
    };
    onMount(() => {
        initQuill();
    });

    $: if (quill && value && !ready) {
        quill.root.innerHTML = value;
        ready = true;
    }
</script>

<div bind:this={editor} />
