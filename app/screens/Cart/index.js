import BackAllow from '@assets/images/go-back-arrow.svg';
import CartSVG from '@assets/images/shopping-cart-svg.svg';
import CartItem from '@components/CartItem';
import { BaseStyle } from "@config";
import { store } from "@store";
import React, { useEffect, useState } from "react";
import { FlatList, SafeAreaView, Text, TouchableOpacity, View } from "react-native";
import EStyleSheet from 'react-native-extended-stylesheet';
import Toast from 'react-native-simple-toast';
import { connect } from "react-redux";
import styles from './styles';

const Cart = (props) => {
    const [products, setProduct] = useState([]);
    const [sub_total, setSubTotal] = useState(0);
    const [count, setCount] = useState(0);
    useEffect(() => {
        let cartProduts = store.getState()?.cart?.product;
        setProduct(cartProduts);
        let total = 0;
        for (let i = 0; i < cartProduts?.length; i++) {
            total += parseFloat(cartProduts[i]?.Partner_Selling_Price) * cartProduts[i]?.Amount;
        }
        setSubTotal(total.toFixed(2));
    }, [store.getState()?.cart?.product.length, count])

    const checkOut = () => {
        if (products?.length == 0) {
            Toast.show("Please add any items.", Toast.LONG);
            return;
        }
        props.navigation.navigate('OrderSummary', { sub_total: sub_total, order_list: products })
    }

    return (
        <SafeAreaView
            style={[BaseStyle.safeAreaView]}
            forceInset={{ top: "always" }}
        >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View
                    style={{ flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: EStyleSheet.value('$primaryColor') }}
                >
                    <TouchableOpacity style={{ margin: 15 }} onPress={() => { props.navigation.goBack() }}>
                        <BackAllow width={25} height={25} color={EStyleSheet.value('$primaryColor')}></BackAllow>
                    </TouchableOpacity>
                    <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'white' }}>Cart</Text>
                </View>
            </View>
            {products?.length == 0 ?
                <View style={{ justifyContent: 'center', flex: 1, alignItems: 'center' }}>
                    <CartSVG width={100} height={100} />
                    <Text style={{ fontSize: 16, paddingHorizontal: 20, textAlign: 'center' }}>Add items to cart</Text>
                </View>
                :
                <FlatList
                    data={products}
                    renderItem={({ item }) => <CartItem product={item} setCount={setCount} count={count}></CartItem>}
                    keyExtractor={item => item.Product_Id}
                />
            }

            <View style={styles.sub_cart}>
                <View style={{ flexDirection: 'row' }}>
                    <Text style={{ color: 'white', fontSize: 15, flex: 1 }}>Total Payment</Text>
                    <Text style={{ color: 'white', fontSize: 15, flex: 1, textAlign: 'right' }}>₹ {sub_total}</Text>
                </View>
                <TouchableOpacity style={styles.button} onPress={() => checkOut()}>
                    <Text style={{ padding: 10, color: EStyleSheet.value('$primaryColor'), fontWeight: 'bold' }}>Checkout</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}
const mapStateToProps = (state) => (state);
const mapDispatchToProps = dispatch => {
    return {
        dispatch
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Cart);