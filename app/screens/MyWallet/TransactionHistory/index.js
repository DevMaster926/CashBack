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
const TransactionHistory = () => {
    const user_detail = store?.getState()?.auth?.login?.user;
    const [transactionHistory, setTransactionHistory] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showPayment, setShowPayment] = useState(false);
    const [amount, setAmount] = useState('');
    useEffect(() => {
        setLoading(true);
        let filter = {
            Records_Filter: 'FILTER',
            User_Email_Id: user_detail?.Email_Id
        }
        apiActions.get_transactions(filter)
            .then(async res => {
                setLoading(false);
                if (res?.Success_Response?.Is_Data_Exist == '1') {
                    setTransactionHistory(res.Transactions);
                }
            })
            .catch(err => {
                setLoading(false);
                console.log('transaction history err', err)
            })
    }, [])
    const RenderItem = ({ item }) => {
        return (
            <View style={styles.content}>
                <View style={{ flexDirection: 'row' }}>
                    <View style={{ flex: 2 }}>
                        <Text style={{ fontSize: 16 }}>{item.User_Email_Id}</Text>
                    </View>
                    <View style={{ flex: 1, alignItems: 'flex-end' }}>
                        <Text>Order {item.Transaction_Id}</Text>
                    </View>
                </View>
                <View style={{ flexDirection: 'row' }}>
                    <View style={{ flex: 1 }}>
                        <Text style={{ color: EStyleSheet.value('$grayColor') }}>₹ {item.Wallet_Amount}</Text>
                    </View>
                    <View style={{ flex: 1, alignItems: 'flex-end' }}>
                        <Text>{item.Transaction_Date}</Text>
                    </View>
                </View>
            </View>
        )
    }
    const createTransaction = () => {
        if (amount == '') {
            Toast.show("Please enter amount", Toast.LONG);
            return;
        } else if (parseInt(amount) < 500) {
            Toast.show("The deposit amount must be greater than 500.", Toast.LONG);
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
                Wallet_Amount: amount,
                User_Email_Id: user_detail?.Email_Id,
                Reason: 'friend'
            }
            apiActions.create_transactions(data)
                .then(async res => {
                    Toast.show(res.UI_Display_Message, Toast.LONG);
                    var id = res?.Transactions_Id;
                    let filter = {
                        Records_Filter: 'FILTER',
                        Transaction_Id: id
                    }
                    apiActions.get_transactions(filter)
                        .then(async res => {
                            setLoading(false);
                            if (res?.Success_Response?.Is_Data_Exist == '1') {
                                setTransactionHistory(transactionHistory => [...transactionHistory, res.Transactions[0]])
                            }
                        })
                        .catch(err => {
                            setLoading(false);
                        })
                })
                .catch(err => {
                    setLoading(false);
                    console.log(err)
                })
        }).catch((error) => {
        });
    }
    return (
        <>
            {loading ? <BallIndicator color={EStyleSheet.value('$primaryColor')} />
                :
                <View style={{ flex: 1 }}>
                    <FlatList
                        showsVerticalScrollIndicator={false}
                        data={transactionHistory}
                        renderItem={RenderItem}
                        keyExtractor={(item, index) => item.Transaction_Id + index}
                    />
                </View>
            }
            <View style={[styles.sub_cart]}>
                <TouchableOpacity style={styles.button} onPress={() => setShowPayment(true)}>
                    <Text style={{ padding: 10, color: EStyleSheet.value('$primaryColor'), fontWeight: 'bold' }}>Deposit</Text>
                </TouchableOpacity>
            </View>
            <BottomSheet
                isVisible={showPayment}
                containerStyle={{ backgroundColor: 'rgba(0.5, 0.25, 0, 0.2)' }}
            >
                <TouchableOpacity onPress={() => setShowPayment(false)} style={{ flexDirection: 'row', flex: 1, height: Utils.SCREEN.HEIGHT - 175 }}></TouchableOpacity>
                <View style={{ height: 150, backgroundColor: 'white', flexDirection: 'column', alignItems: 'center', padding: 20 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text>Deposit Amount:   </Text>
                        <View style={{ backgroundColor: EStyleSheet.value('$contentColor1'), borderRadius: 10 }}>
                            <TextInput onChangeText={(text) => setAmount(text)} keyboardType="numeric"
                                value={amount}
                                placeholder="Enter Amount"
                                style={{ padding: 0, paddingHorizontal: 10, paddingVertical: 5, minWidth: 70 }}
                            />
                        </View>
                    </View>
                    <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'flex-end' }}>
                        <TouchableOpacity style={{
                            backgroundColor: EStyleSheet.value('$primaryColor'),
                            borderRadius: 10, minWidth: '80%'
                        }} onPress={() => createTransaction()}>
                            <Text style={{ padding: 10, fontSize: 18, textAlign: 'center', color: 'white', fontWeight: 'bold' }}>Confirm</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </BottomSheet>
        </>
    )
}

export default TransactionHistory;