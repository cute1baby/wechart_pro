/**
 * 自定义导航，适配手机刘海儿
 * 把导航栏的高度信息存储在 globalData.navgationInfo 中，给页面使用
 * @param { Object } that 
 * @param { Object } system 手机系统信息
 */
export const navgationInfo = function (that, system) {
  var startBarHeight = 20;
  var navgationHeight = 44;
  var screen16x9 = false;
  // 判断手机是否为 16:9  范围±100
  let screenWidth = system.screenWidth
  let screenHeight = system.screenHeight
  let roundWidth = Math.round(screenWidth / 9 * 16)
  screen16x9 = (roundWidth == screenHeight || (roundWidth >= (screenHeight - 100) && roundWidth <= (screenHeight + 100)))

  // 导航栏高度 
  if (!screen16x9) { startBarHeight = 44 }

  return that.globalData.navgationInfo = {
    screen16x9,
    startBarHeight,   // 状态栏高度
    navgationHeight,  // 导航高度
    distanceTop: startBarHeight + navgationHeight // 导航总高度
  }
}