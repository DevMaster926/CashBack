import React, { useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import EStyleSheet from 'react-native-extended-stylesheet';
import AntDesign from 'react-native-vector-icons/AntDesign';
import styles from './styles';
import Octicons from 'react-native-vector-icons/Octicons';
import Modal from 'react-native-modal';

const WishItem = (props) => {
    const { product, addAmount, removeAmount } = props;
    const [modalVisible, setModalVisible] = useState(false);
    const removeItem = (wish_id) => {
        removeAmount(wish_id)
    }
    console.log(product)
    const addItem = (wish_id) => {
        addAmount(wish_id)
    }
    return (
        <View style={styles.content}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={{ flex: 1, paddingHorizontal: 3 }}>
                    <Image source={{ uri: product?.Product_Image }} style={[styles.image, { resizeMode: 'contain' }]}></Image>
                </View>
                <View style={{ flex: 2, justifyContent: 'flex-start', alignSelf: 'flex-start' }}>
                    <Text style={{ fontSize: 16 }}>Brand: {product?.Brand_Name}</Text>
                    <Text style={{ fontSize: 16, color: 'black' }}>Partner: {product?.Partner_Name}</Text>
                    <Text style={{ fontSize: 14, fontWeight: 'bold', color: EStyleSheet.value('$productColor') }}>{product?.Product_Name}</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={{ textDecorationLine: 'line-through', marginRight: 8, fontSize: 12, color: EStyleSheet.value('$placeColor') }}>₹{product?.Original_Price}</Text>
                        <Text style={{ color: EStyleSheet.value('$categoryColor') }}>₹ {product?.Partner_Selling_Price}</Text>
                    </View>
                    <Text style={{ color: EStyleSheet.value('$grayColor') }}>{product?.Product_Short_Description}</Text>
                </View>
                <View style={{ flex: 0.5, flexDirection: 'column', alignItems: 'center' }}>
                    <TouchableOpacity onPress={() => setModalVisible(true)}>
                        <Octicons name="trashcan" size={28} color="red"></Octicons>
                    </TouchableOpacity>
                </View>
            </View>
            <Modal
                onBackButtonPress={() => setModalVisible(false)}
                isVisible={modalVisible}
                onBackdropPress={() => setModalVisible(false)}
                swipeDirection="left"
                backdropColor={EStyleSheet.value('$placeColor')}
                backdropOpacity={0.6}
                animationIn="zoomInDown"
                animationOut="zoomOutUp"
                animationInTiming={600}
                animationOutTiming={600}
                backdropTransitionInTiming={600}
                backdropTransitionOutTiming={600}
            >
                <View style={{ minHeight: '20%', minWidth: '80%', backgroundColor: 'white', borderRadius: 10, flexDirection: 'column' }}>
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ fontSize: 18 }}>Are you sure delete this product?</Text>
                    </View>
                    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginHorizontal: 20 }}>
                        <TouchableOpacity onPress={() => removeItem(product?.Wish_Id)} style={{
                            backgroundColor: EStyleSheet.value('$primaryColor'), flex: 1, alignItems: 'center',
                            borderBottomLeftRadius: 10, borderTopLeftRadius: 10, padding: 5, shadowColor: '#000',
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.8,
                            shadowRadius: 10,
                            elevation: 10,
                        }}>
                            <Text style={{ color: 'white', fontSize: 16 }}>Yes</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setModalVisible(false)}
                            style={{
                                backgroundColor: EStyleSheet.value('white'), flex: 1, alignItems: 'center',
                                borderBottomRightRadius: 10, borderTopRightRadius: 10, padding: 5, shadowColor: '#000',
                                shadowOffset: { width: 0, height: 2 },
                                shadowOpacity: 0.8,
                                shadowRadius: 10,
                                elevation: 10,
                            }}>
                            <Text style={{ fontSize: 16 }}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    )
}

export default WishItem