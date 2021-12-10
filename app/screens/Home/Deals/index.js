import { apiActions } from "@actions";
import Expired from '@assets/images/expired.png';
import Live from '@assets/images/live.png';
import { store } from "@store";
import React, { useEffect, useState } from "react";
import { FlatList, Image, Linking, Text, TouchableOpacity, View } from "react-native";
import DeviceInfo from 'react-native-device-info';
import EStyleSheet from "react-native-extended-stylesheet";
import {
	BallIndicator
} from 'react-native-indicators';
import { connect } from "react-redux";
import styles from "./styles";
import * as Utils from '@utils';
const Deals = (props) => {
	const [topDeals, setTopDeals] = useState([]);
	const [loading, setLoading] = useState(false);
	useEffect(() => {
		let filter = {
			"Record_Filter": "FILTER",
			"Verified_Deal": "1",
			"Is_Top_Deal": "1",
			"Status": "Active",
			"Status_Condition": "Active"
		}
		setLoading(true);
		apiActions.get_deals(filter)
			.then(async res => {
				setLoading(false);
				if (res?.Success_Response?.Response_Code == '200') {
					setTopDeals(res?.Deals);
				}
			})
			.catch(err => {
				setLoading(false);
			})
	}, [])

	const handleClick = async (item) => {
		if (!Utils.checkLogin()) {
            props.navigation.navigate('SignIn')
            return;
        }
		let ipAddress = await DeviceInfo.getIpAddress();
		var data = {
			"User_Email_Id": store?.getState()?.auth?.login?.user.Email_Id,
			"Ip_Address": ipAddress,
			"Offer_Type": "Deal",
			"Offer_Id": item?.Deal_Id,
			"Store_Type": item?.Type,
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
				props.navigation.navigate('DealDetails', { deal: item })
			} else {
				console.log("Don't know how to open URI: " + item?.Mobile_Redirect_Url);
			}
		});
	};

	const RenderItem = ({ item }) => {
		return (
			<View style={styles.deal_item}>
				<View style={{ flexDirection: 'row' }}>
					<View style={{ position: 'absolute', zIndex: 100 }}>
						{item?.Live_Status == "Expired" &&
							<Image source={Expired} style={{ width: 40, height: 40 }} />
						}
						{item?.Live_Status == "Live" &&
							<Image source={Live} style={{ width: 40, height: 40 }} />
						}
					</View>
					{parseInt(item?.Discount) != 0 &&
						<View style={{ alignItems: 'flex-end', flex: 1, marginTop: 5 }}>
							<Text style={{ backgroundColor: EStyleSheet.value('$primaryColor'), padding: 2, fontSize: 10, color: 'white', borderTopLeftRadius: 5, borderBottomLeftRadius: 5 }}>{item?.Discount_Type == 'A' && "₹ " + item?.Discount}{item?.Discount_Type == 'P' && item?.Discount.split('.')[0] + "%"} Off</Text>
						</View>
					}
				</View>
				<View style={{ flexDirection: 'column', width: '100%', marginTop: 10 }}>
					<Image source={{ uri: item?.Logo_Path }} style={{ height: 40, width: '100%', resizeMode: 'contain', marginBottom: 3 }} />
					<Image source={{ uri: item?.Image }} style={{ height: 140, width: "100%" }}></Image>
					<View style={{ backgroundColor: EStyleSheet.value('$cashbackColor'), flex: 1, flexDirection: 'row', justifyContent: 'center', paddingVertical: 5, marginTop: 5 }}>
						<Text style={{ fontSize: 13, color: 'white', textAlign: 'center' }}>ESI Cashback: {item?.Esi_Cashback_Amount}</Text>
					</View>
					<View style={{ alignSelf: 'center', flexDirection: 'column' }}>
						<Text style={{ fontSize: 13, textAlign: 'center', color: EStyleSheet.value('$fontColor') }}>{item?.Category_Name}</Text>
						{item?.Live_Status == "Live" &&
							<Text style={{ fontSize: 11, textAlign: 'center', color: EStyleSheet.value('$grayColor') }}>Deal will expire on {item?.End_Date}</Text>
						}
						{item?.Live_Status == "Expired" &&
							<Text style={{ fontSize: 10, color: EStyleSheet.value('$errorColor') }}>Deal expired on {item?.End_Date}</Text>
						}
					</View>
				</View>
				<View style={{ justifyContent: 'flex-end', flex: 1, marginTop: 5 }}>
					<TouchableOpacity onPress={() => handleClick(item)} style={{ backgroundColor: EStyleSheet.value('$primaryButtonColor'), borderRadius: 20, paddingVertical: 5, paddingHorizontal: 10, marginBottom: 5, height: 30 }}>
						<Text style={{ color: 'white', fontSize: 14 }}>Grab Deal</Text>
					</TouchableOpacity>
				</View>
			</View>
		)
	}
	return (
		<View style={{ padding: 5, flex: 1 }}>
			{loading ? <BallIndicator color='white' />
				:
				<FlatList
					contentContainerStyle={{ paddingVertical: 10 }}
					horizontal
					showsHorizontalScrollIndicator={false}
					data={topDeals}
					renderItem={RenderItem}
					keyExtractor={item => item.Deal_Id}
				/>
			}
		</View>
	);
}
const mapStateToProps = (state) => (state);
const mapDispatchToProps = dispatch => {
	return {
		dispatch
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(Deals);