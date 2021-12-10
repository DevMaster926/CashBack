import EStyleSheet from 'react-native-extended-stylesheet';

export default EStyleSheet.create({
  sub_cart: {
    padding: 20,
    flexDirection: 'column',
    minHeight: 120,
    backgroundColor: '$primaryColor',
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
  },
  button: {
    borderRadius: 20,
    backgroundColor: 'white',
    alignItems: 'center',
    marginTop: 20
  },
  address_box: {
    flexDirection: 'row',
    borderRadius: 10,
    backgroundColor: 'white',
    margin: 15,
    marginBottom: 0,
    minHeight: 130,
    padding: 10,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 10,
  },
  content: {
    borderRadius: 10,
    backgroundColor: 'white',
    marginHorizontal: 15,
    marginVertical: 10,
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
    height: 80,
    borderRadius: 5,
  }
});
