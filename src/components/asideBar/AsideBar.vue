<template>
<div class="aside-bar">
  <el-menu :collapse="isCollapse"  :collapse-transition="false"  :unique-opened="true"
           :router="true" :default-active="activePath" style="width: 100%"
           background-color="#001529" text-color="white" active-text-color="#409FFF">
    <el-menu-item index="/welcome" @click="savePath('/welcome')" class="shouye">
      <i class="el-icon-data-line"></i>
      <span>管理首页</span>
    </el-menu-item>
    <el-submenu :index="item.id+''" v-for="(item,index) in menus"  :key="index">
      <template slot="title">
        <i :class="itemC[index]"></i>
        <span>{{ item.authName }}</span>
      </template>
      <el-menu-item :index="'/'+menu.path" v-for="(menu,i) in item.children" :key="i"  @click="savePath('/'+menu.path)">
        <template slot="title">
          <i class="el-icon-star-on"></i>
          <span>{{menu.authName}}</span>
        </template>
      </el-menu-item>
    </el-submenu>
  </el-menu>

</div>
</template>

<script>
import {setItem,getItem} from "../../utils/storage";

export default {
  name: "AsideBar",
  props:{
    menus:{
      type:Array
    },
    isCollapse:{
      type:Boolean,
      default:false
    }
  },
  data(){
    return{
      activePath:'',
      itemC:["el-icon-user-solid","el-icon-paperclip","el-icon-menu","el-icon-s-shop","el-icon-s-operation"]
    }
  },
  methods:{
    // 保存连接的激活地址
    savePath(activePath){
      setItem("activePath",activePath)
    }
  },
  created() {
    this.activePath = getItem('activePath')
  }
}
</script>

<style scoped>
.aside-bar{
  padding: 0;
  margin:0 ;
}
.shouye{
  font-size: 14px;
  color: #303133;
  padding: 0 20px;
  cursor: pointer;
  transition: border-color .3s,background-color .3s,color .3s;
  box-sizing: border-box;
}
</style>