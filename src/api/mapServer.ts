import { fetch } from '@/utils/index';
import { systemInfo } from '@/stores/index';

// 根据经纬度获取城市信息
interface AddressComponent {
  adcode: string;
  building: any;
  businessAreas: any;
  city: string | any[];
  citycode: string;
  country: string;
  district: string;
  neighborhood: any;
  province: string;
  streetNumber: any;
  towncode: string;
  township: string;
  formatted_address: string;
}
interface Re {
  addressComponent: AddressComponent;
  formatted_address: string;
}

interface Pos {
  regeocode: Re;
  status: string;
}

function get<T>({
  url,
  params = {},
  headers = {},
  opts = { obu: false },
}): Promise<T> {
  return fetch('GET', url, params, headers, opts);
}

export const getCityInfo = ({ longitude, latitude, ...rest }) => {
  return get<Pos>({
    url: 'https://restapi.amap.com/v3/geocode/regeo',
    params: {
      ...rest,
      key: systemInfo().webServerApiKey,
      location: `${longitude},${latitude}`,
      radius: 50,
    },
  });
};

export const geoAddrToLat = (address) => {
  return get({
    url: 'https://restapi.amap.com/v3/geocode/geo',
    params: {
      key: systemInfo().webServerApiKey,
      address,
    },
  });
};
