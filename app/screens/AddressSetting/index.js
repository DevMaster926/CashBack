import { apiActions } from "@actions";
import AddressBook from '@assets/images/address_book.svg';
import BackAllow from '@assets/images/go-back-arrow.svg';
import { BaseStyle } from "@config";
import { store } from "@store";
import React, { useEffect, useState } from "react";
import { FlatList, SafeAreaView, Text, TouchableOpacity, View } from "react-native";
import EStyleSheet from 'react-native-extended-stylesheet';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { connect } from "react-redux";
import styles from './styles';
import {
    BallIndicator
} from 'react-native-indicators';
const AddressItem = (props) => {
    const { item, address_id } = props;
    return (
        <View style={styles.content}>
            <View style={{ flexDirection: 'row' }}>
                <View style={{ paddingVertical: 10 }}>
                    <AddressBook width={100} height={100} />
                </View>
                <View style={{ flexDirection: 'column', flex: 1, paddingVertical: 10 }}>
                    <Text style={{ fontSize: 14 }}>{item?.Mobile}</Text>
                    <Text style={{ fontSize: 14 }}>{item?.Door_Number}, {item?.Landmark}, {item?.Street}</Text>
                    <Text style={{ fontSize: 14 }}>{item?.City}, {item?.Zip}</Text>
                    <Text style={{ fontSize: 14 }}>{item?.Country}</Text>
                </View>
                <View style={{ width: 50, justifyContent: 'center', marginRight: 5 }}>
                    {item.User_Address_Id == address_id &&
                        <Text style={{
                            backgroundColor: EStyleSheet.value('$grayColor'), textAlign: 'center',
                            color: 'white', borderRadius: 5
                        }}>Default</Text>
                    }
                    <TouchableOpacity onPress={() => { props.navigation.navigate('ChangeAddress', { user_address: item }) }}>
                        <Text style={{ color: EStyleSheet.value('$primaryColor'), fontSize: 16, textDecorationLine: 'underline' }}>Edit</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}

const AddressSetting = (props) => {
    const user_detail = store?.getState()?.auth?.login?.user;
    const [user_address, setUserAddress] = useState([]);
    const address_id = store?.getState()?.auth?.location?.User_Address_Id;
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        getAddress();
    }, [address_id])
    const getAddress = () => {
        setLoading(true);
        let filter = {
            Records_Filter: 'FILTER',
            User_Email_Id: user_detail.Email_Id,
            User_Address_Id: '',
            User_Details_Id: '',
            Street: '',
            State: '',
            City: '',
            Country: '',
            Zip: '',
            Address_Type: '',
        }
        apiActions.get_address(filter)
            .then(async res => {
                setLoading(false);
                if (res.Success_Response?.Is_Data_Exist == '1') {
                    setUserAddress(res.User_Address)
                }
            })
            .catch(err => {
                setLoading(false);
                console.log(err);
            })
    }
    React.useEffect(() => {
        const unsubscribe = props.navigation.addListener('focus', () => {
            getAddress();
        });

        return unsubscribe;
    }, []);

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
                    <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'white' }}>Address Book</Text>
                    <View style={{ justifyContent: 'center', flex: 1, alignItems: 'flex-end', marginRight: 10 }}>
                        <TouchableOpacity onPress={() => props.navigation.navigate('ChangeAddress', { user_address: {} })}>
                            <MaterialIcons name="add" color="white" size={30}></MaterialIcons>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
            {loading ? <BallIndicator color={EStyleSheet.value('$primaryColor')} />
                :
                <FlatList
                    showsVerticalScrollIndicator={false}
                    data={user_address}
                    renderItem={({ item }) => <AddressItem item={item} {...props} address_id={address_id}></AddressItem>}
                    keyExtractor={item => item.User_Address_Id}
                />
            }
        </SafeAreaView>
    );
}
const mapStateToProps = (state) => (state);
const mapDispatchToProps = dispatch => {
    return {
        dispatch
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(AddressSetting);