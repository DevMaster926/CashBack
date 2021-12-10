import { apiActions } from "@actions";
import product_5 from '@assets/images/amazon.png';
import product_3 from '@assets/images/apple.png';
import product_1 from '@assets/images/dell.png';
import product_4 from '@assets/images/flipkart.png';
import product_2 from '@assets/images/hp.png';
import React, { useEffect, useState } from "react";
import { FlatList, Image, Text, TouchableOpacity, View, Linking } from "react-native";
import EStyleSheet from 'react-native-extended-stylesheet';
import {
    BallIndicator
} from 'react-native-indicators';
import styles from './styles';
import * as Utils from '@utils';
const TopItem = (props) => {
    const topItems = [product_1, product_2, product_3, product_4, product_5];
    const [topBrands, setTopBrands] = useState([]);
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        setLoading(true);
        let filter = {
            "Records_Filter": "FILTER",
            "Top_Stores": "1"
        }
        setTopBrands([]);
        apiActions.get_partner_details(filter)
            .then(async res => {
                setLoading(false);
                if (res?.Success_Response?.Is_Data_Exist == '1') {
                    setTopBrands(res?.Partner_Details);
                    console.log(res.Partner_Details[0]);
                }
            })
            .catch(err => {
                setLoading(false)
                console.log(err)
            })
    }, [])
    const shopNow = (item) => {
        if (!Utils.checkLogin()) {
            props.navigation.navigate('SignIn')
            return;
        }
        Linking.canOpenURL(item?.Mobile_Redirect_Url).then(supported => {
			if (supported) {
				Linking.openURL(item?.Mobile_Redirect_Url);
			} else {
				console.log("Don't know how to open URI: " + item?.Mobile_Redirect_Url);
			}
		});
    }
    return (
        <View style={styles.content}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={{ fontSize: 15, fontWeight: 'bold' }}>Top Stores</Text>
                {/* <TouchableOpacity style={{ position: 'absolute', right: 10 }}>
                    <Text style={{ fontSize: 12, color: EStyleSheet.value('$grayColor') }}>View All</Text>
                </TouchableOpacity> */}
            </View>
            {loading ? <BallIndicator color={EStyleSheet.value('$primaryColor')} />
                :
                <FlatList
                    contentContainerStyle={{ paddingVertical: 10 }}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    data={topBrands}
                    renderItem={({ item }) => <View style={{ flexDirection: 'column' }}>
                        <View style={[styles.item]}>
                            <Image source={{ uri: item?.Logo_Path }} style={{ height: 80, flex: 1, resizeMode: 'contain', width: 90 }}></Image>
                            <Text style={{ fontSize: 10, textAlign: 'center' }}>{item?.Name}</Text>
                        </View>
                        <TouchableOpacity onPress={() => shopNow(item)} style={{ marginTop: 10 }}>
                            <Text style={{ fontSize: 11, color: 'red', textAlign: 'center' }}>Shop Now</Text>
                        </TouchableOpacity>
                    </View>}
                    keyExtractor={(item, index) => item?.Partner_Details_Id + index}
                />
            }
        </View>
    )
}

export default TopItem