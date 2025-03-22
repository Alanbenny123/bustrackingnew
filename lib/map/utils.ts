import { DOMParser } from '@xmldom/xmldom';

interface BusRoute {
  name: string;
  coordinates: [number, number][];
}

interface BusRoutes {
  [key: string]: BusRoute;
}

export function decodePolyline(encoded: string) {
  const points: [number, number][] = [];
  let index = 0;
  const len = encoded.length;
  let lat = 0;
  let lng = 0;

  while (index < len) {
    let b;
    let shift = 0;
    let result = 0;
    do {
      b = encoded.charAt(index++).charCodeAt(0) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    const dlat = (result & 1) !== 0 ? ~(result >> 1) : result >> 1;
    lat += dlat;
    shift = 0;
    result = 0;
    do {
      b = encoded.charAt(index++).charCodeAt(0) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    const dlng = (result & 1) !== 0 ? ~(result >> 1) : result >> 1;
    lng += dlng;
    points.push([lat / 1e5, lng / 1e5]);
  }
  return points;
}

// GPX data for College Bus 101 route
const gpxData = `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<gpx version="1.1"
     creator="Created via GPX Recorder for Android"
     xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
     xmlns="http://www.topografix.com/GPX/1/1"
     xsi:schemaLocation="http://www.topografix.com/GPX/1/1 http://www.topografix.com/GPX/1/1/gpx.xsd">
    <metadata>
      <time>2025-03-18T16:09:00Z</time>
      <desc>Recorded with GPX Recorder for Android</desc>
    </metadata>
    <trk>
      <name>College Bus 101 Route</name>
      <trkseg>
    <trkpt lat="10.1777434" lon="76.4299632"><ele>-47.700</ele><time>2025-03-18T10:41:29Z</time></trkpt>
    <trkpt lat="10.177733" lon="76.4299376"><ele>-55.700</ele><time>2025-03-18T10:41:58Z</time></trkpt>
    <trkpt lat="10.1777494" lon="76.4299691"><ele>-55.700</ele><time>2025-03-18T10:42:06Z</time></trkpt>
    <trkpt lat="10.1777526" lon="76.4299502"><ele>-55.700</ele><time>2025-03-18T10:42:23Z</time></trkpt>
    <trkpt lat="10.1777479" lon="76.4299149"><ele>-53.800</ele><time>2025-03-18T10:43:15Z</time></trkpt>
    <trkpt lat="10.1777532" lon="76.4296126"><ele>-55.500</ele><time>2025-03-18T10:43:30Z</time></trkpt>
    <trkpt lat="10.1777147" lon="76.4295352"><ele>-55.500</ele><time>2025-03-18T10:43:44Z</time></trkpt>
    <trkpt lat="10.1777348" lon="76.4295557"><ele>-52.200</ele><time>2025-03-18T10:44:00Z</time></trkpt>
    <trkpt lat="10.1777269" lon="76.429598"><ele>-55.700</ele><time>2025-03-18T10:44:19Z</time></trkpt>
    <trkpt lat="10.1777558" lon="76.429579"><ele>-55.700</ele><time>2025-03-18T10:44:30Z</time></trkpt>
    <trkpt lat="10.1777021" lon="76.4292245"><ele>-55.700</ele><time>2025-03-18T10:44:45Z</time></trkpt>
    <trkpt lat="10.1775509" lon="76.4291154"><ele>-55.800</ele><time>2025-03-18T10:44:59Z</time></trkpt>
    <trkpt lat="10.1768814" lon="76.4291216"><ele>-57.700</ele><time>2025-03-18T10:45:14Z</time></trkpt>
    <trkpt lat="10.1763212" lon="76.4291538"><ele>-58.600</ele><time>2025-03-18T10:45:29Z</time></trkpt>
    <trkpt lat="10.1757656" lon="76.4292572"><ele>-66.700</ele><time>2025-03-18T10:45:44Z</time></trkpt>
    <trkpt lat="10.1752957" lon="76.4291844"><ele>-68.100</ele><time>2025-03-18T10:45:59Z</time></trkpt>
    <trkpt lat="10.1749589" lon="76.4291626"><ele>-68.500</ele><time>2025-03-18T10:46:14Z</time></trkpt>
    <trkpt lat="10.174097" lon="76.4290882"><ele>-68.500</ele><time>2025-03-18T10:46:30Z</time></trkpt>
    <trkpt lat="10.1736768" lon="76.4290144"><ele>-68.100</ele><time>2025-03-18T10:46:39Z</time></trkpt>
    <trkpt lat="10.1719115" lon="76.4287462"><ele>-64.000</ele><time>2025-03-18T10:47:14Z</time></trkpt>
    <trkpt lat="10.1713253" lon="76.4288079"><ele>-61.900</ele><time>2025-03-18T10:47:29Z</time></trkpt>
    <trkpt lat="10.1711673" lon="76.4288185"><ele>-60.400</ele><time>2025-03-18T10:47:44Z</time></trkpt>
    <trkpt lat="10.1710088" lon="76.4289344"><ele>-60.400</ele><time>2025-03-18T10:47:58Z</time></trkpt>
    <trkpt lat="10.1708998" lon="76.4292442"><ele>-60.400</ele><time>2025-03-18T10:48:13Z</time></trkpt>
    <trkpt lat="10.1706285" lon="76.4291448"><ele>-61.400</ele><time>2025-03-18T10:48:29Z</time></trkpt>
    <trkpt lat="10.1704255" lon="76.4284579"><ele>-61.700</ele><time>2025-03-18T10:48:44Z</time></trkpt>
    <trkpt lat="10.1703091" lon="76.4273072"><ele>-61.600</ele><time>2025-03-18T10:48:59Z</time></trkpt>
    <trkpt lat="10.1700817" lon="76.4259919"><ele>-60.200</ele><time>2025-03-18T10:49:14Z</time></trkpt>
    <trkpt lat="10.1698064" lon="76.4247272"><ele>-60.400</ele><time>2025-03-18T10:49:29Z</time></trkpt>
    <trkpt lat="10.1693459" lon="76.4244754"><ele>-59.000</ele><time>2025-03-18T10:49:38Z</time></trkpt>
    <trkpt lat="10.1687156" lon="76.4219081"><ele>-60.300</ele><time>2025-03-18T10:50:14Z</time></trkpt>
    <trkpt lat="10.1675975" lon="76.4190279"><ele>-66.300</ele><time>2025-03-18T10:50:44Z</time></trkpt>
    <trkpt lat="10.1672095" lon="76.4175943"><ele>-67.800</ele><time>2025-03-18T10:50:59Z</time></trkpt>
    <trkpt lat="10.1671484" lon="76.4158081"><ele>-67.800</ele><time>2025-03-18T10:51:14Z</time></trkpt>
    <trkpt lat="10.1665656" lon="76.4139901"><ele>-67.800</ele><time>2025-03-18T10:51:29Z</time></trkpt>
    <trkpt lat="10.1659566" lon="76.4127754"><ele>-67.800</ele><time>2025-03-18T10:51:44Z</time></trkpt>
    <trkpt lat="10.1657318" lon="76.4116061"><ele>-67.800</ele><time>2025-03-18T10:51:59Z</time></trkpt>
    <trkpt lat="10.1656967" lon="76.4109699"><ele>-65.200</ele><time>2025-03-18T10:52:14Z</time></trkpt>
    <trkpt lat="10.1646147" lon="76.410885"><ele>-66.300</ele><time>2025-03-18T10:52:29Z</time></trkpt>
    <trkpt lat="10.1639942" lon="76.4095942"><ele>-66.300</ele><time>2025-03-18T10:52:44Z</time></trkpt>
    <trkpt lat="10.1633657" lon="76.4060955"><ele>-67.200</ele><time>2025-03-18T10:53:14Z</time></trkpt>
    <trkpt lat="10.1639982" lon="76.4041854"><ele>-67.000</ele><time>2025-03-18T10:53:29Z</time></trkpt>
    <trkpt lat="10.1639205" lon="76.4023445"><ele>-67.000</ele><time>2025-03-18T10:53:44Z</time></trkpt>
    <trkpt lat="10.16326" lon="76.4000875"><ele>-69.800</ele><time>2025-03-18T10:54:14Z</time></trkpt>
    <trkpt lat="10.1630311" lon="76.3992216"><ele>-69.900</ele><time>2025-03-18T10:54:29Z</time></trkpt>
    <trkpt lat="10.1626616" lon="76.3980024"><ele>-69.400</ele><time>2025-03-18T10:54:44Z</time></trkpt>
    <trkpt lat="10.1619619" lon="76.3968508"><ele>-69.400</ele><time>2025-03-18T10:54:59Z</time></trkpt>
    <trkpt lat="10.1617257" lon="76.3960936"><ele>-69.200</ele><time>2025-03-18T10:55:08Z</time></trkpt>
    <trkpt lat="10.1613593" lon="76.394289"><ele>-69.200</ele><time>2025-03-18T10:55:29Z</time></trkpt>
    <trkpt lat="10.1607813" lon="76.3929754"><ele>-69.500</ele><time>2025-03-18T10:55:44Z</time></trkpt>
    <trkpt lat="10.160329" lon="76.3921332"><ele>-69.500</ele><time>2025-03-18T10:55:59Z</time></trkpt>
    <trkpt lat="10.1599088" lon="76.3915315"><ele>-69.300</ele><time>2025-03-18T10:56:14Z</time></trkpt>
    <trkpt lat="10.1593622" lon="76.3894196"><ele>-71.100</ele><time>2025-03-18T10:56:44Z</time></trkpt>
    <trkpt lat="10.159276" lon="76.3875802"><ele>-70.400</ele><time>2025-03-18T10:56:59Z</time></trkpt>
    <trkpt lat="10.1592005" lon="76.3859244"><ele>-70.400</ele><time>2025-03-18T10:57:14Z</time></trkpt>
    <trkpt lat="10.1590788" lon="76.383853"><ele>-70.400</ele><time>2025-03-18T10:57:29Z</time></trkpt>
    <trkpt lat="10.1585858" lon="76.3816726"><ele>-64.600</ele><time>2025-03-18T10:57:44Z</time></trkpt>
    <trkpt lat="10.1577695" lon="76.3797908"><ele>-64.600</ele><time>2025-03-18T10:57:59Z</time></trkpt>
    <trkpt lat="10.1567568" lon="76.3779335"><ele>-64.600</ele><time>2025-03-18T10:58:14Z</time></trkpt>
    <trkpt lat="10.1551381" lon="76.3765477"><ele>-64.600</ele><time>2025-03-18T10:58:29Z</time></trkpt>
    <trkpt lat="10.1536422" lon="76.3749997"><ele>-64.600</ele><time>2025-03-18T10:58:44Z</time></trkpt>
    <trkpt lat="10.1532492" lon="76.373231"><ele>-64.600</ele><time>2025-03-18T10:58:59Z</time></trkpt>
    <trkpt lat="10.1527956" lon="76.3711269"><ele>-64.600</ele><time>2025-03-18T10:59:14Z</time></trkpt>
    <trkpt lat="10.1513274" lon="76.3694935"><ele>-64.600</ele><time>2025-03-18T10:59:29Z</time></trkpt>
    <trkpt lat="10.1504554" lon="76.3649816"><ele>-64.600</ele><time>2025-03-18T10:59:59Z</time></trkpt>
    <trkpt lat="10.1500984" lon="76.3626995"><ele>-64.600</ele><time>2025-03-18T11:00:14Z</time></trkpt>
    <trkpt lat="10.1497295" lon="76.3602198"><ele>-64.600</ele><time>2025-03-18T11:00:29Z</time></trkpt>
    <trkpt lat="10.1503472" lon="76.3581411"><ele>-64.600</ele><time>2025-03-18T11:00:44Z</time></trkpt>
    <trkpt lat="10.1521411" lon="76.3566496"><ele>-68.900</ele><time>2025-03-18T11:00:59Z</time></trkpt>
    <trkpt lat="10.1527682" lon="76.3551378"><ele>-71.800</ele><time>2025-03-18T11:01:14Z</time></trkpt>
    <trkpt lat="10.1520259" lon="76.3544891"><ele>-71.300</ele><time>2025-03-18T11:01:28Z</time></trkpt>
    <trkpt lat="10.1500337" lon="76.3542988"><ele>-71.300</ele><time>2025-03-18T11:01:44Z</time></trkpt>
    <trkpt lat="10.1478954" lon="76.3540177"><ele>-71.300</ele><time>2025-03-18T11:01:59Z</time></trkpt>
    <trkpt lat="10.1457959" lon="76.3532757"><ele>-70.200</ele><time>2025-03-18T11:02:14Z</time></trkpt>
    <trkpt lat="10.1440494" lon="76.3529027"><ele>-71.500</ele><time>2025-03-18T11:02:29Z</time></trkpt>
    <trkpt lat="10.1425842" lon="76.3530425"><ele>-71.500</ele><time>2025-03-18T11:02:44Z</time></trkpt>
    </trkseg>
    </trk>
</gpx>`;

function parseGPX(gpxContent: string): [number, number][] {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(gpxContent, 'text/xml');
  const trackpoints = xmlDoc.getElementsByTagName('trkpt');
  const coordinates: [number, number][] = [];

  for (let i = 0; i < trackpoints.length; i++) {
    const point = trackpoints[i];
    const lat = parseFloat(point.getAttribute('lat') || '0');
    const lon = parseFloat(point.getAttribute('lon') || '0');
    if (lat && lon) {
      coordinates.push([lat, lon]);
    }
  }

  return coordinates;
}

// Parse the GPX data
const routeCoordinates = parseGPX(gpxData);

export const busRoutes: BusRoutes = {
  "College Bus 101": {
    name: "Kalady - Kochi Route",
    coordinates: routeCoordinates
  }
};
