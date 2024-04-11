import Taro from '@tarojs/taro';
import { getStore } from './weapp';
import { systemInfo } from '../stores/systemInfo';
import { USER_INFO } from './constant';

export class JG {
  static SYS_001 = 'SYS_001'; // 启动时长分析,检测APP在不同机型上的性能
  static SYS_002 = 'SYS_002'; // PUSH开关统计
  static SYS_003 = 'SYS_003'; // APP流量
  static SYS_004 = 'SYS_004'; // APP耗电量

  /// 全局
  static ALL_001 = 'ALL_001'; // 日用户总数
  static ALL_002 = 'ALL_002'; // 日安装总数
  static ALL_003 = 'ALL_003'; // 新增用户区域(省份)
  static ALL_004 = 'ALL_004'; // 机型分布
  static ALL_005 = 'ALL_005'; // 版本分布
  static ALL_006 = 'ALL_006'; // 日使用用户数及次数-是否登录
  static ALL_007 = 'ALL_007'; // 日签到数
  static ALL_008 = 'ALL_008'; // 日签到率
  static ALL_009 = 'ALL_009'; // 连续N天打开
  static ALL_010 = 'ALL_010'; // 连续N天未打开
  static ALL_011 = 'ALL_011'; // PUSH消息打开

  /// 用户
  static USER_001 = 'USER_001'; // 昵称完善
  static USER_002 = 'USER_002'; // 驾照信息补充
  static USER_003 = 'USER_003'; // 修改头像
  static USER_004 = 'USER_004'; // 三方账号绑定
  static USER_005 = 'USER_005'; // 签到成功
  static USER_006 = 'USER_006'; // 登录方式
  static USER_007 = 'USER_007'; // 邀请好友
  static USER_008 = 'USER_008'; // OBU推广
  static USER_009 = 'USER_009'; // OBU推广-激活重试

  /// 线上订车
  static BOOK_001 = 'BOOK_001'; // 订车路径
  static BOOK_002 = 'BOOK_002'; // 订车信息填写
  static BOOK_003 = 'BOOK_003'; // 选配
  static BOOK_004 = 'BOOK_004'; // 下定-带信息

  /// 商城
  static MALL_001 = 'MALL_001'; // 商品详情页浏览统计(每个商品的浏览情况，带名称)
  static MALL_002 = 'MALL_002'; // 支付方式统计-是否带积分
  static MALL_003 = 'MALL_003'; // 商品分享-带商品名称
  static MALL_004 = 'MALL_004'; // 开发票-带类别金额积分

  /// 补能
  static CHARGE_001 = 'CHARGE_001'; // 电站列表浏览统计
  static CHARGE_002 = 'CHARGE_002'; // 电站筛选条件统计
  static CHARGE_003 = 'CHARGE_003'; // 电站地图浏览统计
  static CHARGE_004 = 'CHARGE_004'; // 开启充电-带电站
  static CHARGE_005 = 'CHARGE_005'; // 自动停止充电
  static CHARGE_006 = 'CHARGE_006'; // 异常终止充电
  static CHARGE_007 = 'CHARGE_007'; // 手动终止充电
  static CHARGE_008 = 'CHARGE_008'; // 开通充电钱包
  static CHARGE_009 = 'CHARGE_009'; // 购买充电币-是否用积分
  static CHARGE_010 = 'CHARGE_010'; // 收藏电站
  static CHARGE_011 = 'CHARGE_011'; // 开发票-购买充电币

  /// C端用车
  static CV_001 = 'CV_001'; // 车主绑车-手动/行驶证自动识别
  static CV_002 = 'CV_002'; // 司机绑车-手动/行驶证自动识别
  static CV_003 = 'CV_003'; // 编辑车辆档案
  static CV_004 = 'CV_004'; // 完善车辆保险信息
  static CV_005 = 'CV_005'; // 完善车辆维保里程
  static CV_006 = 'CV_006'; // 完善车辆维保里程
  static CV_007 = 'CV_007'; // 车辆档案中添加司机
  static CV_008 = 'CV_008'; // 查违章
  static CV_009 = 'CV_009'; // 车辆位置
  static CV_010 = 'CV_010'; // 车辆数据
  static CV_011 = 'CV_011'; // 分享车辆数据
  static CV_012 = 'CV_012'; // 历史轨迹
  static CV_013 = 'CV_013'; // 驾驶评分
  static CV_014 = 'CV_014'; // 故障
  static CV_015 = 'CV_015'; // 用车事件
  static CV_016 = 'CV_016'; // 司机联系车主
  static CV_017 = 'CV_017'; // 车主联系司机
  static CV_018 = 'CV_018'; // 一键维保-保养
  static CV_019 = 'CV_019'; // 一键维保-维修
  static CV_020 = 'CV_020'; // 保修手册
  static CV_021 = 'CV_021'; // 车主权益

  /// B端用车
  static BV_001 = 'BV_001'; // 以上所有C端用车的统计
  static BV_002 = 'BV_002'; // 车队
  static BV_003 = 'BV_003'; // 车队分享
  static BV_004 = 'BV_004'; // 车队添加-电车
  static BV_005 = 'BV_005'; // 车队添加-油车
  static BV_006 = 'BV_006'; // 车队添加-油车-激活重试
  static BV_007 = 'BV_007'; // 车队数据
  static BV_008 = 'BV_008'; // 停车热力图
  static BV_009 = 'BV_009'; // 数据排行
  static BV_010 = 'BV_010'; // 全量数据
  static BV_011 = 'BV_011'; // 所属车队
  static BV_012 = 'BV_012'; // 联系车队老板

  /// 咨询
  static NEWS_001 = 'NEWS_001'; // 阅读-带标题
  static NEWS_002 = 'NEWS_002'; // 阅读时长
  static NEWS_003 = 'NEWS_003'; // 文章分享

  /// 客服
  static CS_001 = 'CS_001'; // 400客服-使用位置
  static CS_003 = 'CS_003'; // 在线客服-使用位置

  /// 消息
  static MSG_001 = 'MSG_001'; // 车主同意司机绑定
  static MSG_002 = 'MSG_002'; // 消息查看

  /// 社区
  static COM_001 = 'COM_001'; // 发帖
  static COM_002 = 'COM_002'; // 浏览贴子-带标题
  static COM_003 = 'COM_003'; // 单篇阅读时长
  static COM_004 = 'COM_004'; // 点赞
  static COM_005 = 'COM_005'; // 评论
  static COM_006 = 'COM_006'; // 收藏
  static COM_007 = 'COM_007'; // 举报
}

export function createJGparams() {
  return {
    memberId: getStore(USER_INFO)?.member_id ?? 'noLogin',
    userName: getStore(USER_INFO)?.nickName ?? 'noLogin',
    mobile: getStore(USER_INFO)?.mobile ?? 'noLogin',
    platform: 'wx',
    device: systemInfo().app.system,
  };
}

export function jGcustomCount(id, opts: any = {}) {
  console.log('process.env.NODE_ENV', process.env.NODE_ENV);
  if (process.env.NODE_ENV === 'development') return;
  try {
    Taro.JAnalyticsInterface.onEvent({
      type: 'custom_counting',
      attributes: {
        event_id: id,
        // 用户自定义 key - value，不能与上面的 key 重复
        ...createJGparams(),
        ...opts,
      },
    });
  } catch (error) {
    console.log('error====report', error);
  }
}
