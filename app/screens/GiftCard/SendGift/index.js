import { apiActions } from "@actions";
import { useFocusEffect } from "@react-navigation/native";
import { store } from "@store";
import React, { useState } from "react";
import { FlatList, Image, Text, View } from "react-native";
import EStyleSheet from "react-native-extended-stylesheet";
import {
    BallIndicator
} from 'react-native-indicators';
import styles from './styles';
const SendGift = (props) => {
    const user_detail = store?.getState()?.auth?.login?.user;
    const [gift_list, setGiftList] = useState([]);
    const [loading, setLoading] = useState(false);
    useFocusEffect(
        React.useCallback(() => {
            setGiftList([]);
            setLoading(true);
            let filter = {
                "Email_Id": user_detail?.Email_Id,
                "Is_approved": "1"
            }
            apiActions.get_ordered_gifts(filter)
                .then(async res => {
                    if (res.Success_Response?.Is_Data_Exist == 1) {
                        let gift_vouchers = res.GiftVoucherGet;
                        gift_vouchers?.map((item) => {
                            filter = {
                                Records_Filter: "FILTER",
                                Vendor_Id: item?.Gift_Card_Vendor_Id
                            }
                            apiActions.get_gift_voucher_image(filter)
                                .then(async res => {
                                    if (res.Success_Response?.Is_Data_Exist == '1') {
                                        item.Image_URL = res?.Image_Gift[0].Image_URL;
                                    }
                                    setGiftList(gift_list => [...gift_list, item]);
                                    setLoading(false);
                                })
                                .catch(err => {
                                    setLoading(false);
                                })
                        })
                    } else {
                        setLoading(false);
                    }
                })
                .catch(err => {
                    setLoading(false);
                    console.log(err)
                })

        }, [])
    );

    const RenderItem = ({ item }) => {
        return (
            <View style={styles.content}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View style={{ flex: 1 }}>
                        <Image source={{ uri: item?.Image_URL }} style={styles.image}></Image>
                    </View>
                    <View style={{ flex: 2, justifyContent: 'flex-start', alignSelf: 'flex-start' }}>
                        <Text>{item?.Order_To_Name}</Text>
                        <Text>{item?.Order_To_Email_Id}</Text>
                        <Text style={{ color: EStyleSheet.value('$categoryColor') }}>₹ {item?.Total_Value}</Text>
                        <Text style={{ color: EStyleSheet.value('$grayColor') }}>{item?.Created_Date}</Text>
                        <Text>{item?.Gift_Message}</Text>
                    </View>
                </View>
            </View>
        )
    }
    return (
        <View style={{ flex: 1 }}>
            {loading ? <BallIndicator color={EStyleSheet.value('$primaryColor')} />
                :
                gift_list.length > 0 ?
                    <FlatList
                        showsVerticalScrollIndicator={false}
                        data={gift_list}
                        renderItem={RenderItem}
                        keyExtractor={(item, index) => item?.Gift_Voucher_Id + index}
                    />
                    :
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <Text>No Gift Cards Sent.</Text>
                    </View>
            }
        </View>
        // <ScrollView style={{ flex: 1 }}>
        //     <View style={styles.content}>
        //         <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        //             <View style={{ flex: 1 }}>
        //                 <Image source={product_1} style={styles.image}></Image>
        //             </View>
        //             <View style={{ flex: 2, justifyContent: 'flex-start', alignSelf: 'flex-start' }}>
        //                 <Text>Happy Birth Day</Text>
        //             </View>
        //             <View style={{ flex: 0.5, flexDirection: 'column', alignItems: 'center' }}>
        //                 <Text style={{ fontSize: 18, margin: 5, color: 'black' }}>₹849</Text>
        //             </View>
        //         </View>
        //     </View>
        // </ScrollView>
    )
}

export default SendGift