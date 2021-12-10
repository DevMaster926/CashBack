import { apiActions } from "@actions";
import BackAllow from '@assets/images/go-back-arrow.svg';
import { BaseStyle } from "@config";
import React, { useEffect, useState } from "react";
import { FlatList, Image, Linking, SafeAreaView, Text, TouchableOpacity, View } from "react-native";
import EStyleSheet from "react-native-extended-stylesheet";
import HTMLView from 'react-native-htmlview';
import {
	BallIndicator
} from 'react-native-indicators';
import Toast from 'react-native-simple-toast';
import { connect } from "react-redux";
const Brands = (props) => {
	const [brands, setBrands] = useState([]);
	const [loading, setLoading] = useState(false);
	useEffect(() => {
		setLoading(true);
		let data = {
			"Records_Filter": "ALL",
		}
		apiActions.get_brands(data)
			.then(async response => {
				setLoading(false);
				// setBrands(response?.AllCategories[0].Category);
				if (response?.Success_Response?.Response_Code == '200') {
					setBrands(response?.Brand);
				}
				Toast.show(response?.Success_Response?.UI_Display_Message, Toast.LONG);
			})
			.catch(err => {
				console.log(err)
				setLoading(false);
				Toast.show(err?.UI_Display_Message ? err?.UI_Display_Message : err?.Success_Response?.UI_Display_Message, Toast.LONG);
			})
	}, [])
	const handleClick = (url) => {
		Linking.canOpenURL(url).then(supported => {
			if (supported) {
				Linking.openURL(url);
			} else {
				console.log("Don't know how to open URI: " + url);
			}
		});
	};
	const renderItem = ({ item }) => {
		return (
			<View style={{
				marginHorizontal: 2, borderRadius: 10, padding: 2, backgroundColor: 'white', marginBottom: 5, flexDirection: 'row', shadowColor: '#000',
				shadowOffset: { width: 0, height: 2 },
				shadowOpacity: 0.8,
				shadowRadius: 10,
				elevation: 10,
			}}>
				<View style={{ flex: 1, padding: 5, flexDirection: 'column' }}>
					<Image source={{ uri: item?.Brand_Image }} style={{ height: 100, width: '100%', resizeMode: 'contain' }}></Image>
					<TouchableOpacity onPress={() => handleClick(item.Brand_Link)}>
						<Text style={{ fontSize: 14, fontWeight: 'bold', textDecorationLine: 'underline', color: EStyleSheet.value('$grayColor') }}>Brand: {item.Brand_Name}</Text>
					</TouchableOpacity>
				</View>
				<View style={{ flex: 2, flexDirection: 'column', margin: 10 }}>
					<Text>Description: </Text>
					<HTMLView value={item.Brand_Description} />
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
                    <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'white' }}>Brands</Text>
                </View>
            </View>
			{loading ? <BallIndicator color={EStyleSheet.value('$primaryColor')} />
				:
				<FlatList
					contentContainerStyle={{ padding: 10 }}
					showsVerticalScrollIndicator={false}
					data={brands}
					renderItem={renderItem}
					keyExtractor={item => item.Brand_Id}
				/>
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

export default connect(mapStateToProps, mapDispatchToProps)(Brands);