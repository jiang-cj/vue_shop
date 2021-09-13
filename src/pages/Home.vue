<template>
<div class="home">
  <el-container>
    <!--顶部-->
    <el-header>
      <top-bar class="top-bar" :username = username @fresh="fresh"></top-bar>
    </el-header>
    <el-container>
      <!--      测导航栏-->
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <div class="toggle-button" @click="toggleCollapse">|||</div>
        <aside-bar :menus="menu" :isCollapse="isCollapse" ></aside-bar>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</div>
</template>

<script>
import TopBar from "../components/topBar/TopBar";
import AsideBar from "../components/asideBar/AsideBar";
import {mapGetters} from 'vuex'
export default {
  name: "Home",
  data(){
    return{
      menu:[],
      isCollapse:false
    }
  },
  computed:{
    ...mapGetters({
      username:'username'
    })
  },
  components:{
    TopBar,
    AsideBar
  },
  methods:{
    async getMenu(){
      const {data:res} = await this.$http.get('menus')
      // console.log(res);
      if (res.meta.status!==200){
              this.$message({
                message:'导航信息获取失败',
                type:"error"
              })
            }else {
              this.menu = res.data
            }
    },
    //导航栏收缩
    toggleCollapse(){
      this.isCollapse = !this.isCollapse
    },
    //点击图标刷新
    fresh(){
      location.reload()
    }
  },
  created(){
    this.getMenu()
  }
}
</script>

<style scoped>
.el-header {
  background-color: #001529;
  color:#001529;
  text-align: center;
  line-height: 80px;
}
.el-container{
  height:100vh;
}

.el-aside {
  background-color: #001529;
}
.el-main{
  background-color: #eaedf1;
}
.top-bar{
  transform: translateY(-10px);
}
.toggle-button{
  background-color: #1d2e46;
  font-size: 10px;
  line-height: 30px;
  color: #fff;
  text-align: center;
  /*字母间距*/
  letter-spacing: 0.2em;
  /* 鼠标放上去变成小手*/
  cursor: pointer;
}
</style>
<style>
</style>