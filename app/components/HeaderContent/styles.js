import EStyleSheet from 'react-native-extended-stylesheet';
import * as Utils from '@utils';

export default EStyleSheet.create({
    profile_name: {
        fontSize: 20, 
        color: 'white'
    },
    profile_email: {
        fontSize: 14, 
        color: 'white'
    },
    item_styles: {
        flexDirection: 'row', 
        alignItems: 'center'
    },
    cart_icon: {
        backgroundColor: 'white', borderRadius: 50, padding: 5, right: 15, position: 'absolute'
    },
    cart_count: {
        position: 'absolute', color: 'white', right: 5, zIndex: 10, backgroundColor: '$errorColor', borderRadius: 50, paddingHorizontal: 5, fontSize: 10, textAlign: 'center', top: 2
    },
    search: {
        backgroundColor: 'white', borderRadius: 5, height: 40, margin: 15, flexDirection: 'row', alignItems: 'center', marginBottom: 5
    }
})