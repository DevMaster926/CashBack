import { apiActions } from "@actions";
import { Button } from "@components";
import SocialLogin from '@components/SocialLogin';
import { BaseConfig, BaseStyle } from "@config";
import * as Utils from "@utils";
import React, { Component } from "react";
import { Image, ImageBackground, SafeAreaView, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import EStyleSheet from 'react-native-extended-stylesheet';
import PhoneInput from "react-native-phone-number-input";
import Toast from 'react-native-simple-toast';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { connect } from "react-redux";
import CashBack from '../../assets/images/cashback.png';
import Main from '../../assets/images/Main.png';
import styles from "./styles";
import BackAllow from '@assets/images/go-back-arrow.svg';

class SignUp extends Component {
	constructor(props) {
		super(props);
		this.initState = {
			loading: false,
			fname: BaseConfig.DEVELOP_MEDE ? "test" : '',
			lname: '',
			email: BaseConfig.DEVELOP_MEDE ? "deepa.sirana@easystepin.com" : '',
			password: BaseConfig.DEVELOP_MEDE ? "1234567" : '',
			cpassword: BaseConfig.DEVELOP_MEDE ? "1234567" : '',
			success: {
				fname: true,
				lname: true,
				email: true,
				phone: true,
				password: true,
				cpassword: true
			},
			phone: BaseConfig.DEVELOP_MEDE ? "89777567619" : '',
			formattedPhone: "",
			validPhone: false,
			showPass: true,
			showConfirmPass: true,
			showOtp: false,
		};
		this.state = this.initState;
		this.phoneInput = React.createRef();
	}

	componentDidMount() {

	}

	componentWillUnmount() {
	}

	onSignIn() {
		return this.props.navigation.navigate("SignIn");
	}

	onSingUp() {
		const { navigation } = this.props;
		const { loading, fname, lname, email, password, cpassword, success, phone, formattedPhone, validPhone } = this.state;

		if (fname == "") {
			this.setState({ success: { ...success, fname: false } });
			Toast.show("Please enter name", Toast.LONG);
			return;
		} else if (email == "") {
			Toast.show("Please enter email address", Toast.LONG);
			return;
		} else if (!Utils.EMAIL_VALIDATE.test(String(email).toLowerCase())) {
			Toast.show("Please enter valid email address", Toast.LONG);
			return;
		} else if (phone == "") {
			Toast.show("Please enter phone number", Toast.LONG);
			return;
		} else if (!this.phoneInput.current?.isValidNumber(phone)) {
			Toast.show("Please enter valid phone number", Toast.LONG);
			return;
		} else if (password == "") {
			this.setState({ success: { ...success, password: false } });
			Toast.show("Please enter password", Toast.LONG);
			return;
		} else if (!password.match(Utils?.PASSPORT_VALIDATE)) {
			Toast.show('Password must contain at least 8 characters, including UPPER/lowercase and numbers', Toast.LONG);
			return;
		} else if (cpassword == "") {
			this.setState({ success: { ...success, cpassword: false } });
			Toast.show("Please enter confirm password", Toast.LONG);
			return;
		} else if (cpassword != password) {
			this.setState({ success: { ...success, cpassword: false } });
			Toast.show("Confirm password should be same", Toast.LONG);
			return;
		}

		let model = {
			Email_Id: email,
			Mobile_Number: phone,
			Password: password,
			User_Type: "USER",
		}
		this.setState(
			{
				loading: true,
			},
			() => {
				apiActions.registration(model)
					.then(async response => {
						Toast.show(response?.UI_Display_Message, Toast.LONG);
						if (response?.Response_Status == "Success") {
							this.setState({ ...this.initState });
							return this.navigation.goBack();
						}
					})
					.catch(err => {
						Toast.show(err?.UI_Display_Message, Toast.LONG);
					})
					.finally(
						() => this.setState({ loading: false })
					)
			}
		);
	}

	render() {
		const { loading, fname, lname, email, password, cpassword, success, phone, showPass, showConfirmPass, showOtp } = this.state;
		return (
			<SafeAreaView
				style={[BaseStyle.safeAreaView]}
				forceInset={{ top: "always" }}
			>
				<View style={{ flexDirection: 'row', alignItems: 'center' }}>
					<View
						style={{ flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: EStyleSheet.value('$primaryColor') }}
					>
						<TouchableOpacity style={{ margin: 15 }} onPress={() => { this.props.navigation.goBack() }}>
							<BackAllow width={25} height={25} color={EStyleSheet.value('$primaryColor')}></BackAllow>
						</TouchableOpacity>
						<Text style={{ fontSize: 20, fontWeight: 'bold', color: 'white' }}>Sign Up</Text>
					</View>
				</View>
				<ScrollView >
					<View style={styles.content}>
						<View style={[BaseStyle.inputView]}>
							<Ionicons name="person" size={24} style={{ marginHorizontal: 10 }} color={EStyleSheet.value('$primaryColor')}></Ionicons>
							<TextInput
								style={{ fontSize: 18, flex: 1 }}
								onChangeText={fname => this.setState({ fname })}
								onFocus={() => {
									this.setState({
										success: {
											...success,
											fname: true
										}
									});
								}}
								placeholder="Name"
								multiline={false}
								placeholderTextColor={
									success.fname
										? EStyleSheet.value('$placeColor')
										: EStyleSheet.value('$errorColor')
								}
								value={fname}
								selectionColor={EStyleSheet.value('$primaryColor')}
							/>
						</View>
						<View style={[BaseStyle.inputView]}>
							<Icon name="email" size={24} style={{ marginHorizontal: 10 }} color={EStyleSheet.value('$primaryColor')}></Icon>
							<TextInput
								style={{ fontSize: 18, flex: 1 }}
								onChangeText={email => this.setState({ email })}
								onFocus={() => {
									this.setState({
										success: {
											...success,
											email: true
										}
									});
								}}
								placeholder="Email Address"
								multiline={false}
								placeholderTextColor={
									success.email
										? EStyleSheet.value('$placeColor')
										: EStyleSheet.value('$errorColor')
								}
								value={email}
								selectionColor={EStyleSheet.value('$primaryColor')}
							/>
						</View>
						<View style={[BaseStyle.inputView]}>
							<FontAwesome name="mobile-phone" size={28} style={{ marginHorizontal: 16 }} color={EStyleSheet.value('$primaryColor')}></FontAwesome>
							<PhoneInput
								containerStyle={{ justifyContent: 'center', borderRadius: 10, backgroundColor: EStyleSheet.value('$contentColor1'), width: '85%' }}
								textContainerStyle={{ backgroundColor: EStyleSheet.value('$contentColor1'), height: 50, alignItems: 'center', borderRadius: 10, width: '85%' }}
								textInputStyle={{ paddingVertical: 5, margin: 0, backgroundColor: EStyleSheet.value('$contentColor1'), height: 40, width: '100%', fontSize: 16 }}
								countryPickerButtonStyle={{ alignSelf: 'center', width: '20%', backgroundColor: EStyleSheet.value('$contentColor1') }}
								codeTextStyle={{ height: 20, fontSize: 16 }}
								ref={this.phoneInput}
								value={phone}
								defaultCode="IN"
								layout="first"
								onChangeText={(text) => {
									this.setState({ phone: text });
								}}
							/>
						</View>
						<View style={[BaseStyle.inputView]}>
							<EvilIcons name="lock" size={30} style={{ marginHorizontal: 8 }} color={EStyleSheet.value('$primaryColor')}></EvilIcons>
							<TextInput
								style={{ fontSize: 18, flex: 1, marginRight: 50 }}
								onChangeText={password => this.setState({ password })}
								onFocus={() => {
									this.setState({
										success: {
											...success,
											password: true
										}
									});
								}}
								placeholder="Password"
								secureTextEntry={showPass}
								multiline={false}
								placeholderTextColor={
									success.password
										? EStyleSheet.value('$placeColor')
										: EStyleSheet.value('$errorColor')
								}
								value={password}
								selectionColor={EStyleSheet.value('$primaryColor')}
							/>
							<FontAwesome onPress={() => this.setState({ showPass: !showPass })} name={showPass ? 'eye-slash' : 'eye'} size={30} color={EStyleSheet.value('$primaryColor')} style={{ position: 'absolute', right: 15 }}></FontAwesome>
						</View>
						<View style={[BaseStyle.inputView]}>
							<EvilIcons name="lock" size={30} style={{ marginHorizontal: 8 }} color={EStyleSheet.value('$primaryColor')}></EvilIcons>
							<TextInput
								style={{ fontSize: 18, flex: 1, marginRight: 50 }}
								onChangeText={cpassword => this.setState({ cpassword })}
								onFocus={() => {
									this.setState({
										success: {
											...success,
											cpassword: true
										}
									});
								}}
								placeholder="Confirm Password"
								secureTextEntry={showConfirmPass}
								multiline={false}
								placeholderTextColor={
									success.cpassword
										? EStyleSheet.value('$placeColor')
										: EStyleSheet.value('$errorColor')
								}
								value={cpassword}
								selectionColor={EStyleSheet.value('$primaryColor')}
							/>
							<FontAwesome onPress={() => this.setState({ showConfirmPass: !showConfirmPass })} name={showConfirmPass ? 'eye-slash' : 'eye'} size={30} color={EStyleSheet.value('$primaryColor')} style={{ position: 'absolute', right: 15 }}></FontAwesome>
						</View>
						<View style={{ width: "100%", marginTop: 30 }}>
							<Button
								full
								loading={loading}
								onPress={() => {
									if (!loading)
										this.onSingUp();	
								}}
							>
								Register
							</Button>
						</View>
						<View style={{ width: "100%", marginTop: 30, justifyContent: 'center', flexDirection: 'row' }}>
							<Text>Already a Customer?</Text>
							<TouchableOpacity onPress={() => this.onSignIn()}>
								<Text style={{ color: EStyleSheet.value('$primaryColor') }}> Log In</Text>
							</TouchableOpacity>
						</View>
						<SocialLogin />
					</View>
				</ScrollView>
			</SafeAreaView>
		);
	}
}

const mapStateToProps = (state) => (state);
const mapDispatchToProps = dispatch => {
	return {
		dispatch
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(SignUp);