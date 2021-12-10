import EStyleSheet from 'react-native-extended-stylesheet';

export default EStyleSheet.create({
    input_style: {
        borderRadius: 10,
        paddingHorizontal: 10,
        paddingVertical: 5,
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 10,
        elevation: 5,
        backgroundColor: 'white'
    },
    input_field: {
        fontSize: 16,
        color: '$placeColor',
        textAlign: 'right',
    },
    list_item: {
        borderRadius: 10,
        height: 70,
        padding: 10,
        backgroundColor: 'white',
        shadowColor: '#000',
        marginHorizontal: 15,
        marginVertical: 10,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 10,
        elevation: 10,
    },
    textareaContainer: {
        height: 100,
        padding: 5,
        backgroundColor: 'white',
        borderRadius: 10,
        shadowColor: '#333',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 10,
        elevation: 10,
    },
    textarea: {
        textAlignVertical: 'top',  // hack android
        fontSize: 14,
        color: '#333',
    },
});
