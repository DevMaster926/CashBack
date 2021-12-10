import EStyleSheet from 'react-native-extended-stylesheet';

export default EStyleSheet.create({
    content: {
        flexDirection: 'column',
        borderRadius: 10,
        backgroundColor: 'white',
        margin: 15,
        padding: 14,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 10,
        elevation: 10,
    },
    image: {
        width: 80,
        height: 80
    },
    button: {
        backgroundColor: 'white', 
        borderWidth: 1,
        paddingLeft: 7,
        paddingRight: 7, 
        borderRadius: 15, 
        borderColor: '$primaryColor', 
        margin: 3, 
        padding: 3,
        fontSize: 12,
        alignSelf: 'center',
        textAlign: 'center',
        color: '$primaryColor',
        minWidth: 40,
    },
    selected_button: {
        backgroundColor: '$primaryColor', 
        paddingLeft: 7,
        paddingRight: 7, 
        borderRadius: 15, 
        padding: 3,
        fontSize: 12,
        margin: 3,
        alignSelf: 'center',
        textAlign: 'center',
        color: 'white',
        minWidth: 40,
    },
    seletectAmountItem: {
        backgroundColor: '$inputBoderColor',
    },
    seletectAmount: {
        fontSize: 15, 
        color: 'black', 
        fontWeight: 'bold'
    },
})