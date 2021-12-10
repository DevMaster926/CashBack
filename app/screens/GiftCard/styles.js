import EStyleSheet from 'react-native-extended-stylesheet';

export default EStyleSheet.create({
	sub_cart: {
		padding: 20,
		flexDirection: 'column',
		height: 80,
		backgroundColor: '$primaryColor',
		borderTopRightRadius: 20,
		borderTopLeftRadius: 20,
	},
	button: {
		borderRadius: 20,
		backgroundColor: 'white',
		alignItems: 'center',
	},
	content: {
        borderRadius: 10,
        backgroundColor: 'white',
        marginHorizontal: 15,
        marginVertical: 10,
        height: 120,
        padding: 10,
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 10,
        elevation: 10,
    },
    image: {
        width: 80,
        height: 80
    }
});
