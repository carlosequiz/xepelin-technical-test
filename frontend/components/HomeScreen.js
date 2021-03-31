import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet } from "react-native";
import { List, Button } from "react-native-paper";
import { useIsFocused } from "@react-navigation/native";

import axios from "axios";

const HomeScreen = ({ navigation }) => {
  let [domains, setDomains] = useState([]);
  const isFocused = useIsFocused();
  const fetchDomains = async () => {
    axios
      .get("http://localhost:3003/domain")
      .then((res) => {
        setDomains(res.data);
      })
      .catch((err) => {
        console.log("AXIOS ERROR: ", err);
      });
  };

  useEffect(() => {
    fetchDomains();
  }, [isFocused]);
  const dataRowComponents = domains.map((item) => (
    <List.Item
      key={item._id}
      title={item.name}
      onPress={() => {
        navigation.navigate("DomainDetailScreen", { domainId: item._id });
      }}
      left={() => <List.Icon icon="link" />}
    />
  ));
  return (
    <ScrollView style={styles.container}>
      <Button
        mode="contained"
        onPress={() => {
          navigation.navigate("AddUrlScreen");
        }}
      >
        {"Shorten URL!"}
      </Button>
      <List.Section>{dataRowComponents}</List.Section>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: "5%",
    paddingRight: "10%",
    paddingLeft: "10%",
  },
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
  },
  title: {
    fontSize: 20,
    height: 44,
    marginTop: "5%",
    textAlign: "left",
  },
  shortenBtn: {
    marginTop: "2%",
    marginBottom: "1%",
  },
});

export default HomeScreen;
