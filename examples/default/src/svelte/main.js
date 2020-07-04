import App from './App.svelte';

const app = new App({
    target: document.body,  // no need to change
    intro: true  // any transitions will be applied immediately
});

export default app;
