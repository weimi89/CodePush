import React, { useEffect, useState } from 'react';
import { AppRegistry, StyleSheet, Text, View, TouchableOpacity, Platform } from 'react-native';
import codePush, { CodePushOptions } from 'react-native-code-push';
import {
  DeviceEventEmitter
} from "react-native";

const codePushOptions = { checkFrequency: codePush.CheckFrequency.ON_APP_RESUME };

const App = () => {

  const [message, setMessage] = useState('正在檢查更新...')
  const [showProgress, setShowProgress] = useState('0%')

  useEffect(() => {
    codePush.checkForUpdate()
      .then((remotePackage) => {
        if (remotePackage) {
          setMessage(`有新的更新！Version ${remotePackage.appVersion} (${(remotePackage.packageSize / 1024 / 1024).toFixed(2)}mb) is available for download`)
          syncInNonSilent(remotePackage)
        } else {
          setMessage('已是最新，不需要更新！')
          setShowProgress('')
        }
      })
      .catch((error) => {
        console.log(error)
        setMessage('checkForUpdate 失敗')
        setShowProgress('')
      })
  }, []);

  const syncInNonSilent = (remotePackage) => {
    console.info('安裝更新並立刻重啟應用')
    codePush.disallowRestart() // 禁止重啟
    remotePackage
      .download(({receivedBytes, totalBytes}) => {
        setMessage('開始下載')
        let downloadProgress = (receivedBytes / totalBytes) * 100;
        setShowProgress(downloadProgress.toFixed(2) + "%")
      })
      .then((localPackage) => {
        // 下載完成了，呼叫這個方法
        setMessage('開始安裝')
        localPackage.install(codePush.InstallMode.IMMEDIATE).then(() => {
          setMessage('安裝完成')
          codePush.notifyAppReady()
          codePush.allowRestart() // 強制更新
          codePush.restartApp(true)
        }).catch((error) => {
          console.log(error)
          setMessage('localPackage 更新出錯，請聯繫管理員！')
        })
      }).catch((error) => {
        console.log(error)
        setMessage('remotePackage 更新出錯，請聯繫管理員！')
      })
  }

  return (
    <View style={styles.container}>
      <Text style={styles.welcome}>版本号 1.5.2</Text>
      <Text style={styles.instructions}>{message}</Text>
      <Text style={styles.instructions}>{showProgress}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

export default codePush(codePushOptions)(App);
// export default codePush(App)

