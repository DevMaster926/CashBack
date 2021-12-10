import { apiActions } from "@actions";
import BackAllow from '@assets/images/go-back-arrow.svg';
import empty_profile from '@assets/images/ic_empty_user.png';
import { BaseStyle } from "@config";
import { useFocusEffect } from "@react-navigation/native";
import { store } from "@store";
import * as Utils from "@utils";
import React, { useRef, useState } from "react";
import { FlatList, Image, SafeAreaView, Text, TextInput, TouchableOpacity, View } from "react-native";
import EStyleSheet from 'react-native-extended-stylesheet';
import {
    BallIndicator
} from 'react-native-indicators';
import Modal from 'react-native-modal';
import PhoneInput from "react-native-phone-number-input";
import Toast from 'react-native-simple-toast';
import { connect } from "react-redux";
import Refer from '../../assets/images/refer.png';
import styles from './styles';
import Textarea from 'react-native-textarea';

const Earn = (props) => {
    const user_detail = store?.getState()?.auth?.login?.user;
    const [modalVisible, setModalVisible] = useState(false);
    const [friend_email, setFriendEmail] = useState("");
    const [friend_name, setFriendName] = useState("");
    const [message, setMessage] = useState("");
    const [refer_list, setReferList] = useState([]);
    const phoneInput = useRef();
    const [phone, setPhone] = useState("");
    const [loading, setLoading] = useState(false);
    useFocusEffect(
        React.useCallback(() => {
            var data = {
                "Records_Filter": "FILTER",
                "User_Email_Id": user_detail?.Email_Id
            }
            setLoading(true);
            setReferList([]);
            apiActions.get_refer(data)
                .then(async res => {
                    if (res?.Success_Response?.Is_Data_Exist == '1') {
                        var refer = res?.Refer_Earn;
                        if (refer.length == 0) {
                            setLoading(false);
                        }
                        console.log(refer[0])
                        for (let i = 0; i < refer.length; i++) {
                            let filter = {
                                "Records_Filter": "FILTER",
                                "Email_Id": refer[i].User_Email_Id,
                            }
                            await apiActions.get_user_details(filter)
                                .then(async res => {
                                    setLoading(false);
                                    if (res?.Success_Response?.Is_Data_Exist == '1') {
                                        refer[i].Profile_Pic_Path = res?.User_Details[0]?.Profile_Pic_Path;
                                    }
                                    setReferList(refer_list => [...refer_list, refer[i]])
                                })
                                .catch(err => {
                                    setLoading(false);
                                    console.log('err ===> ', err);
                                })
                        }
                    }
                })
                .catch(err => {
                    setLoading(false);
                    console.log(err);
                })
        }, [])
    );
    const createRefer = () => {
        if (friend_email == user_detail?.Email_Id) {
            Toast.show("Please enter other email address.", Toast.LONG);
        }
        if (friend_email == "" && phone == "") {
            Toast.show("Please enter email or phone number", Toast.LONG);
        }
        if (friend_email && !Utils.EMAIL_VALIDATE.test(String(friend_email).toLowerCase())) {
            Toast.show("Please enter valid email", Toast.LONG);
            return;
        }
        if (phone && !phoneInput.current?.isValidNumber(phone)) {
            Toast.show("Please enter valid phone number", Toast.LONG);
            return;
        }
        var data = {
            "Email_Id": friend_email,
            "User_Email_Id": user_detail?.Email_Id,
            "Mobile": phone,
            "Name": friend_name,
            "Message": message,
        }
        apiActions.create_refer(data)
            .then(async res => {
                setModalVisible(false);
                setPhone("");
                setFriendEmail("");
                setMessage("");
                setFriendName("");
                Toast.show(res?.UI_Display_Message, Toast.LONG);
            })
            .catch(err => {
                setModalVisible(false);
                setPhone("");
                setFriendEmail("");
                setMessage("");
                setFriendName("");
                console.log(err);
            })
    }
    const RenderItem = ({ item }) => {
        return (
            <View style={[styles.list_item, { flexDirection: 'row' }]}>
                <Image source={item?.Profile_Pic_Path ? { uri: item?.Profile_Pic_Path } : empty_profile} style={{ width: 50, height: 50, borderRadius: 50 }} />
                <View style={{ flexDirection: 'column', marginLeft: 5 }}>
                    <Text>{item.User_Email_Id}</Text>
                    <Text>{item.Created_Date}</Text>
                </View>
                <View style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'row', flex: 1 }}>
                    <Text style={{ textAlign: 'center' }}>{item?.Status}</Text>
                </View>
            </View>
        )
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
                    <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'white' }}>Refer a friend</Text>
                </View>
            </View>
            <View>
                <Image source={Refer} style={{ width: '100%', height: 250 }} />
            </View>
            <View style={{ alignItems: 'center', marginTop: 10 }}>
                <TouchableOpacity onPress={() => setModalVisible(true)} style={{
                    backgroundColor: EStyleSheet.value('$primaryColor'),
                    padding: 10, borderRadius: 10
                }}>
                    <Text style={{ fontSize: 18, color: 'white', fontWeight: 'bold' }}>Invite friends</Text>
                </TouchableOpacity>
            </View>
            {loading ? <BallIndicator color={EStyleSheet.value('$primaryColor')} />
                :
                <View style={{ flex: 1 }}>
                    <FlatList
                        showsVerticalScrollIndicator={false}
                        data={refer_list}
                        renderItem={RenderItem}
                        keyExtractor={(item, index) => index + item?.Reference_Id}
                    />
                </View>
            }
            <Modal
                onBackButtonPress={() => setModalVisible(false)}
                isVisible={modalVisible}
                onBackdropPress={() => setModalVisible(false)}
                swipeDirection="left"
                backdropColor={EStyleSheet.value('$placeColor')}
                backdropOpacity={0.6}
            >
                <View style={{ minHeight: 200, minWidth: '80%', backgroundColor: 'white', borderRadius: 10, padding: 10, alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ fontSize: 16, paddingTop: 10 }}>Friend's email</Text>
                    <View style={{ flexDirection: 'row', paddingBottom: 10 }}>
                        <View style={[styles.input_style, { flex: 1 }]}>
                            <TextInput
                                style={{ paddingVertical: 5, fontSize: 16, flex: 1 }}
                                value={friend_email}
                                onChangeText={(value) => setFriendEmail(value)}
                                multiline={false}
                                placeholder="Enter email"
                                selectionColor={EStyleSheet.value('$primaryColor')}
                            />
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginHorizontal: 20 }}>
                        <View style={{ height: 0.8, flex: 1, backgroundColor: EStyleSheet.value('$placeColor'), marginTop: 5 }}>
                        </View>
                        <Text>  Or  </Text>
                        <View style={{ height: 0.8, flex: 1, backgroundColor: EStyleSheet.value('$placeColor'), marginTop: 5 }}>
                        </View>
                    </View>
                    <Text style={{ fontSize: 16, paddingTop: 10 }}>Friend's phone</Text>
                    <View style={{ flexDirection: 'column' }}>
                        <View style={[styles.input_style, { paddingHorizontal: 0, paddingVertical: 0 }]}>
                            <PhoneInput
                                containerStyle={{ justifyContent: 'center', borderRadius: 10 }}
                                textContainerStyle={{ backgroundColor: '#ffffff', height: 50, alignItems: 'center', borderTopRightRadius: 10, borderBottomRightRadius: 10 }}
                                textInputStyle={{ paddingVertical: 5, margin: 0, backgroundColor: '#ffffff', height: 40, width: '100%', fontSize: 16 }}
                                countryPickerButtonStyle={{ alignSelf: 'center', width: '20%' }}
                                codeTextStyle={{ height: 20, fontSize: 16 }}
                                ref={phoneInput}
                                value={phone}
                                defaultCode="IN"
                                layout="first"
                                placeholder="Enter phone number"
                                onChangeText={(text) => {
                                    setPhone(text);
                                }}
                            />
                        </View>
                    </View>
                    <Text style={{ fontSize: 16, paddingTop: 10 }}>Friend's name</Text>
                    <View style={{ flexDirection: 'row', paddingBottom: 10 }}>
                        <View style={[styles.input_style, { flex: 1 }]}>
                            <TextInput
                                style={{ paddingVertical: 5, fontSize: 16, flex: 1 }}
                                value={friend_name}
                                onChangeText={(value) => setFriendName(value)}
                                multiline={false}
                                placeholder="Enter name"
                                selectionColor={EStyleSheet.value('$primaryColor')}
                            />
                        </View>
                    </View>
                    <Textarea
                        containerStyle={styles.textareaContainer}
                        style={styles.textarea}
                        onChangeText={(value) => setMessage(value)}
                        defaultValue={message}
                        maxLength={100}
                        placeholder={'You can send message.'}
                        placeholderTextColor={'#c7c7c7'}
                        underlineColorAndroid={'transparent'}
                    />

                    <View style={{ marginTop: 20, flexDirection: 'row', marginBottom: 10 }}>
                        <TouchableOpacity onPress={createRefer} style={{ backgroundColor: EStyleSheet.value('$primaryColor'), padding: 10, flex: 1, alignItems: 'center', marginHorizontal: 10, borderRadius: 10 }}>
                            <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>Apply</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}
const mapStateToProps = (state) => (state);
const mapDispatchToProps = dispatch => {
    return {
        dispatch
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Earn);