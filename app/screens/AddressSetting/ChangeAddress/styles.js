import EStyleSheet from 'react-native-extended-stylesheet';

export default EStyleSheet.create({
	input_field: {
		fontSize: 16, 
		color: '$placeColor',
		textAlign: 'right',
	},
	input_style: {
		borderRadius: 10, 
		paddingHorizontal: 10, 
		paddingVertical: 5, 
		flexDirection: 'row', 
		alignItems: 'center',
		marginHorizontal: 20,
		shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 10,
        elevation: 5,
		backgroundColor: 'white'
	},
});
