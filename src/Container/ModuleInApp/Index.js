import React, { Component } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Platform,
  Alert,
  ToastAndroid,
  Image,
  ActivityIndicator,
  Modal,
  FlatList,
  AsyncStorage
} from "react-native";
import styles from "./PurchaseStyle";
import * as RNIap from "react-native-iap";
const bannerImg = require("../../images/banner_image.png");
const icAndroid = require("../../images/icon_android.png");
const iciPhone = require("../../images/icon_apple.png");
const checkMark = require("../../images/checkmark.png");

const itemSkus = Platform.select({
  ios: [
    "student1" //purchase
  ],
  android: [
    "com.purchase.coin" // purchase
  ]
});

const itemSubs = Platform.select({
  ios: [
    "com.autorenewingtest" //subscription
  ],
  android: [
    "rn.sub.monthly" // subscription
  ]
});

export default class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      productList: [],
      receipt: "",
      availableItemsMessage: "",
      purchaseIndicator: false,
      subscriptionIndicator: false,
      availableIndicator: false,
      modalVisible: false,
      validateItem: []
    };
  }

  async componentDidMount() {
    try {
      const result = await RNIap.initConnection();
    } catch (err) {
      console.warn(err.code, err.message);
    }
    this.retriveData();
  }

  getItemPurchaseInfo = async () => {
    try {
      this.setState({
        availableIndicator: true
      });
      const products = await RNIap.getProducts(itemSkus);
      if (Platform.OS === "ios") {
        this.setState(
          {
            productList: []
          },
          () => {
            this.getSubscriptionsInfo();
          }
        );
      } else {
        this.setState(
          {
            productList: products
          },
          () => {
            this.getSubscriptionsInfo();
          }
        );
      }
    } catch (err) {
      console.warn(err.code, err.message);
      if (Platform.OS === "ios") {
        this.setState(
          {
            productList: []
          },
          () => {
            this.getSubscriptionsInfo();
          }
        );
      } else {
        this.setState(
          {
            productList: products
          },
          () => {
            this.getSubscriptionsInfo();
          }
        );
      }
    }
  };

  getSubscriptionsInfo = async () => {
    try {
      const products = await RNIap.getSubscriptions(itemSubs);
      this.setState({
        productList: [],
        productList: [...this.state.productList, ...products],
        availableIndicator: false,
        modalVisible: true
      });
    } catch (err) {
      this.setState({
        availableIndicator: false,
        modalVisible: true
      });
      console.warn(err.code, err.message);
    }
  };

  // iOS Code for purchase
  getItems = async () => {
    this.setState({
      purchaseIndicator: true
    });
    try {
      const products = await RNIap.getProducts(itemSkus);
      if (Platform.OS === "ios") {
        this.onPressSubscription(itemSkus[0]);
      } else {
        this.onPressProduct(products[0].productId);
      }
    } catch (err) {
      console.warn(err.code, err.message);
    }
  };

  // get all subscription
  getSubscriptions = async () => {
    try {
      this.setState({
        subscriptionIndicator: true
      });
      const products = await RNIap.getSubscriptions(itemSubs);

      if (Platform.OS === "ios") {
        this.onPressSubscription(itemSubs[0]);
      } else {
        this.onPressSubscription(products[0].productId);
      }
    } catch (err) {
      console.warn(err.code, err.message);
    }
  };

  onPressSubscription = async sku => {
    this.setState({
      subscriptionIndicator: false,
      purchaseIndicator: false
    });
    try {
      const purchase = await RNIap.buySubscription(sku);
      if (Platform.OS === "ios") {
        this.receiptValidateIOS(purchase.transactionReceipt);
      }
    } catch (err) {
      Alert.alert("Inapp", err.message);
    }
  };

  onPressProduct = async sku => {
    try {
      this.setState({
        purchaseIndicator: false
      });
      const purchase = await RNIap.buyProduct(sku);
      this.receiptValidateIOS(purchase.transactionReceipt);
      const transaction = JSON.parse(purchase.transactionReceipt);
      if (Platform.OS === "android") {
        this.onConsumeProduct(transaction);
      }
    } catch (err) {
      Alert.alert("Inapp", err.message);
      this.setState({
        purchaseIndicator: false
      });
      const subscription = RNIap.addAdditionalSuccessPurchaseListenerIOS(
        async purchase => {
          subscription.remove();
        }
      );
    }
  };

  onConsumeProduct = async sku => {
    try {
      const consume_purchase = await RNIap.consumePurchase(sku.purchaseToken);
      console.log("Purchased Consumed :-->", JSON.stringify(consume_purchase));
      this.setState({
        purchaseIndicator:false
      });
    } catch (err) {
      this.setState({
        purchaseIndicator:false
      });
      console.warn(err.code, err.message);
      const subscription = RNIap.addAdditionalSuccessPurchaseListenerIOS(
        async purchase => {
          console.log("Purchase Receipt:---> ", purchase.transactionReceipt);
          subscription.remove();
        }
      );
    }
  };

  saveData = async result => {
    try {
      var countries = await AsyncStorage.getItem("key");
      if (countries != null) {
        countries = JSON.parse(countries);
        if (!countries.includes(result)) {
          countries.push(result);
        }
        this.setState({
          validateItem: [],
          validateItem: countries
        });
      } else {
        let arrProduct = [];
        arrProduct.push(result);
        this.setState({
          validateItem: [],
          validateItem: arrProduct
        });
      }
      console.log(this.state.validateItem);

      AsyncStorage.setItem("key", JSON.stringify(this.state.validateItem));

      console.log("success");
    } catch (error) {
      console.log("fail", error);
    }
  };
  retriveData = async () => {
    try {
      var myArray = await AsyncStorage.getItem("key");
      myArray = JSON.parse(myArray);
      if (myArray !== null) {
        this.setState({
          validateItem: myArray
        });
        console.log(this.state.validateItem);
      }
    } catch (error) {
      console.log(error);
    }
  };

  receiptValidateIOS = async receipt => {
    const receiptBody = {
      "receipt-data": receipt,
      password: "a740150a6e844879a53adcf1aacee812"
    };
    const result = await RNIap.validateReceiptIos(receiptBody, 1);
    const product = result.receipt.in_app[0].product_id;
    this.setState({
      validateItem: [
        ...this.state.validateItem,
        result.receipt.in_app[0].product_id
      ]
    });
    this.saveData(result.receipt.in_app[0].product_id);
  };

  setModalVisible = visible => () => {
    this.setState({ modalVisible: visible });
  };

  renderItem = ({ item, index }) => {
    console.log(this.state.validateItem[index]);
    console.log(item.productId);
    return (
      <View style={{ flex: 1 }} key={index}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={this.setModalVisible(!this.state.modalVisible)}
        >
          <Text style={{ fontWeight: "bold", color: "white" }}>
            {item.localizedPrice}
          </Text>
          <Text style={{ fontWeight: "bold", color: "black" }}>
            {item.currency}
          </Text>
          <Text style={{ fontWeight: "200", color: "white" }}>
            {item.description}
          </Text>
          {this.state.validateItem[index] == item.productId ? (
            <Image style={styles.checkmark} source={checkMark} />
          ) : null}

          <View style={styles.dividerContainer} />
        </TouchableOpacity>
      </View>
    );
  };

  _keyExtractor = (item, index) => item.productId;

  render() {
    return (
      <View style={styles.container}>
        <View style={[styles.container, styles.elevationContainer]}>
          <View style={styles.viewContainer}>
            <View style={[styles.bannerContainer, styles.elevationContainer]}>
              <Image style={styles.fullImageContainer} source={bannerImg} />
            </View>
            <Text style={[styles.textContainer, { marginTop: 20 }]}>
              Subscriptions:
            </Text>

            <View style={styles.rowTextContainer}>
              <TouchableOpacity
                activeOpacity={0.8}
                style={styles.buttonSubscription}
                onPress={this.getSubscriptions}
              >
                {this.state.subscriptionIndicator ? (
                  <ActivityIndicator size="small" color="gray" />
                ) : (
                  <Text style={styles.buttonTextContainer}>Subscription</Text>
                )}
              </TouchableOpacity>
            </View>

            <Text style={[styles.textContainer, { marginTop: 25 }]}>
              Product:
            </Text>

            <View style={styles.rowTextContainer}>
              <TouchableOpacity
                activeOpacity={0.8}
                style={styles.buttonSubscription}
                onPress={this.getItems}
              >
                {this.state.purchaseIndicator ? (
                  <ActivityIndicator size="small" color="gray" />
                ) : (
                  <Text style={styles.buttonTextContainer}>Purchase</Text>
                )}
              </TouchableOpacity>
            </View>

            {/* Get Item */}
            <Text style={[styles.textContainer, { marginTop: 25 }]}>
              Get Item:
            </Text>

            <View style={styles.rowTextContainer}>
              <TouchableOpacity
                activeOpacity={0.8}
                style={styles.buttonSubscription}
                onPress={this.getItemPurchaseInfo}
              >
                {this.state.availableIndicator ? (
                  <ActivityIndicator size="small" color="gray" />
                ) : (
                  <Text style={styles.buttonTextContainer}>
                    Available Purchase
                  </Text>
                )}
              </TouchableOpacity>
            </View>

            {/* Get Item over */}
          </View>

          <View style={styles.bottomIconContainer}>
            <View style={{ flex: 1 }}>
              <Image style={styles.platformContainer} source={icAndroid} />
            </View>
            <View style={{ flex: 1 }}>
              <Image style={styles.platformContainer} source={iciPhone} />
            </View>
          </View>

          {/* Modal for purchase status  */}
          <Modal
            animationType="slide"
            transparent={true}
            visible={this.state.modalVisible}
            onRequestClose={() => {
              Alert.alert("Modal has been closed.");
            }}
          >
            <View style={styles.modalContainer}>
              <View style={styles.purchaseListContainer}>
                <FlatList
                  data={this.state.productList}
                  extraData={this.state}
                  keyExtractor={this._keyExtractor}
                  renderItem={this.renderItem}
                />
              </View>

              <TouchableOpacity
                style={styles.modelCancelButton}
                activeOpacity={0.8}
                onPress={this.setModalVisible(!this.state.modalVisible)}
              >
                <Text style={styles.modalTextButton}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </Modal>
          {/* Modal Over  */}
        </View>
      </View>
    );
  }
}
