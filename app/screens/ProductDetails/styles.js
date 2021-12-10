import EStyleSheet from 'react-native-extended-stylesheet';
export default EStyleSheet.create({
    btn_seleted: {
        backgroundColor: '$primaryColor',
        borderRadius: 20,
        padding: 5,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 10
    },
    btn: {
        borderRadius: 20,
        borderColor: '$primaryColor',
        borderWidth: 1,
        padding: 5,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 10
    },
    loading: {
        color: "$primaryColor",
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
    },
    customSlide: {
        height: 250,
    },
    customImage: {
        height: '100%',
    },
    buttons: {
        flexDirection: 'row',
        position: 'absolute',
        bottom: 0,
        alignSelf: 'center'
    },
    button: {
        margin: 10,
        borderRadius: 50,
        width: 8,
        height: 8,
        backgroundColor: '$primaryColor',
    },
    buttonSelected: {
        margin: 10,
        borderRadius: 50,
        width: 30,
        height: 8,
        backgroundColor: '$primaryColor',
    }
});
