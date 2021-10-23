if (!String.prototype.isNullOrWhitespace) {
    String.prototype.isNullOrWhitespace = function () {
        return this === undefined || this === null || this.trim().length === 0;
    }
}