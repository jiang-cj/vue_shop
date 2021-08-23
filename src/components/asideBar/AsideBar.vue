<template>
<div class="aside-bar">
  <el-menu :collapse="isCollapse"  :collapse-transition="false"  :unique-opened="true"
           :router="true" :default-active="activePath" style="width: 200px"
           background-color="#333744" text-color="white" active-text-color="#409FFF">
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
      window.sessionStorage.setItem("activePath",activePath)
    }
  },
  created() {
    this.activePath = window.sessionStorage.getItem('activePath')
  }
}
</script>

<style scoped>
.aside-bar{
  padding: 0;
  margin:0 ;
}
</style>