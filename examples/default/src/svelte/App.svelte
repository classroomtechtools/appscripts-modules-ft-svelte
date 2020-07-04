<script>
    import {production, setup} from './environment.js';
    const title = "Title";
    setup(window);
    google.script.run.Hey();
</script>

<div class:sidebar={!production}>
<h1>{title}</h1>
</div>

<style>
    /* this class only gets applied during local dev
       keeps it hugged against the right side of the window for easy sidebar dev */
    .sidebar {
      margin-left: auto;
      margin-right: 0;
      max-width: 300px;
    }

</style>
