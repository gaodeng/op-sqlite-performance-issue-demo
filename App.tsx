/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */


import { Button, StatusBar, StyleSheet, useColorScheme, View, Text } from 'react-native';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { useState } from 'react';
import SQLite from 'react-native-sqlite-2'
import { open } from '@op-engineering/op-sqlite';

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <AppContent />
    </SafeAreaProvider>
  );
}

function AppContent() {
  const safeAreaInsets = useSafeAreaInsets();
  const [log, setLog] = useState('');
  return (
    <View style={[styles.container, {marginTop: safeAreaInsets.top, marginBottom: safeAreaInsets.bottom}]}>
      
      <Button title='react-native-sqlite-2 query' onPress={()=>{
          const time = Date.now();
              const db = SQLite.openDatabase('myDB', '1.0', '', 1);
              setLog(prev => prev + `##### react-native-sqlite-2 #####\n`);
              setLog(prev => prev + `SQLite db opened in ${Date.now() - time} ms\n`);

              db.transaction(function(txn) {
              txn.executeSql("SELECT HEX('a') AS hex", [], (tx, results) => {
                  const rows = results.rows;
                  let hexValue = '';
                  if (rows.length > 0) {
                      hexValue = rows.item(0).hex;
                  }
                  
                  setLog(prev => prev + `Query SELECT HEX('a') AS hex result: ${hexValue}\n`);
                  setLog(prev => prev + `Total time: ${Date.now() - time} ms\n`);
                  setLog(prev => prev + `###############################\n`);
              });
            });
      

      }} />
      <Button title='op-sqlite query' onPress={async () => {
          const time = Date.now();
          const db = await open({ name: 'test.db', location: './NoCloud',});
          const timeOpen = Date.now() - time;
          setLog(prev => prev + `##### op-sqlite #####\n`);
          setLog(prev => prev + `Opened database in ${timeOpen} ms\n`);
          const result = await db.execute("SELECT HEX('a') AS hex");

          setLog(prev => prev + `Query SELECT HEX('a') AS hex result: ${result.rows[0].hex}\n`);
          setLog(prev => prev + `Total time: ${Date.now() - time} ms\n`);
          setLog(prev => prev + `###############################\n`);
      }} />
      <Text>Logs:</Text>
      <Text style={styles.logText}>{log}</Text>
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 5,
    padding: 10,
  },
  logText: {
    borderWidth: 1,
    flex: 1,
  },
});

export default App;
