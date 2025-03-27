# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

### Changed
- Removed `currentLocation` prop from `RouteMap` component as it's now handled internally using `useDeviceLocation` hook
- Fixed type error in `test-location/page.tsx`

### Added
- Location tracking functionality with trail visualization
- Start/Stop tracking controls
- Clear trail functionality
- Real-time location updates every 5 seconds

### Features
- Location trail visualization on map
- Current location display with coordinates
- Error handling for location services
- Loading states for location requests

## [0.1.0] - 2024-03-XX
### Added
- Initial project setup
- Basic map integration with React Leaflet
- Location tracking components 