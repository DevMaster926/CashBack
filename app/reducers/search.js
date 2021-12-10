import * as actionTypes from "@actions/actionTypes";
const initialState = {
    product: []
};

export default (state = initialState, action = {}) => {
    let { product } = state;
    switch (action.type) {
        case actionTypes.SEARCH:
            return { product: action.product };
        case actionTypes.SEARCH_ADD:
            product.push(action.product)
            return { product };
        case actionTypes.SEARCH_REMOVE:
            product = product?.map((item, index) => {
                if(item.Product_Id == action.Product_Id) {
                    return null;
                }
                return item;
            })
            product = product.filter(item => item != null);
            return { product };
        case actionTypes.SEARCH_UPDATE:
            product = product?.map((item, index) => {
                if (item.Product_Id == action.Product_Id) {
                    return item;
                }
                return item;
            })
            return { product };
        default:
            return state;
    }
};
