import Cancel from "@assets/images/cancel.svg";
import Success from "@assets/images/success.svg";
import { Button } from "@components";
import { BaseStyle } from "@config";
import React, { useEffect } from "react";
import { BackHandler, SafeAreaView, Text, View } from "react-native";

const PaymentStatus = (props) => {
    const { status } = props.route?.params;

    useEffect(() => {
        const backAction = () => {
            return true;
          };
        const backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            backAction
          );
      
          return () => backHandler.remove();
    }, [])

    return (
        <SafeAreaView
            style={[BaseStyle.safeAreaView]}
            forceInset={{ top: "always" }}
        >
            <View style={{ flexDirection: 'column', alignItems: 'center', flex: 1 }}>
                <View style={{ marginTop: 120 }}></View>
                {status == true ?
                    <Success width={100} height={100}></Success>
                    :
                    <Cancel width={100} height={100}></Cancel>
                }
                <View style={{ marginTop: 30 }}></View>
                {status == true ?
                    <Text style={{ fontSize: 22, fontWeight: 'bold', textAlign: 'center' }}>
                        Order placed successfully
                    </Text>
                    :
                    <Text style={{ fontSize: 22, fontWeight: 'bold', textAlign: 'center' }}>
                        Payment failed
                    </Text>
                }
                <View style={{ marginTop: 20 }}></View>
                {status == true ?
                    <Text style={{ fontSize: 14 }}>
                        We have sent you the receipt to your mailbox
                    </Text>
                    :
                    <Text style={{ fontSize: 14 }}>
                        Please check your internet connection and try again later.
                    </Text>
                }
                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', marginTop: 30, marginHorizontal: 20, marginBottom: 30, alignItems: 'flex-end' }}>
                    <Button
                        full
                        onPress={() => {
                            status==true?props.navigation.navigate('MyOrders'):props.navigation.goBack();
                        }}
                    >
                        DONE
                    </Button>
                </View>
            </View>
        </SafeAreaView>
    )
}

export default PaymentStatus