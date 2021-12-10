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
    productItems: {
        flexDirection: 'row', backgroundColor: 'white',
        borderRadius: 10, justifyContent: 'center', alignItems: 'center', padding: 5,
        shadowColor: 'black',
        width: 180,
        marginHorizontal: 5,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 10,
        elevation: 10
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
