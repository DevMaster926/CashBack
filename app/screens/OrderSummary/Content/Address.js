import Location from '@assets/images/location.svg';
import React, { useEffect, useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import EStyleSheet from 'react-native-extended-stylesheet';
import AntDesign from 'react-native-vector-icons/AntDesign';
import styles from '../styles';

const OrderProduct = (props) => {
    const { product, addOrderAmount, removeOrderAmount } = props;
    const removeItem = (product_id) => {
        removeOrderAmount(product_id)
    }
    const addItem = (product_id) => {
        addOrderAmount(product_id)
    }
    return (
        <View style={styles.content}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={{ flex: 1 }}>
                    <Image source={{ uri: product?.Product_Image }} style={styles.image}></Image>
                </View>
                <View style={{ flex: 2, justifyContent: 'flex-start', alignSelf: 'flex-start' }}>
                    <Text style={{ fontSize: 16 }}>{product?.Product_Name}</Text>
                    <Text style={{ color: EStyleSheet.value('$categoryColor') }}>₹ {product?.Partner_Selling_Price}</Text>
                    <Text style={{ color: EStyleSheet.value('$grayColor') }}>{product?.Product_Short_Description}</Text>
                </View>
                <View style={{ flex: 0.5, flexDirection: 'column', alignItems: 'center' }}>
                    <TouchableOpacity onPress={() => addItem(product?.Product_Id)}>
                        <AntDesign name="pluscircleo" size={28} color={EStyleSheet.value('$primaryColor')}></AntDesign>
                    </TouchableOpacity>
                    <Text style={{ color: EStyleSheet.value('$primaryColor'), fontSize: 16, margin: 5 }}>{product?.Amount}</Text>
                    <TouchableOpacity onPress={() => removeItem(product?.Product_Id)}>
                        <AntDesign name="minuscircleo" size={28} color={EStyleSheet.value('$primaryColor')}></AntDesign>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}

const Address = (props) => {
    const { user_address, setSubTotal, sub_total, order_list } = props;
    const [order_product, setOderProduct] = useState([]);
    useEffect(() => {
        setOderProduct([...order_list])
    }, [order_list, sub_total])
    const addOrderAmount = (product_id) => {
        var orderProduct = order_product?.map((item, index) => {
            if (item.Product_Id == product_id) {
                item.Amount++;
                var sum = parseFloat(sub_total) + parseFloat(item.Partner_Selling_Price);
                setSubTotal(sum);
            }
            return item;
        })
        setOderProduct(orderProduct);
    }
    const removeOrderAmount = (product_id) => {
        var orderProduct = order_product?.map((item, index) => {
            if (item.Product_Id == product_id) {
                var sum = parseFloat(sub_total) - parseFloat(item.Partner_Selling_Price);
                setSubTotal(sum);
                if (item.Amount == 1) {
                    return null;
                }
                item.Amount--;
            }
            return item;
        })
        orderProduct = orderProduct.filter(item => item != null);
        setOderProduct(orderProduct);
    }
    return (
        <>
            <View style={styles.address_box}>
                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', flex: 1 }}>
                    <Location width={50} height={50} />
                </View>
                <View style={{ flexDirection: 'column', flex: 5 }}>
                    {user_address &&
                        <>
                            <Text style={{ fontSize: 18 }}>Name</Text>
                            <Text style={{ fontSize: 16 }}>{user_address?.Door_Number && user_address?.Door_Number + ', '} {user_address?.Landmark && user_address?.Landmark + ', '}{user_address?.Street && user_address?.Street}</Text>
                            <Text style={{ fontSize: 16 }}>
                                {user_address?.City && user_address?.City + ', '} {user_address?.Zip && user_address?.Zip}
                            </Text>
                            <Text style={{ fontSize: 16 }}>
                                {user_address?.Country}
                            </Text>
                            <Text style={{ fontSize: 16 }}>{user_address?.Mobile}</Text>
                        </>
                    }
                </View>
            </View>
            <TouchableOpacity onPress={() => props.navigation.navigate('AddressSetting', { user_address: user_address })} style={{ backgroundColor: EStyleSheet.value('$primaryColor'), margin: 15, borderRadius: 5 }}>
                <Text style={{ fontSize: 18, margin: 10, textAlign: 'center', color: 'white' }}>Change or Add Address</Text>
            </TouchableOpacity>
            <View style={{ flex: 1 }}>
                {order_product?.map((item, index) => {
                    return (
                        <View key={index}>
                            <OrderProduct product={item} addOrderAmount={addOrderAmount} removeOrderAmount={removeOrderAmount}></OrderProduct>
                        </View>
                    )
                })}
            </View>
        </>
    )
}

export default Address