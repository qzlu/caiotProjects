<template>
    <div>
        <ul class="list">
            <li :class="{unnormal:item.AlarmCount}" v-for="(item,i) in systemList" :key="i">
                <h4>
                   <i :class="['iconfont',item.iconName]"></i>
                   <span>{{item.SystemParamName}}</span>
               </h4>
               <div class="list-content">
                   <div class="statu">
                   </div>
                   <ul class="param">
                       <li v-for="(obj,j) in item.data" :key="j">
                           <p class="l">
                               <i :class="['iconfont',obj.IconName]"></i>
                               {{obj.CountName}}
                           </p>
                           <span class="value">
                               {{obj.DeviceCount}} / {{obj.AlarmCount}}
                           </span>
                       </li>
                   </ul>
               </div>
            </li>
        </ul>
    </div>
</template>
<script>
export default {
    data(){
        return{

        }
    },
    props:{
        data:{
            type:Array
        }
    },
    computed:{
        systemList(){
            if(!Array.isArray(this.$props.data)) return []
            let arr = this.$props.data.map((item,i) => {
                let alarmObj = item.find(obj => obj.AlarmCount )
                return {
                    iconName:item[0].SystemParamIconName,
                    SystemParamName:item[0].SystemParamName,
                    AlarmCount:alarmObj?alarmObj.AlarmCount:0,
                    data:item
                }
            })
            arr.sort((a,b) => b.AlarmCount - a.AlarmCount)
            return arr
        }
    }
}
</script>