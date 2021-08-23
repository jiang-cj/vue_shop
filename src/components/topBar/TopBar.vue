<template>
<div class="top-bar">
  <div class="left">
    <i class="el-icon-eleme"></i>
    <span>电商管理系统</span>
  </div>
  <div class="center"></div>
  <div class="right">
    <el-popconfirm  title="确认退出登录?"
                    confirm-button-text="确定"
                    @confirm="layout()"
                    cancel-button-text="取消"
                    icon="el-icon-info"
                    icon-color="red" >
      <el-button slot="reference" size="mini">退出</el-button>
    </el-popconfirm>
  </div>
</div>
</template>

<script>
export default {
  name: "TopBar",
  methods:{
    layout(){
      // console.log('登出');
      window.sessionStorage.clear()
      this.$router.push({path:'/login'})
    }
  }
}
</script>

<style scoped>
.top-bar{
  display: flex;
  width: 100%;
}
.left{
  flex: 2;
  font-size: 15px;
  color: white;
  transform: translateX(-50px);
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