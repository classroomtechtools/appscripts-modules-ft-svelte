<script>
    import {production, setup} from './environment.js';
    let title = "Title";
    let body = 'Initial Value';

    const success = (value) => {
      title = 'Welcome';
      body = value;
    }

    setup({
      hey: function () {
        return 'To Appscripts Modules ft Svelte!'
      }
    });

    google.script.run
      .withSuccessHandler(success)
      .hey();

</script>

<div class:sidebar={!production}>
<h1>{title}</h1>
<p>{body}</p>
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
