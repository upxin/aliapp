import { get } from '@/utils/index';

export function getCode({ mobile }) {
  return get({
    url: '/member/sms/register/code',
    params: {
      mobile,
    },
  });
}

export function activity() {
  return get({
    url: '/vehicle/newActive/userActivityList',
    params: {},
  });
}
export function closeActivity(activityId) {
  return get({
    url: '/vehicle/newActive/changeActivePush',
    params: { activityId },
  });
}
