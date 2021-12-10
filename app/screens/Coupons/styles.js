import EStyleSheet from 'react-native-extended-stylesheet';

export default EStyleSheet.create({
    content: {
        margin: 10, 
    },
    loading: {
        color: "white",
    },
    coupon_item: {
        backgroundColor: '$contentColor', 
        borderRadius: 10, 
        width: '50%',
        margin: 2,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 10,
        elevation: 10,
    }
});
