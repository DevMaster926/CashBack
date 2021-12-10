import { actionTypes, apiActions } from "@actions";
import BackAllow from '@assets/images/go-back-arrow.svg';
import { BaseStyle } from "@config";
import { store } from "@store";
import * as Utils from '@utils';
import React, { useEffect, useState } from "react";
import { SafeAreaView, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { BottomSheet } from 'react-native-elements';
import EStyleSheet from 'react-native-extended-stylesheet';
import RazorpayCheckout from 'react-native-razorpay';
import Toast from 'react-native-simple-toast';
import { connect } from "react-redux";
import Address from './Content/Address';
import styles from './styles';
import DropDownPicker from 'react-native-dropdown-picker';
const OrderSummary = (props) => {
    const user_detail = store?.getState()?.auth?.login?.user;
    const address_id = store?.getState()?.auth?.location?.User_Address_Id;
    const { sub_total: total, order_list: list } = props.route?.params;
    const [user_address, setUserAddress] = useState(null);
    const [order_list, setOrderList] = useState([]);
    const [sub_total, setSubTotal] = useState(0);
    const [showPayment, setShowPayment] = useState(false);
    const [total_wallet_amount, setTotalWallet] = useState('0');
    const [wallet_amount, setWallet] = useState("");
    const [coupon_code, setCouponCode] = useState("");
    const [order_total, setOrderTotal] = useState(0);
    const [discount, setDiscount] = useState(0);
    const [type, setType] = useState("A");
    const [gift_card, setGiftCard] = useState([]);
    const [selected_card, setCard] = useState();
    const [open, setOpen] = useState(false);
    const [items, setItems] = useState([
        { label: 'Apple', value: 'apple' },
        { label: 'Banana', value: 'banana' }
    ]);
    const [value, setValue] = useState(null);
    const [pay_amount, setPayAmount] = useState(0);
    useEffect(() => {
        setOrderTotal(total)
        setSubTotal(total);
        setOrderList(JSON.parse(JSON.stringify(list)))
        let filter = {
            Records_Filter: 'FILTER',
            User_Email_Id: address_id ? '' : user_detail.Email_Id,
            User_Address_Id: address_id ? address_id : "",
        }
        apiActions.get_address(filter)
            .then(async res => {
                if (res.Success_Response?.Is_Data_Exist == '1') {
                    setUserAddress(res.User_Address[0])
                    let data = {
                        User_Address_Id: res.User_Address[0]?.User_Address_Id,
                    };
                    props.dispatch({ type: actionTypes.LOCATION, data })
                }
            })
            .catch(err => {
                console.log(err);
            })
        filter = {
            "Record_Filter": "FILTER",
            "User_Id": user_detail?.Email_Id,
        }
        apiActions.get_user_wallet(filter)
            .then(async res => {
                if (res?.Success_Response?.Response_Status == 'Success') {
                    setTotalWallet(res?.Wallet[0].Remaining_Balance);
                }
            })
            .catch(err => {
                console.log('user wallet', err);
            })
        filter = {
            "Email_Id": user_detail?.Email_Id,
            "Is_approved": "1"
        }
        setGiftCard([]);
        apiActions.get_received_gifts(filter)
            .then(async res => {
                if (res.Success_Response?.Is_Data_Exist == 1) {
                    let gift_vouchers = res.GiftVoucherGet;
                    gift_vouchers?.map((item) => {
                        setGiftCard(gift_card => [...gift_card, { label: item.Total_Value, value: item.Gift_Voucher_Id }])
                    })
                }
            })
            .catch(err => {
                console.log(err)
            })
    }, [total, list, address_id])

    const checkOut = () => {
        if (!address_id) {
            Toast.show("Please add address.", Toast.LONG);
            props.navigation.navigate('ChangeAddress');
            return;
        }
        setShowPayment(true);
    }
    const payNow = () => {
        if (pay_amount == 0) {
            props.navigation.navigate('PaymentStatus', { status: true })
            createOrder();
        } else {
            var options = {
                description: 'Credits towards consultation',
                image: 'https://i.imgur.com/3g7nmJC.png',
                currency: 'INR',
                key: 'rzp_test_6ck8IalL3wwWpn', // Your api key
                amount: (pay_amount).toString() + '00',
                name: 'foo',
                prefill: {
                    email: 'void@razorpay.com',
                    contact: '9191919191',
                    name: 'Razorpay Software'
                },
                theme: { color: EStyleSheet.value('$primaryColor') }
            }
            RazorpayCheckout.open(options).then((data) => {
                // handle success
                createOrder();
                // alert(`Success: ${data.razorpay_payment_id}`);
            }).catch((error) => {
                // handle failure
                console.log(error);
                props.navigation.navigate('PaymentStatus', { status: false })
                // alert(`Error: ${error.code} | ${error.description}`);
            });
        }
    }

    const createOrder = () => {
        var data = {
            "Orders": [
                {
                    "ESI_Copoun_Code": discount == 0 ? "" : coupon_code,
                    "ESI_Copoun_Discount": discount == 0 ? "" : discount,
                    "ESI_Copoun_Id": discount == 0 ? "" : global.Coupon_Id,
                    "Esi_Gift_Vocher_Amount": selected_card?.label ? selected_card?.label : "",
                    "Esi_Gift_Vocher_Id": selected_card?.value ? selected_card?.value : "",
                    "Order_Payments": [
                        {
                            "Currency": pay_amount,
                            "User_Email_Id": user_detail?.Email_Id,
                            "Wallet_Amount": wallet_amount,
                        }
                    ],
                    "Shipping_Address": {
                        "Address": {
                            "City": user_address?.City,
                            "Country": user_address?.Country,
                            "Door_No": user_address?.Door_No,
                            "State": user_address?.State,
                            "Street": user_address?.Street,
                            "Zip5": user_address?.Zip
                        },
                        "Land_Mark": user_address?.Landmark,
                        "Primary_Email": user_address?.Mobile,
                        "Primary_Phone": user_address?.User_Email_Id,
                        "User_Address_Id": user_address?.User_Address_Id
                    },
                }
            ]
        }
        setShowPayment(false);
        apiActions.create_order(data)
            .then(async res => {
                props.navigation.navigate('PaymentStatus', { status: true })
                console.log(res)
            })
            .catch(err => {
                console.log(err);
            })
    }

    const changeWallet = (text) => {
        let limit = sub_total;
        if (parseFloat(total_wallet_amount) > parseFloat(sub_total)) {
            limit = sub_total;
        } else {
            limit = total_wallet_amount;
        }
        if (parseFloat(text) > parseFloat(limit)) {
            setWallet(limit);
            setOrderTotal(parseFloat(sub_total) - parseFloat(limit))
        } else if (parseFloat(text) > 0) {
            setOrderTotal(parseFloat(sub_total) - parseFloat(text))
            setWallet(text);
        } else {
            setOrderTotal(parseFloat(sub_total))
            setWallet('');
        }
    }
    const checkCoupon = () => {
        let filter = {
            "Records_Filter": "FILTER",
            "Coupon_Id": global.Coupon_Id
        }
        apiActions.get_coupons(filter)
            .then(async res => {
                if (res?.Success_Response?.Response_Code == '200') {
                    if (res?.Coupons[0]?.Code == coupon_code) {
                        setDiscount(res?.Coupons[0]?.Discount_Amount);
                        setType(res?.Coupons[0]?.Discount_Type);
                    } else {
                        setDiscount(0);
                        Toast.show("Please enter coupon code correctly.", Toast.LONG);
                    }
                } else {
                    Toast.show("Please enter coupon code correctly.", Toast.LONG);
                    setDiscount(0);
                }
            })
            .catch(res => {
                if (res?.Success_Response?.Response_Code == '200') {
                    if (res?.Coupons[0]?.Code == coupon_code) {
                        setDiscount(res?.Coupons[0]?.Discount_Amount);
                        setType(res?.Coupons[0]?.Discount_Type);
                    } else {
                        setDiscount(0);
                        Toast.show("Please enter coupon code correctly.", Toast.LONG);
                    }
                } else {
                    setDiscount(0);
                    Toast.show("Please enter coupon code correctly.", Toast.LONG);
                }
            })
    }
    useEffect(() => {
        let amount = 0;
        if (type == 'A') {
            amount = (parseFloat(order_total) - parseFloat(discount) - parseFloat(selected_card?.label ? selected_card?.label : "0")).toFixed(2);
        } else {
            amount = (parseFloat(order_total) * (100 - parseFloat(discount) / 100) - parseFloat(selected_card?.label ? selected_card?.label : "0")).toFixed(2)
        }
        setPayAmount(amount);
        // setOrderTotal(pay_amount);
    }, [selected_card, discount, order_total])
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
                    <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'white' }}>Order Summary</Text>
                </View>
            </View>
            <ScrollView>
                <Address user_address={user_address} setSubTotal={setSubTotal} sub_total={sub_total} order_list={order_list}  {...props}></Address>
            </ScrollView>
            <View style={styles.sub_cart}>
                <View style={{ flexDirection: 'row' }}>
                    <Text style={{ color: 'white', fontSize: 15, flex: 1 }}>Total Payment</Text>
                    <Text style={{ color: 'white', fontSize: 15, flex: 1, textAlign: 'right' }}>₹ {sub_total}</Text>
                </View>
                <TouchableOpacity style={styles.button} onPress={() => checkOut()}>
                    <Text style={{ padding: 10, color: EStyleSheet.value('$primaryColor'), fontWeight: 'bold' }}>Pay Now</Text>
                </TouchableOpacity>
            </View>
            <BottomSheet
                isVisible={showPayment}
                containerStyle={{ backgroundColor: 'rgba(0.5, 0.25, 0, 0.2)' }}
            >
                <TouchableOpacity onPress={() => setShowPayment(false)} style={{ flexDirection: 'row', flex: 1, height: Utils.SCREEN.HEIGHT - 425 }}></TouchableOpacity>
                <View style={{ height: 400, backgroundColor: 'white', flexDirection: 'column', alignItems: 'center', padding: 20 }}>
                    <View style={{ flexDirection: 'row', marginVertical: 10 }}>
                        <Text style={{ fontSize: 16, color: 'black', flex: 1 }}>Item Total</Text>
                        <Text style={{ fontSize: 16, color: 'black' }}>₹ {sub_total}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={{ fontSize: 16, flex: 1 }}>Wallet Amount: ₹ {total_wallet_amount} - </Text>
                        <View style={{ borderRadius: 10, backgroundColor: EStyleSheet.value('$contentColor1'), marginLeft: 10 }}>
                            <TextInput
                                style={{ paddingHorizontal: 10, paddingVertical: 5, minWidth: 100 }}
                                keyboardType="numeric"
                                value={wallet_amount}
                                onChangeText={changeWallet}
                                placeholder={`₹ ${total_wallet_amount}`}
                            />
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', height: 50, width: '100%', marginTop: 10, alignItems: 'center' }}>
                        <Text style={{ fontSize: 16, color: 'black', flex: 1 }}>
                            Gift Card
                        </Text>
                        <DropDownPicker
                            style={{ width: 150 }}
                            containerStyle={{ height: 40 }}
                            itemStyle={{ justifyContent: 'flex-start' }}
                            open={open}
                            value={value}
                            items={gift_card}
                            placeholder="Select an card"
                            setOpen={setOpen}
                            setValue={setValue}
                            setItems={setItems}
                            onChangeItem={(item) => setCard(item)}
                        />
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
                        <Text style={{ fontSize: 16, color: 'black', flex: 1 }}>
                            Coupon Code
                        </Text>
                        <View style={{ borderRadius: 10, backgroundColor: EStyleSheet.value('$contentColor1'), marginLeft: 10 }}>
                            <TextInput
                                style={{ paddingHorizontal: 10, paddingVertical: 5, minWidth: 80 }}
                                value={coupon_code}
                                onChangeText={(text) => setCouponCode(text)}
                                placeholder="Enter Coupon Code"
                            />
                        </View>
                        <TouchableOpacity onPress={checkCoupon} style={{ backgroundColor: EStyleSheet.value('$primaryColor'), padding: 10, borderRadius: 10, marginLeft: 10 }}>
                            <Text style={{ fontSize: 16, color: 'white' }}>Apply</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{ flexDirection: 'row', marginVertical: 10 }}>
                        <Text style={{ fontSize: 16, color: 'black', flex: 1 }}>Coupon Discount</Text>
                        <Text style={{ fontSize: 16, color: 'black' }}>
                            {type == 'A' ? ('₹ ' + parseFloat(discount).toFixed(2)) : discount + '%'}
                        </Text>
                    </View>
                    <View style={{ flexDirection: 'row', marginVertical: 10 }}>
                        <Text style={{ fontSize: 16, color: 'black', flex: 1 }}>Order Total</Text>
                        <Text style={{ fontSize: 16, color: 'black' }}>
                            ₹ {pay_amount}
                        </Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
                        <TouchableOpacity onPress={() => payNow()} style={{ backgroundColor: EStyleSheet.value('$primaryColor'), flex: 1, alignItems: 'center', padding: 10, borderRadius: 10, marginLeft: 10 }}>
                            <Text style={{ fontSize: 18, color: 'white' }}>Checkout</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </BottomSheet>
        </SafeAreaView>
    );
}
const mapStateToProps = (state) => (state);
const mapDispatchToProps = dispatch => {
    return {
        dispatch
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(OrderSummary);