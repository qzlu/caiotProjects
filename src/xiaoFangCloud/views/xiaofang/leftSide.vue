<template>
    <div>
        <ul class="list">
            <li :class="{unnormal:item.AlarmKind == 1,'alarm':item.AlarmKind == 2}" v-for="(item,i) in systemList.slice(0,3)" :key="i">
                <h4>
                   <i :class="['iconfont',item.IconName]"></i>
                   <span>{{item.SystemParamName}}</span>
               </h4>
               <div class="list-content">
                   <div class="statu">
                   </div>
                   <ul class="param">
                       <li v-for="(obj,j) in item.mBlocHomePageCounts" :key="j">
                           <p class="l">
                               <i :class="['iconfont',obj.IconName]"></i>
                               {{obj.CountName}}
                           </p>
                           <span class="value">
                               <span :class="{red:obj.AlarmCount>0}">{{obj.AlarmCount}} </span>/ {{obj.DeviceCount}}
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
/*             if(!Array.isArray(this.$props.data)) return []
            let arr = this.$props.data.map((item,i) => {
                let alarmObj = item.find(obj => obj.AlarmCount )
                return {
                    iconName:item[0].SystemParamIconName,
                    SystemParamName:item[0].SystemParamName,
                    AlarmCount:alarmObj?alarmObj.AlarmCount:0,
                    data:item
                }
            }) */
            return this.$props.data.sort((a,b) => b.AlarmKind - a.AlarmKind)
        }
    }
}
</script>