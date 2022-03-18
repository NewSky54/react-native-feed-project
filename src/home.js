import React from "react";
import {
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Image,
  FlatList,
  StatusBar,
  Alert,
} from "react-native";
import { useQuery, gql } from "@apollo/client";
import { PRODUCTS_QUERY } from "./queries";
import { ImageLoader } from "react-native-image-fallback";
import * as Animatable from "react-native-animatable";

export default function Home() {
  const { loading, error, data, fetchMore, updateQuery } = useQuery(
    PRODUCTS_QUERY,
    {
      variables: {
        first: 9,
      },
    }
  );

  const alertPress = () =>
    Alert.alert("Possible New Features", "Login Flow, Product Detail View");

  // removes products images with 404 status code
  const removeItem = (cursor) => {
    updateQuery((prevResult) => {
      // return new array with product containing 404 image not included
      const newList = prevResult.products.edges.filter((item) => {
        return item.cursor !== cursor;
      });

      // copy products object
      const productsCopy = { ...prevResult.products, edges: newList };

      // return previous object with new array in place of `prevResult.products.edges`
      return { products: productsCopy };
    });
  };

  // handles no data coming from API
  const renderEmpty = () => (
    <View style={styles.emptyText}>
      <Text>No products available</Text>
    </View>
  );

  // handles infinite scroll loading and no more products state
  const renderFooter = (loading) => {
    return (
      <View styles={styles.footerText}>
        {!data?.products.pageInfo.hasNextPage ? (
          <Text>You've reached the end!</Text>
        ) : (
          <ActivityIndicator />
        )}
      </View>
    );
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" />
      <SafeAreaView>
        {loading ? (
          <View style={styles.loading}>
            <ActivityIndicator size="large" />
          </View>
        ) : (
          <FlatList
            data={data?.products.edges}
            style={styles.container}
            keyExtractor={(product, idx) => `${product.node.createdAt}-${idx}`}
            removeClippedSubviews={true}
            renderItem={({ item, index, separators }) => {
              return (
                <Animatable.View animation="slideInUp">
                  <TouchableOpacity
                    key={`${item.node.createdAt}`}
                    style={styles.card}
                    onPress={alertPress}
                  >
                    <View
                      style={{
                        width: 400,
                        height: 400,
                      }}
                    >
                      <Image
                        source={{ uri: item?.node.image.src }}
                        resizeMode="contain"
                        style={{
                          aspectRatio: 1,
                        }}
                        onError={(error) => {
                          // passing in cursor of image with 404 error
                          removeItem(item.cursor);
                        }}
                      />
                    </View>
                    <View style={styles.infoContainer}>
                      <Text style={styles.title}>{item?.node.name}</Text>
                      <Text style={styles.price}>
                        {item?.node.priceAmountPretty}
                      </Text>
                    </View>
                  </TouchableOpacity>
                </Animatable.View>
              );
            }}
            onEndReached={() => {
              fetchMore({
                variables: { after: data?.products.pageInfo.endCursor },
                updateQuery: (prevResult, { fetchMoreResult }) => {
                  fetchMoreResult.products.edges = [
                    ...prevResult.products.edges,
                    ...fetchMoreResult.products.edges,
                  ];
                  return fetchMoreResult;
                },
              });
            }}
            onEndReachedThreshold={0}
            ListEmptyComponent={renderEmpty}
            ListFooterComponent={renderFooter}
          />
        )}
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    backgroundColor: "black",
  },
  card: {
    width: "100%",
    alignItems: "center",
    backgroundColor: "white",
    // backgroundColor: "lightgrey",
    marginVertical: 20,
  },
  infoContainer: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-around",
    padding: 10,
    // alignItems: "space-around",
  },
  title: {
    fontFamily: "Nunito_600SemiBold",
  },
  price: {
    fontFamily: "Nunito_800ExtraBold",
  },
  footerText: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 10,
  },
  loading: {
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

// // instead of removing product with no images, provide fallback image
// <ImageLoader
//   source={item?.node.image.src}
//   style={{
//     aspectRatio: 1,
//   }}
//   fallback="https://pngimg.com/uploads/cat/cat_PNG50498.png"
//   onError={(error) => {
//     // passing in cursor of image with 404 error
//     console.log("inside onError");
//   }}
// />;
