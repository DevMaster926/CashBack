import { actionTypes } from "@actions";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import EStyleSheet from 'react-native-extended-stylesheet';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useDispatch } from "react-redux";
import styles from './styles';

const CartItem = (props) => {
    const { product, setCount, count } = props;
    const dispatch = useDispatch();
    const removeItem = (Product_Id) => {
        dispatch({ type: actionTypes.CART_REMOVE, Product_Id })
        setCount(count - 1);
    }
    const addItem = (Product_Id) => {
        dispatch({ type: actionTypes.CART_UPDATE, Product_Id })
        setCount(count + 1);
    }
    return (
        <View style={styles.content}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={{ flex: 1 }}>
                    <Image source={{ uri: product?.Product_Image }} style={styles.image}></Image>
                </View>
                <View style={{ flex: 2, justifyContent: 'flex-start', alignSelf: 'flex-start' }}>
                    <Text style={{ fontSize: 16 }}>Brand: {product?.Brand_Name}</Text>
                    <Text style={{ fontSize: 14, fontWeight: 'bold', color: EStyleSheet.value('$productColor') }}>{product?.Product_Name}</Text>
                    <Text style={{ color: EStyleSheet.value('$categoryColor') }}>₹ {product?.Partner_Selling_Price}</Text>
                    <Text style={{ color: EStyleSheet.value('$grayColor') }}>{product?.Product_Short_Description}</Text>
                </View>
                <View style={{ flex: 0.5, flexDirection: 'column', alignItems: 'center' }}>
                    <TouchableOpacity onPress={() => addItem(product?.Product_Id)}>
                        <AntDesign name="pluscircleo" size={28} color={EStyleSheet.value('$primaryColor')}></AntDesign>
                    </TouchableOpacity>
                    <Text style={{ color: EStyleSheet.value('$primaryColor'), fontSize: 16, margin: 5 }}>{product?.Amount?product?.Amount:1}</Text>
                    <TouchableOpacity onPress={() => removeItem(product?.Product_Id)}>
                        <AntDesign name="minuscircleo" size={28} color={EStyleSheet.value('$primaryColor')}></AntDesign>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}

export default CartItem