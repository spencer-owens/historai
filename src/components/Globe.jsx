import React, { useState, useEffect } from 'react';
import * as d3 from 'd3';
import * as topojson from 'topojson-client';

// Path to your local TopoJSON file
const TOPO_JSON_PATH = '/src/assets/topo.json'; 

const Globe = ({ size = 400, rotationSpeed = 0.3 }) => {
  console.log('[Globe] Props:', { size, rotationSpeed });

  const [geoData, setGeoData] = useState(null);
  const [rotation, setRotation] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log(`[Globe] Fetching TopoJSON data from ${TOPO_JSON_PATH}...`);
    setIsLoading(true);
    setError(null);
    d3.json(TOPO_JSON_PATH).then(data => {
      console.log('[Globe] TopoJSON data fetched:', data);
      if (data && data.objects && data.objects.ne_110m_admin_0_countries) {
        console.log('[Globe] Converting TopoJSON to GeoJSON...');
        const geoJson = topojson.feature(data, data.objects.ne_110m_admin_0_countries);
        console.log('[Globe] GeoJSON created, setting geoData state.');
        setGeoData(geoJson);
      } else {
        console.error('[Globe] Failed to parse TopoJSON data. Unexpected structure:', data);
        setError('Invalid TopoJSON data structure');
      }
    }).catch(err => {
      console.error('[Globe] Error loading TopoJSON data:', err);
      setError(`Failed to load TopoJSON: ${err.message}`);
    }).finally(() => {
      setIsLoading(false);
    });
  }, []);

  useEffect(() => {
    if (!geoData || isLoading || error) return;

    console.log('[Globe] geoData present, starting animation loop...');
    let animationFrameId;
    const animate = () => {
      setRotation(prevRotation => prevRotation + rotationSpeed);
      animationFrameId = window.requestAnimationFrame(animate);
    };
    animationFrameId = window.requestAnimationFrame(animate);
    
    return () => {
      if (animationFrameId) {
        console.log('[Globe] Cleaning up animation frame:', animationFrameId);
        window.cancelAnimationFrame(animationFrameId);
      }
    };
  }, [geoData, rotationSpeed, isLoading, error]);

  let pathString = '';
  if (geoData && !isLoading && !error) {
    const projection = d3.geoOrthographic()
      .fitSize([size, size], geoData)
      .rotate([rotation, 0, 0]);
    const pathGenerator = d3.geoPath().projection(projection);
    pathString = pathGenerator(geoData);
    console.log('[Globe] Path string generated. Length:', pathString.length);
  }

  const padding = size * 0.01; // 2% padding, adjust as needed
  const viewBox = `-${padding} -${padding} ${size + 2 * padding} ${size + 2 * padding}`;

  return (
    <svg 
      width={size} 
      height={size} 
      viewBox={viewBox} 
      style={{ display: 'block', margin: 'auto' }}
    >
      {isLoading && <text x={size/2} y={size/2} textAnchor="middle">Loading globe data...</text>}
      {error && <text x={size/2} y={size/2} textAnchor="middle" fill="red">Error: {error}</text>}
      
      {/* Background sphere for water and overall globe border */}
      {geoData && !isLoading && !error && (
        <circle 
          cx={(size / 2) + 1.25} 
          cy={(size / 2) - 2}
          r={(size / 2) * 1.001}
          fill="#88aab6" // Color for the water/base sphere
          // stroke="#000000" // Border color for the entire globe
          // strokeWidth="1.5" // Border width for the entire globe
        />
      )}

      {/* Landmasses are drawn relative to the 0-size box within the viewBox */}
      {geoData && !isLoading && !error && (
        <path
          d={pathString}
          fill="#868585"      // Original fill for countries
          stroke="#5d5e5d"    // Original stroke for country borders
          strokeWidth="0.5" // Original strokeWidth for country borders
        />
      )}
    </svg>
  );
};

export default Globe; 