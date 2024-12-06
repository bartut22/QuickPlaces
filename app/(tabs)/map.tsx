import { Image, StyleSheet, Platform, TextInput, PermissionsAndroid, Button, FlatList, View, GestureResponderEvent } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import MapView, { Marker } from 'react-native-maps';
import { forwardRef, useEffect, useRef, useState } from 'react';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import "react-native-get-random-values";
import { GooglePlacesAutocomplete, GooglePlacesAutocompleteRef } from 'react-native-google-places-autocomplete';
import React from 'react';
import * as Location from 'expo-location';
import { ThemedText } from '@/components/ThemedText';
import { Collapsible } from '@/components/Collapsible';

export default function HomeScreen() {
  const GOOGLE_API_KEY = "AIzaSyC5Lpq0rRkamY4AKtjSApeWrD2-pRBzOUg";
  const insets = useSafeAreaInsets();
  let [searchText, setSearchText] = useState('');
  let [placeName, setPlaceName] = useState('');
  // useref for mapview
  // let currentLocation = useRef<{ latitude: number; longitude: number; }>({ latitude: 0, longitude: 0 });
  let [currLoc, setCurrLoc] = useState<{ latitude: number; longitude: number; }>({ latitude: 0, longitude: 0 });
  let [markers, setMarkers] = useState<{ latlng: { latitude: number; longitude: number; }; title: string; description: string; }[]>([]);
  const mapRef = useRef<MapView>(null);
  const mapObjRef = (map: any) => {
    if (map) mapRef.current = map;
  }
  const inputRef = React.createRef<GooglePlacesAutocompleteRef>();

  const [city, setCity] = useState('');

  type Place = {
    name: string;
    rating: number;
    photos: [{ photo_reference: string }];
    image: string;
    address: string;
  };

  const [places, setPlaces] = useState<Place[]>([]);

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (mounted) return;

    Location.requestForegroundPermissionsAsync().then((permission) => {
      if (permission.status === 'granted') {
        Location.getCurrentPositionAsync({}).then((location) => {
          setCurrLoc({ latitude: location.coords.latitude, longitude: location.coords.longitude });
          Location.reverseGeocodeAsync({ latitude: location.coords.latitude, longitude: location.coords.longitude }, {}).then((address) => {
            // clearText();
            // setMarkers([]);
            setPlaceName('');
            console.log("City: " + address[0].city);
            setCity(address[0].city ?? "");
          });
          if (mapRef.current != null) {
            // clearText();
            mapRef.current.animateToRegion({
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }, 1000);
          }

          setMounted(true);
        });
      }
    });
  }, [mounted]);

  function clearText(): void {
    inputRef.current?.setAddressText("");
    // cleared @ time
    console.log("cleared @ " + new Date().toLocaleTimeString());
    setSearchText("");
    setPlaceName("");
    // setMarkers([]);
  }

  // useEffect(() => {
  //   console.log("Places updated:", places.length);
  // }, [places]);

  const clearPlaces = () => {
    setPlaces([]);
  };

  const fetchPlaces = async () => {
    if (city.length === 0) return;
    try {
      console.log("Fetching places from " + city + "...");
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/textsearch/json?query=restaurants+parks+tourist+attractions+museums+historical+sites+in+5+miles+of+${city}&key=${GOOGLE_API_KEY}`
      );
      const data = await response.json();
      if (data.results) {
        console.log("----------------");
        const promises = data.results.map(async (place: any) => {
          const photoResponse = await fetch(
            `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${place.photos[0].photo_reference}&key=${GOOGLE_API_KEY}`
          );
          place.image = photoResponse.url;
          return place;
        });
        setPlaces([]);
        // console.log("Number of places: " + places.length);

        const resolvedPlaces = await Promise.all(promises);
        setPlaces(resolvedPlaces);
        // console.log(`All photos fetched (${resolvedPlaces.length})`);

        // console.log("almost done!");
        setMarkers([]);
        resolvedPlaces.forEach((place: any) => {
          // console.log(place.name + " in " + city);
          setMarkers((prevMarkers) => [
            ...prevMarkers,
            {
              latlng: {
                latitude: place.geometry.location.lat,
                longitude: place.geometry.location.lng,
              },
              title: place.name,
              description: place.formatted_address,
            },
          ]);
        });
        // console.log("done!");
      }
    } catch (error) {
      console.error("Error fetching places:", error);
    }
  };

  useEffect(() => {
    fetchPlaces();
  }, [city]);

  function returnToPlace(event: GestureResponderEvent): void {
    // go to map at place
    mapRef?.current?.animateToRegion({
      latitude: currLoc.latitude,
      longitude: currLoc.longitude,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    }, 1000);
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ThemedView style={styles.container}>
        <MapView
          style={{ flex: 1 }}
          mapPadding={{ top: insets.top + 16, right: insets.right, bottom: insets.bottom, left: insets.left }}
          showsUserLocation={true}
          showsBuildings={true}
          showsCompass={true}
          rotateEnabled={false}
          ref={mapObjRef}
        >
          {markers.map((marker, index) => (
            <Marker
              key={index}
              coordinate={marker.latlng}
              title={marker.title}
              description={marker.description}
            />
          ))}
        </MapView>
      </ThemedView>

      <GooglePlacesAutocomplete
        placeholder="Search"
        // only cities/towns
        query={{
          key: GOOGLE_API_KEY,
          language: "en", // language of the results
          types: "(cities)", // only
        }}
        ref={inputRef}
        renderRightButton={() => (
          <View>
           { 
          searchText.length > 0 ? (
            <Button onPress={clearText} title="Clear"></Button>
            ) : <></>}
          {city.length > 0 ? (
            <Button onPress={returnToPlace} title="Find"></Button>
            ) : <></>}
          </View>
        )}
        debounce={300}
        enablePoweredByContainer={false}
        textInputProps={{
          onChangeText: (text) => {
            setSearchText(text);
          },
          returnKeyType: 'search',
          onSubmitEditing: () => {
            // console.log("Submitted: " + searchText);
          }
          // clearButtonMode: 'while-editing',
        }}

        onPress={(data, details) => {
          console.log("--------------------" + data.description + "--------------------");
          // console.log(details?.formatted_address ?? (details?.name ?? data.description));
          // console.log(data.description)
          // console.log(details?.name);
          // console.log(details?.geometry.location)

          // set place name
          setPlaceName(data.description);
          setCity(data.description);


          // change map location to data.description
          if (mapRef.current != null && details != null) {
            setCurrLoc({ latitude: details.geometry.location.lat, longitude: details.geometry.location.lng });
            mapRef.current.animateToRegion({
              latitude: details.geometry.location.lat,
              longitude: details.geometry.location.lng,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }, 1000);
          }
        }}
        autoSelectFirstResult={true}
        onFail={(error) => console.error(error)}
        fetchDetails={true}
        filterReverseGeocodingByTypes={['locality', 'administrative_area_level_3']}
        styles={{
          container: {
            position: 'absolute',
            top: insets.top + 16,
            left: insets.left + 16,
            right: insets.right + 16,
          }
        }}
      />

      {/* text for the name of the place upon requesting
      {placeName.length > 0 ? (
        <ThemedText style={{ position: 'relative', bottom: 0, left: 0, right: 0, textAlign: 'center', backgroundColor: "#4CAF50", borderTopLeftRadius: 8, borderTopRightRadius: 8, fontWeight: "bold" }}>
        {placeName}
      </ThemedText>) : <></>} */}

      <Collapsible title={`See places in ${(city) ? city : "your area"}`} >
        {/* Fetch places from the google places api, including name, rating, an image, address */}
        {/* Show a list of places with a name, rating, an image, and address
      When a place is clicked, show the location of the place on the map */}
        <FlatList
          data={places}
          renderItem={({ item }) => (
            <ThemedView style={styles.stepContainer}>
              <View style={{ flex: 1, flexDirection: "row", gap: 16 }}>
                <ThemedText>{item.name}</ThemedText>
                <ThemedText>{item.rating} / 5</ThemedText>
                <ThemedText>{item.address}</ThemedText>
              </View>
              <Image source={{ uri: item.image }} style={styles.placeImg} />
            </ThemedView>
          )}
          keyExtractor={(item) => item.name}
          contentContainerStyle={{ paddingBottom: 200 }} // Add padding to the bottom
        />
      </Collapsible>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 32,
    flexDirection: 'column',
  },
  placeImg: {
    minHeight: 150,
    minWidth: 150,
    width: "auto",
    aspectRatio: 2,
    flex: 3,
    resizeMode: 'cover',
  },
  linkText: {
    color: Colors.light.tint,
    textDecorationLine: 'underline',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
