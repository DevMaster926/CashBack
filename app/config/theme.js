import EStyleSheet from 'react-native-extended-stylesheet';
export const BaseStyle = EStyleSheet.create({
  safeAreaView: {
    flex: 1,
    backgroundColor: '$contentColor'
  },
  safeAreaView1: {
    flex: 1,
    backgroundColor: '$contentColor1'
  },
  inputView: {
    marginTop: 15, 
    backgroundColor: "#f2f3f4",
    borderRadius: 5, 
    flexDirection: 'row', 
    alignItems: 'center'
  },
  textInput: {
    height: 46,
    color: '$textColor',
    padding: 8,
    fontSize: 15,
    width: "100%",
    justifyContent: "center",
    borderRadius: 5,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderStyle:'solid',
    borderColor:'$inputBoderColor',
  },

  text: {
    color: '$textColor',
    width: "100%",
    fontSize:18,
    fontWeight:'bold'
  },
});
