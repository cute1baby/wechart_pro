// components/demo.js
import { watch} from "../utils/util.js"
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    number: {
      type: Number
    },
    newObj: {
      type: Object
    }
  },

  ready: function(){
    watch(this, {
      number: function (newNum) {
        let name = "";
        if (newNum < 4){
          name = "张三";
        } else if (newNum < 8){
          name = "李四";
        } else {
          name = "王二麻子";
        }
        this.setData({
          name
        })
      },
      newObj: function (newVal) {
        console.log("newVal=====", newVal);
      },
    })
  },
  /**
   * 组件的初始数据
   */
  data: {
    name: "暂位名称"
  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})
