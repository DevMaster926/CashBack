import { actionTypes, apiActions } from "@actions";
import BackAllow from '@assets/images/go-back-arrow.svg';
import profile from '@assets/images/ic_empty_user.png';
import { Button } from "@components";
import { BaseStyle } from "@config";
import DateTimePicker from '@react-native-community/datetimepicker';
import { useFocusEffect } from "@react-navigation/native";
import { store } from "@store";
import * as Utils from "@utils";
import Moment from "moment";
import React, { useRef, useState } from "react";
import { Image, SafeAreaView, ScrollView, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import EStyleSheet from 'react-native-extended-stylesheet';
import { launchImageLibrary } from 'react-native-image-picker';
import { RadioButton } from 'react-native-paper';
import PhoneInput from "react-native-phone-number-input";
import Toast from 'react-native-simple-toast';
import { useDispatch } from "react-redux";
import styles from './styles';

const ProfileEdit = (props) => {
    const [loading, setLoading] = useState(false);
    const phoneInput = useRef();
    const user_detail = store?.getState()?.auth?.login?.user;
    const [fir_name, setFirName] = useState("");
    const [last_name, setLastName] = useState("");
    const [gender, setGender] = useState('Male');
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [proof_type, setProofType] = useState("");
    const [proof_number, setProofNumber] = useState("");
    const [user_image, setImage] = useState();
    const [update_image, setUpdateImage] = useState("");
    const [birth_date, setBirthDate] = useState(new Date());
    const dispatch = useDispatch();
    const [details_id, setDetailsID] = useState("");
    const [show, setShow] = useState(false);
    useFocusEffect(
        React.useCallback(() => {
            setUpdateImage("");
            setFirName(user_detail?.First_Name);
            setLastName(user_detail?.Last_Name);
            setGender(user_detail?.Gender ? user_detail?.Gender : 'Male');
            setPhone(user_detail?.Mobile);
            setEmail(user_detail?.Email_Id);
            setProofType(user_detail?.Id_Proof_Type);
            setProofNumber(user_detail?.Id_Proof_Number);
            setImage(user_detail?.Profile_Pic_Path);
            setDetailsID(user_detail?.User_Details_Id);
        }, [])
    );
    const createProfile = () => {
        if (fir_name == "") {
            Toast.show("Please enter first name", Toast.LONG);
            return;
        } else if (last_name == "") {
            Toast.show("Please enter enter second name", Toast.LONG);
            return;
        } else if (email == "") {
            Toast.show("Please enter email", Toast.LONG);
            return;
        } else if (!Utils.EMAIL_VALIDATE.test(String(email).toLowerCase())) {
            Toast.show("Please enter valid email", Toast.LONG);
            return;
        } else if (phone == "") {
            Toast.show("Please enter phone number", Toast.LONG);
            return;
        } else if (!phoneInput.current?.isValidNumber(phone)) {
            Toast.show("Please enter valid phone number", Toast.LONG);
            return;
        } else if (proof_type == "") {
            Toast.show("Please enter enter proof type", Toast.LONG);
            return;
        } else if (proof_number == "") {
            Toast.show("Please enter proof number", Toast.LONG);
            return;
        }
        let update_data = {
            "User_Details_Id": details_id ? details_id : "",
            "Email_Id": email,
            "Dob": "2020-07-02",
            "Gender": gender,
            "First_Name": fir_name,
            "Last_Name": last_name,
            "Mobile": phone,
            "Id_Proof_Type": proof_type,
            "Id_Proof_Number": proof_number,
            "Profile_Pic_Path": user_image,
            "Dob": Moment(birth_date).format('YYYY-MM-DD')
        }
        if (update_image) {
            apiActions.upload_image(update_image, user_detail?.Email_Id)
                .then(async res => {
                    if (res?.Response_Status == 'Success') {
                        let path = res?.File_URL;
                        update_data.Profile_Pic_Path = path;
                        saveProfile(update_data);
                    }
                })
                .catch(err => {
                    console.log(err)
                })
        } else {
            saveProfile(update_data);
        }
    }

    const saveProfile = (update_data) => {
        if (details_id == undefined) {
            apiActions.create_profile(update_data)
                .then(async res => {
                    if (res?.Response_Status == 'Success') {
                        Toast.show('Profile updated successfully', Toast.LONG);
                        let data = {
                            success: true,
                            user: update_data,
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
                    console.log(err);
                })
        } else {
            apiActions.update_profile(update_data)
                .then(async res => {
                    if (res?.Response_Status == 'Success') {
                        Toast.show('Profile updated successfully', Toast.LONG);
                        let data = {
                            success: true,
                            user: update_data,
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
                    console.log(err);
                })
        }
    }
    const uploadPicture = () => {
        launchImageLibrary(
            {
                mediaType: 'photo',
                includeBase64: true,
                maxHeight: 200,
                maxWidth: 200,
            },
            (response) => {
                if (!response?.didCancel) {
                    setUpdateImage(response);
                }
            },
        )
    }
    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate || birth_date;
        setShow(false);
        setBirthDate(currentDate);
      };
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
                    <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'white' }}>Edit Profile</Text>
                </View>
            </View>
            <ScrollView>
                <View style={{ justifyContent: 'center', alignItems: 'center', margin: 10 }}>
                    <TouchableOpacity onPress={() => uploadPicture()} style={styles.user_image}>
                        <Image source={update_image ? { uri: update_image?.uri } : (user_image ? { uri: user_image } : profile)} style={{ width: 120, height: 120, borderRadius: 100, resizeMode: 'cover' }}></Image>
                    </TouchableOpacity>
                </View>
                <View style={{ flexDirection: 'column', paddingBottom: 20 }}>
                    <View style={styles.input_style}>
                        <Text style={styles.input_field}>First Name:</Text>
                        <TextInput
                            style={{ paddingVertical: 5, fontSize: 16, flex: 1 }}
                            value={fir_name}
                            onChangeText={(value) => setFirName(value)}
                            multiline={false}
                            selectionColor={EStyleSheet.value('$primaryColor')}
                        />
                    </View>
                </View>
                <View style={{ flexDirection: 'column', paddingBottom: 20 }}>
                    <View style={styles.input_style}>
                        <Text style={styles.input_field}>Last Name:</Text>
                        <TextInput
                            style={{ paddingVertical: 5, fontSize: 16, flex: 1 }}
                            value={last_name}
                            onChangeText={(value) => setLastName(value)}
                            multiline={false}
                            selectionColor={EStyleSheet.value('$primaryColor')}
                        />
                    </View>
                </View>
                <TouchableWithoutFeedback style={{ flexDirection: 'column', paddingBottom: 20 }} onPress={() => { setShow(true) }}>
                    <View style={styles.input_style}>
                        <Text style={styles.input_field}>Birth Date: </Text>
                        <Text
                            style={{ paddingVertical: 5, fontSize: 16, flex: 1 }}
                        >{Moment(birth_date).format('YYYY-MM-DD')}</Text>
                    </View>
                </TouchableWithoutFeedback>
                {show && (
                    <DateTimePicker
                        testID="dateTimePicker"
                        value={birth_date}
                        mode={'date'}
                        display="default"
                        onChange={onChange}
                    />
                )}
                <View style={{ flexDirection: 'column', paddingVertical: 20 }}>
                    <RadioButton.Group onValueChange={newValue => setGender(newValue)} value={gender}>
                        <View style={{ flexDirection: 'row' }}>
                            <View style={{ flexDirection: 'row', flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                                <Text>Male</Text>
                                <RadioButton value="Male" color={EStyleSheet.value('$primaryColor')} />
                            </View>
                            <View style={{ flexDirection: 'row', flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                                <Text>Female</Text>
                                <RadioButton value="Female" color={EStyleSheet.value('$primaryColor')} />
                            </View>
                        </View>
                    </RadioButton.Group>
                </View>
                <View style={{ flexDirection: 'column', paddingBottom: 20 }}>
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
                </View>
                <View style={{ flexDirection: 'column', paddingBottom: 20 }}>
                    <View style={styles.input_style}>
                        <Text style={styles.input_field}>Proof Type:</Text>
                        <TextInput
                            style={{ paddingVertical: 5, fontSize: 16, flex: 1 }}
                            value={proof_type}
                            onChangeText={(value) => setProofType(value)}
                            multiline={false}
                            selectionColor={EStyleSheet.value('$primaryColor')}
                        />
                    </View>
                </View>
                <View style={{ flexDirection: 'column', paddingBottom: 20 }}>
                    <View style={styles.input_style}>
                        <Text style={styles.input_field}>Proof ID:</Text>
                        <TextInput
                            style={{ paddingVertical: 5, fontSize: 16, flex: 1 }}
                            value={proof_number}
                            onChangeText={(value) => setProofNumber(value)}
                            multiline={false}
                            keyboardType="numeric"
                            selectionColor={EStyleSheet.value('$primaryColor')}
                        />
                    </View>
                </View>
                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-end', marginTop: 30, marginHorizontal: 20, marginBottom: 10 }}>
                    <Button
                        full
                        loading={loading}
                        onPress={() => {
                            if (!loading)
                                createProfile();
                        }}
                    >
                        Update
                    </Button>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

export default ProfileEdit;