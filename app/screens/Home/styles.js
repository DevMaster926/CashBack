import EStyleSheet from 'react-native-extended-stylesheet';

export default EStyleSheet.create({
    content: {
        borderRadius: 10, 
        backgroundColor: 'white', 
        margin: 10, 
        minHeight: 270,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 10,
        elevation: 10,
    },
    selectedTab: {
        color: '$primaryColor',
        fontWeight: 'bold'
    }
});
