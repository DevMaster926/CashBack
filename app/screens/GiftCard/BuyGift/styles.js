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
    button: {
        borderRadius: 20,
        backgroundColor: 'white',
        marginTop: 20,
        alignItems: 'center',
        marginTop: 35
    },
    container: {
        flex: 1,
        padding: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
    textareaContainer: {
        height: 180,
        padding: 5,
        backgroundColor: 'white',
        borderRadius:10,
        shadowColor: '#333',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 10,
        elevation: 10,
    },
    textarea: {
        textAlignVertical: 'top',  // hack android
        height: 170,
        fontSize: 14,
        color: '#333',
    },
    input_field: {
		fontSize: 16, 
		color: '$placeColor',
		textAlign: 'right',
	},
	input_style: {
        marginVertical: 5,
		borderRadius: 10, 
		paddingHorizontal: 10, 
		paddingVertical: 5, 
		flexDirection: 'row', 
		alignItems: 'center',
		shadowColor: '#333',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 10,
        elevation: 5,
		backgroundColor: 'white'
	},
    send_style: {
        marginBottom: 20,
        borderRadius: 10, 
		paddingHorizontal: 10, 
		paddingVertical: 5, 
		flexDirection: 'row', 
		alignItems: 'center',
		shadowColor: '$primaryColor',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 10,
        elevation: 5,
		backgroundColor: '$primaryColor'
    },
    gift_item: {
        padding: 5, 
        backgroundColor: 'white', 
        borderRadius: 10, 
        borderColor: '$primaryColor',
        marginHorizontal: 5,
        shadowColor: '$primaryColor',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 1,
        shadowRadius: 10,
        elevation: 10,
    },
    selectedItem: {
        borderWidth: 2
    },
    seletectAmountItem: {
        backgroundColor: '$inputBoderColor',
    },
    seletectAmount: {
        fontSize: 16, 
        color: 'black', 
        fontWeight: 'bold'
    },
    selectedTab: {
        backgroundColor: '$primaryColor', 
        color: 'white', 
    }
});
