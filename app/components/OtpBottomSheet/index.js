import { actionTypes, apiActions } from "@actions";
import { store } from "@store";
import * as Utils from '@utils';
import React, { useEffect, useRef, useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { BottomSheet } from 'react-native-elements';
import EStyleSheet from "react-native-extended-stylesheet";
import RNRestart from 'react-native-restart';
import Toast from 'react-native-simple-toast';
import { useDispatch } from "react-redux";

const OtpBottomSheet = ({ showOtp, _this, loginType, phone, email }) => {
    const dispatch = useDispatch();
    const otpRef = useRef();
    const [otpCode, setOtpCode] = useState("");
    useEffect(() => {
        setOtpCode("");
    }, [showOtp])
    const emailVerification = () => {
        if (otpCode != "") {
            if(loginType == 0) {
                var data = {
                    Email_Id: email,
                    E_Verification_Code: otpCode
                }
                apiActions.email_verification(data)
                    .then(async res => {
                        _this.setState({ showOtp: false })
                        Toast.show(res?.UI_Display_Message, Toast.LONG);
                        let data = {
                            success: true,
                            user: { Email_Id: email },
                        };
                        dispatch({ type: actionTypes.LOGIN, data })
                        setTimeout(() => {
                            try {
                                _this.props.navigation.goBack();
                            } catch (err) {
                            }
                        }, 500);
                    })
                    .catch(err => {
                        Toast.show(err?.UI_Display_Message, Toast.LONG);
                    })
            }else {
                var data = {
                    Mobile_Number: phone,
                    OTP: otpCode
                }
                apiActions.mobile_verification(data)
                    .then(async res => {
                        _this.setState({ showOtp: false })
                        Toast.show(res?.UI_Display_Message, Toast.LONG);
                        let data = {
                            success: true,
                            user: { Email_Id: res?.User_Email },
                        };
                        dispatch({ type: actionTypes.LOGIN, data })
                        setTimeout(() => {
                            try {
                                _this.props.navigation.goBack();
                            } catch (err) {
                            }
                        }, 500);
                    })
                    .catch(err => {
                        console.log(err)
                        Toast.show(err?.UI_Display_Message, Toast.LONG);
                    })
            }
        } else {
            Toast.show("Please enter OTP code.", Toast.LONG);
        }
    }
    return (
        <BottomSheet
            isVisible={showOtp}
            containerStyle={{ backgroundColor: 'rgba(0.5, 0.25, 0, 0.2)' }}
        >
            <TouchableOpacity onPress={() => _this.setState({ showOtp: false })} style={{ flexDirection: 'row', flex: 1, height: Utils.SCREEN.HEIGHT - 295 }}></TouchableOpacity>
            <View style={{ height: 270, backgroundColor: 'white', flexDirection: 'column', alignItems: 'center', padding: 20 }}>
                <Text style={{ fontSize: 25, color: EStyleSheet.value('$primaryColor') }}>OTP Verification</Text>
                <Text style={{ fontSize: 18, textAlign: 'center', marginTop: 10 }}>{loginType==0?'Please provide OTP sent on your Email Address':'Please provide OTP sent on your Mobile Number'}</Text>
                <View style={{ flexDirection: 'row', width: '90%', marginTop: 20, backgroundColor: EStyleSheet.value('$contentColor1'), borderRadius: 10, paddingHorizontal: 10 }}>
                    {/* <OtpInputs
                        inputStyles={{ fontSize: 30, borderWidth: 1, padding: 15, borderRadius: 10, borderColor: EStyleSheet.value('$inputBoderColor'), color: EStyleSheet.value('$primaryColor') }}
                        clearTextOnFocus
                        keyboardType="phone-pad"
                        handleChange={(code) => setOtpCode(code)}
                        numberOfInputs={6}
                        ref={otpRef}
                        selectTextOnFocus={false}
                    /> */}
                    <TextInput
                        style={{ fontSize: 18, flex: 1 }}
                        onChangeText={code => setOtpCode(code)}
                        placeholder="Enter Verify Code"
                        multiline={false}
                        value={otpCode}
                    />
                </View>
                {/* <View style={{ flexDirection: 'row', marginTop: 10 }}>
                    <View style={{ alignSelf: 'flex-start', flex: 1 }}>
                        <TouchableOpacity>
                            <Text style={{ color: EStyleSheet.value('$primaryColor') }}>Resend OTP</Text>
                        </TouchableOpacity>
                    </View>
                    <View>
                        <TouchableOpacity>
                            <Text style={{ color: EStyleSheet.value('$primaryColor') }}>Change Number</Text>
                        </TouchableOpacity>
                    </View>
                </View> */}
                <View style={{ flexDirection: 'row', marginTop: 20 }}>
                    <TouchableOpacity onPress={emailVerification} style={{ backgroundColor: EStyleSheet.value('$primaryColor'), flex: 1, borderRadius: 10, padding: 10 }}>
                        <Text style={{ fontSize: 20, color: 'white', textAlign: 'center' }}>Submit</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </BottomSheet>
    )
}

export default OtpBottomSheet