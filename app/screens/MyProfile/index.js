import { actionTypes, apiActions } from "@actions";
import profile from '@assets/images/ic_empty_user.png';
import { Button } from "@components";
import HeaderContent from '@components/HeaderContent';
import { BaseStyle } from "@config";
import { useFocusEffect } from "@react-navigation/native";
import { store } from "@store";
import React from "react";
import { Image, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from "react-native";
import EStyleSheet from 'react-native-extended-stylesheet';
import Fontisto from 'react-native-vector-icons/Fontisto';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { connect } from "react-redux";
import styles from './styles';
import * as Utils from '@utils';

const MyProfile = (props) => {
    const user_detail = store?.getState()?.auth?.login?.user;
    useFocusEffect(
        React.useCallback(() => {
            let email = user_detail?.Email_Id;
            let filter = {
                "Records_Filter": "FILTER",
                "Email_Id": email,
                "User_Details_Id": "",
                "First_Name": "",
                "Last_Name ": "",
            }
            apiActions.get_user_details(filter)
                .then(async res => {
                    if (res?.Success_Response?.Is_Data_Exist == '1') {
                        let data = {
                            success: true,
                            user: res.User_Details[0],
                        };
                        props.dispatch({ type: actionTypes.LOGIN, data })
                    }
                })
                .catch(err => {
                    console.log(err);
                })
        }, [])
    );
    return (
        <SafeAreaView
            style={[BaseStyle.safeAreaView]}
            forceInset={{ top: "always" }}
        >
            <HeaderContent {...props} title="My Account"></HeaderContent>
            {!Utils.checkLogin() ?
                <View style={{ justifyContent: 'center', flex: 1, alignItems: 'center' }}>
                    <TouchableOpacity onPress={() => props.navigation.navigate('SignIn')} style={{ backgroundColor: EStyleSheet.value('$primaryColor'), padding: 10 }}>
                        <Text style={{ color: 'white', fontSize: 20, fontWeight: '600' }}>Login</Text>
                    </TouchableOpacity>
                </View>
                :
                <ScrollView>
                    <View style={{ flexDirection: 'row', padding: 10 }}>
                        <View style={{ flex: 1, flexDirection: 'column' }}>
                            <Text style={{ fontSize: 20, fontWeight: '800' }}>{user_detail?.Full_Name}</Text>
                            <Text style={{ fontSize: 16 }}>{user_detail?.Email_Id}</Text>
                        </View>
                        <View style={{ flex: 0.5, alignItems: 'flex-end' }}>
                            <Image source={user_detail?.Profile_Pic_Path ? { uri: user_detail?.Profile_Pic_Path } : profile} style={{ width: 55, height: 55, borderRadius: 50 }}></Image>
                        </View>
                    </View>
                    <View style={[styles.content, { minHeight: 200 }]}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                            <Ionicons name="person" size={30} color={EStyleSheet.value('$primaryColor')}></Ionicons>
                            <Text style={{ fontSize: 20, paddingLeft: 10 }}>Personal Details</Text>
                            <View style={{ flex: 1, alignItems: 'flex-end' }}>
                                <TouchableOpacity onPress={() => props.navigation.navigate('ProfileEdit')}>
                                    <Text style={{ color: EStyleSheet.value('$primaryColor'), fontSize: 18 }}>Edit</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={{ flex: 1, flexDirection: 'row', marginTop: 10 }}>
                            <Text style={{ fontSize: 15, flex: 0.5 }}>Full Name</Text>
                            <Text style={{ fontSize: 16, textAlign: 'right', flex: 1 }}>{user_detail?.Full_Name}</Text>
                        </View>
                        <View style={{ flex: 1, flexDirection: 'row' }}>
                            <Text style={{ fontSize: 15, flex: 0.5 }}>Email</Text>
                            <Text style={{ fontSize: 16, textAlign: 'right', flex: 1 }}>{user_detail?.Email_Id}</Text>
                        </View>
                        <View style={{ flex: 1, flexDirection: 'row' }}>
                            <Text style={{ fontSize: 15, flex: 0.5 }}>Gender</Text>
                            <Text style={{ fontSize: 16, textAlign: 'right', flex: 1 }}>{user_detail?.Gender}</Text>
                        </View>
                        <View style={{ flex: 1, flexDirection: 'row' }}>
                            <Text style={{ fontSize: 15, flex: 0.5 }}>Birth Date</Text>
                            <Text style={{ fontSize: 16, textAlign: 'right', flex: 1 }}>{user_detail?.Dob}</Text>
                        </View>
                    </View>
                    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-end', marginHorizontal: 20 }}>
                        <Button
                            full
                            onPress={() => {
                                props.navigation.navigate('ResetPassword')
                            }}
                        >
                            Change Password
                        </Button>
                    </View>
                    <View style={[styles.content, { height: 150 }]}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Fontisto name="player-settings" size={30} color={EStyleSheet.value('$primaryColor')}></Fontisto>
                            <Text style={{ fontSize: 20, paddingLeft: 10 }}>Profile Setting</Text>
                        </View>
                        <View style={{ flexDirection: 'row', marginTop: 15 }}>
                            <MaterialIcons name="local-shipping" size={20} color={EStyleSheet.value('$primaryColor')} style={{ marginRight: 10, marginLeft: 5 }}></MaterialIcons>
                            <Text style={{ fontSize: 15 }}>Shipping Addresses</Text>
                        </View>
                        <View style={{ flexDirection: 'row', marginTop: 15 }}>
                            <MaterialIcons name="contact-support" size={20} color={EStyleSheet.value('$primaryColor')} style={{ marginRight: 10, marginLeft: 5 }}></MaterialIcons>
                            <Text style={{ fontSize: 15 }}>Help & Support</Text>
                        </View>
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

export default connect(mapStateToProps, mapDispatchToProps)(MyProfile);