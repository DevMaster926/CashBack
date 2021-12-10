import { apiActions } from "@actions";
import React, { useEffect, useState } from "react";
import { Image, Text, View } from "react-native";
import EStyleSheet from 'react-native-extended-stylesheet';
import styles from './styles';
const OrderItem = ({ item }) => {
    let item_master = item.item.Item_Master[0];
    let order = item.item.Order;
    const [images, setImages] = useState([]);
    useEffect(() => {
        var data = {
            "Record_Filter": "FILTER",
            "Product_Image_Id": "",
            "Product_Id": item_master.Product_Id,
        }
        apiActions.get_product_images(data)
            .then(async images => {
                
            })
            .catch(err => {
                setImages(err?.Images[0].Product_Image);
            })
    }, [])
    return (
        <View style={styles.content} key={item.index}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={{ flex: 1 }}>
                    <Image source={{ uri: images[0]?.Product_Image }} style={styles.image}></Image>
                </View>
                <View style={{ flex: 2, justifyContent: 'flex-start', alignSelf: 'flex-start' }}>
                    <Text style={{ fontSize: 18 }}>{item_master.Product_Name}</Text>
                    <Text style={{ color: EStyleSheet.value('$categoryColor') }}>₹ {item_master.Net_Price}</Text>
                    <Text style={{ fontSize: 14,  color: EStyleSheet.value('$grayColor') }}>Order No: {order.Order_Id}</Text>
                    <Text style={{ fontSize: 14,  color: EStyleSheet.value('$grayColor') }}>Order Date: {order.Order_Date}</Text>
                    <Text style={{ fontSize: 14,  color: EStyleSheet.value('$grayColor') }}>Order Status: {order.Shipping_Status}</Text>
                </View>
                <View style={{ flex: 0.5, flexDirection: 'column', alignItems: 'center' }}>
                    <Text style={{ borderRadius: 20, borderWidth: 1, borderColor: EStyleSheet.value('$categoryColor'), color: EStyleSheet.value('$categoryColor'), minWidth: 30, textAlign: 'center' }}>X{item_master.Quantity}</Text>
                </View>
            </View>
        </View>
    )
}

export default OrderItem