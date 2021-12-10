import EStyleSheet from 'react-native-extended-stylesheet';

export default EStyleSheet.create({
    sub_cart: {
        padding: 20,
        flexDirection: 'column',
        height: 150,
        backgroundColor: '$primaryColor',
        borderTopRightRadius: 20,
        borderTopLeftRadius: 20,
    },
    button : {
        borderRadius: 20, 
        backgroundColor: 'white', 
        marginTop: 20, 
        alignItems: 'center', 
        marginTop: 35
    },
    content: {
        borderRadius: 10,
        backgroundColor: 'white',
        marginHorizontal: 15,
        marginVertical: 10,
        minHeight: 120,
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 10,
        elevation: 10,
    },
});
