import React from "react";
import { View } from 'react-native'
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { connect } from "react-redux";
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Home from "@screens/Home";
import MyProfile from "@screens/MyProfile";
import ResetPassword from "@screens/MyProfile/ResetPassword";
import ProfileEdit from "@screens/MyProfile/ProfileEdit";
import Categories from "@screens/Categories";
import LeftDrawerContent from "@components/LeftDrawerContent";
import RightDrawerContent from "@components/RightDrawerContent";
import Cart from "@screens/Cart";
import WishList from "@screens/WishList";
import OrderSummary from "@screens/OrderSummary";
import MyOrders from "@screens/MyOrders";
import ProductDetails from "@screens/ProductDetails";
import Products from "@screens/Products";
import Brands from "@screens/Brands";
import MyWallet from "@screens/MyWallet";
import GiftCard from "@screens/GiftCard";
import BuyGift from "@screens/GiftCard/BuyGift";
import ChangeAddress from "@screens/AddressSetting/ChangeAddress";
import AddressSetting from "@screens/AddressSetting";
import PaymentStatus from "@screens/PaymentStatus";
import Coupons from "@screens/Coupons";
import CouponDetails from "@screens/CouponDetails";
import Deals from "@screens/Deals";
import DealDetails from "@screens/DealDetails";
import SearchProduct from "@screens/SearchProduct";
import Earn from "@screens/Earn";
import SignIn from "@screens/SignIn";
import SignUp from "@screens/SignUp";
import ForgotPassword from "@screens/ForgotPassword";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import EStyleSheet from 'react-native-extended-stylesheet';
import CouponIcon from '@assets/images/coupon-svg.svg';
import CouponSelectedIcon from '@assets/images/coupon-selected-svg.svg';
import DealIcon from '@assets/images/deal-svg.svg';
import DealSelectedIcon from '@assets/images/deal-selected-svg.svg';
import { AnimatedCircleBarComponent } from 'react-navigation-custom-bottom-tab-component/AnimatedCircleBarComponent';
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();
const DrawerL = createDrawerNavigator();
const DrawerR = createDrawerNavigator();

function BottomTab() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      tabBarOptions={{
        activeTintColor: EStyleSheet.value('$primaryColor'),
        inactiveTintColor: EStyleSheet.value('$placeColor'),
        tabStyle: { backgroundColor: 'red' },
        style: { backgroundColor: 'red' },
        iconStyle: { backgroundColor: 'red' },
        labelStyle: { backgroundColor: 'red' },
        showLabel: false
      }}
      sceneContainerStyle={{ backgroundColor: 'red' }}
      tabBar={(props) => {
        return <View
          style={{ paddingTop: 20, backgroundColor: "white" }}
        >
          <AnimatedCircleBarComponent
            navigation={props}
            style={{ backgroundColor: "white" }}
            getLabelText={({ route }) => {
              return route?.name || "Home";
            }}
            renderIcon={({ route, focused }) => {
              switch (route.name) {
                case "Home":
                  return focused ? <MaterialCommunityIcons name="home" color={EStyleSheet.value('$primaryColor')} size={30} /> : <MaterialCommunityIcons name="home" color={EStyleSheet.value('$placeColor')} size={30} />
                case "Categories":
                  return focused ? <MaterialIcons name="category" color={EStyleSheet.value('$primaryColor')} size={30} /> : <MaterialIcons name="category" color={EStyleSheet.value('$placeColor')} size={30} />;
                case "Deals":
                  return focused ? <DealSelectedIcon width={30} height={30} /> : <DealIcon width={30} height={30} />
                case "Coupons":
                  return focused ? <CouponSelectedIcon width={30} height={30} /> : <CouponIcon width={30} height={30} />
                case "MyProfile":
                  return focused ? <MaterialCommunityIcons name="account" color={EStyleSheet.value('$primaryColor')} size={30} /> : <MaterialCommunityIcons name="account" color={EStyleSheet.value('$placeColor')} size={30} />
                default:
                  return <MaterialCommunityIcons name="home" color={EStyleSheet.value('$primaryColor')} size={30} />;
              }
            }}
            onTabPress={({ route }) => props.navigation.navigate(route.name)}
          />
        </View>
      }}
    >
      <Tab.Screen
        name="Categories"
        component={Categories}
        options={{
          tabBarLabel: 'Categories',
        }}
      />
      <Tab.Screen
        name="Deals"
        component={Deals}
        options={{
          tabBarLabel: 'Deals',
        }}
      />
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarLabel: 'Home',
        }}
      />
      <Tab.Screen
        name="Coupons"
        component={Coupons}
        options={{
          tabBarLabel: 'Coupons',
        }}
      />
      <Tab.Screen
        name="MyProfile"
        component={MyProfile}
        options={{
          tabBarLabel: 'My Profile',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="account" color={color} size={30} />
          ),
        }}
      />
    </Tab.Navigator>
  )
}

function RightDrawer() {
  return (
    <DrawerR.Navigator initialRouteName="BottomTab" drawerPosition="right" drawerContent={(props) => <RightDrawerContent {...props} />}>
      <DrawerR.Screen name="BottomTab" component={BottomTab} />
      {/* <DrawerR.Screen name="MyProfile" component={MyProfile} /> */}
      <DrawerR.Screen name="ProfileEdit" component={ProfileEdit} />
      {/* <DrawerR.Screen name="Categories" component={Categories} /> */}
      <DrawerR.Screen name="Cart" component={Cart} />
      <DrawerR.Screen name="WishList" component={WishList} />
      <DrawerR.Screen name="OrderSummary" component={OrderSummary} />
      <DrawerR.Screen name="MyOrders" component={MyOrders} />
      <DrawerR.Screen name="ProductDetails" component={ProductDetails} />
      <DrawerR.Screen name="Products" component={Products} />
      <DrawerR.Screen name="Brands" component={Brands} />
      <DrawerR.Screen name="MyWallet" component={MyWallet} />
      <DrawerR.Screen name="GiftCard" component={GiftCard} />
      <DrawerR.Screen name="BuyGift" component={BuyGift} />
      <DrawerR.Screen name="AddressSetting" component={AddressSetting} />
      <DrawerR.Screen name="ChangeAddress" component={ChangeAddress} />
      <DrawerR.Screen name="PaymentStatus" component={PaymentStatus} />
      <DrawerR.Screen name="DealDetails" component={DealDetails} />
      <DrawerR.Screen name="CouponDetails" component={CouponDetails} />
      <DrawerR.Screen name="SearchProduct" component={SearchProduct} />
      <DrawerR.Screen name="ResetPassword" component={ResetPassword} />
      <DrawerR.Screen name="Earn" component={Earn} />
      <DrawerR.Screen name="SignIn" component={SignIn} />
      <DrawerR.Screen name="SignUp" component={SignUp} />
      <DrawerR.Screen name="ForgotPassword" component={ForgotPassword} />
    </DrawerR.Navigator>
  )
}
function LeftDrawer() {
  return (
    <DrawerL.Navigator initialRouteName="RightDrawer" drawerPosition="left" drawerContent={(props) => <LeftDrawerContent {...props} />}>
      <DrawerL.Screen name="RightDrawer" component={RightDrawer} />
    </DrawerL.Navigator>
  );
}
export default function Navigation() {
  return (
    <NavigationContainer >
      <Stack.Navigator
        initialRouteName="Main"
        headerMode="none"
        screenOptions={{ animationEnabled: false }}>
        <Stack.Screen name="Main" component={LeftDrawer} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}
