import { apiActions } from "@actions";
import BackAllow from '@assets/images/go-back-arrow.svg';
import CustomModal from '@components/CustomModal';
import OrderItem from '@components/OrderItem';
import { BaseStyle } from "@config";
import React, { useEffect, useState } from "react";
import { FlatList, SafeAreaView, Text, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import EStyleSheet from 'react-native-extended-stylesheet';
import {
    BallIndicator
} from 'react-native-indicators';
import { SwipeListView } from "react-native-swipe-list-view";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Octicons from 'react-native-vector-icons/Octicons';
import { connect } from "react-redux";
import styles from './styles';
const MyOrders = (props) => {
    const [myOrderList, setOrderList] = useState();
    const amount = [{ id: 0, value: 'ALL' }, { id: 1, value: 'NEW' }, { id: 2, value: 'UNPAID' }
        , { id: 3, value: 'ACCEPTED' }, { id: 4, value: 'PACKED' }, { id: 5, value: 'SHIPPED' }, { id: 6, value: 'DELIVERED' }, { id: 7, value: 'CANCELLED' }, { id: 8, value: 'RETURNED' }]
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedAmount, setSelectedAmount] = useState(0);
    const [order_id, setOrderId] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        setOrderList([]);
        var data = {
            "Record_Filter": "FILTER",
            "Order_Status": amount[selectedAmount].value,
            "User_Email_ID": 'sravalya.molakala@easystepin.com'
        }
        console.log(data);
        apiActions.get_orders(data)
            .then(async res => {
                setLoading(false);
                if (res?.Success_Response?.Is_Data_Exist == '1') {
                    setOrderList(res?.Order_Details);
                }
            })
            .catch(err => {
                setLoading(false);
                console.log(err)
            })
    }, [selectedAmount])
    const showModal = (order_id) => {
        setOrderId(order_id);
        setModalVisible(true);
    }
    const deleteOrder = () => {
        setModalVisible(false);
        var data = {
            Order_Id: order_id
        }
        apiActions.delete_order(data)
            .then(async res => {
                let myOrderList = myOrderList?.map((item, index) => {
                    if (item?.Order?.Order_Id == order_id) {
                        return null;
                    }
                    return item;
                })
                myOrderList = myOrderList.filter(item => item != null);
            })
            .catch(err => {
                console.log(err);
            })
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
                    <TouchableOpacity style={{ margin: 15 }} onPress={() => { props.navigation.navigate('Home') }}>
                        <BackAllow width={25} height={25} color={EStyleSheet.value('$primaryColor')}></BackAllow>
                    </TouchableOpacity>
                    <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'white' }}>My Order</Text>
                </View>
            </View>
            <View style={{ flexDirection: 'column', padding: 10, marginTop: 10 }}>
                <View style={{ flexDirection: 'row', marginBottom: 10 }}>
                    <MaterialIcons name="bookmarks" size={30} color={EStyleSheet.value('$primaryColor')}></MaterialIcons>
                    <Text style={{ fontSize: 18, }}>Order List</Text>
                </View>
                <View style={{ flexDirection: 'row', paddingVertical: 10 }}>
                    <FlatList
                        showsHorizontalScrollIndicator={false}
                        horizontal
                        data={amount}
                        renderItem={({ item, index }) => <TouchableWithoutFeedback onPress={() => setSelectedAmount(index)} >
                            <View style={[{
                                padding: 3,
                                paddingHorizontal: 8,
                                borderRadius: 5,
                                marginHorizontal: 3,
                                backgroundColor: EStyleSheet.value('$primaryColor')
                            }, index == selectedAmount && styles.seletectAmountItem]}>
                                <Text style={[{ fontSize: 15, color: 'white', fontWeight: 'bold' }, index == selectedAmount && styles.seletectAmount]}>{item.value}</Text>
                            </View>
                        </TouchableWithoutFeedback>}
                        keyExtractor={item => item.id}
                    />
                </View>
            </View>
            {loading ? <BallIndicator color={EStyleSheet.value('$primaryColor')} />
                :
                <SwipeListView
                    data={myOrderList}
                    renderItem={(data, rowMap) => (
                        <View key={rowMap}>
                            <OrderItem item={data}></OrderItem>
                        </View>
                    )}
                    renderHiddenItem={(data, rowMap) => (
                        <TouchableOpacity onPress={() => { showModal(data?.item?.Order?.Order_Id) }} key={rowMap} style={{ right: 0, position: 'absolute', backgroundColor: 'red', width: 75, height: 120, justifyContent: 'center', alignItems: 'center', marginTop: 5 }}>
                            <Octicons name="trashcan" size={65} color="white"></Octicons>
                        </TouchableOpacity>
                    )}
                    previewOpenDelay={3000}
                    friction={1000}
                    tension={40}
                    leftOpenValue={75}
                    stopLeftSwipe={10}
                    rightOpenValue={-75}
                    stopRightSwipe={-75}
                    keyExtractor={(item, index) => index}
                />
            }

            <CustomModal setModalVisible={setModalVisible} modalVisible={modalVisible} deleteOrder={deleteOrder}></CustomModal>
        </SafeAreaView>
    );
}
const mapStateToProps = (state) => (state);
const mapDispatchToProps = dispatch => {
    return {
        dispatch
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(MyOrders);