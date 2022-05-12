import { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Image, ActivityIndicator } from 'react-native';
import WebView from 'react-native-webview';
import * as Contacts from 'expo-contacts';

interface Notification { show: boolean; state: 'success' | 'error'; message: string };

export default function App() {
  let webView: any;
  const [showWebView, setShowWebView] = useState<boolean>(false);
  const [showBottomTab, setShowBottomTab] = useState<boolean>(true);
  const [showHeader, setShowHeader] = useState<boolean>(true);
  const [notification, setNotification] = useState<Notification>({ show: false, state: 'success', message: 'aaaaaaa' })

  const handleEvent = ({ nativeEvent }: any) => {
    const event = JSON.parse(nativeEvent.data)
    setShowBottomTab(!!event['showTabs']);
    setShowHeader(!!event['showTabs']);
    if (event.notification) {
      setNotification({ ...event['notification'], show: true })
      setTimeout(() => setNotification({ ...notification, show: false }), 3000)
    }
  };

  const sendContacts = async () => {
    let contacts;
    const { status } = await Contacts.requestPermissionsAsync();
    if (status === 'granted') {
      const { data } = await Contacts.getContactsAsync({ fields: [Contacts.Fields.PhoneNumbers] });
      contacts = data.map(e => ({
        name: `${e.firstName} ${e.lastName || ''}`,
        phone: e.phoneNumbers ? e.phoneNumbers[0].number : ''
      }))
    }
    webView.postMessage(JSON.stringify({ storeId: 106119, language: 'mx', contacts }))
  };

  return (
    <View style={styles.container}>
      {showHeader && <Image source={require("./assets/Topbar.png")} />}

      {notification.show && (
        <Text style={{ ...styles.notification, ...styles[notification.state] }}>{notification.message}</Text>
      )}

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
          <Text>ecommerce</Text>
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
  },
  notification: {
    flex: 1,
    position: 'absolute',
    height: 75,
    top: 70,
    width: 500,
    backgroundColor: '#2B2845',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    textAlign: 'center',
    paddingTop: 25,
    zIndex: 99999999
  },
  success: { backgroundColor: '#2B2845' },
  error: { backgroundColor: 'red' }
});


// useEffect(() => {
//   (window as any).ReactNativeWebView?.postMessage(JSON.stringify({ show: true }));
//   return () => { (window as any).ReactNativeWebView?.postMessage(JSON.stringify({ show: false })) }
// }, []);
// useEffect(() => {
//   document.addEventListener('message', (msg: any) => {
//     const a = JSON.parse(msg.data)
//     alert(JSON.stringify(a, null, 2))
//   })
// },[]);
