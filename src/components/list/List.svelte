<script>
    import AnimatedText from "../animatedText/AnimatedText.svelte";
</script>

<div>
    <ul>
        <li><AnimatedText delay="500" text="Jeff Bezos" /></li>
        <li><AnimatedText delay="1000" text="Bill Gates" /></li>
        <li><AnimatedText delay="1500" text="Tim Sweeney" /></li>
        <li><AnimatedText delay="2000" text="Elon Musk" /></li>
        <li><AnimatedText delay="2500" text="Gab Newels" /></li>
    </ul>
</div>

<style>
    ul {
    }

    ul li {
        list-style-type: none;
    }
</style>
