import { apiActions } from "@actions";
import BackAllow from '@assets/images/go-back-arrow.svg';
import { BaseStyle } from "@config";
import { store } from "@store";
import * as Utils from "@utils";
import React, { useEffect, useState, useRef } from "react";
import { FlatList, Image, SafeAreaView, ScrollView, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import EStyleSheet from 'react-native-extended-stylesheet';
import {
    BallIndicator
} from 'react-native-indicators';
import LinearGradient from 'react-native-linear-gradient';
import RazorpayCheckout from 'react-native-razorpay';
import Toast from 'react-native-simple-toast';
import Textarea from 'react-native-textarea';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { connect } from "react-redux";
import styles from './styles';
import PhoneInput from "react-native-phone-number-input";
const BuyGift = (props) => {
    const phoneInput = useRef();
    const user_detail = store?.getState()?.auth?.login?.user;
    const [message, setMessage] = useState("");
    const [email, setEmail] = useState("");
    const [name, setName] = useState();
    const [phone, setPhone] = useState("");
    const [selectedItem, setSelectedItem] = useState(0);
    const [selectedVoucher, setSelectedVoucher] = useState(0);
    const [selectedAmount, setSelectedAmount] = useState(0);
    const [selectedTab, setSelectedTab] = useState(0);
    const [gift_voucher_list, setGiftVoucher] = useState([]);
    const [gift_card_list, setGiftCard] = useState([]);
    const [loading, setLoading] = useState(false);
    const [custom_amount, setAmount] = useState("");
    const amount = [{ id: 0, value: '500' }, { id: 1, value: '1000' }, { id: 2, value: '1500' }
        , { id: 3, value: '2000' }]
    useEffect(() => {
        setGiftCard([]);
        setGiftVoucher([]);
        setSelectedTab(0);
        setSelectedVoucher(0);
        setSelectedItem(0);
        setSelectedAmount(0);
        setMessage("");
        setEmail("");
        setName("");
        setPhone("");
        setLoading(true);
        var filter = {
            Records_Filter: "ALL",
        }
        apiActions.get_gift_vender(filter)
            .then(async res => {
                if (res?.Success_Response?.Is_Data_Exist == '1') {
                    let gift_venders = res?.Gift_Voucher_Vendor;
                    gift_venders?.map((item) => {
                        filter = {
                            Records_Filter: "FILTER",
                            Vendor_Id: item?.Vendor_Id
                        }
                        apiActions.get_gift_voucher_image(filter)
                            .then(async res => {
                                if (res.Success_Response?.Is_Data_Exist == '1') {
                                    item.Image_URL = res?.Image_Gift[0].Image_URL;
                                    item.Type = res?.Image_Gift[0].Type;
                                }
                                if (item?.Type == 'Card') {
                                    setGiftCard(gift_card_list => [...gift_card_list, item]);
                                } else {
                                    setGiftVoucher(gift_voucher_list => [...gift_voucher_list, item]);
                                }
                                setLoading(false);
                            })
                            .catch(err => {
                                setLoading(false);
                            })
                    })
                }
            })
            .catch(err => {
                setLoading(false);
                console.log(err)
            })
    }, [])

    const GiftCard = ({ item, index, data }) => {
        if (index % 3 != 0) {
            return null;
        }
        return (
            <View style={{ flexDirection: 'column' }}>
                <View style={{ marginHorizontal: 5, marginVertical: 5 }}>
                    <TouchableWithoutFeedback onPress={() => setSelectedItem(index)}>
                        <View style={[styles.gift_item, selectedItem == index && styles.selectedItem]}>
                            <Image source={{ uri: item?.Image_URL }} style={{ width: 100, height: 100 }} />
                        </View>
                    </TouchableWithoutFeedback>
                </View>
                {data[index + 1] &&
                    <View style={{ marginHorizontal: 5, marginVertical: 5 }}>
                        <TouchableWithoutFeedback onPress={() => setSelectedItem(index + 1)}>
                            <View style={[styles.gift_item, selectedItem == index + 1 && styles.selectedItem]}>
                                <Image source={{ uri: data[index + 2]?.Image_URL }} style={{ width: 100, height: 100 }} />
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                }
                {data[index + 2] &&
                    <View style={{ marginHorizontal: 5, marginVertical: 5 }}>
                        <TouchableWithoutFeedback onPress={() => setSelectedItem(index + 2)}>
                            <View style={[styles.gift_item, selectedItem == index + 2 && styles.selectedItem]}>
                                <Image source={{ uri: data[index + 2]?.Image_URL }} style={{ width: 100, height: 100 }} />
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                }
            </View>
        )
    }
    const GiftVoucher = ({ item, index, data }) => {
        if (index % 3 != 0) {
            return null;
        }
        return (
            <View style={{ flexDirection: 'column' }}>
                <View style={{ marginHorizontal: 5, marginVertical: 5 }}>
                    <TouchableWithoutFeedback onPress={() => setSelectedVoucher(index)}>
                        <View style={[styles.gift_item, selectedVoucher == index && styles.selectedItem]}>
                            <Image source={{ uri: item?.Image_URL }} style={{ width: 100, height: 100 }} />
                        </View>
                    </TouchableWithoutFeedback>
                </View>
                {data[index + 1] &&
                    <View style={{ marginHorizontal: 5, marginVertical: 5 }}>
                        <TouchableWithoutFeedback onPress={() => setSelectedVoucher(index + 1)}>
                            <View style={[styles.gift_item, selectedVoucher == index + 1 && styles.selectedItem]}>
                                <Image source={{ uri: data[index + 2]?.Image_URL }} style={{ width: 100, height: 100 }} />
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                }
                {data[index + 2] &&
                    <View style={{ marginHorizontal: 5, marginVertical: 5 }}>
                        <TouchableWithoutFeedback onPress={() => setSelectedVoucher(index + 2)}>
                            <View style={[styles.gift_item, selectedVoucher == index + 2 && styles.selectedItem]}>
                                <Image source={{ uri: data[index + 2]?.Image_URL }} style={{ width: 100, height: 100 }} />
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                }
            </View>
        )
    }
    const SendGift = () => {
        if(custom_amount != '' && parseFloat(custom_amount) < 500) {
            Toast.show("The amount must be greater than 500.", Toast.LONG);
            return;
        }
        if (message == "") {
            Toast.show("Please enter message", Toast.LONG);
            return;
        }
        if (name == "") {
            Toast.show("Please enter friend's name", Toast.LONG);
            return;
        } else if (phone == "") {
            Toast.show("Please enter friend's phone number", Toast.LONG);
            return;
        } else if (!phoneInput.current?.isValidNumber(phone)) {
            Toast.show("Please enter valid phone number", Toast.LONG);
            return;
        } else if (email == "") {
            Toast.show("Please enter friend's email", Toast.LONG);
            return;
        } else if (!Utils.EMAIL_VALIDATE.test(String(email).toLowerCase())) {
            Toast.show("Please enter valid email", Toast.LONG);
            return;
        }
        let voucher_name = "";
        if (selectedTab == 0) {
            voucher_name = gift_card_list[selectedItem]?.Vendor_Name;
        } else {
            voucher_name = gift_voucher_list[selectedVoucher]?.Vendor_Name;
        }
        var options = {
            description: 'Credits towards consultation',
            image: 'https://i.imgur.com/3g7nmJC.png',
            currency: 'INR',
            key: 'rzp_test_6ck8IalL3wwWpn', // Your api key
            amount: custom_amount ? custom_amount + '00' : amount[selectedAmount].value + '00',
            name: 'foo',
            prefill: {
                email: 'void@razorpay.com',
                contact: '9191919191',
                name: 'Razorpay Software'
            },
            theme: { color: EStyleSheet.value('$primaryColor') }
        }
        RazorpayCheckout.open(options).then((data) => {
            var data = {
                "Gift_Message": message,
                "Order_By_Email_Id": user_detail?.Email_Id,
                "Order_By_Name": user_detail?.Full_Name,
                "Order_To_Email_Id": email,
                "Order_To_Moblie": phone,
                "Order_To_Name": name,
                "Total_Value": custom_amount ? custom_amount : amount[selectedAmount].value,
                "Voucher_Name": voucher_name
            }
            apiActions.create_gift_voucher(data)
                .then(async res => {
                    Toast.show(res.UI_Display_Message, Toast.LONG);
                })
                .catch(err => {
                    console.log(err);
                })
        }).catch((error) => {
            // handle failure
            console.log(error)
        });
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
                        <BackAllow width={25} height={25}></BackAllow>
                    </TouchableOpacity>
                    <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'white' }}>Gift A Friend</Text>
                </View>
            </View>
            {loading ? <BallIndicator color={EStyleSheet.value('$primaryColor')} />
                :
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={{ flexDirection: 'row', padding: 10 }}>
                        <FlatList
                            showsHorizontalScrollIndicator={false}
                            horizontal
                            data={amount}
                            renderItem={({ item, index }) => <TouchableWithoutFeedback onPress={() => setSelectedAmount(index)} >
                                <View style={[{
                                    padding: 3,
                                    paddingHorizontal: 8,
                                    borderRadius: 5,
                                    marginHorizontal: 5,
                                    backgroundColor: EStyleSheet.value('$primaryColor')
                                }, index == selectedAmount && styles.seletectAmountItem]}>
                                    <Text style={[{ fontSize: 16, color: 'white', fontWeight: 'bold' }, index == selectedAmount && styles.seletectAmount]}>{item.value}</Text>
                                </View>
                            </TouchableWithoutFeedback>}
                            keyExtractor={item => item.id}
                        />
                        <View style={{ borderRadius: 5, backgroundColor: EStyleSheet.value('$contentColor1'), width: 100 }}>
                            <TextInput
                                style={{ padding: 0, paddingHorizontal: 5 }}
                                value={custom_amount}
                                keyboardType="numeric"
                                placeholder="Enter amount"
                                onChangeText={(text) => setAmount(text)}
                            />
                        </View>
                    </View>
                    <View style={{ padding: 10 }}>
                        <View style={{ flexDirection: 'row' }}>
                            <TouchableWithoutFeedback onPress={() => setSelectedTab(0)}>
                                <Text style={[{
                                    paddingVertical: 5,
                                    paddingHorizontal: 10,
                                    borderTopLeftRadius: 10,
                                    borderTopRightRadius: 10,
                                    fontSize: 20,
                                    flex: 1,
                                    color: 'black'
                                }, selectedTab == 0 && styles.selectedTab]}>Card</Text>
                            </TouchableWithoutFeedback>
                            <TouchableWithoutFeedback onPress={() => setSelectedTab(1)}>
                                <Text style={[{
                                    paddingVertical: 5,
                                    paddingHorizontal: 10,
                                    borderTopLeftRadius: 10,
                                    borderTopRightRadius: 10,
                                    fontSize: 20,
                                    flex: 1,
                                    color: 'black'
                                }, selectedTab == 1 && styles.selectedTab]}>Voucher</Text>
                            </TouchableWithoutFeedback>
                        </View>
                        <View style={{ borderWidth: 1, borderColor: EStyleSheet.value('$primaryColor') }}>
                            {selectedTab == 0 ?
                                <FlatList
                                    showsHorizontalScrollIndicator={false}
                                    horizontal
                                    data={gift_card_list}
                                    renderItem={({ item, index }) => <GiftCard item={item} index={index} data={gift_card_list}></GiftCard>}
                                    keyExtractor={(item, index) => index + item.Vendor_Id}
                                />
                                :
                                <FlatList
                                    showsHorizontalScrollIndicator={false}
                                    horizontal
                                    data={gift_voucher_list}
                                    renderItem={({ item, index }) => <GiftVoucher item={item} index={index} data={gift_voucher_list}></GiftVoucher>}
                                    keyExtractor={(item, index) => item.Vendor_Id + index}
                                />
                            }
                        </View>
                    </View>
                    <View style={{ marginTop: 10, padding: 10 }}>
                        <Text style={{ fontSize: 16 }}>Message:</Text>
                        <Textarea
                            containerStyle={styles.textareaContainer}
                            style={styles.textarea}
                            onChangeText={(value) => setMessage(value)}
                            defaultValue={message}
                            maxLength={250}
                            placeholder={'I thought you would like this gift!'}
                            placeholderTextColor={'#c7c7c7'}
                            underlineColorAndroid={'transparent'}
                        />
                    </View>

                    <View style={{ marginTop: 20, padding: 10 }}>
                        <Text style={{ fontSize: 16 }}>Friend's Name:</Text>
                        <View style={styles.input_style}>
                            <Ionicons name="person" size={24} style={{ marginHorizontal: 10 }} color={EStyleSheet.value('$primaryColor')}></Ionicons>
                            <TextInput
                                style={{ paddingVertical: 5, fontSize: 16, flex: 1 }}
                                value={name}
                                onChangeText={(value) => setName(value)}
                                multiline={false}
                                selectionColor={EStyleSheet.value('$primaryColor')}
                            />
                        </View>
                        <Text style={{ fontSize: 16, marginTop: 10 }}>Friend's Phone:</Text>
                        <View style={[styles.input_style, { paddingHorizontal: 0, paddingVertical: 0 }]}>
                            <PhoneInput
                                containerStyle={{ justifyContent: 'center', borderRadius: 10 }}
                                textContainerStyle={{ backgroundColor: '#ffffff', height: 50, alignItems: 'center' }}
                                textInputStyle={{ paddingVertical: 5, margin: 0, backgroundColor: '#ffffff', height: 40, width: '100%', fontSize: 16 }}
                                countryPickerButtonStyle={{ alignSelf: 'center', width: '20%' }}
                                codeTextStyle={{ height: 20, fontSize: 16 }}
                                ref={phoneInput}
                                value={phone}
                                defaultCode="IN"
                                layout="first"
                                onChangeText={(text) => {
                                    setPhone(text);
                                }}
                            />
                        </View>
                        <Text style={{ fontSize: 16, marginTop: 10 }}>Friend's Email:</Text>
                        <View style={styles.input_style}>
                            <MaterialCommunityIcons name="email" size={24} style={{ marginHorizontal: 10 }} color={EStyleSheet.value('$primaryColor')}></MaterialCommunityIcons>
                            <TextInput
                                style={{ paddingVertical: 5, fontSize: 16, flex: 1 }}
                                value={email}
                                onChangeText={(value) => setEmail(value)}
                                multiline={false}
                                selectionColor={EStyleSheet.value('$primaryColor')}
                            />
                        </View>
                    </View>
                    <View style={{ marginTop: 10, padding: 10 }}>
                        <LinearGradient
                            colors={[EStyleSheet.value('$primaryColor'), EStyleSheet.value('$mainColor1')]}
                            start={{ x: 0.0, y: 0.25 }}
                            end={{ x: 0.5, y: 1.0 }}
                            locations={[0, 0.6]}
                            style={[styles.send_style, { alignItems: 'center', justifyContent: 'center' }]}
                        >
                            <TouchableOpacity style={{ flex: 1 }} onPress={() => SendGift()}>
                                <Text style={{ paddingVertical: 5, fontSize: 20, flex: 1, textAlign: 'center', color: 'white' }}>
                                    Send
                                </Text>
                            </TouchableOpacity>
                        </LinearGradient>
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

export default connect(mapStateToProps, mapDispatchToProps)(BuyGift);