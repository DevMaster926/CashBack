import { apiActions } from "@actions";
import HeaderContent from '@components/HeaderContent';
import { BaseStyle } from "@config";
import React, { useEffect, useState } from "react";
import { Image, SafeAreaView, ScrollView, Text, TouchableWithoutFeedback, View } from "react-native";
import EStyleSheet from "react-native-extended-stylesheet";
import {
    BallIndicator
} from 'react-native-indicators';
import Toast from 'react-native-simple-toast';
import { connect } from "react-redux";
import styles from './styles';
const RightItem = ({ item, navigation }) => {
    const { Category_Name, SubCategories, Category_Image_Mobile } = item;
    return (
        <View style={{ flexDirection: 'row', padding: 10, minHeight: 200 }}>
            <View style={[styles.right_category_name]}>
                <Image source={{ uri: Category_Image_Mobile }} style={{
                    width: 140, height: 140,
                    position: 'absolute',
                    borderTopLeftRadius: 20,
                    borderBottomLeftRadius: 20,
                }} />
            </View>
            <View style={styles.sub_category_right_item}>
                <View style={{ padding: 10, flexDirection: 'row' }}>
                    {SubCategories?.map((item, index) => {
                        return (
                            <View key={index + item?.Sub_Category_Id} style={{ marginRight: 10, alignItems: 'flex-start', padding: 2, flexWrap: 'wrap' }}>
                                <TouchableWithoutFeedback onPress={() => { navigation.navigate('Products', { Sub_Category_Id: item?.Sub_Category_Id, Category_Id: item?.Category_Id }); }}>
                                    <Text style={[styles.sub_category_name1]}>{item?.Sub_Category_Name}</Text>
                                </TouchableWithoutFeedback>
                            </View>
                        )
                    })}
                </View>
            </View>
        </View>
    )
}

const LeftItem = ({ item, navigation }) => {
    const { Category_Name, SubCategories, Description, Category_Image_Mobile } = item;
    
    return (
        <View style={{ flexDirection: 'row', padding: 10, minHeight: 200 }}>
            <View style={styles.sub_category_left_item}>
                <View style={{ padding: 10, flexDirection: 'row' }}>
                    {SubCategories?.map((item, index) => {
                        return (
                            <View key={index + item?.Sub_Category_Id} style={{ marginRight: 10, alignItems: 'flex-start', padding: 5, flexWrap: 'wrap' }}>
                                <TouchableWithoutFeedback onPress={() => { navigation.navigate('Products', { Sub_Category_Id: item?.Sub_Category_Id, Category_Id: item?.Category_Id }); }}>
                                    <Text style={[styles.sub_category_name]}>{item?.Sub_Category_Name}</Text>
                                </TouchableWithoutFeedback>
                            </View>
                        )
                    })}
                </View>
            </View>
            <View style={[styles.left_category_name]}>
                <Image source={{ uri: Category_Image_Mobile }} style={{
                    width: 140, height: 140,
                    position: 'absolute',
                    borderTopRightRadius: 20,
                    borderBottomRightRadius: 20,
                }} />
            </View>
        </View>
    )
}

const Categories = (props) => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        setLoading(true);
        apiActions.get_all_categories()
            .then(async response => {
                setLoading(false);
                setCategories(response?.AllCategories[0].Category);
                Toast.show(response?.Success_Response?.UI_Display_Message, Toast.LONG);
            })
            .catch(err => {
                setLoading(false);
                Toast.show(err?.UI_Display_Message ? err?.UI_Display_Message : err?.Success_Response?.UI_Display_Message, Toast.LONG);
            })
    }, [])
    return (
        <SafeAreaView
            style={[BaseStyle.safeAreaView]}
            forceInset={{ top: "always" }}
        >
            <HeaderContent {...props} title="Categories"></HeaderContent>
            {loading ? <BallIndicator color={EStyleSheet.value('$primaryColor')} />
                :
                <ScrollView>
                    {categories?.map((item, index) => {
                        if (index % 2 == 0)
                            return (
                                <RightItem key={index + item.Category_Id} item={item} navigation={props.navigation}></RightItem>
                            )
                        else
                            return (
                                <LeftItem key={index + item.Category_Id} item={item} navigation={props.navigation}></LeftItem>
                            )
                    })}
                </ScrollView>
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

export default connect(mapStateToProps, mapDispatchToProps)(Categories);