import React, { useContext } from "react";
import { View, Text, StyleSheet, FlatList, Image,Button } from "react-native";
import { Searchbar } from "react-native-paper";
import { ItemsContext } from "../components/ItemsContext";

const MySearchBar = () => {
  const [query, setQuery] = React.useState('');
  return (
    <Searchbar
      placeholder="Search"
      onChangeText={(text) => setQuery(text)}
      value={query}
    />
  );
};

function Home() {
  const { items,removeItem } = useContext(ItemsContext);

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.inputContainer}>
        <MySearchBar />
      </View>

      {/* ✅ hiện list item đã add */}
      {items.length === 0 ? (
        <Text style={{ textAlign: "center", marginTop: 20 }}>
          Chưa có item nào
        </Text>
      ) : (
        <FlatList

          data={items}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item,index }) => (
             <View style={styles.itemBox}>

                <Image
                  source={{ uri: item }}
                  style={{ width: "100%", height: 200, marginBottom: 10 }}
                />
                <Button title="Xoá" color="red" onPress={() => removeItem(index)} />
             </View>

          )}
        />
      )}
    </View>
  );
}

export default Home;

const styles = StyleSheet.create({
  inputContainer: {
    margin: 10,
  },
  itemBox: {
      marginBottom: 15,
      alignItems: "center",
    },
});
