/*
This module exposes methods that are useful in a local dev environment:
For local dev, we need production boolean so other modules know what to do
And we also need google.script.run

For example:
<script>
  import {setup} from './environment.js';
  setup(window);
</script>
 */
export let production = window.hasOwnProperty('google');

export const setup = (global, serverSideFunctions={}) => {
    if (global === undefined) throw new Error("environment setup requires window variable to work as expected");

    // detect if we are in a local environment, if not, do nothing
    if (global.hasOwnProperty('google')) return;

    // define a mock google object
    global.google = {
        script: {
            run: proxyObject(serverSideFunctions)
        }
    }
};

const proxyObject = (serverSideFunctions) => {
    // defined methods by api:
    const target = {
        withSuccessHandler: function (func) {
            this._state.successHandler = func;
            return this;
        },
        withFailureHandler: function (func) {
            this._state.failureHandler = func;
            return this;
        },
        withUserObject: function (obj) {
            this._state.userObj = obj;
            return this;
        },
        // default values:
        _state: {
            userObj: null,
            successHandler: () => console.log('default success handler does nothing'),
            failureHandler: (err) => console.log('default failure handler got error:', err)
        }
    };

    const handler = {
        get: function (target, prop, receiver) {
            // if the target already has the prop, return that
            const hasProp = Reflect.get(...arguments);
            if (hasProp) return hasProp;

            // otherwise assume that this is a server-side function
            // not yet defined in the package (for local dev)
            // and we'll just call the successHandler after a delay to simulate
            return (value) => {
                setTimeout(() => target._state.successHandler(value, target._state.userObj), 2000);
            };
        }
    }

    return new Proxy(target, handler);
}



