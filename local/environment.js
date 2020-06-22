export const runner = (serverSideFunctions={}) => {
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
            // and we'll just call the successHandler after a delay to simulate
            return function (value) {
                setTimeout(() => this._state.successHandler(value, this._state.userObj), 2000);
            };
        }
    }

    return new Proxy(target, handler);
};

export let production = window.hasOwnProperty('google');
