import EStyleSheet from 'react-native-extended-stylesheet';
import * as Utils from '@utils';

export default EStyleSheet.create({
    content: {
        borderRadius: 10, 
        backgroundColor: 'white', 
        margin: 10, 
        height: 150, 
        padding: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 10,
        elevation: 10,
    },
    item: {
        borderRadius: 5, 
        borderWidth: 1, 
        borderColor: '$grayColor',
        marginRight: 10, 
        padding: 5,
        flex: 1
    }
})