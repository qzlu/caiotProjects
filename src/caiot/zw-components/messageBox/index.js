import Vue from 'vue';
import messageBox from './index.vue';
import { Dialog } from 'element-ui';
Vue.use(Dialog)
// 构造子类
const MessageBox = Vue.extend(messageBox)
// 创建实例
let	instance = new MessageBox({
    el: document.createElement('div')
});
let DeleteMessage = function(options,show = true){
    // 将参数传给msg
      if(typeof options === 'string') {
        instance.msg = options
      }else{
        instance.msg = options[0]
        instance.title=options[1]
      }
    
      // 显示组件
      instance.show = true
      instance.showConfirm = show
      // 插入页面
      document.body.appendChild(instance.$el)
      return new Promise((resolve,reject) => {
        instance.confirm = () => {
          instance.show = false
          resolve()
        }
        instance.cancle = () => {
          instance.show = false
          reject()
        }
      })
  }
  
  export default DeleteMessage;