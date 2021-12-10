import EStyleSheet from 'react-native-extended-stylesheet';
import * as Utils from '@utils';

export default EStyleSheet.create({
    content: {
        flexDirection: 'column',
        borderRadius: 10,
        backgroundColor: 'white',
        margin: 15,
        padding: 14,
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
})