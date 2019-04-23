<template>
    <div class="system-manage">
        <ul class="nav">
            <li><router-link to="/system/projectManage" > <i class="iconfont icon-ZS-Projectmanagement"></i><span>项目管理</span></router-link></li>
            <li><router-link to="/system/fireManage"> <i class="iconfont icon-ZS-Firemanagement"></i><span>火警管理</span></router-link></li>
            <li><router-link to="/system/systemMange"> <i class="iconfont icon-ZS-Systemmanagement"></i><span>系统管理</span></router-link></li>
        </ul>
        <router-view>
        </router-view>
    </div>
</template>
<script>
export default {
    
}
</script>
<style lang="scss">
$img-url:'../../../assets/image/';
.system-manage{
    height: 100%;
    background: url(#{$img-url}device/bg_1.png);
    color: #48B3C8;
    a{
      color: #48B3C8;
    }
    .nav{
        width: 100%;
        height: 110px;
        line-height: 110px;
        padding-left: 256px;
        text-align: left;
        li{
            width: 166px;
            height: 52px;
            line-height: 42px;
            display: inline-block;
            vertical-align: middle;
            font-size: 20px;
            a{
                display: inline-block;
                width: 100%;
                height: 100%;
                text-align: center;
                border: 2px solid;
                border-radius: 4px;
                color: #FFFFFF
            }
            a.router-link-active{
                border-color: #b6cd61;   
                background:linear-gradient(to right,#5c5712,#9e942f,#5c5712)
            }
            i{
                position: relative;
                top: 4px;
                font-size: 30px;
                margin-right: 11px;
            }
        }
        li+li{
            margin-left: 122px;
        }
    }
}
</style>