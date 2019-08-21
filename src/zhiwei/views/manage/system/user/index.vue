<template>
    <div class="report user">
        <header>
            {{$route.name}}
        </header>
        <div class="main">
            <router-view></router-view>
        </div>
    </div>
</template>
<style lang="scss">
.user{
    header{
        padding-left: 10px;
        text-align: left;
        line-height: 44px;
        font-size: 22px;
        border-bottom: 1px solid rgba(143,156,191,1);
    }
    .main{
        height: 860px;
    }
}
</style>