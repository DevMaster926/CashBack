import CashBack from '@assets/images/cashback.png';
import React, { useEffect, useState } from "react";
import { Image, Text, TextInput, TouchableOpacity, View } from "react-native";
import EStyleSheet from 'react-native-extended-stylesheet';
import LinearGradient from 'react-native-linear-gradient';
import Entypo from 'react-native-vector-icons/Entypo';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { shallowEqual, useSelector } from "react-redux";
import { store } from "@store";
import styles from './styles';
import * as Utils from '@utils';
const HeaderContent = (props) => {
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
        <View style={{ backgroundColor: EStyleSheet.value('$primaryColor') }}>
            <LinearGradient
                colors={[EStyleSheet.value('$mainColor1'), EStyleSheet.value('$primaryColor')]}
                start={{ x: 0.0, y: 0.25 }}
                end={{ x: 1, y: 1.0 }}
                locations={[0, 0.6]}
                style={{ padding: 10 }}
            >
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <TouchableOpacity
                        style={{ margin: 5 }}
                        onPress={() => props.navigation.dangerouslyGetParent().dangerouslyGetParent().openDrawer()}>
                        <EvilIcons name="navicon" size={40} color="white" />
                    </TouchableOpacity>
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingRight: 60 }}>
                        <Image source={CashBack} style={{ height: 45, width: 100, resizeMode: 'contain' }} />
                    </View>
                    {cartCount != 0 && <Text style={[styles.cart_count]}>{cartCount}</Text>}
                    <TouchableOpacity
                        style={[styles.cart_icon]}
                        onPress={() => gotoCart()}>
                        <Entypo name="shopping-cart" size={20} color={EStyleSheet.value('$primaryColor')} />
                    </TouchableOpacity>
                </View>
                <View style={[styles.search]}>
                    <EvilIcons name="search"
                        size={25}
                        color={EStyleSheet.value('$primaryColor')}
                        style={{ margin: 5 }} />
                    <TextInput
                        onTouchStart={() => props.navigation.navigate('SearchProduct')}
                        style={{ fontSize: 15, color: EStyleSheet.value('$primaryColor'), marginRight: 40, flex: 1 }} placeholderTextColor={EStyleSheet.value('$primaryColor')}
                        placeholder="Email Address"
                        multiline={false}
                        placeholder="Search for anything" />
                    <TouchableOpacity
                        style={{ margin: 5, position: 'absolute', right: 10 }}
                        onPress={() => props.navigation.dangerouslyGetParent().openDrawer()}>
                        <FontAwesome name="sliders" size={22} color={EStyleSheet.value('$primaryColor')} />
                    </TouchableOpacity>
                </View>
            </LinearGradient>
        </View>
    )
}

export default HeaderContent