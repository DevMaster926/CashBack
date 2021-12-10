import { apiActions } from "@actions";
import { store } from "@store";
import * as Utils from '@utils';
import React, { useEffect, useState } from "react";
import { FlatList, Text, TextInput, TouchableOpacity, View } from "react-native";
import { BottomSheet } from 'react-native-elements';
import EStyleSheet from 'react-native-extended-stylesheet';
import {
    BallIndicator
} from 'react-native-indicators';
import RazorpayCheckout from 'react-native-razorpay';
import Toast from 'react-native-simple-toast';
import styles from '../styles';
const WithdrawHistroy = () => {
    const user_detail = store?.getState()?.auth?.login?.user;
    const [loading, setLoading] = useState(false);
    const [showPayment, setShowPayment] = useState(false);
    const [amount, setAmount] = useState('');
    const [wallet_id, setWalletId] = useState('');
    const [withdraw_list, setWithdraw] = useState([]);
    const [reason, setReason] = useState('Friend');
    useEffect(() => {
        let filter = {
            "User_Id": user_detail?.Email_Id,
        }
        apiActions.user_wallet_history(filter)
            .then(async res => {
                if (res.Response?.Response_Status == 'Success') {
                    setWithdraw(res?.Wallet_History);
                }
            })
            .catch(err => {
                if (err.Response?.Response_Status == 'Success') {
                    setWithdraw(err?.Wallet_History);
                }
            })
        filter = {
            "Record_Filter": "FILTER",
            "User_Id": user_detail?.Email_Id,
        }
        apiActions.get_user_wallet(filter)
            .then(async res => {
                if (res.Success_Response?.Response_Status == 'Success') {
                    setWalletId(res.Wallet[0]?.Wallet_Id);
                }
            })
            .catch(err => {
                console.log('user wallet', err);
            })
        filter = {
            "Record_Filter": "ALL",
        }
    }, [])

    const walletWithdraw = () => {
        if (amount == '') {
            Toast.show("Please enter amount", Toast.LONG);
            return;
        } else if (parseInt(amount) < 500) {
            Toast.show("The withdraw amount must be greater than 500.", Toast.LONG);
            return;
        }
        setLoading(true);
        var options = {
            description: 'Credits towards consultation',
            image: 'https://i.imgur.com/3g7nmJC.png',
            currency: 'INR',
            key: 'rzp_test_6ck8IalL3wwWpn', // Your api key
            amount: amount + '00',
            name: 'foo',
            prefill: {
                email: 'void@razorpay.com',
                contact: '9191919191',
                name: 'Razorpay Software'
            },
            theme: { color: EStyleSheet.value('$primaryColor') }
        }
        setShowPayment(false);
        setAmount('');

        RazorpayCheckout.open(options).then((result) => {
            let data = {
                Wallet_Id: wallet_id,
                Withdraw_Amount: amount,
                User_Id: user_detail?.Email_Id,
                Payment_Method: 'UPI',
                Reason: reason
            }
            apiActions.user_wallet_withdraw(data)
                .then(async res => {
                    let filter = {
                        "Wallet_History_Id": res?.Wallet_History_Id,
                    }
                    Toast.show(res?.UI_Display_Message, Toast.LONG);
                    apiActions.user_wallet_history(filter)
                        .then(async res => {
                            setLoading(false);
                            if (res.Response?.Response_Status == 'Success') {
                                setWithdraw(withdraw_list => [...withdraw_list, res?.Wallet_History[0]]);
                            }
                        })
                        .catch(err => {
                            setLoading(false);
                            if (err.Response?.Response_Status == 'Success') {
                                setWithdraw(withdraw_list => [...withdraw_list, err?.Wallet_History[0]]);
                            }
                        })
                })
                .catch(err => {
                    console.log('user withdraw err', err)
                    setLoading(false);
                })
        }).catch((error) => {
        });
    }
    const RenderItem = ({ item }) => {
        return (
            <View style={styles.content}>
                <View style={{ flexDirection: 'row' }}>
                    <View style={{ flex: 2 }}>
                        <Text style={{ fontSize: 16 }}>{item.Wallet_Owner_Id}</Text>
                    </View>
                    <View style={{ flex: 1, alignItems: 'flex-end' }}>
                        <Text>No: {item.Wallet_History_Id}</Text>
                    </View>
                </View>
                <View style={{ flexDirection: 'row' }}>
                    <View style={{ flex: 1 }}>
                        <Text style={{ color: 'black' }}>Reason:  {item.Debit_Reason}</Text>
                    </View>
                    <View style={{ flex: 1, alignItems: 'flex-end' }}>
                        <Text style={{ color: EStyleSheet.value('$grayColor') }}>₹ {item.Debited_Amount}</Text>
                    </View>
                </View>
            </View>
        )
    }
    return (
        <>
            {loading ? <BallIndicator color={EStyleSheet.value('$primaryColor')} />
                :
                <View style={{ flex: 1 }}>
                    <FlatList
                        showsVerticalScrollIndicator={false}
                        data={withdraw_list}
                        renderItem={RenderItem}
                        keyExtractor={(item, index) => item.Wallet_History_Id + index}
                    />
                </View>
            }
            <View style={[styles.sub_cart]}>
                <TouchableOpacity style={styles.button} onPress={() => setShowPayment(true)}>
                    <Text style={{ padding: 10, color: EStyleSheet.value('$primaryColor'), fontWeight: 'bold' }}>Withdraw</Text>
                </TouchableOpacity>
            </View>
            <BottomSheet
                isVisible={showPayment}
                containerStyle={{ backgroundColor: 'rgba(0.5, 0.25, 0, 0.2)' }}
            >
                <TouchableOpacity onPress={() => setShowPayment(false)} style={{ flexDirection: 'row', flex: 1, height: Utils.SCREEN.HEIGHT - 200 }}></TouchableOpacity>
                <View style={{ height: 175, backgroundColor: 'white', flexDirection: 'column', alignItems: 'center', padding: 20 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={{ flex: 1 }}>Withdraw Amount:   </Text>
                        <Text>₹ </Text>
                        <View style={{ backgroundColor: EStyleSheet.value('$contentColor1'), borderRadius: 10 }}>
                            <TextInput onChangeText={(text) => setAmount(text)} keyboardType="numeric"
                                value={amount}
                                placeholder="Enter Amount"
                                style={{ padding: 0, paddingHorizontal: 10, paddingVertical: 5, minWidth: 70 }}
                            />
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5 }}>
                        <Text style={{ flex: 1 }}>Reason:   </Text>
                        <View style={{ backgroundColor: EStyleSheet.value('$contentColor1'), borderRadius: 10 }}>
                            <TextInput onChangeText={(text) => setReason(text)}
                                value={reason}
                                placeholder="Enter Amount"
                                style={{ padding: 0, paddingHorizontal: 10, paddingVertical: 5, minWidth: 200 }}
                            />
                        </View>
                    </View>
                    <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'flex-end' }}>
                        <TouchableOpacity style={{
                            backgroundColor: EStyleSheet.value('$primaryColor'),
                            borderRadius: 10, minWidth: '80%'
                        }} onPress={() => walletWithdraw()}>
                            <Text style={{ padding: 10, fontSize: 18, textAlign: 'center', color: 'white', fontWeight: 'bold' }}>Confirm</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </BottomSheet>
        </>
    )
}

export default WithdrawHistroy;