/**
 * 用户身份
 * top { String } 上级
 * user { String } 用户
 * below { String } 下属
 */
const role = {
  // top: '1',
  // user: '2',
  // below: '3'

  // 测试
  top: '1',
  user: '2',
  below: '3'
}

/**
 * 用户步骤的开启状态
 * unopened  未开启
 * study  做任务
 * finished  已完成
 * waitconfirm  待确认
 * reply  上级回复
 */
const stepStatus = {
  unopened: '0',
  study: '1',
  finished: '2',
  waitconfirm: '3',
  reply: '4'
}

/**
 * 步骤类型状态[目标计划： 1、向上级申请目标 2、上级确认目标 3、讨论计划反馈上级 4、上级回复 5、讨论计划下发下属 6、下属确认]
 * taskReply 回复页面
 * taskDetail 详情页面
 * allotTasks 分配任务
 */
const userActionPages = {
  1: 'studentReply/studentReply',
  3: 'studentReply/studentReply',
  7: 'studentReply/studentReply',
  2: 'taskReply/taskReply',
  4: 'taskReply/taskReply',
  6: 'taskReply/taskReply',
  5: 'allotTasks/allotTasks',
}
// 上下级步骤详情
const actionPages = {
  2: 'taskDetail/taskDetail',
  4: 'taskDetail/taskDetail',
  6: 'taskDetail/taskDetail',
  7: 'supsubTarget/supsubTarget'
}

/**
 * 消息通知
 * @return noticeType { Object }
 *  step: 小程序步骤详情
 *  h5  : H5
 *  task: 任务列表
 */
const noticeType = {
  step: '1',
  h5: '2',
  task: '3'
}


module.exports = {
  role,
  stepStatus,
  actionPages,
  userActionPages,
  noticeType
}