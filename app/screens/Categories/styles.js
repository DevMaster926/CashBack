import EStyleSheet from 'react-native-extended-stylesheet';
export default EStyleSheet.create({
    right_category_name: {
        backgroundColor: '$mainColor1',
        width: '35%',
        height: 140,
        borderTopLeftRadius: 20,
        borderBottomLeftRadius: 20,
        justifyContent: 'flex-end',
        alignItems: 'center', 
        shadowColor: '$mainColor1',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 10,
        elevation: 10
    },
    left_category_name: {
        backgroundColor: '$mainColor1',
        width: '35%',
        height: 140,
        borderTopRightRadius: 20,
        borderBottomRightRadius: 20,
        justifyContent: 'flex-end',
        alignItems: 'center', shadowColor: '$mainColor2',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 10,
        elevation: 10
    },
    sub_category_name: {
        backgroundColor: 'white',
        color: '$mainColor2',
        borderRadius: 5,
        fontSize: 18,
        minWidth: 50,
        textAlign: 'center',
        paddingHorizontal: 10,
        paddingVertical: 5,
        shadowColor: '$mainColor2',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 10,
        elevation: 10
    },
    sub_category_name1: {
        backgroundColor: 'white',
        color: '$mainColor1',
        borderRadius: 5,
        fontSize: 18,
        minWidth: 50,
        textAlign: 'center',
        paddingHorizontal: 10,
        paddingVertical: 5,
        shadowColor: '$mainColor2',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 10,
        elevation: 10
    },
    loading: {
        color: "$primaryColor",
    },
    sub_category_right_item: {
        width: '65%', backgroundColor: 'white', borderTopRightRadius: 20, borderBottomRightRadius: 20, 
        borderBottomLeftRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 10,
        elevation: 10
    },
    sub_category_left_item: {
        borderBottomRightRadius: 10,
        width: '65%', backgroundColor: 'white', borderTopLeftRadius: 20, borderBottomLeftRadius: 20, shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 10,
        elevation: 10
    }
});
