import { apiActions } from "@actions";
import Expired from '@assets/images/expired.png';
import Live from '@assets/images/live.png';
import HeaderContent from '@components/HeaderContent';
import { BaseStyle } from "@config";
import { store } from "@store";
import React, { useEffect, useState } from "react";
import { FlatList, Image, Linking, SafeAreaView, Text, TouchableOpacity, View } from "react-native";
import DeviceInfo from 'react-native-device-info';
import EStyleSheet from "react-native-extended-stylesheet";
import {
	BallIndicator
} from 'react-native-indicators';
import { connect } from "react-redux";
import styles from "./styles";
import * as Utils from '@utils';

const Coupons = (props) => {
    const user_detail = store?.getState()?.auth?.login?.user;
	const [topCoupons, setTopCoupons] = useState([]);
	const [loading, setLoading] = useState(false);
	useEffect(() => {
		let filter = {
			"Records_Filter": "ALL",
		}
		setLoading(true);
		apiActions.get_coupons(filter)
			.then(async res => {
				setLoading(false);
				if (res?.Success_Response?.Response_Code == '200') {
					setTopCoupons(res?.Coupons);
				}
			})
			.catch(err => {
				setLoading(false);
				if (err?.Success_Response?.Response_Code == '200') {
					setTopCoupons(err?.Coupons);
				}
			})
	}, [])
	const RenderItem = ({ item }) => {
		return (
			<View style={[styles.coupon_item]}>
				<View style={{ flexDirection: 'row' }}>
					<View style={{ position: 'absolute', zIndex: 100 }}>
						{item?.Expired_Status == "Expired" &&
							<Image source={Expired} style={{ width: 40, height: 40 }} />
						}
						{item?.Expired_Status == "Live" &&
							<Image source={Live} style={{ width: 40, height: 40 }} />
						}
					</View>
					{parseInt(item?.Discount_Amount) != 0 &&
						<View style={{ alignItems: 'flex-end', flex: 1, marginTop: 5 }}>
							<Text style={{ backgroundColor: EStyleSheet.value('$primaryColor'), padding: 2, fontSize: 10, color: 'white', borderTopLeftRadius: 5, borderBottomLeftRadius: 5 }}>{item?.Discount_Type == 'A' && "??? " + item?.Discount_Amount}{item?.Discount_Type == 'P' && item?.Discount_Amount + "%"} Off</Text>
						</View>
					}
				</View>
				<View style={{ flexDirection: 'column', width: '100%', marginTop: 10 }}>
					<Image source={{ uri: item?.Logo_Path }} style={{ height: 40, width: '100%', resizeMode: 'contain', marginBottom: 3 }} />
					<Image source={{ uri: item?.Image_Path }} style={{ padding: 8, height: 130, width: "100%" }}></Image>
					<View style={{ backgroundColor: EStyleSheet.value('$cashbackColor'), flex: 1, flexDirection: 'row', justifyContent: 'center', paddingVertical: 5, marginTop: 5 }}>
						<Text style={{ fontSize: 13, color: 'white', textAlign: 'center' }}>ESI Cashback:  {item?.ESI_Cashback_Amount}</Text>
					</View>
					<View style={{ alignSelf: 'center', flexDirection: 'column' }}>
						<Text style={{ fontSize: 13, textAlign: 'center', color: EStyleSheet.value('$fontColor') }}>{item?.Name}</Text>
						{item?.Expired_Status == "Live" &&
							<Text style={{ fontSize: 11, textAlign: 'center', color: EStyleSheet.value('$grayColor') }}>Coupon will expire on {item?.Valid_Through_Date}</Text>
						}
						{item?.Expired_Status == "Expired" &&
							<Text style={{ fontSize: 10, color: EStyleSheet.value('$errorColor') }}>Coupon expired on {item?.Valid_Through_Date}</Text>
						}
					</View>
				</View>
				<View style={{ justifyContent: 'flex-end', flex: 1, marginTop: 5 }}>
					<TouchableOpacity onPress={() => handleClick(item)} style={{ backgroundColor: EStyleSheet.value('$primaryButtonColor'), borderRadius: 20, paddingVertical: 5, paddingHorizontal: 10, marginBottom: 5, height: 30 }}>
						<Text style={{ color: 'white', fontSize: 14 }}>Grab Coupon</Text>
					</TouchableOpacity>
				</View>
			</View>
		)
	}
	const handleClick = async (item) => {
		if (!Utils.checkLogin()) {
            props.navigation.navigate('SignIn')
            return;
        }
		let ipAddress = await DeviceInfo.getIpAddress();
		var data = {
			"User_Email_Id": user_detail?.Email_Id,
			"Ip_Address": ipAddress,
			"Offer_Type": "Coupon",
			"Offer_Id": item?.Coupon_Id,
			"Store_Type": item?.Partner_Type,
			"Store_Id": item?.Partner_Details_Id,
			"Esi_Cashback": item?.Extra_Cashback,
			"Status": item?.Status,
			"Redirection_Url": item?.Mobile_Redirect_Url
		}
		apiActions.create_offer_visitor(data)
			.then(async res => {
				console.log(res);
			})
			.catch(err => {
				console.log(err)
			})
		Linking.canOpenURL(item?.Mobile_Redirect_Url).then(supported => {
			if (supported) {
				Linking.openURL(item?.Mobile_Redirect_Url);
				props.navigation.navigate('CouponDetails', { coupon: item })
			} else {
				console.log("Don't know how to open URI: " + item?.Mobile_Redirect_Url);
			}
		});
	};
	return (
		<SafeAreaView
			style={[BaseStyle.safeAreaView]}
			forceInset={{ top: "always" }}
		>
			<HeaderContent {...props} title="My Account"></HeaderContent>
			<View style={{ padding: 5, flex: 1, }}>
				{loading ? <BallIndicator color={EStyleSheet.value('$primaryColor')} />
					:
					<FlatList
						columnWrapperStyle={{ marginVertical: 5, paddingRight: 10 }}
						numColumns={2}
						showsVerticalScrollIndicator={false}
						data={topCoupons}
						renderItem={RenderItem}
						keyExtractor={item => item.Coupon_Id}
					/>
				}

			</View>
		</SafeAreaView>
	);
}
const mapStateToProps = (state) => (state);
const mapDispatchToProps = dispatch => {
	return {
		dispatch
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(Coupons);