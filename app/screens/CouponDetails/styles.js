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
});
