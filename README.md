# QuickPlaces 📍

A mobile app built with React Native and Expo that helps users quickly find and explore nearby places using their device location and Google Places search.

## Features

- 🗺️ Interactive maps powered by `react-native-maps`
- 📍 Real-time device geolocation via `expo-location` and `react-native-geolocation-service`
- 🔍 Google Places Autocomplete for searching any location
- ⚡ File-based routing with Expo Router
- 📱 Supports Android, iOS, and Web

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React Native 0.74 + Expo 51 |
| Navigation | Expo Router + React Navigation |
| Maps | react-native-maps |
| Search | react-native-google-places-autocomplete |
| Language | TypeScript |
| Testing | Jest + jest-expo |

## Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- A [Google Maps API key](https://developers.google.com/maps/documentation/javascript/get-api-key) with **Maps SDK** and **Places API** enabled

## Getting Started

1. **Clone the repository**

   ```bash
   git clone https://github.com/bartut22/QuickPlaces.git
   cd QuickPlaces
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure your API key**

   Create a `.env` file in the root directory and add your Google Maps API key:

   ```env
   EXPO_PUBLIC_GOOGLE_MAPS_API_KEY=your_api_key_here
   ```

4. **Start the development server**

   ```bash
   npx expo start
   ```

   Then open the app using one of the following:
   - **Expo Go** — scan the QR code on your device
   - **Android emulator** — press `a`
   - **iOS simulator** — press `i`
   - **Web browser** — press `w`

## Project Structure

```
QuickPlaces/
├── app/ # File-based routes (Expo Router)
├── components/ # Reusable UI components
├── constants/ # App-wide constants (colors, config, etc.)
├── hooks/ # Custom React hooks
├── assets/ # Images, fonts, and static files
└── scripts/ # Utility scripts
```


## Available Scripts

| Command | Description |
|---|---|
| `npm start` | Start the Expo development server |
| `npm run android` | Run on Android emulator/device |
| `npm run ios` | Run on iOS simulator/device |
| `npm run web` | Run in the web browser |
| `npm test` | Run tests with Jest |
| `npm run lint` | Lint the project with Expo's linter |
| `npm run reset-project` | Reset to a blank app scaffold |

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m 'Add your feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request

## License

This project is private. All rights reserved.
