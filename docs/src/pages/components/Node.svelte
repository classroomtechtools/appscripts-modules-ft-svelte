<script>
    export let name = "";
    export let children = [];
    export let indent = 0;
    
    let open = true;
    
    function toggleOpen() {
        open = !open;
    }
</script>

<style>
    h3 {
        cursor: pointer;
        user-select: none;
    }
</style>

<h3 style="padding-left: {indent}px" on:click={toggleOpen}>
    {name} {open ? "(open)" : "(closed)"}
</h3>

{#if open}
    {#each children as child}
        <svelte:self {...child} indent={indent + 24}/>
    {/each}
{/if}
