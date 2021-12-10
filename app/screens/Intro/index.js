import { actionTypes } from "@actions";
import { BaseStyle } from "@config";
import React, { useEffect, useState } from "react";
import { Image, Linking, Text, TouchableHighlight, View, SafeAreaView, TouchableOpacity } from "react-native";
import EStyleSheet from 'react-native-extended-stylesheet';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useDispatch } from "react-redux";
import Intro_2 from '../../assets/images/login-visual-1.svg';
import { default as Intro_1, default as Intro_3 } from '../../assets/images/login-visual-3.svg';
import ImageSlider from 'react-native-image-slider';
import Onboarding from 'react-native-onboarding-swiper';
import * as Utils from '@utils';
import styles from "./styles";
const Intro = ({ navigation }) => {
    const [pageNumber, setPage] = useState(0);
    const banner = [Intro_1, Intro_3, Intro_1];
    const dispatch = useDispatch();
    useEffect(() => {
        let data = {
            success: false,
        };
        dispatch({ type: actionTypes.LOGIN, data })
        return;
    }, [])
    const onSkip = () => {
        console.log('sss')
        const data = {
            splash: true
        }
        dispatch({ type: actionTypes.SPLASH, data });
        setTimeout(() => {
            try {
                return navigation.navigate('Main');
            } catch (err) {

            }
        }, 500)
    }
    const nextSkip = () => {
        if (pageNumber == 2) {
            return;
        }
        setPage(pageNumber + 1);
    }

    const preSkip = () => {
        if (pageNumber == 0) {
            return;
        }
        setPage(pageNumber - 1);
    }
    return (
        <SafeAreaView
            style={BaseStyle.safeAreaView}
            forceInset={{ top: "always" }}
        >
            <TouchableOpacity onPress={() => { onSkip() }} style={{ borderRadius: 50, backgroundColor: EStyleSheet.value('$primaryColor'), width: 60, padding: 5, justifyContent: 'center', alignItems: 'center', position: 'absolute', right: 5, marginTop: 5, zIndex: 100 }}>
                <Text style={{ fontWeight: 'bold', fontSize: 12, color: 'white' }}>Skip</Text>
            </TouchableOpacity>
            <ImageSlider
                images={banner}
                customSlide={({ index, item, style, width }) => (

                    // It's important to put style here because it's got offset inside
                    <View key={index} style={[{ width: Utils.SCREEN.WIDTH, backgroundColor: 'white' }]}>
                        <View style={{ flex: 1 }}>

                            <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
                                {index == 0 && <Intro_1 width={350} height={350}></Intro_1>}
                                {index == 1 && <Intro_2 width={350} height={350}></Intro_2>}
                                {index == 2 && <Intro_3 width={350} height={350}></Intro_3>}
                            </View>
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={{ color: EStyleSheet.value('$primaryColor'), fontSize: 25, fontWeight: 'bold', textAlign: 'center' }}>
                                Welcome To ESI Cashback
                            </Text>
                            <Text style={{ textAlign: 'center', fontSize: 15, padding: 10, fontWeight: '100', margin: 10 }}>
                                Lorem Ipsum is simply dummy text of the printing
                                and typesetting industry. Lorem Ipsum has been
                                the industry's standard dummy text ever since
                                the 1500s, when an unknown printer took a
                                galley of type and scrambled it to make a type
                                specimen book.
                            </Text>
                            <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
                                {index == 2 && <TouchableOpacity onPress={() => onSkip()} style={{ borderRadius: 50, borderWidth: 2, borderColor: EStyleSheet.value('$primaryColor'), padding: 10, paddingLeft: 30, paddingRight: 30 }}>
                                    <Text style={{ fontSize: 20, color: EStyleSheet.value('$primaryColor') }}>Start Exploring</Text>
                                </TouchableOpacity>}
                            </View>
                        </View>
                    </View>
                )}
                customButtons={(position, move) => {
                    return (
                        <View style={styles.buttons}>
                            {banner?.map((image, index) => {
                                return (
                                    <TouchableHighlight
                                        key={index}
                                        underlayColor="#ccc"
                                        onPress={() => move(index)}
                                        style={position % banner?.length === index ? styles.buttonSelected : styles.button}
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
            {/* <View style={{ flex: 1 }}>
                <TouchableOpacity onPress={() => { onSkip() }} style={{ borderRadius: 50, backgroundColor: EStyleSheet.value('$primaryColor'), width: 60, padding: 5, justifyContent: 'center', alignItems: 'center', position: 'absolute', right: 5, marginTop: 5, zIndex: 100 }}>
                    <Text style={{ fontWeight: 'bold', fontSize: 12, color: 'white' }}>Skip</Text>
                </TouchableOpacity>
                <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
                    {pageNumber == 0 && <Intro_1 width={350} height={350}></Intro_1>}
                    {pageNumber == 1 && <Intro_2 width={350} height={350}></Intro_2>}
                    {pageNumber == 2 && <Intro_3 width={350} height={350}></Intro_3>}
                </View>
            </View>
            <View style={{ flex: 1 }}>
                <Text style={{ color: EStyleSheet.value('$primaryColor'), fontSize: 25, fontWeight: 'bold', textAlign: 'center' }}>
                    Welcome To ESI Cashback
                </Text>
                <Text style={{ textAlign: 'center', fontSize: 15, padding: 10, fontWeight: '100', margin: 10 }}>
                    Lorem Ipsum is simply dummy text of the printing
                    and typesetting industry. Lorem Ipsum has been
                    the industry's standard dummy text ever since
                    the 1500s, when an unknown printer took a
                    galley of type and scrambled it to make a type
                    specimen book.
                </Text>
                <View style={{ marginTop: 30, flexDirection: 'row' }}>
                    <View style={{ flex: 1 }}>
                        {(pageNumber == 1 || pageNumber == 2) &&
                            <TouchableOpacity onPress={() => preSkip()} style={{ backgroundColor: EStyleSheet.value('$primaryColor'), height: 45, width: 70, borderTopRightRadius: 50, borderBottomRightRadius: 50, alignItems: 'center', justifyContent: 'center' }}>
                                <AntDesign name="arrowleft" color="#ffffff" size={30}></AntDesign>
                            </TouchableOpacity>
                        }
                    </View>
                    <View style={{ alignItems: 'center', flexDirection: 'row', justifyContent: 'center', flex: 1 }}>
                        {pageNumber == 0 ? <View style={{ height: 15, width: 15, borderRadius: 50, backgroundColor: EStyleSheet.value('$primaryColor') }}></View> : <View style={{ height: 15, width: 15, borderRadius: 50, borderWidth: 1, borderColor: EStyleSheet.value('$errorColor') }}></View>}
                        {pageNumber == 1 ? <View style={{ height: 15, width: 15, borderRadius: 50, margin: 10, backgroundColor: EStyleSheet.value('$primaryColor') }}></View> : <View style={{ height: 15, width: 15, borderRadius: 50, margin: 10, borderWidth: 1, borderColor: EStyleSheet.value('$errorColor') }}></View>}
                        {pageNumber == 2 ? <View style={{ height: 15, width: 15, borderRadius: 50, backgroundColor: EStyleSheet.value('$primaryColor') }}></View> : <View style={{ height: 15, width: 15, borderRadius: 50, borderWidth: 1, borderColor: EStyleSheet.value('$errorColor') }}></View>}
                    </View>
                    <View style={{ flex: 1, alignItems: 'flex-end' }}>
                        {(pageNumber == 0 || pageNumber == 1) &&
                            <TouchableOpacity onPress={() => nextSkip()} style={{ backgroundColor: EStyleSheet.value('$primaryColor'), height: 45, width: 70, borderTopLeftRadius: 50, borderBottomLeftRadius: 50, alignItems: 'center', justifyContent: 'center' }}>
                                <AntDesign name="arrowright" color="#ffffff" size={30}></AntDesign>
                            </TouchableOpacity>
                        }
                    </View>
                </View>
                <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
                    {pageNumber == 2 && <TouchableOpacity onPress={() => onSkip()} style={{ borderRadius: 50, borderWidth: 2, borderColor: EStyleSheet.value('$primaryColor'), padding: 10, paddingLeft: 30, paddingRight: 30 }}>
                        <Text style={{ fontSize: 25, color: EStyleSheet.value('$primaryColor') }}>Start Exploring</Text>
                    </TouchableOpacity>}
                </View>
            </View> */}
        </SafeAreaView>
    )
}

export default Intro;