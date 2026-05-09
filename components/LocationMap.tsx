"use client";

import { useEffect, useRef, useState } from "react";
import type * as Leaflet from "leaflet";
import { useLocale, type TranslationKey } from "@/lib/i18n";
import styles from "./LocationMap.module.css";

const ACTIVE_POI_DELAY_MS = 600;
const MAP_ZOOM_INITIAL = 11;
const MAP_ZOOM_DETAIL = 14;
const MAP_SET_VIEW_DURATION_SECONDS = 0.55;
const MAP_OVERVIEW_DURATION_SECONDS = 1.2;
const MAP_PAN_DURATION_SECONDS = 0.4;
const SELECTION_VERSION_INCREMENT = 1;
const TILE_LAYER_URL =
  "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png";
const TILE_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>';

interface PointOfInterest {
  nameKey: TranslationKey;
  coord: [number, number];
  dist: string;
  descKey: TranslationKey;
  isVilla?: boolean;
}

const VILLA_COORDINATES: [number, number] = [43.5856, 6.999];

const POINTS_OF_INTEREST: PointOfInterest[] = [
  {
    nameKey: "location.poi.0.name",
    coord: VILLA_COORDINATES,
    dist: "—",
    descKey: "location.poi.0.desc",
    isVilla: true,
  },
  {
    nameKey: "location.poi.1.name",
    coord: [43.6004, 7.005],
    dist: "1 km · 3 min",
    descKey: "location.poi.1.desc",
  },
  {
    nameKey: "location.poi.2.name",
    coord: [43.5513, 7.0128],
    dist: "8 km · 15 min",
    descKey: "location.poi.2.desc",
  },
  {
    nameKey: "location.poi.3.name",
    coord: [43.5808, 7.1239],
    dist: "15 km · 22 min",
    descKey: "location.poi.3.desc",
  },
  {
    nameKey: "location.poi.4.name",
    coord: [43.6584, 6.9225],
    dist: "15 km · 22 min",
    descKey: "location.poi.4.desc",
  },
  {
    nameKey: "location.poi.5.name",
    coord: [43.6217, 7.0498],
    dist: "6 km · 12 min",
    descKey: "location.poi.5.desc",
  },
  {
    nameKey: "location.poi.6.name",
    coord: [43.6584, 7.2158],
    dist: "25 km · 25 min",
    descKey: "location.poi.6.desc",
  },
  {
    nameKey: "location.poi.7.name",
    coord: [43.7384, 7.4246],
    dist: "55 km · 50 min",
    descKey: "location.poi.7.desc",
  },
  {
    nameKey: "location.poi.8.name",
    coord: [43.6973, 7.1224],
    dist: "22 km · 30 min",
    descKey: "location.poi.8.desc",
  },
];

function createPopupContent(point: PointOfInterest, t: (key: TranslationKey) => string): string {
  return `<strong>${t(point.nameKey)}</strong><span>${point.dist}</span><p>${t(point.descKey)}</p>`;
}

function formatMapIndex(index: number): string {
  return String(index + 1).padStart(2, "0");
}

type ActivationSource = "marker" | "list" | "initial";

