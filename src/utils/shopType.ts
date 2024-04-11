import {
  PRE_SALES_SERVICE_CENTER,
  PRE_SALES_CITY_EXHIBITION_HALL,
  CUSTOMER_SERVICE_REPAIR_SHOP,
  DIRECT_SHOP,
} from '@/utils/index';
import { homeStore } from '@/stores/home';
import { computed } from 'vue';

// 是否有售前属性
export function isPreSalesShop(type: number): boolean {
  return ((type ?? 0) & PRE_SALES_SERVICE_CENTER) == PRE_SALES_SERVICE_CENTER;
}
// 是否有售后属性
export function isAfter(type: number): boolean {
  return (
    ((type ?? 0) & CUSTOMER_SERVICE_REPAIR_SHOP) == CUSTOMER_SERVICE_REPAIR_SHOP
  );
}
const hasCar = computed(() => {
  return !!homeStore().state.cars?.length;
});

// 是否显示售后按钮
export function isDiaplayCsBtn(type): boolean {
  return isCustomerServiceShop(type) && (hasCar.value ?? false);
}

// 特约维修店（售后）
export function isCustomerServiceShop(type): boolean {
  return (
    ((type ?? 0) & CUSTOMER_SERVICE_REPAIR_SHOP) == CUSTOMER_SERVICE_REPAIR_SHOP
  );
}
// 是否销售服务中心
export function isPreSalesServiceCenter(type): boolean {
  return ((type ?? 0) & PRE_SALES_SERVICE_CENTER) == PRE_SALES_SERVICE_CENTER;
}
// 是否城市展厅
export function isPreSalesCityExhibitionHall(type): boolean {
  return (
    ((type ?? 0) & PRE_SALES_CITY_EXHIBITION_HALL) ==
    PRE_SALES_CITY_EXHIBITION_HALL
  );
}
// 是否直营店
export function isDirect(type): boolean {
  return ((type ?? 0) & DIRECT_SHOP) == DIRECT_SHOP;
}
