import { apiActions } from "@actions";
import BackAllow from '@assets/images/go-back-arrow.svg';
import { BaseStyle } from "@config";
import { useFocusEffect } from "@react-navigation/native";
import { store } from "@store";
import React, { useState } from "react";
import { SafeAreaView, Text, TouchableOpacity, View } from "react-native";
import EStyleSheet from 'react-native-extended-stylesheet';
import { TabBar, TabView } from 'react-native-tab-view';
import { connect } from "react-redux";
import TransactionHistory from "./TransactionHistory";
import WithdrawHistroy from "./WithdrawHistroy";

const MyWallet = (props) => {
    const user_detail = store?.getState()?.auth?.login?.user;
    const [index, setIndex] = React.useState(0);
    const [remain_amount, setRemainAmount] = useState('');
    const [routes] = React.useState([
        { key: 'first', title: 'transaction' },
        { key: 'second', title: 'withdraw' },
    ]);
    useFocusEffect(
        React.useCallback(() => {
            var filter = {
                "Record_Filter": "FILTER",
                "User_Id": user_detail?.Email_Id,
            }
            apiActions.get_user_wallet(filter)
                .then(async res => {
                    if (res.Success_Response?.Response_Status == 'Success') {
                        setRemainAmount(res.Wallet[0].Remaining_Balance)
                    }
                })
                .catch(err => {
                    console.log('user wallet', err);
                })
            filter = {
                "Record_Filter": "ALL",
            }
        }, [])
    );

    const renderScene = ({ route, jumpTo }) => {
        switch (route.key) {
            case 'first':
                return <TransactionHistory {...props} />;
            case 'second':
                return <WithdrawHistroy {...props} />;
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
                    <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'white' }}>My Wallet</Text>
                </View>
            </View>
            <View style={{ alignItems: 'center', marginTop: 5 }}>
                <Text style={{ fontSize: 18, color: EStyleSheet.value('$grayColor') }}>COIN BALANCE</Text>
                <Text style={{ fontSize: 16, color: EStyleSheet.value('$categoryColor') }}>₹ {remain_amount?remain_amount:'0.00'}</Text>
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
        </SafeAreaView>
    );
}
const mapStateToProps = (state) => (state);
const mapDispatchToProps = dispatch => {
    return {
        dispatch
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(MyWallet);