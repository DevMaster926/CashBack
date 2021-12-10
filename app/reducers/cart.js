import * as actionTypes from "@actions/actionTypes";
const initialState = {
    product: []
};

export default (state = initialState, action = {}) => {
    let { product } = state;
    switch (action.type) {
        case actionTypes.CART:
            return { product: action.product };
        case actionTypes.CART_ADD:
            product.push(action.product)
            return { product };
        case actionTypes.CART_REMOVE:
            product = product?.map((item, index) => {
                if (item.Product_Id == action.Product_Id && item.Amount > 1) {
                    item.Amount -= 1;
                    return item;
                }else if(item.Product_Id == action.Product_Id && item.Amount == 1) {
                    return null;
                }
                return item;
            })
            product = product.filter(item => item != null);
            return { product };
        case actionTypes.CART_UPDATE:
            product = product?.map((item, index) => {
                if (item.Product_Id == action.Product_Id) {
                    item.Amount += 1;
                    return item;
                }
                return item;
            })
            return { product };
        default:
            return state;
    }
};
