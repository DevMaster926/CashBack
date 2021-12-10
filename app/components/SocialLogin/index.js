import { actionTypes, apiActions } from "@actions";
import FaceBook from '@assets/images/facebook-svgrepo-com.svg';
import Google from '@assets/images/google-svgrepo-com.svg';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { LoginManager } from 'react-native-fbsdk';
import RNRestart from 'react-native-restart';
import Toast from 'react-native-simple-toast';
import { useDispatch } from "react-redux";

const SocialLogin = (props) => {
    const dispatch = useDispatch();
    const logIn = (email) => {
        let data = {
            "Email_Id": email,
            "Login_Type": 'Social'
        }
        apiActions.login(data)
            .then(async res => {
                console.log(res);
                Toast.show(res?.UI_Display_Message, Toast.LONG);
                if(res?.Response_Status == 'Success') {
                    var data = {
                        success: true,
                        user: { Email_Id: email },
                    };
                    dispatch({ type: actionTypes.LOGIN, data })
                    setTimeout(() => {
                        try {
                            props.navigation.goBack();
                        } catch (err) {
                        }
                    }, 500);
                }
            })
            .catch(err => {
                var data = {
                    success: true,
                    user: { Email_Id: email },
                };
                dispatch({ type: actionTypes.LOGIN, data })
                setTimeout(() => {
                    try {
                        props.navigation.goBack();
                    } catch (err) {
                    }
                }, 500);
                console.log(err);
            })
    }
    const facebookSignIn = async () => {
        try {
            // Attempt login with permissions
            const result = await LoginManager.logInWithPermissions(['public_profile', 'email']);
            // Toast.show(JSON.stringify(result), Toast.LONG);
            if (result.isCancelled) {
                throw 'User cancelled the login process';
            }
            logIn(result?.email);
            LoginManager.logOut();
        } catch (err) {
            console.log(err)
        }
    }
    const googleSignIn = async () => {
        try {
            await GoogleSignin.hasPlayServices();
            const { user } = await GoogleSignin.signIn();
            logIn(user?.email);
            GoogleSignin.signOut();
            // this.setState({ userInfo });
            // const userInfo = await GoogleSignin.signIn();
        } catch (error) {
            if (error.code === statusCodes.SIGN_IN_CANCELLED) {
                console.log('cancalled')
                // user cancelled the login flow
            } else if (error.code === statusCodes.IN_PROGRESS) {
                console.log('sign in')
                // operation (f.e. sign in) is in progress already
            } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
                console.log('play')
                // play services not available or outdated
            } else {
                // some other error happened
                console.log(error.code)
            }
        }
    };

    return (
        <>
            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 20 }}>
                <View style={{ height: 0.5, borderWidth: 0.2, flex: 1 }}></View>
                <View>
                    <Text>OR</Text>
                </View>
                <View style={{ height: 0.5, borderWidth: 0.2, flex: 1 }}></View>
            </View>
            <View style={{ flexDirection: 'row', marginTop: 25 }}>
                <TouchableOpacity onPress={() => facebookSignIn()} style={{ flex: 1, flexDirection: 'row', padding: 10, justifyContent: 'center', alignItems: 'center', borderWidth: 0.2, borderRadius: 5 }}>
                    <FaceBook width={25} height={25} />
                    <Text>Facebook</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => googleSignIn()} style={{ flex: 1, marginLeft: 20, flexDirection: 'row', padding: 10, justifyContent: 'center', alignItems: 'center', borderWidth: 0.2, borderRadius: 5 }}>
                    <Google width={25} height={25} />
                    <Text>Google</Text>
                </TouchableOpacity>
            </View>
        </>
    )
}

export default SocialLogin;