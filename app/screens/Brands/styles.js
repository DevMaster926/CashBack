import EStyleSheet from 'react-native-extended-stylesheet';
export default EStyleSheet.create({
    right_category_name: {
        backgroundColor: '$primaryColor',
        width: '35%',
        height: 140,
        borderTopLeftRadius: 20,
        borderBottomLeftRadius: 20,
        justifyContent: 'center',
        alignItems: 'center'
    },
    left_category_name: {
        backgroundColor: '$primaryColor',
        width: '35%',
        height: 140,
        borderTopRightRadius: 20,
        borderBottomRightRadius: 20,
        justifyContent: 'center',
        alignItems: 'center'
    },
    sub_category_name: {
        borderWidth: 1,
        borderRadius: 20,
        fontSize: 20,
        minWidth: 50,
        textAlign: 'center',
        paddingRight: 5,
        paddingLeft: 5
    },
    loading: {
        color: "$primaryColor",
      }
});
