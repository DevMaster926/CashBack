import BackAllow from '@assets/images/go-back-arrow.svg';
import WishItem from '@components/WishItem';
import { BaseStyle } from "@config";
import { useFocusEffect } from "@react-navigation/native";
import { store } from "@store";
import React, { useEffect, useState } from "react";
import { FlatList, SafeAreaView, Text, TouchableOpacity, View } from "react-native";
import EStyleSheet from 'react-native-extended-stylesheet';
import {
    BallIndicator
} from 'react-native-indicators';
import Toast from 'react-native-simple-toast';
import { connect, useDispatch } from "react-redux";
import styles from './styles';
import { actionTypes, apiActions } from "@actions";
import IconCart from '@components/IconCart';

const WishList = (props) => {
    const user_detail = store?.getState()?.auth?.login?.user;
    const [wish_list, setWishList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [sub_total, setSubTotal] = useState(0);
    const dispatch = useDispatch();
    useFocusEffect(
        React.useCallback(() => {
            getWishList();
        }, [])
    );

    const getWishList = async () => {
        setLoading(true);
        setSubTotal(0);
        setWishList([]);
        let filter = {
            "Record_Filter": "FILTER",
            "Wish_Id": "",
            "User_Email_Id": user_detail?.Email_Id,
            "Product_Id": ""
        }
        apiActions.get_wish_list(filter)
            .then(async res => {
                if (res?.Success_Response?.Is_Data_Exist == '1') {
                    let wish_data = res.Wish[0]?.Wish_List;
                    let sum = 0;
                    for (let i = 0; i < wish_data.length; i++) {
                        let item = wish_data[i];
                        let data = {
                            "Record_Filter": "FILTER",
                            "Product_Id": item.Product_Id,
                            "Partner_Details_Id": item.Partner_Details_Id
                        }
                        await apiActions.get_products(data)
                            .then(async response => {
                                Toast.show(response?.Success_Response?.UI_Display_Message, Toast.LONG);
                                if (response?.Success_Response.Is_Data_Exist == '1') {
                                    let productsData = response?.Product_Details[0];
                                    sum += parseFloat(productsData.Partner_Selling_Price);
                                    productsData.Wish_Id = item.Wish_Id;
                                    productsData.Amount = 1;
                                    setSubTotal(sum);
                                    await setWishList(wish_list => [...wish_list, productsData]);
                                    setLoading(false);
                                } else {
                                    setLoading(false);
                                }
                            })
                            .catch(err => {
                                setLoading(false);
                                console.log('==========')
                            })
                    }
                    setSubTotal(sum);
                } else {
                    setLoading(false);
                }
            })
            .catch(err => {
                console.log(err);
                setLoading(false);
            })
    }

    const addAmount = (wish_id) => {
        var wishList = wish_list?.map((item, index) => {
            if (item.Wish_Id == wish_id) {
                item.Amount++;
                var sum = parseFloat(sub_total) + parseFloat(item.Partner_Selling_Price);
                setSubTotal(sum);
            }
            return item;
        })
        setWishList(wishList);
    }
    const removeAmount = (wish_id) => {
        console.log(wish_id)
        var wishList = wish_list?.map((item, index) => {
            if (item.Wish_Id == wish_id) {
                var sum = parseFloat(sub_total) - parseFloat(item.Partner_Selling_Price);
                setSubTotal(sum);
                if (item.Amount == 1) {
                    let data = {
                        Wish_Id: wish_id
                    }
                    apiActions.delete_wish_list(data)
                        .then(async res => {
                            console.log(res)
                        })
                        .catch(err => {
                            console.log(err)
                        })
                    return null;
                }
                item.Amount--;
            }
            return item;
        })
        wishList = wishList.filter(item => item != null);
        setWishList(wishList);
    }
    const checkOut = async () => {
        let cartProduts = store.getState()?.cart?.product;
        if (wish_list.length == 0) {
            Toast.show('No items', Toast.LONG);
        } else {
            wish_list?.map((item) => {
                let flag = false;
                for (let i = 0; i < cartProduts.length; i++) {
                    if (cartProduts[i].Product_Id == item.Product_Id) {
                        flag = true;
                    }
                }
                var Product_Id = item.Product_Id;
                if (flag)
                    dispatch({ type: actionTypes.CART_UPDATE, Product_Id })
                else
                    dispatch({ type: actionTypes.CART_ADD, product: item })
            })
        }
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
                    <Text style={{ fontSize: 20, flex: 1, fontWeight: 'bold', color: 'white' }}>Wish List</Text>
                    <IconCart {...props}></IconCart>
                </View>
            </View>

            {loading ? <BallIndicator color={EStyleSheet.value('$primaryColor')} />
                :
                wish_list.length > 0 ? <View style={{ flex: 1 }}>
                    <FlatList
                        showsVerticalScrollIndicator={false}
                        data={wish_list}
                        renderItem={({ item }) => <WishItem product={item} addAmount={addAmount} removeAmount={removeAmount}></WishItem>}
                        keyExtractor={(item, index) => index}
                    />
                </View> :
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <Text>There are no items in this to be displayed.</Text>
                    </View>
            }
            <View style={styles.sub_cart}>
                <View style={{ flexDirection: 'row' }}>
                    <Text style={{ color: 'white', fontSize: 15, flex: 1 }}>Total Payment</Text>
                    <Text style={{ color: 'white', fontSize: 15, flex: 1, textAlign: 'right' }}>₹ {parseFloat(sub_total).toFixed(2)}</Text>
                </View>
                <TouchableOpacity style={styles.button} onPress={() => checkOut()}>
                    <Text style={{ padding: 10, color: EStyleSheet.value('$primaryColor'), fontWeight: 'bold' }}>Move to cart</Text>
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

export default connect(mapStateToProps, mapDispatchToProps)(WishList);