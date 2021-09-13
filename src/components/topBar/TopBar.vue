<template>
<div class="top-bar">
  <div class="left" @click="fresh()">
    <i class="el-icon-s-goods"></i>
    <span>电商管理系统</span>
  </div>
  <div class="center"></div>
  <div class="right">
    <el-dropdown @command="handleCommand" trigger="click">
      <span class="el-dropdown-link" style="color: white;cursor: pointer">
        欢迎您：<span>{{username}}</span>
      </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item command="a">welcome</el-dropdown-item>
        <a href="https://gitee.com/jiang-cj/vue_shop.git" target="_blank" style="text-decoration:none">
          <el-dropdown-item command="c">my gitee</el-dropdown-item>
        </a>

        <el-dropdown-item divided command="b">退出登录</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</div>
</template>

<script>
import {setItem} from "../../utils/storage";

export default {
  name: "TopBar",
  props:{
    username:{
      type:String,
    }
  },
  methods:{
    handleCommand(command){
      switch (command){
        case 'a': this.welcome()
              break;
        case 'b':this.layout()
              break;
      }
    },
    //进入welcome页面
    welcome(){
      this.$router.push({path:'/welcome'})
      setItem('activePath','/welcome')
      location.reload()
    },
    //退出登录
    layout(){
      this.$store.commit('setUsername',false)
      window.sessionStorage.clear()
      this.$router.push({path:'/login'})
    },
    fresh(){
      this.$emit('fresh',1)
    }
  },
}
</script>

<style scoped>
.top-bar{
  display: flex;
  width: 100%;
  height: 100%;
}
.left{
  flex: 2;
  color: white;
  transform: translateX(-30px);
  height: 100%;
  cursor: pointer;
}
.left span{
  font-size: 20px;
}
.left i{
  transform: translate(-8px,10px);
  font-size: 40px;
}
.center{
  flex: 8;
}
.right{
  flex: 1;
}
</style>