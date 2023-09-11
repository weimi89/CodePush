import React, { useEffect, useState } from 'react';
import { AppRegistry, StyleSheet, Text, View, TouchableOpacity, Platform } from 'react-native';
import codePush, { CodePushOptions } from 'react-native-code-push';
import {
  DeviceEventEmitter
} from "react-native";

// const codePushOptions = { checkFrequency: codePush.CheckFrequency.MANUAL };

const codePushOptions: CodePushOptions = {
  checkFrequency: codePush.CheckFrequency.MANUAL,
  // deploymentKey: 'Fruifi3ySc7wmRSENczmlUZpD3G5aYIw33Gma'
};

const App = () => {

  const [message, setMessage] = useState('正在检查更新...')
  const [progress, setProgress] = useState('0%')

  useEffect(() => {
    codePush.checkForUpdate()
    .then((update) => {
      if (update) {
        setMessage('有新的更新！');
        deal(update);
      } else {
        setMessage('已是最新，不需要更新！');
      }
    })
    .catch(err => console.log(err))
  }, []);

  const onButtonPress = () => {
    codePush.sync({
      updateDialog: true,
      installMode: codePush.InstallMode.IMMEDIATE
    });
  }

  const deal = (update) => {
    // NavigationUtil.showLoadingOverLayOrModal("0%");
    codePush.disallowRestart();
    setMessage('确定之后，开始下载');
    // 确定之后，开始下载
    update.download(down).then(instance => {
      // 下载完成了，调用这个方法
      console.log("开始安装");
      setMessage('开始安装');
      instance.install(codePush.InstallMode.IMMEDIATE).then(() => {
        console.log("安装完成");
        setMessage('安装完成');
        codePush.notifyAppReady();
        codePush.allowRestart();
        codePush.restartApp(true);
      }).catch(reason => {
        // error();
        setMessage(reason);
        console.log(reason)
      });
    }).catch((reason) => {
      setMessage(reason);
      console.log(reason)
    });
  };
  const down = (downloadProgress) => {
    let n = (downloadProgress.receivedBytes / downloadProgress.totalBytes) * 100;
    setProgress(n.toFixed(2) + "%")
    // DeviceEventEmitter.emit(LoadingOverlay.LOADING_REFRESH, n.toFixed(2) + "%");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.welcome}>版本号 1.2.8</Text>
      <Text style={styles.instructions}>{message}</Text>
      <Text style={styles.instructions}>{progress}</Text>
      <TouchableOpacity onPress={onButtonPress}>
        <Text>檢查更新</Text>
        </TouchableOpacity>
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

