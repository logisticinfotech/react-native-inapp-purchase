import { StyleSheet } from "react-native";

export default StyleSheet.create({
  textContainer: {
    fontWeight: "bold",
    fontStyle: "normal"
  },
  viewContainer: {
    padding: 15,
    width: "100%"
  },
  container: {
    flex: 1,
    justifyContent: "center",
    margin: 10
  },
  buttonSubscription: {
    width: "100%",
    height:40,
    borderRadius: 6,
    backgroundColor: "green",
    borderWidth: 1,
    borderColor: "red",
    alignSelf: "center",
    justifyContent: "center",
    paddingHorizontal: 15,
    paddingVertical: 5
  },
  buttonTextContainer: {
    color: "white",
    textAlign: "center"
  },
  bannerContainer: {
    width: 200,
    height: 100,
    alignSelf: "center"
  },
  rowTextContainer: {
    width: "100%",
    marginTop: 5
  },
  elevationContainer: {
    backgroundColor: "white",
    elevation: 4
  },
  platformContainer: {
    height: 100,
    width: 100,
    alignSelf: "center",
    resizeMode: "contain"
  },
  checkmark: {
    height: 30,
    width: 30,
    alignItems:'center',
    marginLeft: 300,

  },
  bottomIconContainer: {
    flexDirection: "row",
    marginTop: 20
  },
  fullImageContainer: {
    height: "100%",
    width: "100%"
  },
  modalContainer: {
    flex: 1,
    margin: 25,
    backgroundColor: "white",
    borderRadius: 10,
    elevation: 4
  },
  modelCancelButton: {
    height: 40,
    width: "100%",
    alignSelf: "center",
    backgroundColor: "orange",
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    justifyContent: "center",
    bottom: 0,
    position: "absolute"
  },
  modalTextButton: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold"
  },
  purchaseListContainer: {
    flex: 1,
    marginBottom: 40,
    backgroundColor: "#FF8C00",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    padding: 15
  },
  dividerContainer: {
    height: 1,
    width: "100%",
    backgroundColor: "white",
    marginTop: 10
  }
});
