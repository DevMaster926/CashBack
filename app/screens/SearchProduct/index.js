import { BaseStyle } from "@config";
import { useFocusEffect } from "@react-navigation/native";
import React, { useEffect, useRef, useState } from "react";
import { SafeAreaView, TextInput, TouchableOpacity, View, ScrollView, Text, TouchableWithoutFeedback } from "react-native";
import EStyleSheet from 'react-native-extended-stylesheet';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import * as Utils from '@utils';
import { actionTypes, apiActions } from "@actions";
import Tags from "react-native-tags";
import { store } from "@store";
const SearchProduct = (props) => {
    const textInput = useRef();
    const dispatch = useDispatch();
    const [searchText, setSearchText] = useState("");
    const [searchProduts, setSearchProducts] = useState([]);
    const { currentState } = useSelector(
        (state) => ({ currentState: state.search }),
        shallowEqual
    );
    const { product } = currentState;
    useEffect(() => {
        // setSearchProducts(searchProduts => [...searchProduts, store.getState()?.search?.product[0]])
        setSearchProducts(store.getState()?.search?.product)
    }, [product.length])

    const [searchResult, setSearchResult] = useState([]);
    const onSearch = (text) => {
        setSearchText(text);
        if(text == "") {
            setSearchResult([]);
            return;
        }
        var data = {
            "Product_Name": text + '%',
            "Brand_Name": ""
        }
        apiActions.search_products(data)
            .then(async res => {
                console.log(res);
                if (res?.Success_Response?.Is_Data_Exist == '1') {
                    setSearchResult(res?.Product_Details);
                }
                else
                    setSearchResult([]);
            })
            .catch(err => {
                console.log(err);
                setSearchResult([]);
            })
    }
    const addToSearchHistory = (item) => {
        let flag = false;
        for (let i = 0; i < searchProduts.length; i++) {
            if (searchProduts[i].Product_Id == item.Product_Id) {
                flag = true;
            }
        }
        if (!flag)
            dispatch({ type: actionTypes.SEARCH_ADD, product: item });
        
        setSearchResult([]);
        props.navigation.navigate('ProductDetails', { Product_Id: item?.Product_Id })
    }
    const removeHistory = (Product_Id) => {
        dispatch({ type: actionTypes.SEARCH_REMOVE, Product_Id })
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
                        ref={textInput}
                        value={searchText}
                        autoFocus={true}
                        onChangeText={(text) => onSearch(text)}
                        style={{ fontSize: 16, color: EStyleSheet.value('$primaryColor'), flex: 1, paddingVertical: 5 }}
                        placeholderTextColor={EStyleSheet.value('$placeColor')}
                        multiline={false}
                        placeholder="Search for anything" />
                </View>
            </View>
            {searchResult?.length > 0 &&
                <ScrollView style={{ position: 'absolute', backgroundColor: 'white', marginLeft: 55, width: '80%', marginTop: 48, borderColor: EStyleSheet.value('$contentColor1'), borderWidth: 1 }}>
                    {searchResult?.map((item, index) => {
                        return (
                            <TouchableOpacity onPress={() => { addToSearchHistory(item) }} key={index} style={{ paddingHorizontal: 10, paddingVertical: 10, borderBottomWidth: 1, borderColor: EStyleSheet.value('$contentColor1'), flexDirection: 'row' }}>
                                <Text>{item.Product_Name}  </Text>
                                <Text>{item.Brand_Name}</Text>
                            </TouchableOpacity>
                        )
                    })}
                </ScrollView>
            }
            <TouchableWithoutFeedback onPress={() => setSearchResult([])}>
                <View style={{ zIndex: -1, flex: 1 }}>
                    <Text style={{ fontSize: 16, marginLeft: 10, marginTop: 10 }}>Recent Searches</Text>
                    <View style={{ flexWrap: 'wrap', flexDirection: 'row' }}>
                        {searchProduts?.map((item, index) => {
                            return (
                                <View key={`${index}`} style={{
                                    backgroundColor: EStyleSheet.value('$contentColor1'),
                                    marginHorizontal: 10,
                                    marginVertical: 5,
                                    padding: 5,
                                    paddingHorizontal: 10,
                                    borderRadius: 15,
                                    flexDirection: 'row',
                                }}>
                                    <TouchableOpacity onPress={() => props.navigation.navigate('ProductDetails', { Product_Id: item?.Product_Id })}>
                                        <Text style={[{
                                            fontSize: 14,
                                            color: 'black'
                                        }]}>{item?.Product_Name}  {item?.Brand_Name}</Text>
                                    </TouchableOpacity>
                                    <TouchableWithoutFeedback onPress={() => removeHistory(item?.Product_Id)} >
                                        <Text style={{ paddingLeft: 15, color: EStyleSheet.value('$productColor') }}>X</Text>
                                    </TouchableWithoutFeedback>
                                </View>
                            )
                        })}
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </SafeAreaView>
    )
}

export default SearchProduct