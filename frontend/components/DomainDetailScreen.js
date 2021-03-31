import React, { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import { DataTable } from "react-native-paper";
import { Card, Title } from "react-native-paper";
import axios from "axios";

const DomainDetailScreen = ({ route, navigation }) => {
  const { domainId } = route.params;
  let [urls, setUrls] = useState([]);
  const fetchUrls = async () => {
    axios
      .get(`http://localhost:3003/domain/${domainId}`)
      .then((res) => {
        setUrls(res.data);
      })
      .catch((err) => {
        console.log("AXIOS ERROR: ", err);
      });
  };
  useEffect(() => {
    fetchUrls();
  }, []);
  const dataRowComponents = urls.map((item) => (
    <DataTable.Row key={item._id}>
      <DataTable.Cell>{item.name}</DataTable.Cell>
    </DataTable.Row>
  ));
  return (
    <View style={styles.container}>
      <Card.Content>
        <Title>{domainId}</Title>
      </Card.Content>
      <DataTable>
        <DataTable.Header>
          <DataTable.Title>URL</DataTable.Title>
        </DataTable.Header>

        <>{dataRowComponents}</>
      </DataTable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 22,
  },
});

export default DomainDetailScreen;
