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

// executing this at import
export let production = window.hasOwnProperty('google');

export const setup = (serverSideFunctions={}) => {
    // have we run already?
    // note, this is not the same as checking at import time, as above!
    if (window.hasOwnProperty('google')) return;

    // define a mock google object
    window.google = {
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
            let locallyReturnedValue = undefined;
            if (hasProp) return hasProp;

            if (!production) {
                if (prop in serverSideFunctions) {
                    locallyReturnedValue = serverSideFunctions[prop].call();
                }
            }

            // otherwise assume that this is a server-side function
            // not yet defined in the package (for local dev)
            // and we'll just call the successHandler after a delay
            return (value) => {
                mockSuccess(target._state.successHandler, locallyReturnedValue !== undefined ? locallyReturnedValue : value , target._state.userObj);
                // setTimeout(() => target._state.successHandler(value, target._state.userObj), 2000);
            };
        }
    }

    return new Proxy(target, handler);
}

export let mockSuccess = (func, parameter=undefined, obj={}) => {
    setTimeout( () => { func(parameter, obj); }, 2000);
};