export default function LocationMap() {
  const { t } = useLocale();
  const mapElementRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<Leaflet.Map | null>(null);
  const markersRef = useRef<Leaflet.Marker[]>([]);
  const activationSourceRef = useRef<ActivationSource>("initial");
  const [activePoiIndex, setActivePoiIndex] = useState(0);
  const [selectionVersion, setSelectionVersion] = useState(0);

  function activatePointOfInterest(index: number, source: ActivationSource): void {
    activationSourceRef.current = source;
    setActivePoiIndex(index);
    setSelectionVersion((version) => version + SELECTION_VERSION_INCREMENT);
  }

  useEffect(() => {
    let isMounted = true;
    let timeoutId = 0;

    async function loadMap(): Promise<void> {
      const L = await import("leaflet");
      if (!isMounted || !mapElementRef.current || mapRef.current) return;

      const map = L.map(mapElementRef.current, {
        scrollWheelZoom: false,
        zoomControl: false,
      }).setView(VILLA_COORDINATES, MAP_ZOOM_INITIAL);

      L.control.zoom({ position: "topright" }).addTo(map);
      L.tileLayer(TILE_LAYER_URL, {
        attribution: TILE_ATTRIBUTION,
      }).addTo(map);

      const villaIcon = L.divIcon({
        className: styles.villaIcon,
        html: "A",
        iconSize: [44, 44],
        iconAnchor: [22, 22],
      });

      markersRef.current = POINTS_OF_INTEREST.map((point, index) => {
        const indexedPoiIcon = point.isVilla
          ? villaIcon
          : L.divIcon({
              className: styles.poiIcon,
              html: `<span>${formatMapIndex(index)}</span>`,
              iconSize: [34, 34],
              iconAnchor: [17, 17],
            });
        const marker = L.marker(point.coord, {
          icon: indexedPoiIcon,
        })
          .addTo(map)
          .bindPopup(createPopupContent(point, t));

        marker.on("click", () => {
          activatePointOfInterest(index, "marker");
        });
        return marker;
      });

      mapRef.current = map;
      timeoutId = window.setTimeout(() => {
        activatePointOfInterest(0, "initial");
      }, ACTIVE_POI_DELAY_MS);
    }

    loadMap();

    return () => {
      isMounted = false;
      window.clearTimeout(timeoutId);
      mapRef.current?.remove();
      mapRef.current = null;
      markersRef.current = [];
    };
  }, [t]);

  useEffect(() => {
    const map = mapRef.current;
    const marker = markersRef.current[activePoiIndex];
    const point = POINTS_OF_INTEREST[activePoiIndex];
    if (!map || !marker || !point) return;

    markersRef.current.forEach((item, index) => {
      const element = item.getElement();
      element?.classList.toggle(styles.poiIconActive, index === activePoiIndex);
    });

    const currentZoom = map.getZoom();
    const shouldZoomToDetail =
      !point.isVilla &&
      (activationSourceRef.current === "list" || currentZoom < MAP_ZOOM_DETAIL);

    map.stop();

    if (point.isVilla) {
      map.setView(point.coord, MAP_ZOOM_INITIAL, {
        animate: activationSourceRef.current !== "initial",
        duration: MAP_OVERVIEW_DURATION_SECONDS,
      });
    } else if (shouldZoomToDetail) {
      map.setView(point.coord, MAP_ZOOM_DETAIL, {
        animate: activationSourceRef.current !== "initial",
        duration: MAP_SET_VIEW_DURATION_SECONDS,
      });
    } else if (activationSourceRef.current === "list") {
      map.panTo(point.coord, {
        animate: true,
        duration: MAP_PAN_DURATION_SECONDS,
      });
    }

    marker.openPopup();
  }, [activePoiIndex, selectionVersion]);

  return (
    <div className={styles.locationMap}>
      <div className={styles.mapFrame}>
        <div className={styles.mapPlate} aria-hidden="true" />
        <div
          ref={mapElementRef}
          className={styles.map}
          aria-label="Villa Azuréa location map"
        />
        <button
          type="button"
          className={styles.resetMapButton}
          onClick={() => activatePointOfInterest(0, "list")}
          aria-label={t("location.map.reset")}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path
              d="M12 21s6-5.2 6-11a6 6 0 0 0-12 0c0 5.8 6 11 6 11Z"
              fill="none"
              stroke="currentColor"
              strokeLinejoin="round"
              strokeWidth="1.6"
            />
            <circle cx="12" cy="10" r="2.1" fill="currentColor" />
          </svg>
        </button>
        <div className={styles.mapLegend} aria-hidden="true">
          <span>43.5856° N</span>
          <span>006.9990° E</span>
        </div>
      </div>
      <div className={styles.poiList}>
        {POINTS_OF_INTEREST.map((point, index) => {
          const isActive = index === activePoiIndex;
          return (
            <button
              key={point.nameKey}
              type="button"
              className={`${styles.poiItem} ${isActive ? styles.poiItemActive : ""}`}
              onClick={() => activatePointOfInterest(index, "list")}
            >
              <span className={styles.poiIndex}>{formatMapIndex(index)}</span>
              <span className={styles.poiContent}>
                <span className={styles.poiName}>{t(point.nameKey)}</span>
                <span className={styles.poiMeta}>{point.dist}</span>
                <span className={styles.poiDesc}>{t(point.descKey)}</span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
