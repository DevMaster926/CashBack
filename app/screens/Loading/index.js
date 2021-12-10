import CashBack from '@assets/images/cashback.png';
import { BaseStyle } from "@config";
import { store } from "@store";
import React, { Component } from "react";
import { Image, SafeAreaView, View } from "react-native";
import EStyleSheet from "react-native-extended-stylesheet";
import {
    BallIndicator
} from 'react-native-indicators';
import { connect } from "react-redux";
class Loading extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        setTimeout(() => {
            try {
                if (store.getState().auth?.splash?.splash == true) {
                    return this.props.navigation.navigate("Main");
                } else {
                    return this.props.navigation.navigate("Intro");
                }
            } catch (err) {
            }
        }, 1000);
    }

    componentWillUnmount() {

    }

    render() {
        return (
            <SafeAreaView
                style={[BaseStyle.safeAreaView]}
                forceInset={{ top: "always" }}
            >
                <View style={{ alignItems: "center", flexDirection: 'column', justifyContent: 'center', height: '100%' }}>
                    <View style={{ flex: 1, justifyContent: 'flex-end', alignItems: 'flex-end' }}>
                        <Image style={{ height: 170, resizeMode: 'contain' }} source={CashBack} />
                    </View>
                    <View style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'flex-end' }}>
                        <BallIndicator color={EStyleSheet.value('$primaryColor')} />
                    </View>
                </View>
            </SafeAreaView>
        );
    }
}

const mapStateToProps = (state) => (state);
const mapDispatchToProps = dispatch => {
    return {
        dispatch
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Loading);