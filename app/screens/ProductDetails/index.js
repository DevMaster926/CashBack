import { actionTypes, apiActions } from "@actions";
import { BaseStyle } from "@config";
import { store } from "@store";
import * as Utils from '@utils';
import React, { useEffect, useState } from "react";
import { TouchableWithoutFeedback } from "react-native";
import { FlatList, Image, SafeAreaView, ScrollView, Text, TouchableHighlight, TouchableOpacity, View } from "react-native";
import EStyleSheet from 'react-native-extended-stylesheet';
import HTMLView from 'react-native-htmlview';
import ImageSlider from 'react-native-image-slider';
import {
    BallIndicator
} from 'react-native-indicators';
import Toast from 'react-native-simple-toast';
import Entypo from 'react-native-vector-icons/Entypo';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import styles from './styles';
const ProductDetails = (props) => {
    const { Product_Id, Partner_Detail_Id } = props.route?.params;
    const user_detail = store?.getState()?.auth?.login?.user;
    const dispatch = useDispatch();
    const [currentProduct, setCurrentProduct] = useState([]);
    const [related_products, setRelatedProducts] = useState([]);
    const [viewIndex, setViewIndex] = useState(1);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(false);
    const [related_loading, setRelatedLoading] = useState(false);
    const [is_like, setLike] = useState(false);
    const [brand_name, setBrandName] = useState("");
    const [image_index, setImageIndex] = useState(0);

    useEffect(() => {
        setRelatedProducts([]);
        setCurrentProduct([]);
        setReviews([]);
        setViewIndex(1);
        setBrandName("");
        setLike(false);
        getProductDetails();
    }, [Product_Id, props.route])
    const getProductDetails = () => {
        if (Product_Id) {
            setLoading(true);
            let data = {
                "Record_Filter": "FILTER",
                "Product_Id": Product_Id,
                "Partner_Detail_Id": Partner_Detail_Id,
            }
            apiActions.get_products(data)
                .then(async response => {
                    Toast.show(response?.Success_Response?.UI_Display_Message, Toast.LONG);
                    let productsData = response?.Product_Details[0];
                    data = {
                        "Record_Filter": "FILTER",
                        "Product_Image_Id": "",
                        "Product_Id": productsData.Product_Id,
                    }
                    apiActions.get_product_images(data)
                        .then(async images => {
                            setLoading(false);
                            productsData.Product_Images = [];
                            setCurrentProduct(currentProduct => [...currentProduct, productsData]);
                        })
                        .catch(err => {
                            let images = err?.Images[0].Product_Image;
                            productsData.Product_Images = [];
                            images.map((item, index) => {
                                productsData.Product_Images.push(item?.Product_Image);
                            })
                            setCurrentProduct(currentProduct => [...currentProduct, productsData]);
                            setLoading(false);
                        })
                })
                .catch(err => {
                    setLoading(false);
                    console.log(err)
                })
            data = {
                "Records_Filter": "FILTER",
                "Product_Id": Product_Id,
            }
            setRelatedLoading(true);
            apiActions.get_related_products(data)
                .then(async res => {
                    if (res?.Success_Response?.Is_Data_Exist == '1') {
                        let relatedProduct = res?.Products[0]?.Related_Products;
                        await setRelatedProducts([]);
                        for (let i = 0; i < relatedProduct.length; i++) {
                            let Related_Prod_Id = res?.Products[0]?.Related_Products[i]?.Related_Product_Of_Product_Id;
                            data = {
                                "Record_Filter": "FILTER",
                                "Product_Id": Related_Prod_Id,
                            }
                            await apiActions.get_products(data)
                                .then(async res => {
                                    setRelatedLoading(false);
                                    if (res?.Success_Response?.Is_Data_Exist == "1") {
                                        let productsData = res?.Product_Details[0];
                                        setRelatedProducts(related_products => [...related_products, productsData]);
                                    }
                                })
                                .catch(err => {
                                    setRelatedLoading(false);
                                    console.log(err)
                                })
                        }
                    } else {
                        setRelatedLoading(false);
                    }
                })
                .catch(err => {
                    console.log(err)
                    setRelatedLoading(false);
                })

            data = {
                "Record_Filter": "FILTER",
                "Product_Review_Id": "",
                "Product_Id": currentProduct[0]?.Product_Id,
                "Name": "",
                "Email_Id": "",
                "Min_Rating": "2",
                "Max_Rating": "5",
                "Status": ""
            }
            apiActions.get_product_reviews(data)
                .then(async res => {
                    setReviews(res?.Product_Review)
                })
                .catch(err => {
                    console.log(err)
                })
            let filter = {
                "Record_Filter": "FILTER",
                "Wish_Id": "",
                "User_Email_Id": user_detail?.Email_Id,
                "Product_Id": currentProduct[0]?.Product_Id
            }
            apiActions.get_wish_list(filter)
                .then(async res => {
                    if (res?.Success_Response?.Is_Data_Exist == '1') {
                        setLike(true);
                    } else {
                        setLike(false);
                    }
                })
                .catch(err => {
                    console.log(err);
                })
        }
    }

    const addToCart = () => {
        if (!Utils.checkLogin()) {
            props.navigation.navigate('SignIn')
            return;
        }
        if (currentProduct.length == 0)
            return;
        let cartProduts = store.getState()?.cart?.product;
        let flag = false;
        for (let i = 0; i < cartProduts.length; i++) {
            if (cartProduts[i].Product_Id == currentProduct[0].Product_Id) {
                flag = true;
            }
        }
        // if (flag) {
        //     Toast.show('Already exist', Toast.LONG);
        // } else {
        // Toast.show('Correctly Added', Toast.LONG);
        currentProduct[0].Amount = 1;
        var Product_Id = currentProduct[0].Product_Id;
        if (flag)
            dispatch({ type: actionTypes.CART_UPDATE, Product_Id })
        else
            dispatch({ type: actionTypes.CART_ADD, product: currentProduct[0] })
        // }
    }
    const onLikeClicked = () => {
        if (!is_like) {
            var data = {
                "User_Email_Id": user_detail?.Email_Id,
                "Product_Id": currentProduct[0]?.Product_Id,
                "Partner_Details_Id": currentProduct[0]?.Partner_Detail_Id
            }
            apiActions.create_wish_list(data)
                .then(async res => {
                    setLike(true);
                })
                .catch(err => {
                    console.log(err);
                })
        } else {
            let filter = {
                "Record_Filter": "FILTER",
                "Wish_Id": "",
                "User_Email_Id": user_detail?.Email_Id,
                "Product_Id": currentProduct[0]?.Product_Id
            }
            apiActions.get_wish_list(filter)
                .then(async res => {
                    if (res?.Success_Response?.Is_Data_Exist == '1') {
                        var wish_id = res?.Wish[0]?.Wish_List[0]?.Wish_Id;
                        var data = {
                            Wish_Id: wish_id
                        }
                        apiActions.delete_wish_list(data)
                            .then(async res => {
                                setLike(false)
                            })
                            .catch(err => {
                                console.log(err)
                            })
                    }
                })
                .catch(err => {
                    console.log(err);
                })
        }
    }
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
    const buyNow = () => {
        if (!Utils.checkLogin()) {
            props.navigation.navigate('SignIn')
            return;
        }
        props.navigation.navigate('OrderSummary', { order_list: [currentProduct[0]] });
    }
    const gotoCart = () => {
        if (!Utils.checkLogin()) {
            props.navigation.navigate('SignIn')
            return;
        }
        props.navigation.navigate('Cart')
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
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10, marginTop: 10 }}>
                <TouchableOpacity style={{ marginLeft: 5 }} onPress={() => props.navigation.goBack()}>
                    <FontAwesome5 name='angle-left' color={EStyleSheet.value('$primaryColor')} size={30}></FontAwesome5>
                </TouchableOpacity>
                {cartCount != 0 && <Text style={{ position: 'absolute', right: 5, top: 0, backgroundColor: EStyleSheet.value('$errorColor'), paddingHorizontal: 5, borderRadius: 50, zIndex: 10, color: 'white', fontSize: 10 }}>{cartCount}</Text>}
                <TouchableOpacity style={{ right: 10, position: 'absolute' }} onPress={() => gotoCart()}>
                    <Entypo name="shopping-cart" size={20} color={EStyleSheet.value('$primaryColor')}></Entypo>
                </TouchableOpacity>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={{ flexDirection: 'column' }}>
                    <View style={{ height: 250, marginTop: 10 }}>
                        {!loading && currentProduct[0]?.Product_Images.length > 0 &&
                            <View style={{ position: 'absolute', right: 20, backgroundColor: EStyleSheet.value('$placeColor'), zIndex: 100, borderRadius: 10, minWidth: 30, opacity: 0.8 }}>
                                <Text style={{ color: 'white', textAlign: 'center' }}>{currentProduct[0]?.Product_Images.length}/{image_index}</Text>
                            </View>
                        }
                        {loading ? <BallIndicator color={EStyleSheet.value('$primaryColor')} /> : currentProduct.length > 0 && currentProduct[0]?.Product_Images.length > 0 &&
                            <ImageSlider
                                setImageIndex={setImageIndex}
                                autoPlayWithInterval={5000}
                                images={currentProduct[0]?.Product_Images}
                                customSlide={({ index, item, style, width }) => (
                                    // It's important to put style here because it's got offset inside
                                    <View key={index} style={[styles.customSlide, { width: Utils.SCREEN.WIDTH, backgroundColor: 'white' }]}>
                                        <Image source={{ uri: item }} style={[styles.customImage, { resizeMode: 'contain', width: Utils.SCREEN.WIDTH }]} />
                                    </View>
                                )}
                                customButtons={(position, move) => {
                                    setImageIndex(position % currentProduct[0]?.Product_Images?.length + 1);
                                    return (
                                        <View style={styles.buttons}>
                                            {currentProduct[0]?.Product_Images?.map((image, index) => {
                                                return (
                                                    <TouchableHighlight
                                                        key={index}
                                                        underlayColor="#ccc"
                                                        onPress={() => move(index)}
                                                        style={position % currentProduct[0]?.Product_Images?.length === index ? styles.buttonSelected : styles.button}
                                                    >
                                                        <Text>
                                                        </Text>
                                                    </TouchableHighlight>
                                                );
                                            })}
                                        </View>
                                    )
                                }
                                }
                            />
                        }
                    </View>
                    <View style={{ flexDirection: 'row', marginTop: 10, alignItems: 'center' }}>
                        <TouchableWithoutFeedback onPress={() => onLikeClicked()}>
                            <View style={{
                                marginLeft: 10,
                                padding: 5,
                                backgroundColor: 'white',
                                borderRadius: 50,
                                shadowOffset: { width: 0, height: 2 },
                                shadowOpacity: 0.8,
                                shadowRadius: 10,
                                elevation: 10
                            }}>
                                <FontAwesome name={is_like ? 'heart' : 'heart-o'} color={EStyleSheet.value('$errorColor')} size={20}></FontAwesome>
                            </View>
                        </TouchableWithoutFeedback>
                        <Text style={{ marginLeft: 20, fontSize: 16, fontWeight: 'bold' }}>Brand: {!loading && currentProduct[0]?.Brand_Name}</Text>
                    </View>
                </View>
                <View style={{ flexDirection: 'row' }}>
                    <TouchableWithoutFeedback onPress={() => {
                        setViewIndex(1);
                    }}>
                        <View style={viewIndex == 1 ? styles.btn_seleted : styles.btn}>
                            <Text style={{ color: viewIndex == 1 ? 'white' : EStyleSheet.value('$primaryColor'), fontSize: 18 }}>Product</Text>
                        </View>
                    </TouchableWithoutFeedback>
                    <TouchableWithoutFeedback onPress={() => { setViewIndex(2); }}>
                        <View style={viewIndex == 2 ? styles.btn_seleted : styles.btn}>
                            <Text style={{ color: viewIndex == 2 ? 'white' : EStyleSheet.value('$primaryColor'), fontSize: 18 }}>Detail</Text>
                        </View>
                    </TouchableWithoutFeedback>
                    <TouchableWithoutFeedback onPress={() => { setViewIndex(3); }}>
                        <View style={viewIndex == 3 ? styles.btn_seleted : styles.btn}>
                            <Text style={{ color: viewIndex == 3 ? 'white' : EStyleSheet.value('$primaryColor'), fontSize: 18 }}>Review</Text>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
                <View style={{ minHeight: 150 }}>
                    {!loading &&
                        <>
                            {viewIndex == 1 &&
                                <View style={{ flexDirection: 'row', padding: 10 }}>
                                    <View style={{ flexDirection: 'column', width: '90%' }}>
                                        <Text style={{ fontSize: 18, color: EStyleSheet.value('$primaryColor') }}>{currentProduct[0]?.Product_Name}</Text>
                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                            <Text style={{ textDecorationLine: 'line-through', marginRight: 8, fontSize: 12, color: EStyleSheet.value('$placeColor') }}>₹ {currentProduct[0]?.Original_Price}</Text>
                                            <Text style={{ color: EStyleSheet.value('$categoryColor'), fontSize: 14, fontWeight: 'bold' }}>₹{currentProduct[0]?.Partner_Selling_Price}</Text>
                                        </View>
                                    </View>
                                    <View style={{ flexDirection: 'row', justifyContent: 'flex-end', flex: 1, height: 40 }}>
                                        <View style={{
                                            flexDirection: 'row', backgroundColor: EStyleSheet.value('$primaryColor'),
                                            alignItems: 'center', height: '50%', borderRadius: 50, minWidth: 50, justifyContent: 'center'
                                        }}>
                                            <Text style={{ color: 'white', fontSize: 14, textAlign: 'center' }}>{currentProduct[0]?.Esi_Rating}</Text>
                                            <Entypo name="star" size={14} color={EStyleSheet.value('$primaryColor')} color={'white'}></Entypo>
                                        </View>
                                    </View>
                                </View>
                            }
                            {viewIndex == 2 &&
                                <View style={{ padding: 10 }}>
                                    <View style={{ flexDirection: 'row' }}>
                                        <MaterialIcons name="description" size={20} color={EStyleSheet.value('$primaryColor')}></MaterialIcons>
                                        <Text style={{ fontSize: 18 }}>Description</Text>
                                    </View>
                                    <HTMLView value={currentProduct[0]?.Product_Description}></HTMLView>
                                </View>
                            }
                            {viewIndex == 3 &&
                                <View style={{ padding: 10 }}>
                                    <View style={{ flexDirection: 'row', marginBottom: 10 }}>
                                        <Feather name="thumbs-up" size={20} color={EStyleSheet.value('$primaryColor')}></Feather>
                                        <Text style={{ fontSize: 18, marginLeft: 10 }}>Product Reviews</Text>
                                    </View>
                                    <View>
                                        {reviews?.map((item, index) => (
                                            <View key={index}>
                                                <View style={{ flexDirection: 'row' }}>
                                                    <View style={{ backgroundColor: EStyleSheet.value('$primaryColor'), borderRadius: 50, marginRight: 10, padding: 5 }}>
                                                        <Feather name="user" size={20} color={'white'}></Feather>
                                                    </View>
                                                    <View>
                                                        <Text>{item.Email_Id}</Text>
                                                        <Text style={{ fontSize: 10 }}>{item.Created_Date}</Text>
                                                    </View>
                                                    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-end' }}>
                                                        <View style={{
                                                            flexDirection: 'row', backgroundColor: EStyleSheet.value('$primaryColor'),
                                                            alignItems: 'center', height: 20, borderRadius: 50, minWidth: 50, justifyContent: 'center'
                                                        }}>
                                                            <Text style={{ color: 'white', fontSize: 14, textAlign: 'center' }}>{item?.Rating}</Text>
                                                            <Entypo name="star" size={14} color={EStyleSheet.value('$primaryColor')} color={'white'}></Entypo>
                                                        </View>
                                                    </View>
                                                </View>
                                                <Text style={{ margin: 5 }}>{item.Comments}</Text>
                                            </View>
                                        ))}
                                    </View>
                                </View>
                            }
                        </>
                    }
                    {related_loading ? <BallIndicator color={EStyleSheet.value('$primaryColor')} /> :
                        <>
                            <View style={{ marginTop: 10, marginLeft: 10 }}>
                                <Text style={{ fontSize: 16, color: EStyleSheet.value('$grayColor') }}>Related Products</Text>
                            </View>
                            <FlatList
                                contentContainerStyle={{ paddingVertical: 10 }}
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                data={related_products}
                                renderItem={RenderItem}
                                keyExtractor={(item, index) => item.Product_Id + '-' + index}
                            />
                        </>
                    }
                </View>
            </ScrollView>
            <View style={{ flexDirection: 'row', height: 60, backgroundColor: EStyleSheet.value('$primaryColor') }}>
                <TouchableOpacity onPress={() => addToCart()} style={{ flex: 1, backgroundColor: 'white', margin: 3, justifyContent: 'center' }}>
                    <Text style={{ textAlign: 'center', fontSize: 20 }}>Add to Cart</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => buyNow()} style={{ flex: 1, margin: 3, justifyContent: 'center' }}>
                    <Text style={{ fontSize: 20, textAlign: 'center', color: 'white' }}>BUY NOW !</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}

export default ProductDetails