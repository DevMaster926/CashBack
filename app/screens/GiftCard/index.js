import BackAllow from '@assets/images/go-back-arrow.svg';
import CustomModal from '@components/CustomModal';
import { BaseStyle } from "@config";
import React, { useState } from "react";
import { SafeAreaView, Text, TouchableOpacity, View } from "react-native";
import EStyleSheet from 'react-native-extended-stylesheet';
import { TabBar, TabView } from 'react-native-tab-view';
import { connect } from "react-redux";
import ReceiveGift from './ReceiveGift';
import SendGift from './SendGift';
import styles from './styles';

const GiftCard = (props) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [index, setIndex] = React.useState(0);
    const [routes] = React.useState([
        { key: 'first', title: 'Sent' },
        { key: 'second', title: 'Recived' },
    ]);
    const renderScene = ({ route, jumpTo }) => {
        switch (route.key) {
            case 'first':
                return <SendGift {...props} setModalVisible={setModalVisible} />;
            case 'second':
                return <ReceiveGift {...props} setModalVisible={setModalVisible} />;
        }
    };

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
                    <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'white' }}>Gift Card</Text>
                </View>
            </View>
            <TabView
                renderTabBar={props => <TabBar {...props}
                    style={{ backgroundColor: '#fff' }}
                    activeColor={EStyleSheet.value('$primaryColor')}
                    inactiveColor='#111'
                    labelStyle={{ fontWeight: 'bold' }}
                    indicatorStyle={{ backgroundColor: EStyleSheet.value('$primaryColor') }} />}
                navigationState={{ index, routes }}
                renderScene={renderScene}
                onIndexChange={setIndex}
            />
            <View style={styles.sub_cart}>
                <TouchableOpacity style={styles.button} onPress={() => props.navigation.navigate('BuyGift')}>
                    <Text style={{ padding: 10, color: EStyleSheet.value('$primaryColor'), fontWeight: 'bold' }}>Buy Gift Card</Text>
                </TouchableOpacity>
            </View>
            <CustomModal setModalVisible={setModalVisible} modalVisible={modalVisible}></CustomModal>
        </SafeAreaView>
    );
}
const mapStateToProps = (state) => (state);
const mapDispatchToProps = dispatch => {
    return {
        dispatch
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(GiftCard);