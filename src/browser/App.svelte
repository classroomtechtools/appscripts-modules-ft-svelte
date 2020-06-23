<script>
    import Component from './Component.svelte';
    import {production} from './environment.js';

    let greeting = 'Hello';
    let noun = 'world';
    let value = 'value from outside';

    let phrases = [
        {
            greeting: 'Hello',
            noun: 'World',
            template: '${greeting}, ${noun}',
            // language: 'English'  // default not needed
        },
        {
            greeting: 'nihao',
            noun: 'shijie',
            template: '${greeting}, ${noun}',
            language: 'Chinese'
        },
        {
            greeting: 'hao',
            noun: 'shijie',
            template: '${noun}${greeting}',
            language: 'More fluent Chinese'
        },
        {
            greeting: '지구촌 여러분',
            noun: '안녕하세요',
            template: '${greeting},${noun}',
            language: 'Korean'
        }
    ];

    let title = `${greeting}, ${noun}`;
    const changeTitle = (event) => {
        title = event.detail;
    };

</script>

<div class:main={!production}>
<h1 id="title">{title}</h1>

{#each phrases as phrase, index}
<p>
    <Component language={phrase.language} template={phrase.template}
        noun={phrase.noun}
        greeting={phrase.greeting}
        {index}
        on:makeTitle={changeTitle}
    />
</p>
{/each}
</div>

<style>
    /* this class only gets applied during local dev
       keeps it hugged against the right side of the window */
    .main {
      margin-left: auto;
      margin-right: 0;
      max-width: 300px;
    }

    :global(html) {
        scroll-behavior: smooth !important;
    }

</style>
