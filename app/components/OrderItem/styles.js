import EStyleSheet from 'react-native-extended-stylesheet';
import * as Utils from '@utils';

export default EStyleSheet.create({
    content: {
        backgroundColor: 'white',
        marginVertical: 5,
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
})