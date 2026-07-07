import { useEffect, useMemo, useRef } from "react";
import L from "leaflet";
import "leaflet.heat";
// @ts-expect-error - leaflet.heat has no types
import type {} from "leaflet.heat";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import type { Incident } from "@/lib/incidents";
import { CAMPUS_CENTER, categoryLabel, severityColor } from "@/lib/constants";
import { Link } from "@tanstack/react-router";

function coloredIcon(color: string) {
  return L.divIcon({
    className: "campussafe-marker",
    html: `<span style="display:inline-block;width:18px;height:18px;border-radius:9999px;background:${color};border:2px solid white;box-shadow:0 1px 4px rgba(0,0,0,.4)"></span>`,
    iconSize: [18, 18],
    iconAnchor: [9, 9],
  });
}

function HeatLayer({ incidents, enabled }: { incidents: Incident[]; enabled: boolean }) {
  const map = useMap();
  const layerRef = useRef<L.Layer | null>(null);
  useEffect(() => {
    if (layerRef.current) {
      map.removeLayer(layerRef.current);
      layerRef.current = null;
    }
    if (!enabled) return;
    const points = incidents.map((i) => {
      const weight = i.severity === "emergency" ? 1 : i.severity === "high" ? 0.8 : i.severity === "medium" ? 0.5 : 0.3;
      return [i.latitude, i.longitude, weight] as [number, number, number];
    });
    // @ts-expect-error heatLayer added by plugin
    const heat = L.heatLayer(points, { radius: 30, blur: 20, maxZoom: 18 });
    heat.addTo(map);
    layerRef.current = heat;
    return () => {
      if (layerRef.current) map.removeLayer(layerRef.current);
    };
  }, [enabled, incidents, map]);
  return null;
}

export function IncidentMap({
  incidents,
  showHeatmap = false,
  height = 500,
}: {
  incidents: Incident[];
  showHeatmap?: boolean;
  height?: number | string;
}) {
  const center = useMemo(() => {
    if (!incidents.length) return CAMPUS_CENTER;
    const lat = incidents.reduce((s, i) => s + i.latitude, 0) / incidents.length;
    const lng = incidents.reduce((s, i) => s + i.longitude, 0) / incidents.length;
    return [lat, lng] as [number, number];
  }, [incidents]);

  return (
    <div style={{ height }} className="overflow-hidden rounded-xl border border-border">
      <MapContainer center={center} zoom={16} scrollWheelZoom style={{ height: "100%", width: "100%" }}>
        <TileLayer
          attribution='&copy; <a href="https://osm.org">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <HeatLayer incidents={incidents} enabled={showHeatmap} />
        {!showHeatmap &&
          incidents.map((i) => (
            <Marker key={i.id} position={[i.latitude, i.longitude]} icon={coloredIcon(severityColor(i.severity, i.status))}>
              <Popup>
                <div className="min-w-[200px] space-y-1">
                  <div className="font-semibold">{i.title}</div>
                  <div className="text-xs text-muted-foreground">
                    {categoryLabel(i.category)} · {i.severity} · {i.status}
                  </div>
                  {i.location_name && <div className="text-xs">{i.location_name}</div>}
                  <Link to="/incidents/$id" params={{ id: i.id }} className="text-xs text-primary underline">
                    View details →
                  </Link>
                </div>
              </Popup>
            </Marker>
          ))}
      </MapContainer>
    </div>
  );
}
