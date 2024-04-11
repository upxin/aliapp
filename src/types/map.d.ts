export interface Markers {
  id: number;
  latitude: number;
  longitude: number;
  title?: string;
  zIndex?: number;
  iconPath: string;
  width: number | string;
  height: number | string;
  [propName: string]: any;
}
