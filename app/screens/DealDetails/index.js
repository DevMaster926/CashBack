import { apiActions } from "@actions";
import BackAllow from '@assets/images/go-back-arrow.svg';
import { BaseStyle } from "@config";
import { useFocusEffect } from "@react-navigation/native";
import React, { useState } from "react";
import { FlatList, Image, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from "react-native";
import EStyleSheet from 'react-native-extended-stylesheet';
import HTMLView from 'react-native-htmlview';
import {
    BallIndicator
} from 'react-native-indicators';
import Toast from 'react-native-simple-toast';
import { connect } from "react-redux";
import styles from './styles';

const DealDetails = (props) => {
    const deal = props.route?.params?.deal;
    const [loading, setLoading] = useState(false);
    const [partner_products, setPartnerProducts] = useState([]);
    useFocusEffect(
        React.useCallback(() => {
            getCouponProducts();
        }, [])
    );
    const getCouponProducts = () => {
        setLoading(true);
        var filter = {
            "Records_Filter": "FILTER",
            "Partner_Details_Id": deal?.Partner_Details_Id,
        }
        setPartnerProducts([]);
        apiActions.get_products(filter)
            .then(async res => {
                setLoading(false);
            })
            .catch(res => {
                if (res?.Success_Response?.Is_Data_Exist == '1') {
                    Toast.show(res?.Success_Response?.UI_Display_Message, Toast.LONG);
                    let productsData = res?.Partner_Product;
                    for (let i = 0; i < productsData?.length; i++) {
                        let item = productsData[i];
                        let data = {
                            "Record_Filter": "FILTER",
                            "Product_Image_Id": "",
                            "Product_Id": item.Product_Id,
                        }
                        apiActions.get_product_images(data)
                            .then(async images => {
                                setLoading(false);
                                productsData[i].Product_Images = [];
                                setPartnerProducts(products => [...products, productsData[i]]);
                            })
                            .catch(err => {
                                let images = err?.Images[0].Product_Image;
                                productsData[i].Product_Images = [];
                                images.map((item, index) => {
                                    productsData[i].Product_Images.push(item?.Product_Image);
                                })
                                setPartnerProducts(products => [...products, productsData[i]]);
                                setLoading(false);
                            })
                    }
                }
            })
    }

    const RenderItem = ({ item }) => {
        return (
            <View style={styles.reder_item}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 3 }}>
					<Image source={{ uri: item?.Logo_Path }} style={{ height: 25, flex: 1, resizeMode: 'contain', marginBottom: 3, width: 80 }} />
					{parseInt(item?.Partner_Discount) != 0 &&
						<View style={{ position: 'absolute', right: 0 }}>
							<Text style={{ backgroundColor: EStyleSheet.value('$primaryColor'), padding: 2, fontSize: 10, color: 'white', borderTopLeftRadius: 5, borderBottomLeftRadius: 5 }}>{item?.Partner_Discount_Type == 'A' && "₹ " + item?.Partner_Discount}{item?.Partner_Discount_Type == 'P' && item?.Partner_Discount.split('.')[0] + "%"} Off</Text>
						</View>
					}
				</View>
				<View style={{ backgroundColor: EStyleSheet.value('$productColor'), width: '100%', marginTop: 5 }}>
					<Text style={{ paddingVertical: 3, color: 'white', fontSize: 14, fontWeight: 'bold', textAlign: 'center' }}>ESI Cashback: {item?.Esi_Cashback}</Text>
				</View>
				<View style={{ flexDirection: 'column', width: '100%' }}>
					<Image source={{ uri: item?.Product_Image }} style={{ padding: 8, height: 140, width: "100%", resizeMode: 'contain' }}></Image>
					<View style={{ backgroundColor: EStyleSheet.value('$productColor'), width: '100%', marginTop: 5 }}>
						<Text style={{ paddingVertical: 3, color: 'white', fontSize: 16, fontWeight: 'bold', textAlign: 'center' }}>Brand: {item?.Brand_Name}</Text>
					</View>
					<View>
						<Text style={{ fontSize: 14, textAlign: 'center' }}>Original Price: {item?.Original_Price}</Text>
					</View>
					<View style={{ backgroundColor: EStyleSheet.value('$productColor'), width: '100%', marginTop: 5 }}>
						<Text style={{ paddingVertical: 3, color: 'white', fontSize: 14, fontWeight: 'bold', textAlign: 'center' }}>Final Price: {item?.CashBack_Product_Price}</Text>
					</View>
				</View>
				<View style={{ justifyContent: 'flex-end', flex: 1 }}>
					<TouchableOpacity onPress={() => props.navigation.navigate('ProductDetails', { Product_Id: item.Product_Id, Partner_Detail_Id: item.Partner_Detail_Id })} style={{ backgroundColor: EStyleSheet.value('$primaryButtonColor'), borderRadius: 20, paddingVertical: 5, paddingHorizontal: 10, marginBottom: 5, height: 30 }}>
						<Text style={{ color: 'white', fontSize: 14 }}>View Product</Text>
					</TouchableOpacity>
				</View>
            </View>
        )
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
                    <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'white' }}>Deal ({deal?.Category_Name})</Text>
                </View>
            </View>

            {loading ? <BallIndicator color={EStyleSheet.value('$primaryColor')} />
                :
                <ScrollView style={{ flex: 1, padding: 10 }} showsVerticalScrollIndicator={false}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Image source={{ uri: deal?.Image }} style={{ width: 150, height: 70, resizeMode: 'contain' }} />
                        <Text style={{ fontSize: 18, fontWeight: 'bold', flex: 1, textAlign: 'center', color: EStyleSheet.value('$primaryColor') }}>{deal?.Category_Name}</Text>
                    </View>
                    <HTMLView value={deal?.Deal_Description} />
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={{ flex: 1, color: 'black', fontSize: 16, fontWeight: 'bold' }}>Status:   {deal?.Status}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={{ fontSize: 16, flex: 1, color: EStyleSheet.value('$grayColor') }}>ESI Cashback</Text>
                        <Text style={{ flex: 2 }}>{deal?.Esi_Cashback_Amount} %</Text>
                    </View>
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={{ fontSize: 14, textAlign: 'center', flex: 1 }}>Valid  from  {deal?.Start_Date}  to  {deal?.End_Date}</Text>
                    </View>
                    <Text style={{ fontSize: 15, fontWeight: 'bold', marginTop: 20 }}>Partner Products</Text>
                    <View>
                        <FlatList
                            contentContainerStyle={{ paddingVertical: 10, marginBottom: 10 }}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            data={partner_products}
                            renderItem={RenderItem}
                            keyExtractor={(item, index) => index + item.Product_Id}
                        />
                    </View>
                </ScrollView>
            }
        </SafeAreaView>
    );
}
const mapStateToProps = (state) => (state);
const mapDispatchToProps = dispatch => {
    return {
        dispatch
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(DealDetails);