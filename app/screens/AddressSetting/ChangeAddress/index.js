import { actionTypes, apiActions } from "@actions";
import BackAllow from '@assets/images/go-back-arrow.svg';
import { Button } from "@components";
import { BaseStyle } from "@config";
import { store } from "@store";
import React, { useEffect, useRef, useState } from "react";
import { KeyboardAvoidingView, SafeAreaView, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import EStyleSheet from 'react-native-extended-stylesheet';
import { Switch } from 'react-native-paper';
import PhoneInput from "react-native-phone-number-input";
import Toast from 'react-native-simple-toast';
import { connect } from "react-redux";
import styles from './styles';
import DropDownPicker from "react-native-custom-dropdown";
// import Flags from 'react-native-flags'
import csc from 'country-state-city'
import {
    BallIndicator
} from 'react-native-indicators';
const ChangeAddress = (props) => {
    const address_id = store?.getState()?.auth?.location?.User_Address_Id;
    const user_detail = store?.getState()?.auth?.login?.user;
    const user_address = props.route?.params?.user_address;
    const phoneInput = useRef();
    const [address_data, setAddressData] = useState({});
    const [isSwitchOn, setIsSwitchOn] = React.useState(false);
    const onToggleSwitch = () => setIsSwitchOn(!isSwitchOn);
    const [defaultState, setDefaultSate] = useState(null);
    const countries = {
        'India': 'IN',
        'United States of America': 'US',
        'United Kingdom of Great Britain and Northern Ireland': 'GB',
        'United Arab Emirates': 'AE',
        'Singapore': 'SG',
        'Malaysia': 'MY',
        'Sri Lanka': 'LK',
        'Nepal': 'NP',
        'Thailand': 'TH',
        'Indonesia': 'ID'
    }
    const countryList = [
        { label: 'India', value: 'IN' },
        { label: 'United States of America', value: 'US' },
        { label: 'United Kingdom of Great Britain and Northern Ireland', value: 'GB' },
        { label: 'United Arab Emirates', value: 'AE' },
        { label: 'Singapore', value: 'SG' },
        { label: 'Malaysia', value: 'MY' },
        { label: 'Sri Lanka', value: 'LK' },
        { label: 'Nepal', value: 'NP' },
        { label: 'Thailand', value: 'TH' },
        { label: 'Indonesia', value: 'ID' },
    ]
    const [stateList, setStateList] = useState([]);
    const [loading, setLoading] = useState(false);
    const onChangeCountry = (item) => {
        setLoading(true);
        let states = csc.getStatesOfCountry(item.value);
        setStateList([]);
        setAddressData({ ...address_data, Country: item.label })
        states?.map((item) => {
            setStateList(stateList => [...stateList, { label: item.name, value: item.isoCode }])
        })
        setLoading(false);
    }

    const getStateList = (country_code) => {
        let states = csc.getStatesOfCountry(country_code);
        setStateList([]);
        states?.map((item) => {
            setStateList(stateList => [...stateList, { label: item.name, value: item.name }])
        })
    }
    useEffect(() => {
        setIsSwitchOn(false);
        setStateList([]);
        setLoading(true);
        setAddressData({
            User_Address_Id: user_address?.User_Address_Id ? user_address?.User_Address_Id : "",
            Address_Type: user_address?.Address_Type,
            Country: user_address?.Country ? user_address?.Country : undefined,
            Land_Mark: user_address?.Landmark,
            Door_No: user_address?.Door_Number,
            Mobile: user_address?.Mobile,
            State: user_address?.State ? user_address?.State : "",
            Zip: user_address?.Zip,
            Street: user_address?.Street ? user_address?.Street : "",
            City: user_address?.City,
            User_Email_Id: user_detail?.Email_Id
        })
        if(user_address?.Country) {
            getStateList(countries[user_address?.Country]);
        }
        setLoading(false);
    }, [user_address])
    const createAddress = () => {
        const { Address_Type, Country, Land_Mark, Mobile, State, Zip, Street, City, Email_Id, User_Address_Id, Door_No } = address_data;
        if (Door_No == "") {
            Toast.show("Please enter door number.", Toast.LONG);
            return;
        } else if (Street == "") {
            Toast.show("Please enter street.", Toast.LONG);
            return;
        } else if (Land_Mark == "") {
            Toast.show("Please enter land mark.", Toast.LONG);
            return;
        } else if (Mobile == "") {
            Toast.show("Please enter phone number.", Toast.LONG);
            return;
        } else if (phoneInput.current?.isValidNumber(Mobile)) {
            Toast.show("Please enter valid phone number.", Toast.LONG);
            return;
        } else if (City == "") {
            Toast.show("Please enter City.", Toast.LONG);
            return;
        } else if (Zip == "") {
            Toast.show("Please enter Zip.", Toast.LONG);
            return;
        } else if (State == "") {
            Toast.show("Please enter State.", Toast.LONG);
            return;
        } else if (Country == "") {
            Toast.show("Please enter country.", Toast.LONG);
            return;
        }
        setLoading(true);
        if (User_Address_Id) {
            apiActions.update_address(address_data)
                .then(async res => {
                    Toast.show(res?.UI_Display_Message, Toast.LONG);
                    setLoading(false);
                    if (isSwitchOn && res?.Response_Status == "Success") {
                        let data = {
                            User_Address_Id: res?.User_Address_Id,
                        };
                        props.dispatch({ type: actionTypes.LOCATION, data })
                    }
                    setTimeout(() => {
                        try {
                            return props.navigation.goBack();
                        } catch (err) {
                        }
                    }, 500);
                })
                .catch(err => {
                    setLoading(false);
                    console.log(err)
                })
        } else {
            apiActions.create_address(address_data)
                .then(async res => {
                    Toast.show(res?.UI_Display_Message, Toast.LONG);
                    setLoading(false);
                    if ((isSwitchOn || address_id == undefined) && res?.Response_Status == "Success") {
                        let data = {
                            User_Address_Id: res?.User_Address_Id,
                        };
                        props.dispatch({ type: actionTypes.LOCATION, data })
                    }
                    setTimeout(() => {
                        try {
                            return props.navigation.goBack();
                        } catch (err) {
                        }
                    }, 500);
                })
                .catch(err => {
                    setLoading(false);
                    console.log(err);
                })
        }
    }
    useEffect(() => {
        if(stateList.length > 0) {
            let state = stateList.filter((item) => item.value == address_data?.State);
            setDefaultSate(state[0]?.value?state[0]?.value:null);
        }
    }, [stateList])
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
                    <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'white' }}>{address_data?.User_Address_Id ? 'Change Address' : 'Add Address'}</Text>
                </View>
            </View>
            {loading ? <BallIndicator color={EStyleSheet.value('$primaryColor')} />
                :
                <ScrollView>
                    <View style={{ flexDirection: 'column', paddingTop: 20, zIndex: -1 }}>
                        <View style={styles.input_style}>
                            <TextInput
                                style={{ paddingVertical: 5, fontSize: 16, flex: 1 }}
                                value={address_data?.Door_No}
                                onChangeText={(value) => { setAddressData({ ...address_data, Door_No: value }) }}
                                keyboardType="numeric"
                                multiline={false}
                                placeholder="Door Number"
                                selectionColor={EStyleSheet.value('$primaryColor')}
                            />
                        </View>
                    </View>
                    <View style={{ flexDirection: 'column', paddingTop: 20, zIndex: -1 }}>
                        <View style={styles.input_style}>
                            <TextInput
                                style={{ paddingVertical: 5, fontSize: 16, flex: 1 }}
                                value={address_data?.Street}
                                onChangeText={(value) => { setAddressData({ ...address_data, Street: value }) }}
                                multiline={false}
                                placeholder="Street"
                                selectionColor={EStyleSheet.value('$primaryColor')}
                            />
                        </View>
                    </View>
                    <View style={{ flexDirection: 'column', paddingTop: 20, zIndex: -1 }}>
                        <View style={styles.input_style}>
                            <TextInput
                                style={{ paddingVertical: 5, fontSize: 16, flex: 1 }}
                                value={address_data?.Land_Mark}
                                onChangeText={(value) => { setAddressData({ ...address_data, Land_Mark: value }) }}
                                multiline={false}
                                placeholder="Land Mark"
                                selectionColor={EStyleSheet.value('$primaryColor')}
                            />
                        </View>
                    </View>

                    <View style={{ flexDirection: 'column', paddingTop: 20, zIndex: -1 }}>
                        <View style={[styles.input_style, { paddingHorizontal: 0, paddingVertical: 0 }]}>
                            <PhoneInput
                                containerStyle={{ justifyContent: 'center', borderRadius: 10 }}
                                textContainerStyle={{ backgroundColor: '#ffffff', height: 50, alignItems: 'center' }}
                                textInputStyle={{ paddingVertical: 5, margin: 0, backgroundColor: '#ffffff', height: 40, width: '100%', fontSize: 16 }}
                                countryPickerButtonStyle={{ alignSelf: 'center', width: '20%' }}
                                codeTextStyle={{ height: 20, fontSize: 16 }}
                                ref={phoneInput}
                                value={address_data?.Mobile ? address_data?.Mobile : ""}
                                defaultCode="IN"
                                layout="first"
                                onChangeText={(text) => {
                                    setAddressData({ ...address_data, Mobile: text })
                                }}
                            />
                        </View>
                    </View>
                    <DropDownPicker
                        items={countryList}
                        searchable={true}
                        defaultValue={address_data?.Country ? countries[address_data?.Country]:null}
                        placeholder="Select Country ..."
                        style={{ backgroundColor: '#fafafa', borderWidth: 0, marginHorizontal: 20, marginTop: 20, height: 50 }}
                        placeholderStyle={{ fontSize: 16 }}
                        activeLabelStyle={{ fontSize: 16 }}
                        searchablePlaceholder="Enter country"
                        itemStyle={{
                            justifyContent: 'flex-start'
                        }}
                        dropDownStyle={{ backgroundColor: '#fafafa', marginHorizontal: 20, width: '90%', marginTop: 20, minHeight: 300 }}
                        onChangeItem={item => onChangeCountry(item)}
                    />
                    <DropDownPicker
                        items={stateList}
                        searchable={true}
                        defaultValue={defaultState}
                        placeholder="Select State ..."
                        style={{ backgroundColor: '#fafafa', borderWidth: 0, marginHorizontal: 20, marginTop: 20 , height: 50}}
                        placeholderStyle={{ fontSize: 16 }}
                        activeLabelStyle={{ fontSize: 16 }}
                        searchablePlaceholder="Enter state"
                        itemStyle={{
                            justifyContent: 'flex-start'
                        }}
                        dropDownStyle={{ backgroundColor: '#fafafa', marginHorizontal: 20, width: '90%', marginTop: 20, minHeight: 300 }}
                        onChangeItem={item => setAddressData({...address_data, State: item.label})}
                    />
                    <View style={{ paddingTop: 10, zIndex: -2 }}>
                        <View style={{
                            borderRadius: 10,
                            flex: 1,
                            margin: 10,
                            marginHorizontal: 20,
                            paddingHorizontal: 10,
                            paddingVertical: 5,
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.8,
                            shadowRadius: 10,
                            elevation: 5,
                            backgroundColor: 'white',
                        }}>
                            <TextInput
                                style={{ paddingVertical: 5, fontSize: 16 }}
                                value={address_data?.City}
                                onChangeText={(value) => { setAddressData({ ...address_data, City: value }) }}
                                multiline={false}
                                placeholder="City"
                                selectionColor={EStyleSheet.value('$primaryColor')}
                            />
                        </View>
                    </View>
                    <View style={{ zIndex: -2 }}>
                        <View style={{
                            borderRadius: 10,
                            flex: 1,
                            margin: 10,
                            marginHorizontal: 20,
                            paddingHorizontal: 10,
                            paddingVertical: 5,
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.8,
                            shadowRadius: 10,
                            elevation: 5,
                            backgroundColor: 'white',
                        }}>
                            <TextInput
                                style={{ paddingVertical: 5, fontSize: 16 }}
                                value={address_data?.Zip}
                                onChangeText={(value) => { setAddressData({ ...address_data, Zip: value }) }}
                                multiline={false}
                                keyboardType="numeric"
                                placeholder="Zip"
                                selectionColor={EStyleSheet.value('$primaryColor')}
                            />
                        </View>
                    </View>

                    {address_data?.User_Address_Id != address_id &&
                        <View style={{ flexDirection: 'row', paddingTop: 20, paddingHorizontal: 20, zIndex: -2 }}>
                            <View style={{ flex: 1 }}>
                                <Text style={{ fontSize: 16 }}>Set as default</Text>
                            </View>
                            <View style={{ flex: 1, alignItems: 'flex-start' }}>
                                <Switch color={EStyleSheet.value('$primaryColor')} value={isSwitchOn} onValueChange={onToggleSwitch} />
                            </View>
                        </View>
                    }

                    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', marginTop: 30, marginHorizontal: 20, marginBottom: 10, alignItems: 'flex-end', zIndex: -1 }}>
                        <Button
                            full
                            loading={loading}
                            onPress={() => {
                                if (!loading)
                                    createAddress();
                            }}
                        >
                            {address_data?.User_Address_Id ? 'Update' : 'Create'}
                        </Button>
                    </View>
                </ScrollView>
            }
        </SafeAreaView>
    )
}

const mapStateToProps = (state) => (state);
const mapDispatchToProps = dispatch => {
    return {
        dispatch
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ChangeAddress);