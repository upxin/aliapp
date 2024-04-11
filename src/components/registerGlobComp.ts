import type { App } from 'vue';
import {
  Table,
  Rate,
  Button,
  Cell,
  CellGroup,
  NoticeBar,
  Form,
  FormItem,
  Input,
  Step,
  Steps,
  TextArea,
  Range,
  InputNumber,
  Picker,
  Popover,
  Icon,
} from '@nutui/nutui-taro';

const compList = [
  Icon,
  Table,
  Popover,
  InputNumber,
  Picker,
  Rate,
  Range,
  TextArea,
  Step,
  Steps,
  Form,
  FormItem,
  NoticeBar,
  CellGroup,
  Button,
  Cell,
  Input,
];

export function registerGlobComp(app: App) {
  compList.forEach((comp) => {
    app.use(comp);
  });
}
