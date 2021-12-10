import React, { Component, useEffect, useState, useRef } from "react"
import { View, TextInput, SafeAreaView, ScrollView, TouchableOpacity, Image, FlatList, Dimensions, TouchableOpacityComponent, Text, TouchableWithoutFeedback } from "react-native";
import { apiActions, actionTypes } from "@actions";
import EStyleSheet from 'react-native-extended-stylesheet';
import { BaseStyle, Images, BaseConfig } from "@config";
import BackAllow from '@assets/images/go-back-arrow.svg';
import styles from './styles';
import { Button } from "@components";
import Toast from 'react-native-simple-toast';
import * as Utils from "@utils";
import { store } from "@store";
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const ForgotPassword = (props) => {
    const user_detail = store?.getState()?.auth?.login?.user;
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [cpassword, setCPassword] = useState("");
    const [showPass, setShowPass] = useState(true);
    const [showCPass, setShowCPass] = useState(true);
    const changePass = () => {
        if (email == "") {
            Toast.show("Please enter email address", Toast.LONG);
            return;
        } else if (!Utils.EMAIL_VALIDATE.test(String(email).toLowerCase())) {
            Toast.show("Please enter valid email address", Toast.LONG);
            return;
        } else if (password == "") {
            Toast.show("Please enter password", Toast.LONG);
            return;
        } else if (!password.match(Utils?.PASSPORT_VALIDATE)) {
            Toast.show('Password must contain at least 8 characters, including UPPER/lowercase and numbers', Toast.LONG);
            return;
        } else if (cpassword == "") {
            Toast.show("Please enter confirm password", Toast.LONG);
            return;
        } else if (cpassword != password) {
            Toast.show("Confirm password should be same", Toast.LONG);
            return;
        }
        var data = {
            "Email_Id": email,
            "Password": password
        }
        apiActions.reset_password(data)
            .then((res) => {
                Toast.show(res.UI_Display_Message, Toast.LONG);
                props.navigation.goBack();
            })
            .catch(err => {
                console.log(err);
            })
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
                    <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'white' }}>Forgot Password</Text>
                </View>
            </View>
            <View style={{ flexDirection: 'column', paddingVertical: 20 }}>
                <View style={styles.input_style}>
                    <Text style={styles.input_field}>Email:</Text>
                    <TextInput
                        style={{ paddingVertical: 5, fontSize: 16, flex: 1 }}
                        value={email}
                        onChangeText={(value) => setEmail(value)}
                        multiline={false}
                        selectionColor={EStyleSheet.value('$primaryColor')}
                    />
                </View>
            </View>
            <View style={{ flexDirection: 'column', paddingBottom: 20 }}>
                <View style={styles.input_style}>
                    <TextInput
                        style={{ paddingVertical: 5, fontSize: 16, flex: 1 }}
                        value={password}
                        onChangeText={(value) => setPassword(value)}
                        multiline={false}
                        secureTextEntry={showPass}
                        placeholder="New Password"
                        selectionColor={EStyleSheet.value('$primaryColor')}
                    />
                    <FontAwesome onPress={() => setShowPass(!showPass)} name={showPass ? 'eye-slash' : 'eye'} size={30} color={EStyleSheet.value('$primaryColor')} style={{ position: 'absolute', right: 15 }}></FontAwesome>
                </View>
            </View>
            <View style={{ flexDirection: 'column', paddingBottom: 20 }}>
                <View style={styles.input_style}>
                    <TextInput
                        style={{ paddingVertical: 5, fontSize: 16, flex: 1 }}
                        value={cpassword}
                        onChangeText={(value) => setCPassword(value)}
                        placeholder="Confirm Password"
                        multiline={false}
                        secureTextEntry={showCPass}
                        selectionColor={EStyleSheet.value('$primaryColor')}
                    />
                    <FontAwesome onPress={() => setShowCPass(!showCPass)} name={showCPass ? 'eye-slash' : 'eye'} size={30} color={EStyleSheet.value('$primaryColor')} style={{ position: 'absolute', right: 15 }}></FontAwesome>
                </View>
            </View>
            <View style={{
                flex: 1, flexDirection: 'row', justifyContent: 'flex-end', marginHorizontal: 20,
                alignItems: 'flex-end', marginBottom: 20
            }}>
                <Button
                    full
                    onPress={changePass}
                >
                    Confirm
                </Button>
            </View>
        </SafeAreaView>
    )
}

export default ForgotPassword;