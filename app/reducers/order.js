import * as actionTypes from "@actions/actionTypes";
const initialState = {
    product: []
};

export default (state = initialState, action = {}) => {
    switch (action.type) {
        case actionTypes.ORDER:
            return { product: action.product };
        default:
            return state;
    }
};
