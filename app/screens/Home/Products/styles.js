import EStyleSheet from 'react-native-extended-stylesheet';

export default EStyleSheet.create({
    content: {
        margin: 10, 
    },
    loading: {
        color: "white",
    },
    reder_item: {
        margin: 2, 
        backgroundColor: '$contentColor', 
        borderRadius: 10, 
        width: 220,
        justifyContent: 'center', 
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 10,
        elevation: 10,
    }
});
