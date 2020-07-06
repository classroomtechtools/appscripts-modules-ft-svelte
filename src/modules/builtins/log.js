export function Log () {

    window.Logger = (function () {
        this._log = [];
        this.log = (...params) => {
            this._log.push(params.join(""))
        };
        this.get = () => this._log.join("\n");
        return this;
    })();

}
Log.get = function () {
    return window.Logger.get();
}

