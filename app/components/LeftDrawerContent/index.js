import { actionTypes } from "@actions";
import profile from '@assets/images/ic_empty_user.png';
import { useIsDrawerOpen } from '@react-navigation/drawer';
import { store } from "@store";
import React, { useEffect } from "react";
import { Image, Keyboard, ScrollView, Text, TouchableOpacity, View } from "react-native";
import EStyleSheet from 'react-native-extended-stylesheet';
import LinearGradient from 'react-native-linear-gradient';
import RNRestart from 'react-native-restart';
import Entypo from 'react-native-vector-icons/Entypo';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Fontisto from 'react-native-vector-icons/Fontisto';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import { useDispatch } from "react-redux";
import styles from './styles';
import * as Utils from '@utils';

const onLogOut = data => {
	return {
		type: actionTypes.LOGIN,
		data
	};
};
function LeftDrawerContent(props) {
	const isDrawerOpen = useIsDrawerOpen();
	const user_detail = store?.getState()?.auth?.login?.user;
	useEffect(() => {
		Keyboard.dismiss();
	}, [isDrawerOpen])
	const dispatch = useDispatch();
	const LogOut = () => {
		let data = {
			success: false,
		};
		dispatch(onLogOut(data));
		setTimeout(() => {
			try {
				props.navigation.navigate('Home');
			} catch (err) {

			}
		}, 500)
	}
	const gotoPage = (page_name) => {
		if (!Utils.checkLogin()) {
			props.navigation.navigate('SignIn')
		} else {
			props.navigation.navigate(page_name);
		}
	}
	return (
		<View style={{ flexDirection: 'column', flex: 1 }}>
			<LinearGradient
				colors={[EStyleSheet.value('$primaryColor'), EStyleSheet.value('$mainColor1')]}
				start={{ x: 0.0, y: 0.25 }}
				end={{ x: 1, y: 1.0 }}
				locations={[0, 0.6]}
				style={{ backgroundColor: EStyleSheet.value('$primaryColor'), padding: 10, flexDirection: 'row', height: 80 }}
			>
				{!Utils.checkLogin() ?
					<View style={{ justifyContent: 'center' }}>
						<TouchableOpacity onPress={() => props.navigation.navigate('SignIn')} >
							<Text style={{ color: 'white', fontSize: 20, fontWeight: 'bold' }}>Login</Text>
						</TouchableOpacity>
					</View>
					:
					<>
						<TouchableOpacity onPress={() => props.navigation.navigate('ProfileEdit')}>
							<Image source={user_detail?.Profile_Pic_Path ? { uri: user_detail?.Profile_Pic_Path } : profile} style={{ height: 55, width: 55, borderRadius: 50, backgroundColor: 'white' }}></Image>
						</TouchableOpacity>
						<Text style={[styles.profile_name, { alignSelf: 'flex-end' }]}>Hi, {user_detail?.First_Name}</Text>
					</>
				}
			</LinearGradient>
			<View style={{ flex: 5, padding: 10 }}>
				<ScrollView showsVerticalScrollIndicator={false}>
					<TouchableOpacity style={styles.item_styles} onPress={() => props.navigation.navigate('Home')}>
						<Entypo name="home" size={25} style={{ margin: 10 }} color={EStyleSheet.value('$primaryColor')}></Entypo>
						<Text style={{ fontSize: 20 }}>Home</Text>
					</TouchableOpacity>
					<TouchableOpacity style={styles.item_styles} onPress={() => gotoPage('MyOrders')}>
						<FontAwesome5 name="box" size={25} style={{ margin: 10 }} color={EStyleSheet.value('$primaryColor')}></FontAwesome5>
						<Text style={{ fontSize: 20 }}>My Orders</Text>
					</TouchableOpacity>
					<TouchableOpacity style={styles.item_styles} onPress={() => gotoPage('WishList')}>
						<FontAwesome name="heart" size={25} style={{ margin: 10 }} color={EStyleSheet.value('$primaryColor')}></FontAwesome>
						<Text style={{ fontSize: 20 }}>Wish List</Text>
					</TouchableOpacity>
					<TouchableOpacity style={styles.item_styles} onPress={() => gotoPage('GiftCard')}>
						<FontAwesome name="gift" size={25} style={{ margin: 10 }} color={EStyleSheet.value('$primaryColor')}></FontAwesome>
						<Text style={{ fontSize: 20 }}>Gift Card</Text>
					</TouchableOpacity>
					<TouchableOpacity style={styles.item_styles} onPress={() => gotoPage('MyWallet')}>
						<FontAwesome5 name="wallet" size={25} style={{ margin: 10 }} color={EStyleSheet.value('$primaryColor')}></FontAwesome5>
						<Text style={{ fontSize: 20 }}>My Wallet</Text>
					</TouchableOpacity>
					<TouchableOpacity style={styles.item_styles} onPress={() => gotoPage('MyProfile')}>
						<Ionicons name="person-circle" size={25} style={{ margin: 10 }} color={EStyleSheet.value('$primaryColor')}></Ionicons>
						<Text style={{ fontSize: 20 }}>My Profile</Text>
					</TouchableOpacity>
					<TouchableOpacity style={styles.item_styles} onPress={() => gotoPage('Earn')}>
						<FontAwesome5 name="user-friends" size={25} style={{ margin: 10 }} color={EStyleSheet.value('$primaryColor')}></FontAwesome5>
						<Text style={{ fontSize: 20 }}>Refer a friend</Text>
					</TouchableOpacity>
					<TouchableOpacity style={styles.item_styles} onPress={() => gotoPage('AddressSetting')}>
						<Entypo name="location" size={25} style={{ margin: 10 }} color={EStyleSheet.value('$primaryColor')}></Entypo>
						<Text style={{ fontSize: 20 }}>Address</Text>
					</TouchableOpacity>
					<Text style={{ fontSize: 16, fontWeight: 'bold' }}>Products</Text>
					<TouchableOpacity style={styles.item_styles} onPress={() => props.navigation.navigate('Categories')}>
						<MaterialIcons name="category" size={25} style={{ margin: 10 }} color={EStyleSheet.value('$primaryColor')}></MaterialIcons>
						<Text style={{ fontSize: 20 }}>Categories</Text>
					</TouchableOpacity>
					<TouchableOpacity style={styles.item_styles} onPress={() => props.navigation.navigate('Brands')}>
						<SimpleLineIcons name="tag" size={25} style={{ margin: 10 }} color={EStyleSheet.value('$primaryColor')}></SimpleLineIcons>
						<Text style={{ fontSize: 20 }}>Brands</Text>
					</TouchableOpacity>
					<Text style={{ fontSize: 16, fontWeight: 'bold' }}>Application Preferences</Text>
					<TouchableOpacity style={styles.item_styles}>
						<FontAwesome5 name="bell" size={25} style={{ margin: 10 }} color={EStyleSheet.value('$primaryColor')}></FontAwesome5>
						<Text style={{ fontSize: 20 }}>Notification</Text>
					</TouchableOpacity>
					<TouchableOpacity style={styles.item_styles}>
						<MaterialIcons name="support-agent" size={25} style={{ margin: 10 }} color={EStyleSheet.value('$primaryColor')}></MaterialIcons>
						<Text style={{ fontSize: 20 }}>Help & Support</Text>
					</TouchableOpacity>
					<TouchableOpacity style={styles.item_styles}>
						<Fontisto name="player-settings" size={25} style={{ margin: 10 }} color={EStyleSheet.value('$primaryColor')}></Fontisto>
						<Text style={{ fontSize: 20 }}>Settings</Text>
					</TouchableOpacity>
					{Utils.checkLogin() &&
						<TouchableOpacity style={styles.item_styles} onPress={() => LogOut()}>
							<MaterialIcons name="logout" size={25} style={{ margin: 10 }} color={EStyleSheet.value('$primaryColor')}></MaterialIcons>
							<Text style={{ fontSize: 20 }}>Log Out</Text>
						</TouchableOpacity>
					}
				</ScrollView>
			</View>
		</View>
	);
}

export default LeftDrawerContent