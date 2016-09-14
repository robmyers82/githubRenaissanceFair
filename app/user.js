"use strict";
exports.userReducer = function (state, action) {
    if (state === void 0) { state = { id: '', username: '', type: '' }; }
    switch (action.type) {
        case "SET_LOGGEDUSER":
            // add the username and type to the state
            state.id = action.payload.id;
            state.username = action.payload.username;
            state.type = action.payload.type;
            return state;
        case "REMOVE_LOGGEDUSER":
            // remove the username from the state
            state = { id: '', username: '', type: '' };
            return state;
        default:
            return state;
    }
};
//# sourceMappingURL=user.js.map