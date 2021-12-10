import EStyleSheet from 'react-native-extended-stylesheet';
export default EStyleSheet.create({
    loading: {
        color: "$primaryColor",
    },
    productItems: {
        flexDirection: 'row', width: '50%', backgroundColor: 'white',
        borderRadius: 10, marginHorizontal: 5, justifyContent: 'center', alignItems: 'center', 
        shadowColor: 'black',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 10,
        elevation: 10
    }
});
