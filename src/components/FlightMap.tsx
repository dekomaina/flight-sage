import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import { Icon } from 'leaflet';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plane, Navigation, CloudRain, Wind, AlertTriangle } from 'lucide-react';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in react-leaflet
delete (Icon.Default.prototype as any)._getIconUrl;
Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface Airport {
  id: string;
  name: string;
  code: string;
  lat: number;
  lng: number;
  type: 'major' | 'regional' | 'airstrip';
  facilities: string[];
}

interface FlightPath {
  id: string;
  origin: [number, number];
  destination: [number, number];
  waypoints: [number, number][];
  distance: number;
  estimatedTime: string;
  difficulty: 'easy' | 'moderate' | 'challenging';
  weather: 'clear' | 'cloudy' | 'stormy';
}

interface FlightMapProps {
  currentLocation?: [number, number];
  destination?: [number, number];
  showWeather?: boolean;
  onAirportSelect?: (airport: Airport) => void;
  onRouteCalculated?: (route: FlightPath) => void;
}

const FlightMap: React.FC<FlightMapProps> = ({
  currentLocation,
  destination,
  showWeather = true,
  onAirportSelect,
  onRouteCalculated
}) => {
  const [airports, setAirports] = useState<Airport[]>([]);
  const [flightPaths, setFlightPaths] = useState<FlightPath[]>([]);
  const [weatherData, setWeatherData] = useState<any>(null);
  const [selectedAirport, setSelectedAirport] = useState<Airport | null>(null);

  // Mock airports data (in real implementation, fetch from aviation APIs)
  useEffect(() => {
    const mockAirports: Airport[] = [
      {
        id: '1',
        name: 'John F. Kennedy International Airport',
        code: 'JFK',
        lat: 40.6413,
        lng: -73.7781,
        type: 'major',
        facilities: ['Control Tower', 'Radar', 'ILS', 'Emergency Services']
      },
      {
        id: '2',
        name: 'Los Angeles International Airport',
        code: 'LAX',
        lat: 34.0522,
        lng: -118.2437,
        type: 'major',
        facilities: ['Control Tower', 'Radar', 'ILS', 'Emergency Services', 'Weather Station']
      },
      {
        id: '3',
        name: 'Chicago O\'Hare International Airport',
        code: 'ORD',
        lat: 41.9742,
        lng: -87.9073,
        type: 'major',
        facilities: ['Control Tower', 'Radar', 'ILS', 'Emergency Services']
      },
      {
        id: '4',
        name: 'Heathrow Airport',
        code: 'LHR',
        lat: 51.4700,
        lng: -0.4543,
        type: 'major',
        facilities: ['Control Tower', 'Radar', 'ILS', 'Emergency Services']
      },
      {
        id: '5',
        name: 'Regional Airfield Alpha',
        code: 'RAF',
        lat: 42.3601,
        lng: -71.0589,
        type: 'regional',
        facilities: ['Control Tower', 'Basic Navigation']
      }
    ];

    setAirports(mockAirports);

    // Generate mock flight paths if we have origin and destination
    if (currentLocation && destination) {
      const mockPath: FlightPath = {
        id: 'route-1',
        origin: currentLocation,
        destination: destination,
        waypoints: [
          [currentLocation[0] + 0.5, currentLocation[1] - 0.5],
          [destination[0] - 0.5, destination[1] + 0.5]
        ],
        distance: calculateDistance(currentLocation, destination),
        estimatedTime: '2h 45m',
        difficulty: 'moderate',
        weather: 'clear'
      };
      setFlightPaths([mockPath]);
      onRouteCalculated?.(mockPath);
    }
  }, [currentLocation, destination, onRouteCalculated]);

  const calculateDistance = (point1: [number, number], point2: [number, number]): number => {
    const R = 6371; // Earth's radius in km
    const dLat = (point2[0] - point1[0]) * Math.PI / 180;
    const dLon = (point2[1] - point1[1]) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(point1[0] * Math.PI / 180) * Math.cos(point2[0] * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const getAirportIcon = (airport: Airport) => {
    const color = airport.type === 'major' ? '#0070f3' : airport.type === 'regional' ? '#ff6b35' : '#10b981';
    return new Icon({
      iconUrl: `data:image/svg+xml;base64,${btoa(`
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M21 16V14L13 9V3.5C13 2.67 12.33 2 11.5 2S10 2.67 10 3.5V9L2 14V16L10 13.5V19L8 20.5V22L11.5 21L15 22V20.5L13 19V13.5L21 16Z" fill="${color}"/>
        </svg>
      `)}`,
      iconSize: [24, 24],
      iconAnchor: [12, 12],
    });
  };

  const WeatherOverlay = () => {
    const map = useMap();
    
    useEffect(() => {
      if (showWeather && currentLocation) {
        // Mock weather data overlay
        // In real implementation, use weather APIs
        setWeatherData({
          temperature: '22°C',
          windSpeed: '15 kt',
          visibility: '10+ km',
          conditions: 'Clear'
        });
      }
    }, [showWeather, currentLocation]);

    return null;
  };

  return (
    <div className="relative w-full h-[600px] rounded-lg overflow-hidden shadow-lg">
      <MapContainer
        center={currentLocation || [40.7128, -74.0060] as [number, number]}
        zoom={currentLocation ? 8 : 2}
        style={{ width: '100%', height: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <WeatherOverlay />

        {/* Current location marker */}
        {currentLocation && (
          <Marker position={currentLocation}>
            <Popup>
              <div className="text-center">
                <h3 className="font-semibold text-primary">Current Location</h3>
                <p className="text-sm text-muted-foreground">
                  {currentLocation[0].toFixed(4)}, {currentLocation[1].toFixed(4)}
                </p>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Destination marker */}
        {destination && (
          <Marker position={destination}>
            <Popup>
              <div className="text-center">
                <h3 className="font-semibold text-primary">Destination</h3>
                <p className="text-sm text-muted-foreground">
                  {destination[0].toFixed(4)}, {destination[1].toFixed(4)}
                </p>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Airport markers */}
        {airports.map((airport) => (
          <Marker
            key={airport.id}
            position={[airport.lat, airport.lng]}
            eventHandlers={{
              click: () => {
                setSelectedAirport(airport);
                onAirportSelect?.(airport);
              }
            }}
          >
            <Popup>
              <div className="min-w-[200px]">
                <h3 className="font-semibold text-primary">{airport.name}</h3>
                <p className="text-sm font-mono">{airport.code}</p>
                <Badge variant={airport.type === 'major' ? 'default' : 'secondary'} className="mt-1">
                  {airport.type}
                </Badge>
                <div className="mt-2">
                  <p className="text-xs font-semibold">Facilities:</p>
                  <ul className="text-xs text-muted-foreground">
                    {airport.facilities.map((facility, idx) => (
                      <li key={idx}>• {facility}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Flight paths */}
        {flightPaths.map((path) => (
          <React.Fragment key={path.id}>
            <Polyline
              positions={[path.origin, ...path.waypoints, path.destination]}
              pathOptions={{
                color: path.difficulty === 'easy' ? '#10b981' : path.difficulty === 'moderate' ? '#f59e0b' : '#ef4444',
                weight: 3,
                opacity: 0.8
              }}
            />
          </React.Fragment>
        ))}
      </MapContainer>

      {/* Weather info overlay */}
      {showWeather && weatherData && (
        <Card className="absolute top-4 right-4 p-4 bg-background/90 backdrop-blur-sm">
          <div className="flex items-center gap-2 mb-2">
            <CloudRain className="h-4 w-4 text-primary" />
            <span className="font-semibold text-sm">Weather</span>
          </div>
          <div className="space-y-1 text-xs">
            <div className="flex justify-between">
              <span>Temperature:</span>
              <span>{weatherData.temperature}</span>
            </div>
            <div className="flex justify-between">
              <span>Wind:</span>
              <span>{weatherData.windSpeed}</span>
            </div>
            <div className="flex justify-between">
              <span>Visibility:</span>
              <span>{weatherData.visibility}</span>
            </div>
            <div className="flex justify-between">
              <span>Conditions:</span>
              <span>{weatherData.conditions}</span>
            </div>
          </div>
        </Card>
      )}

      {/* Flight path info */}
      {flightPaths.length > 0 && (
        <Card className="absolute bottom-4 left-4 p-4 bg-background/90 backdrop-blur-sm">
          <div className="flex items-center gap-2 mb-2">
            <Navigation className="h-4 w-4 text-primary" />
            <span className="font-semibold text-sm">Route Information</span>
          </div>
          {flightPaths.map((path) => (
            <div key={path.id} className="space-y-1 text-xs">
              <div className="flex justify-between">
                <span>Distance:</span>
                <span>{path.distance.toFixed(0)} km</span>
              </div>
              <div className="flex justify-between">
                <span>Est. Time:</span>
                <span>{path.estimatedTime}</span>
              </div>
              <div className="flex justify-between">
                <span>Difficulty:</span>
                <Badge variant={path.difficulty === 'easy' ? 'default' : 'secondary'}>
                  {path.difficulty}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Weather:</span>
                <div className="flex items-center gap-1">
                  {path.weather === 'stormy' && <AlertTriangle className="h-3 w-3 text-destructive" />}
                  <span className={path.weather === 'stormy' ? 'text-destructive' : 'text-foreground'}>
                    {path.weather}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </Card>
      )}
    </div>
  );
};

export default FlightMap;