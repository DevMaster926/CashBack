import { apiActions } from "@actions";
import { BaseStyle } from "@config";
import React, { useEffect, useState } from "react";
import { Image, SafeAreaView, Text, TextInput, TouchableOpacity, View } from "react-native";
import EStyleSheet from 'react-native-extended-stylesheet';
import { FlatList } from "react-native-gesture-handler";
import {
    BallIndicator
} from 'react-native-indicators';
import Toast from 'react-native-simple-toast';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { shallowEqual, useSelector } from "react-redux";
import styles from './styles';
import IconCart from '@components/IconCart';
const Products = (props) => {
    const { sub_category_id, Category_Id, rating, cash_back, discount } = props?.route?.params;
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        setLoading(true);
        setProducts([]);
        let data = {
            "Record_Filter": sub_category_id ? "FILTER" : "ALL",
        }
        if (Category_Id && !sub_category_id) {
            data = {
                "Record_Filter": "FILTER",
                "Category_Id": Category_Id,
                "Esi_Rating": rating ? rating : "",
                "Sub_Category_Id": sub_category_id ? sub_category_id : "",
                "Discount": discount?discount:"",
                "Discount_Type":"P",
                "Esi_Cashback": cash_back?cash_back:""
            }
        }
        console.log(data)
        apiActions.get_products(data)
            .then(async response => {
                Toast.show(response?.Success_Response?.UI_Display_Message, Toast.LONG);
                let productsData = response?.Product_Details;
                console.log(productsData[0])
                setLoading(false);
                setProducts(productsData);
            })
            .catch(err => {
                setLoading(false);
                console.log(err)
            })
    }, [sub_category_id, Category_Id,rating, cash_back, discount])
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
    const renderItem = ({ item }) => {
        return (
            <View style={styles.productItems}>
                <TouchableOpacity onPress={() => props.navigation.navigate('ProductDetails', { Product_Id: item.Product_Id })} style={{ flexDirection: 'column', flex: 1 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 3 }}>
                        <Image source={{ uri: item?.Logo_Path }} style={{ height: 30, flex: 1, resizeMode: 'contain', marginBottom: 3 }} />
                    </View>
                    <View style={{ backgroundColor: EStyleSheet.value('$productColor'), width: '100%', marginTop: 5 }}>
                        <Text style={{ paddingVertical: 3, color: 'white', fontSize: 14, fontWeight: 'bold', textAlign: 'center' }}>ESI Cashback: {item?.Esi_Cashback}</Text>
                    </View>
                    <Image source={{ uri: item?.Product_Image }} style={{ resizeMode: 'contain', width: '100%', minHeight: 150, borderColor: 'gray' }}></Image>
                    <View style={{ backgroundColor: EStyleSheet.value('$productColor'), width: '100%', marginTop: 5 }}>
                        <Text style={{ paddingVertical: 3, color: 'white', fontSize: 14, fontWeight: 'bold', textAlign: 'center' }}>Brand: {item?.Brand_Name}</Text>
                    </View>
                    <View style={{ marginLeft: 10 }}>
                        <Text style={{ color: EStyleSheet.value('$grayColor') }}>{item?.Product_Name}</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={{ textDecorationLine: 'line-through', marginRight: 8, fontSize: 12, color: EStyleSheet.value('$placeColor') }}>₹{item?.Original_Price}</Text>
                            <Text style={{ fontWeight: 'bold', color: EStyleSheet.value('$categoryColor') }}>₹{item?.Partner_Selling_Price}</Text>
                        </View>
                    </View>
                </TouchableOpacity>
            </View>
        )
    }
    return (
        <SafeAreaView
            style={[BaseStyle.safeAreaView]}
            forceInset={{ top: "always" }}
        >
            <View
                style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: EStyleSheet.value('$primaryColor'), paddingVertical: 10 }}
            >
                <TouchableOpacity style={{ marginLeft: 5 }} onPress={() => props.navigation.goBack()}>
                    <FontAwesome5 name='angle-left' color={'white'} size={30}></FontAwesome5>
                </TouchableOpacity>
                <View style={{
                    backgroundColor: 'white',
                    borderRadius: 20,
                    marginHorizontal: 15,
                    flexDirection: 'row',
                    alignItems: 'center',
                    flex: 1
                }}>
                    <EvilIcons name="search" size={25} color={EStyleSheet.value('$placeColor')} style={{ margin: 5 }}></EvilIcons>
                    <TextInput
                        onTouchStart={() => props.navigation.navigate('SearchProduct')}
                        style={{ fontSize: 16, color: EStyleSheet.value('$primaryColor'), flex: 1, paddingVertical: 5 }}
                        placeholderTextColor={EStyleSheet.value('$placeColor')}
                        multiline={false}
                        placeholder="Search for anything" />
                </View>
                <IconCart {...props}></IconCart>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', paddingTop: 10 }}>
                <Text style={{ fontSize: 12, marginLeft: 10, flex: 1 }}>show all products</Text>
                <TouchableOpacity style={{ marginRight: 10 }} onPress={() => props.navigation.openDrawer({ test: 'test' })}>
                    <FontAwesome name="filter" size={22} color={EStyleSheet.value('$primaryColor')} ></FontAwesome>
                </TouchableOpacity>
            </View>
            {loading ? <BallIndicator color={EStyleSheet.value('$primaryColor')} />
                :
                <FlatList
                    columnWrapperStyle={{ marginVertical: 5, marginRight: 20 }}
                    showsVerticalScrollIndicator={false}
                    style={{ margin: 10 }}
                    data={products}
                    numColumns={2}
                    renderItem={renderItem}
                    keyExtractor={item => item.Product_Id + item.Partner_Detail_Id}
                />
            }

        </SafeAreaView>
    )
}

export default Products