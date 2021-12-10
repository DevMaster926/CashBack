import { apiActions } from "@actions";
import { useIsDrawerOpen } from '@react-navigation/drawer';
import React, { useEffect, useState } from "react";
import { Keyboard, ScrollView, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import EStyleSheet from 'react-native-extended-stylesheet';
import Toast from 'react-native-simple-toast';
import Tags from "react-native-tags";
import styles from './styles';

function RightDrawerContent(props) {
	const isDrawerOpen = useIsDrawerOpen();
	const [category_list, setCategory] = useState([]);
	const [brand_list, setBrandList] = useState([]);
	const [selected_category, setSelectedCategory] = useState(-1);
	const [selected_brand, setSelectedBrand] = useState(-1);
	const [selected_rate, setSelectedRate] = useState(-1);
	const [selected_type, setSelectedType] = useState(-1);
	const [selectd_discount, setSelectedDiscount] = useState(-1);
	const [selectd_cashback, setSelectedCashback] = useState(-1);
	const [min_price, setMinPrice] = useState("");
	const [max_price, setMaxPrice] = useState("");
	const cash_back = [{text: '10% or more', value: '10'}, {text: '25% or more', value: '25'}, {text: '35% or more', value: '35'}, {text: '50% or more', value: '50'}];;
	const discount = [{text: '10% or more', value: '10'}, {text: '25% or more', value: '25'}, {text: '35% or more', value: '35'}, {text: '50% or more', value: '50'}];
	const sort_by = ['All Products', 'All Coupons', 'All Deals'];
	const rating = [{text: '5 Stars', value: '5'}, {text: '4 Stars', value: '4'}, {text: '3 Stars', value: '3'}, {text: '2 Stars', value: '2'}, {text: '1 Stars', value: '1'}];
	useEffect(() => {
		Keyboard.dismiss();
	}, [isDrawerOpen])
	useEffect(() => {
		setCategory([]);
		let data = {
			"Records_Filter": "ALL",
		}
		apiActions.get_brands(data)
			.then(async response => {
				if(response?.Success_Response?.Is_Data_Exist == '1') {
					let brand = response['Brand'];
					brand?.map((item) => {
						setBrandList(brand_list => [...brand_list, {Brand_Name: item.Brand_Name, Brand_Id: item.Brand_Id}])
					})
				}
			})
			.catch(err => {
				console.log(err)
			})
		apiActions.get_all_categories()
			.then(async response => {
				let categories = response?.AllCategories[0].Category;
				for (let i = 0; i < categories.length; i++) {
					setCategory(category_list => [...category_list, { Category_Name: categories[i].Category_Name, Category_Id: categories[i].Category_Id }]);
				}
			})
			.catch(err => {
			})
	}, [])
	const applyFilter = () => {
		if (min_price > max_price) {
			Toast.show('The maximum price cannot be lower than the minimum price.', Toast.LONG)
			return;
		}
		if (selected_type == 0) {
			props.navigation.navigate('Products', { Category_Id: category_list[selected_category]?.Category_Id,Brand_Id: brand_list[selected_brand]?.Brand_Id, rating: rating[selected_rate]?.value, cash_back: cash_back[selectd_cashback]?.value, discount: discount[selectd_discount]?.value });
		} else if (selected_type == 1) {
			props.navigation.navigate('Coupons', { Category_Id: category_list[selected_category]?.Category_Id,Brand_Id: brand_list[selected_brand]?.Brand_Id, rating: rating[selected_rate]?.value, cash_back: cash_back[selectd_cashback]?.value, discount: discount[selectd_discount]?.value });
		} else if (selected_type == 2) {
			props.navigation.navigate('Deals', { Category_Id: category_list[selected_category]?.Category_Id,Brand_Id: brand_list[selected_brand]?.Brand_Id, rating: rating[selected_rate]?.value, cash_back: cash_back[selectd_cashback]?.value, discount: discount[selectd_discount]?.value });
		}
	}
	
	const initState = () => {
		setSelectedBrand(-1);
		setSelectedType(-1);
		setSelectedCategory(-1);
		setSelectedRate(-1);
		setSelectedDiscount(-1);
		setSelectedCashback(-1);
		setMinPrice("");
		setMaxPrice("");
	}
	return (
		<View style={{ flexDirection: 'column', flex: 1 }}>
			<ScrollView style={{ flexDirection: 'column', flex: 1 }}>
				<View style={{ flexDirection: 'column', paddingVertical: 10 }}>
					<View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
						<View style={{ flex: 1 }}>
							<Text style={{ fontSize: 14, paddingHorizontal: 10, color: EStyleSheet.value('$placeColor') }}>Sort by</Text>
						</View>
						<View style={{ flex: 1, alignItems: 'flex-end' }}>
							<TouchableOpacity onPress={() => initState()}>
								<Text style={{ fontSize: 12, paddingHorizontal: 10, color: EStyleSheet.value('$primaryButtonColor'), textDecorationLine: 'underline' }}>Clear All</Text>
							</TouchableOpacity>
						</View>
					</View>
					<View style={{ flexWrap: 'wrap', flexDirection: 'row' }}>
						{sort_by?.map((item, index) => (
							<View key={`${item}-${index}`} style={{ flexDirection: 'row' }}>
								<TouchableWithoutFeedback onPress={() => setSelectedType(index)}>
									<Text style={[{
										fontSize: 14,
										backgroundColor: EStyleSheet.value('$inputBoderColor'),
										marginHorizontal: 10,
										marginVertical: 5,
										padding: 5,
										paddingHorizontal: 10,
										borderRadius: 5,
										color: 'black'
									}, index == selected_type && styles.selected_item]}>{item}</Text>
								</TouchableWithoutFeedback>
							</View>
						))}
					</View>
				</View>
				<View style={{ flexDirection: 'column' }}>
					<Text style={{ fontSize: 14, paddingHorizontal: 10, color: EStyleSheet.value('$placeColor') }}>Categories</Text>
					<View style={{ flexWrap: 'wrap', flexDirection: 'row' }}>
						{category_list?.map((item, index) => (
							<TouchableWithoutFeedback key={`${item.Category_Id}-${index}`} onPress={() => setSelectedCategory(index)}>
								<Text style={[{
									fontSize: 14,
									backgroundColor: EStyleSheet.value('$inputBoderColor'),
									marginHorizontal: 10,
									marginVertical: 5,
									padding: 5,
									paddingHorizontal: 10,
									borderRadius: 5,
									color: 'black'
								}, selected_category == index && styles.selected_item]}>{item.Category_Name}</Text>
							</TouchableWithoutFeedback>
						))}
					</View>
				</View>
				<View style={{ flexDirection: 'column' }}>
					<Text style={{ fontSize: 14, paddingHorizontal: 10, color: EStyleSheet.value('$placeColor') }}>Brands</Text>
					<View style={{ flexWrap: 'wrap', flexDirection: 'row' }}>
						{brand_list?.map((item, index) => (
							<TouchableWithoutFeedback key={`${item.Brand_Id}-${index}`} onPress={() => setSelectedBrand(index)}>
								<Text style={[{
									fontSize: 14,
									backgroundColor: EStyleSheet.value('$inputBoderColor'),
									marginHorizontal: 10,
									marginVertical: 5,
									padding: 5,
									paddingHorizontal: 10,
									borderRadius: 5,
									color: 'black'
								}, selected_brand == index && styles.selected_item]}>{item.Brand_Name}</Text>
							</TouchableWithoutFeedback>
						))}
					</View>
				</View>
				<View style={{ flexDirection: 'column' }}>
					<Text style={{ fontSize: 14, paddingHorizontal: 10, color: EStyleSheet.value('$placeColor') }}>Rating</Text>
					<View style={{ flexWrap: 'wrap', flexDirection: 'row' }}>
						{rating?.map((item, index) => (
							<TouchableWithoutFeedback key={`${item.text}-${index + category_list.length}`} onPress={() => setSelectedRate(index)}>
								<Text style={[{
									fontSize: 14,
									backgroundColor: EStyleSheet.value('$inputBoderColor'),
									marginHorizontal: 10,
									marginVertical: 5,
									padding: 5,
									paddingHorizontal: 10,
									borderRadius: 5,
									color: 'black'
								}, index == selected_rate && styles.selected_item]}>{item.text}</Text>
							</TouchableWithoutFeedback>
						))}
					</View>
				</View>
				<View style={{ flexDirection: 'column' }}>
					<Text style={{ fontSize: 14, paddingHorizontal: 10, color: EStyleSheet.value('$placeColor') }}>Extra Cashback upto</Text>
					<View style={{ flexWrap: 'wrap', flexDirection: 'row' }}>
						{cash_back?.map((item, index) => (
							<TouchableWithoutFeedback key={`${item.text}-${index + category_list.length}`} onPress={() => setSelectedCashback(index)}>
								<Text style={[{
									fontSize: 14,
									backgroundColor: EStyleSheet.value('$inputBoderColor'),
									marginHorizontal: 10,
									marginVertical: 5,
									padding: 5,
									paddingHorizontal: 10,
									borderRadius: 5,
									color: 'black'
								}, index == selectd_cashback && styles.selected_item]}>{item.text}</Text>
							</TouchableWithoutFeedback>
						))}
					</View>
				</View>
				<View style={{ flexDirection: 'column' }}>
					<Text style={{ fontSize: 14, paddingHorizontal: 10, color: EStyleSheet.value('$placeColor') }}>Discount</Text>
					<View style={{ flexWrap: 'wrap', flexDirection: 'row' }}>
						{discount?.map((item, index) => (
							<TouchableWithoutFeedback key={`${item.text}-${index + category_list.length}`} onPress={() => setSelectedDiscount(index)}>
								<Text style={[{
									fontSize: 14,
									backgroundColor: EStyleSheet.value('$inputBoderColor'),
									marginHorizontal: 10,
									marginVertical: 5,
									padding: 5,
									paddingHorizontal: 10,
									borderRadius: 5,
									color: 'black'
								}, index == selectd_discount && styles.selected_item]}>{item.text}</Text>
							</TouchableWithoutFeedback>
						))}
					</View>
				</View>
				<View style={{ flexDirection: 'column', paddingVertical: 10, paddingHorizontal: 10 }}>
					<Text style={{ fontSize: 14, color: EStyleSheet.value('$placeColor') }}>Price</Text>
					<View style={{ flexDirection: 'row', alignItems: 'center' }}>
						<Text>Minimum price: ₹ </Text>
						<TextInput style={{ borderBottomWidth: 1, borderColor: 'gray', padding: 0, minWidth: 70 }} value={min_price} keyboardType="numeric" onChangeText={(value) => setMinPrice(value)} />
					</View>
					<View style={{ flexDirection: 'row', alignItems: 'center' }}>
						<Text>Maximum price: ₹ </Text>
						<TextInput style={{ borderBottomWidth: 1, borderColor: 'gray', padding: 0, minWidth: 70 }} keyboardType="numeric" value={max_price} onChangeText={(value) => setMaxPrice(value)} />
					</View>
				</View>
			</ScrollView>
			<TouchableOpacity onPress={() => applyFilter()} style={{ backgroundColor: EStyleSheet.value('$primaryColor'), borderRadius: 50, margin: 10, marginHorizontal: 30 }}>
				<Text style={{ color: 'white', padding: 10, fontSize: 14, textAlign: 'center' }}>Apply Filter</Text>
			</TouchableOpacity>
		</View>

	);
}

export default RightDrawerContent