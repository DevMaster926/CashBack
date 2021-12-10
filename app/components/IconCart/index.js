import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import {TouchableOpacity, Text} from 'react-native'
import Entypo from 'react-native-vector-icons/Entypo';
import EStyleSheet from "react-native-extended-stylesheet";
import { store } from "@store";
import * as Utils from '@utils';

const IconCart = (props) => {
    const [cartCount, setCount] = useState("");
    const { currentState } = useSelector(
        (state) => ({ currentState: state.cart }),
        shallowEqual
    );
    const { product } = currentState;
    useEffect(() => {
        if (product) {
            setCount(product.length);
        } else {
            setCount("");
        }
    }, [product.length])
    const gotoCart = () => {
        if (!Utils.checkLogin()) {
            props.navigation.navigate('SignIn')
            return;
        }
        props.navigation.navigate('Cart')
    }
    return (
        <>
            {cartCount != 0 && <Text
                style={{
                    position: 'absolute', right: 2, top: 12,
                    backgroundColor: EStyleSheet.value('$errorColor'),
                    paddingHorizontal: 5, borderRadius: 50,
                    zIndex: 10, color: 'white',
                    fontSize: 10
                }}>{cartCount}</Text>}
            <TouchableOpacity onPress={() => gotoCart()} style={{ marginRight: 10 }}>
                <Entypo name="shopping-cart" size={20} color={'white'}></Entypo>
            </TouchableOpacity>
        </>
    )
}

export default IconCart;