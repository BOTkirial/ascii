<script>
    import { onMount } from "svelte";

    let symbols = "@?!€01$&#%§";
    let originalText = $$props.text;
    let displayedText = encryptText(originalText);
    let delay = $$props.delay;

    function encryptText(text) {
        let encryptedText = "";
        for (let cpt = 0; cpt < text.length; cpt++) {
            const rand = Math.floor(Math.random() * (symbols.length - 1));
            encryptedText += symbols[rand];
        }
        return encryptedText;
    }

    function decryptText(encryptedText, step = 0) {
        let decryptedTextForThisStep =
            originalText.slice(0, step) +
            encryptText(originalText).slice(step, originalText.length);
        displayedText = decryptedTextForThisStep;
        if (step === originalText.length) return decryptedTextForThisStep;
        window.setTimeout(function () {
            decryptText(encryptedText, step + 1);
        }, 100);
    }

    onMount(() => {
        window.setTimeout(() => {
            decryptText(originalText);
        }, delay);
    });
</script>

<span>{displayedText}</span>

<style>
    span {
        /* taille du text */
        font-size: 1.1em;
        /* text en dégradé de couleur */
        background-image: linear-gradient(120deg, #f6d365 0%, #fda085 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
    }
</style>
