import { actionTypes, apiActions } from "@actions";
import HeaderContent from '@components/HeaderContent';
import SliderItem from '@components/SliderItem';
import { BaseStyle } from "@config";
import { store } from "@store";
import React, { useEffect } from "react";
import { SafeAreaView, ScrollView, Text, View, TouchableOpacity } from "react-native";
import EStyleSheet from "react-native-extended-stylesheet";
import LinearGradient from 'react-native-linear-gradient';
import RNRestart from 'react-native-restart';
import { connect } from "react-redux";
import Coupons from './Coupons';
import Deals from './Deals';
import Products from './Products';
import styles from "./styles";
import TopItem from './TopItem';

const Home = (props) => {
	let email = store?.getState()?.auth?.login?.user?.Email_Id;
	let login_status = store?.getState()?.auth?.login?.success;
	useEffect(() => {
		let filter = {
			"Records_Filter": "FILTER",
			"Email_Id": email,
			"User_Details_Id": "",
			"First_Name": "",
			"Last_Name ": "",
		}
		apiActions.get_user_details(filter)
			.then(async res => {
				if (res?.Is_Data_Exist == '0') {
					let data = {
						success: false,
					};
					props.dispatch({ type: actionTypes.LOGIN, data })
					return;
				} else {
					let data = {
						success: true,
						user: res?.User_Details[0],
					};
					props.dispatch({ type: actionTypes.LOGIN, data })
				}
			})
			.catch(err => {
				console.log(err);
			})
	}, [login_status])
	return (
		<SafeAreaView
			style={[BaseStyle.safeAreaView]}
			forceInset={{ top: "always" }}
		>
			<HeaderContent {...props} title="ESI CASHBACK"></HeaderContent>
			<ScrollView showsVerticalScrollIndicator={false}>
				<SliderItem></SliderItem>
				<TopItem {...props}></TopItem>
				<LinearGradient
					colors={[EStyleSheet.value('$mainColor1'), EStyleSheet.value('$primaryColor')]}
					start={{ x: 0.0, y: 0.25 }}
					end={{ x: 1, y: 1.0 }}
					locations={[0, 0.6]}
					style={styles.content}
				>
					<View style={{ flexDirection: 'row', height: 50, alignItems: 'center', justifyContent: 'center', borderBottomWidth: 2, borderColor: EStyleSheet.value('$contentColor1') }}>
						<Text style={[{ fontSize: 19, fontWeight: 'bold', textAlign: 'center', color: 'white' }]}>DEALS</Text>
						<TouchableOpacity onPress={() => props.navigation.navigate('Deals')} style={{ position: 'absolute', right: 10 }}>
							<Text style={{ color: 'white' }}>View All</Text>
						</TouchableOpacity>
					</View>
					<Deals {...props} />
				</LinearGradient>
				<LinearGradient
					colors={[EStyleSheet.value('$mainColor1'), EStyleSheet.value('$primaryColor')]}
					start={{ x: 0.0, y: 0.25 }}
					end={{ x: 1, y: 1.0 }}
					locations={[0, 0.6]}
					style={styles.content}
				>
					<View style={{ flexDirection: 'row', height: 50, alignItems: 'center', justifyContent: 'center', borderBottomWidth: 2, borderColor: EStyleSheet.value('$contentColor1') }}>
						<Text style={[{ fontSize: 19, fontWeight: 'bold', textAlign: 'center', color: 'white' }]}>PRODUCTS</Text>
						<TouchableOpacity onPress={() => props.navigation.navigate('Products', { Sub_Category_Id: "", Category_Id: "" })} style={{ position: 'absolute', right: 10 }}>
							<Text style={{ color: 'white' }}>View All</Text>
						</TouchableOpacity>
					</View>
					<Products {...props} />
				</LinearGradient>
				<LinearGradient
					colors={[EStyleSheet.value('$mainColor1'), EStyleSheet.value('$primaryColor')]}
					start={{ x: 0.0, y: 0.25 }}
					end={{ x: 1, y: 1.0 }}
					locations={[0, 0.6]}
					style={styles.content}
				>
					<View style={{ flexDirection: 'row', height: 50, alignItems: 'center', justifyContent: 'center', borderBottomWidth: 2, borderColor: EStyleSheet.value('$contentColor1') }}>
						<Text style={[{ fontSize: 19, fontWeight: 'bold', textAlign: 'center', color: 'white' }]}>COUPONS</Text>
						<TouchableOpacity onPress={() => props.navigation.navigate('Coupons')} style={{ position: 'absolute', right: 10 }}>
							<Text style={{ color: 'white' }}>View All</Text>
						</TouchableOpacity>
					</View>
					<Coupons {...props} />
				</LinearGradient>
			</ScrollView>

		</SafeAreaView>
	);
}
const mapStateToProps = (state) => (state);
const mapDispatchToProps = dispatch => {
	return {
		dispatch
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);