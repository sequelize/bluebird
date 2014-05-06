"use strict";
module.exports =
    function(Promise, Promise$_CreatePromiseArray, PromiseArray) {

var SettledPromiseArray = require("./settled_promise_array.js")(
    Promise, PromiseArray);

function Promise$_Settle(promises, useBound) {
    var settled = Promise$_CreatePromiseArray(
        promises,
        SettledPromiseArray,
        useBound === USE_BOUND && promises._isBound()
            ? promises._boundTo
            : void 0
   ).promise();

    // SEQUELIZE SPECIFIC
    // Propagate sql events
    promises.forEach(function (promise) {
        if (Promise.is(promise)) {
            promise.on("sql", function (sql) {
                settled.emit("sql", sql);
            });

            promise.$sql.forEach(function (sql) {
                settled.emit("sql", sql);
            });
        }
    });
    // END SEQUELIZE SPECIFIC

    return settled;
}

Promise.settle = function Promise$Settle(promises) {
    return Promise$_Settle(promises, DONT_USE_BOUND);
};

Promise.prototype.settle = function Promise$settle() {
    return Promise$_Settle(this, USE_BOUND);
};
};
