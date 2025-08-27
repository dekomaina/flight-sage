import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Plane, 
  Navigation, 
  CloudRain, 
  MapPin, 
  Mic, 
  Search,
  Compass,
  Radio,
  Gauge
} from 'lucide-react';
import FlightSearchForm from '@/components/FlightSearchForm';
import VoiceInterface from '@/components/VoiceInterface';
import WeatherWidget from '@/components/WeatherWidget';
import LocationTracker from '@/components/LocationTracker';
import FlightMap from '@/components/FlightMap';

const Index = () => {
  const [currentLocation, setCurrentLocation] = useState<[number, number] | undefined>();
  const [selectedDestination, setSelectedDestination] = useState<[number, number] | undefined>();
  const [activeTab, setActiveTab] = useState('search');

  // Handle voice commands
  const handleVoiceCommand = (command: any) => {
    console.log('Voice command received:', command);
    
    // Auto-switch tabs based on voice commands
    switch (command.intent) {
      case 'search':
        setActiveTab('search');
        break;
      case 'location':
        setActiveTab('location');
        break;
      case 'weather':
        setActiveTab('weather');
        break;
      case 'navigate':
        setActiveTab('map');
        break;
    }
  };

  const handleLocationUpdate = (location: any) => {
    setCurrentLocation([location.latitude, location.longitude]);
  };

  const handleFlightSearch = (criteria: any) => {
    console.log('Flight search:', criteria);
    // Mock destination coordinates for demo
    if (criteria.destination?.toLowerCase().includes('new york')) {
      setSelectedDestination([40.7128, -74.0060]);
    } else if (criteria.destination?.toLowerCase().includes('los angeles')) {
      setSelectedDestination([34.0522, -118.2437]);
    }
  };

  const handleNavigationHelp = (destination: string) => {
    console.log('Navigation help requested for:', destination);
    setActiveTab('map');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-blue-950 dark:to-indigo-950">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-primary/5" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="flex justify-center items-center gap-3 mb-6">
              <div className="p-3 bg-primary/10 rounded-2xl">
                <Plane className="h-8 w-8 text-primary" />
              </div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-primary via-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Flight Sage AI
              </h1>
            </div>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Your intelligent aviation assistant with AI-powered flight search, real-time weather analysis, 
              GPS navigation, and voice control for pilots and travelers.
            </p>
            
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <Badge variant="secondary" className="px-4 py-2">
                <Mic className="h-4 w-4 mr-2" />
                Voice Commands
              </Badge>
              <Badge variant="secondary" className="px-4 py-2">
                <Navigation className="h-4 w-4 mr-2" />
                Smart Routes
              </Badge>
              <Badge variant="secondary" className="px-4 py-2">
                <CloudRain className="h-4 w-4 mr-2" />
                Real-time Weather
              </Badge>
              <Badge variant="secondary" className="px-4 py-2">
                <MapPin className="h-4 w-4 mr-2" />
                GPS Tracking
              </Badge>
            </div>

            <div className="flex justify-center gap-4">
              <Button 
                size="lg" 
                onClick={() => setActiveTab('voice')}
                className="text-lg px-8"
              >
                <Mic className="h-5 w-5 mr-2" />
                Start Voice Assistant
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => setActiveTab('search')}
                className="text-lg px-8"
              >
                <Search className="h-5 w-5 mr-2" />
                Search Flights
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Application */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:mx-auto">
            <TabsTrigger value="voice" className="flex items-center gap-2">
              <Mic className="h-4 w-4" />
              <span className="hidden sm:inline">Voice</span>
            </TabsTrigger>
            <TabsTrigger value="search" className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              <span className="hidden sm:inline">Search</span>
            </TabsTrigger>
            <TabsTrigger value="map" className="flex items-center gap-2">
              <Navigation className="h-4 w-4" />
              <span className="hidden sm:inline">Map</span>
            </TabsTrigger>
            <TabsTrigger value="weather" className="flex items-center gap-2">
              <CloudRain className="h-4 w-4" />
              <span className="hidden sm:inline">Weather</span>
            </TabsTrigger>
            <TabsTrigger value="location" className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <span className="hidden sm:inline">GPS</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="voice" className="space-y-6">
            <VoiceInterface
              onCommand={handleVoiceCommand}
              onFlightSearch={handleFlightSearch}
              onLocationRequest={() => setActiveTab('location')}
              onNavigationHelp={handleNavigationHelp}
            />
          </TabsContent>

          <TabsContent value="search" className="space-y-6">
            <FlightSearchForm onSearch={handleFlightSearch} />
          </TabsContent>

          <TabsContent value="map" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Navigation className="h-5 w-5 text-primary" />
                  Interactive Aviation Map
                </CardTitle>
                <CardDescription>
                  Real-time flight paths, airports, weather overlays, and navigation aids
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FlightMap
                  currentLocation={currentLocation}
                  destination={selectedDestination}
                  showWeather={true}
                  onAirportSelect={(airport) => console.log('Airport selected:', airport)}
                  onRouteCalculated={(route) => console.log('Route calculated:', route)}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="weather" className="space-y-6">
            <WeatherWidget
              location=""
              autoUpdate={true}
              showFlightAnalysis={true}
              onWeatherUpdate={(weather) => console.log('Weather updated:', weather)}
            />
          </TabsContent>

          <TabsContent value="location" className="space-y-6">
            <LocationTracker
              onLocationUpdate={handleLocationUpdate}
              onNearbyAirportsFound={(airports) => console.log('Nearby airports:', airports)}
              showNavigationAids={true}
              autoUpdate={true}
            />
          </TabsContent>
        </Tabs>

        {/* Quick Stats */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <Plane className="h-8 w-8 text-primary" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Flight Routes</p>
                  <p className="text-2xl font-bold">1000+</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <Compass className="h-8 w-8 text-primary" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Airports</p>
                  <p className="text-2xl font-bold">5000+</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <Radio className="h-8 w-8 text-primary" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Nav Aids</p>
                  <p className="text-2xl font-bold">2500+</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <Gauge className="h-8 w-8 text-primary" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Accuracy</p>
                  <p className="text-2xl font-bold">99.9%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
