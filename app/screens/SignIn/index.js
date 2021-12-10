import { actionTypes, apiActions } from "@actions";
import { Button } from "@components";
import OtpBottomSheet from '@components/OtpBottomSheet';
import SocialLogin from '@components/SocialLogin';
import { BaseConfig, BaseStyle } from "@config";
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import * as Utils from "@utils";
import React, { Component } from "react";
import { Image, ImageBackground, SafeAreaView, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import EStyleSheet from 'react-native-extended-stylesheet';
import Toast from 'react-native-simple-toast';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { connect } from "react-redux";
import CashBack from '../../assets/images/cashback.png';
import Main from '../../assets/images/Main.png';
import styles from "./styles";
import PhoneInput from "react-native-phone-number-input";
import BackAllow from '@assets/images/go-back-arrow.svg';

class SignIn extends Component {
	constructor(props) {
		super(props);
		this.state = {
			loading: false,
			email: BaseConfig.DEVELOP_MEDE ? "deepa.sirana@easystepin.com" : '',
			password: BaseConfig.DEVELOP_MEDE ? "Changed12" : '',
			success: {
				email: true,
				password: true
			},
			phone: BaseConfig.DEVELOP_MEDE ? "8904389411" : '',
			userInfo: null,
			showPass: true,
			showOtp: false,
			isEmail: true,
			loginType: 0,
		};
		this.phoneInput = React.createRef();
	}
	UNSAFE_componentWillMount = async () => {
		GoogleSignin.configure({
			webClientId: Utils.GOOGLE_OAUTH_WEB_CLIENT_ID,
			offlineAccess: true
		});
	}
	componentDidMount() {
	}

	onLogin() {
		let self = this;
		let { email, password, success, isEmail, phone } = this.state;
		if (email == "" && isEmail) {
			this.setState({ success: { ...success, email: false } });
			Toast.show("Please enter email address", Toast.LONG);
			return;
		} else if (!Utils.EMAIL_VALIDATE.test(String(email).toLowerCase()) && isEmail) {
			Toast.show("Please enter valid email address", Toast.LONG);
			return;
		} else if (phone == "" && isEmail == false) {
			this.setState({ success: { ...success, email: false } });
			Toast.show("Please enter phone number", Toast.LONG);
			return;
		} else if (!this.phoneInput.current?.isValidNumber(phone) && isEmail == false) {
			Toast.show("Please enter valid phone number", Toast.LONG);
			return;
		} else if (password == "") {
			this.setState({ success: { ...success, password: false } });
			Toast.show("Please enter password", Toast.LONG);
			return;
		}
		if (isEmail == false) {
			self.setState({ loginType: 1 })
			let model = {
				Mobile: phone
			}
			this.setState({
				loading: true
			}, () => {
				apiActions.mobile_otp(model)
					.then(async response => {
						console.log(response);
						self.setState({ showOtp: true })
					})
					.catch(err => {
						Toast.show(err?.UI_Display_Message, Toast.LONG);
					})
					.finally(
						() => this.setState({ loading: false })
					)
			})
		} else {
			self.setState({ loginType: 0 })
			let model = {
				Email_Id: email,
				Password: password,
			}
			this.setState({
				loading: true
			}, () => {
				apiActions.login(model)
					.then(async response => {
						self.setState({ showOtp: true })
					})
					.catch(err => {
						Toast.show(err?.UI_Display_Message, Toast.LONG);
					})
					.finally(
						() => this.setState({ loading: false })
					)
			})
		}
	}

	onSignUp() {
		return this.props.navigation.navigate("SignUp");
	}
	render() {
		const { email, password, loading, success, showPass, showOtp, phone, isEmail, loginType } = this.state;
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
						<Text style={{ fontSize: 20, fontWeight: 'bold', color: 'white' }}>Sign In</Text>
					</View>
				</View>
				<ScrollView >
					<View style={styles.content}>
						{isEmail ?
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
							:
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
						}
						<View style={{ alignItems: 'flex-end' }}>
							{isEmail ?
								<TouchableOpacity onPress={() => this.setState({ isEmail: false })}>
									<Text style={{ color: EStyleSheet.value('$primaryColor') }}>Login with phone</Text>
								</TouchableOpacity>
								:
								<TouchableOpacity onPress={() => this.setState({ isEmail: true })}>
									<Text style={{ color: EStyleSheet.value('$primaryColor') }}>Login with email</Text>
								</TouchableOpacity>
							}

						</View>
						{isEmail &&
							<>
								<View style={[BaseStyle.inputView]}>
									<EvilIcons name="lock" size={35} style={{ marginHorizontal: 6 }} color={EStyleSheet.value('$primaryColor')}></EvilIcons>
									<TextInput
										style={{ fontSize: 18, flex: 1 }}
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
								<View style={{ alignItems: 'flex-end' }}>
									<TouchableOpacity onPress={() => this.props.navigation.navigate('ForgotPassword')}>
										<Text style={{ color: EStyleSheet.value('$primaryColor') }}>Forgot password?</Text>
									</TouchableOpacity>
								</View>
							</>
						}
						<View style={{ width: "100%", marginTop: 30 }}>
							<Button
								full
								loading={loading}
								onPress={() => {
									if (!loading)
										this.onLogin();
								}}
							>
								Log In
							</Button>
						</View>
						<View style={{ width: "100%", marginTop: 30, justifyContent: 'center', flexDirection: 'row' }}>
							<Text>New Customer? </Text>
							<TouchableOpacity onPress={() => this.onSignUp()}>
								<Text style={{ color: EStyleSheet.value('$primaryColor') }}>Register</Text>
							</TouchableOpacity>
						</View>
						<SocialLogin {...this.props} />
					</View>
				</ScrollView>
				<OtpBottomSheet showOtp={showOtp} _this={this} loginType={loginType} phone={phone} email={email}></OtpBottomSheet>
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

export default connect(mapStateToProps, mapDispatchToProps)(SignIn);
