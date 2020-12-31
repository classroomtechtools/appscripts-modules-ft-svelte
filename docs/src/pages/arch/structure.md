<script>
    import Node from "../components/Node.svelte";
    
    let root = {
        name: "Root",
        children: [{
            name: "Child 1",
            children: [{
                name: "Grandchild 1",
                children: []
            }, {
                name: "Grandchild 2",
                children: []
            }, {
                name: "Grandchild 3",
                children: []
            }]
        }, {
            name: "Child 2",
            children: [{
                name: "Grandchild 1",
                children: []
            }, {
                name: "Grandchild 2",
                children: []
            }, {
                name: "Grandchild 3",
                children: []
            }]
        }, {
            name: "Child 3",
            children: [{
                name: "Grandchild 1",
                children: []
            }, {
                name: "Grandchild 2",
                children: []
            }, {
                name: "Grandchild 3",
                children: []
            }]
        }]
    };
    
</script>

<Node {...root}/>


```
├── .clasp.json
├── README.md
├── build
├── examples
│   ├── default
│   └── helloworld
├── on_modules.md
├── package.json
├── project
│   ├── Bundle.js
│   ├── Code.js
│   ├── appsscript.json
│   └── index.html
├── rollup.config.js
└── src
    ├── modules
    ├── scripts
    ├── static
    └── svelte
```
