import EStyleSheet from 'react-native-extended-stylesheet';
import * as Utils from '@utils';

export default EStyleSheet.create({
    customImage: {
        height: '100%',
    },
    buttons: {
        flexDirection: 'row',
        position: 'absolute',
        bottom: 5,
        alignSelf: 'center'
    },
    button: {
        margin: 10,
        borderRadius: 50,
        width: 8,
        height: 8,
        backgroundColor: '$primaryColor',
    },
    buttonSelected: {
        margin: 10,
        borderRadius: 50,
        width: 40,
        height: 8,
        backgroundColor: '$primaryColor',
    }
})