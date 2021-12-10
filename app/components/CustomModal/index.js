import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import EStyleSheet from 'react-native-extended-stylesheet';
import Modal from 'react-native-modal';

const CustomModal = (props) => {
    const { setModalVisible, modalVisible, deleteOrder } = props;

    return (
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
                    <Text style={{ fontSize: 18 }}>Are you sure delete this order?</Text>
                </View>
                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginHorizontal: 20 }}>
                    <TouchableOpacity onPress={() => deleteOrder()} style={{
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
    )
}

export default CustomModal