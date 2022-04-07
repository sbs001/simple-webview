import { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Image, ActivityIndicator } from 'react-native';
import WebView from 'react-native-webview';
import * as Contacts from 'expo-contacts';

export default function App() {
  let webView: any;
  const [showWebView, setShowWebView] = useState<boolean>(false);
  const [showBottomTab, setShowBottomTab] = useState<boolean>(true);
  const [showHeader, setShowHeader] = useState<boolean>(true);

  const handleEvent = ({ nativeEvent }: any) => {
    const event = JSON.parse(nativeEvent.data)
    setShowBottomTab(JSON.parse(event['show']));
    setShowHeader(JSON.parse(event['show']));
  };

  const sendContacts = async () => {
    let contacts: Contacts.Contact[] = [];
    const { status } = await Contacts.requestPermissionsAsync();
    if (status === 'granted') {
      const { data } = await Contacts.getContactsAsync({ fields: [Contacts.Fields.PhoneNumbers] });
      contacts = data;
    }
    webView.postMessage(JSON.stringify(contacts))
  };

  return (
    <View style={styles.container}>
      {showHeader && <Image source={require("./assets/Topbar.png")} />}

      {showWebView ? (
        <WebView
          ref={el => webView = el}
          style={styles.webViewWrapper}
          startInLoadingState
          renderLoading={() => <ActivityIndicator style={{ flex: 1 }} color='green' size='large' />}
          originWhitelist={['*']}
          source={{ uri: 'http://192.168.0.21:3000' }}
          onLoadEnd={sendContacts}
          onMessage={handleEvent}
        />
      ) : (
        <View style={styles.home}>
          <Text>El ecommerce</Text>
        </View>
      )}

      {showBottomTab && (
        <View style={styles.tabs}>
          <TouchableOpacity style={styles.tab} onPress={() => setShowWebView(false)}>
            <Text>Home</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.tab} onPress={() => setShowWebView(true)}>
            <Text>Wallet</Text>
          </TouchableOpacity>

        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffff',
    paddingTop: 15
  },
  webViewWrapper: {},
  tabs: {
    height: 35,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  tab: {
    flex: 1,
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ddd',
    borderWidth: 0.5,
  },
  home: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }
});
