import { apiActions } from "@actions";
import React, { useEffect, useState } from "react";
import { FlatList, Image, Text, TouchableOpacity, View } from "react-native";
import EStyleSheet from "react-native-extended-stylesheet";
import {
	BallIndicator
} from 'react-native-indicators';
import { connect } from "react-redux";
import styles from './styles';
const Products = (props) => {
	const [topProducts, setTopProducts] = useState([]);
	const [loading, setLoading] = useState(false);
	useEffect(() => {
		setTopProducts([]);
		let filter = {
			"Record_Filter": "FILTER",
			"Is_Top_Product": "1",
		}
		setLoading(true);
		apiActions.get_products(filter)
			.then(async res => {
				setLoading(false);
				if (res?.Success_Response?.Response_Code == '200') {
					let productsData = res?.Product_Details;
					setTopProducts(productsData);
				}
			})
			.catch(err => {
				setLoading(false);
				if (err?.Success_Response?.Response_Code == '200') {
					setTopProducts(err?.Product);
				}
			})
	}, [])
	const RenderItem = ({ item }) => {
		return (
			<View style={[styles.reder_item]}>
				<View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 3 }}>
					<Image source={{ uri: item?.Logo_Path }} style={{ height: 25, flex: 1, resizeMode: 'contain', marginBottom: 3, width: 80 }} />
					{parseInt(item?.Partner_Discount) != 0 &&
						<View style={{ position: 'absolute', right: 0 }}>
							<Text style={{ backgroundColor: EStyleSheet.value('$primaryColor'), padding: 2, fontSize: 10, color: 'white', borderTopLeftRadius: 5, borderBottomLeftRadius: 5 }}>{item?.Partner_Discount_Type == 'A' && "₹ " + item?.Partner_Discount}{item?.Partner_Discount_Type == 'P' && item?.Partner_Discount.split('.')[0] + "%"} Off</Text>
						</View>
					}
				</View>
				<View style={{ backgroundColor: EStyleSheet.value('$productColor'), width: '100%', marginTop: 5 }}>
					<Text style={{ paddingVertical: 3, color: 'white', fontSize: 14, fontWeight: 'bold', textAlign: 'center' }}>ESI Cashback: {item?.Esi_Cashback}</Text>
				</View>
				<View style={{ flexDirection: 'column', width: '100%' }}>
					<Image source={{ uri: item?.Product_Image }} style={{ padding: 8, height: 140, width: "100%", resizeMode: 'contain' }}></Image>
					<View style={{ backgroundColor: EStyleSheet.value('$productColor'), width: '100%', marginTop: 5 }}>
						<Text style={{ paddingVertical: 3, color: 'white', fontSize: 16, fontWeight: 'bold', textAlign: 'center' }}>Brand: {item?.Brand_Name}</Text>
					</View>
					<View>
						<Text style={{ fontSize: 14, textAlign: 'center' }}>Original Price: {item?.Original_Price}</Text>
					</View>
					<View style={{ backgroundColor: EStyleSheet.value('$productColor'), width: '100%', marginTop: 5 }}>
						<Text style={{ paddingVertical: 3, color: 'white', fontSize: 14, fontWeight: 'bold', textAlign: 'center' }}>Final Price: {item?.CashBack_Product_Price}</Text>
					</View>
				</View>
				<View style={{ justifyContent: 'flex-end', flex: 1 }}>
					<TouchableOpacity onPress={() => props.navigation.navigate('ProductDetails', { Product_Id: item.Product_Id, Partner_Detail_Id: item.Partner_Detail_Id })} style={{ backgroundColor: EStyleSheet.value('$primaryButtonColor'), borderRadius: 20, paddingVertical: 5, paddingHorizontal: 10, marginBottom: 5, height: 30 }}>
						<Text style={{ color: 'white', fontSize: 14 }}>View Product</Text>
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
					data={topProducts}
					renderItem={RenderItem}
					keyExtractor={(item, index) => item.Product_Id + index}
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

export default connect(mapStateToProps, mapDispatchToProps)(Products);