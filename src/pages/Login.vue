<template>
<div class="login">
  <el-header>
    <div class="title">
      <i class="el-icon-s-goods"></i>
      <span>电商管理系统</span>
    </div>
  </el-header>
  <el-main class="main">
    <el-row>
      <el-col :span="16">
          <img src="~@/assets/images/img.png" class="img">
      </el-col>
      <el-col :span="8">
        <div class="deng">
          <el-form class="form" ref="form" :model="form" label-width="80px" :rules="loginRules" label-position="top">
            <h3 class="login-title">电商管理系统</h3>
            <el-form-item label="用户名:" prop="username">
              <el-input v-model="form.username" style="width: 280px" placeholder="用户名"></el-input>
            </el-form-item>
            <el-form-item label="密码:" prop="password">
              <el-input v-model="form.password" type="password" show-password style="width: 280px" placeholder="密码"></el-input>
            </el-form-item>
            <el-form-item style="text-align: center">
              <el-button type="primary" @click="login()" class="button">登录</el-button>
              <el-button @click="reset()" class="button">重置</el-button>
            </el-form-item>
            <el-form-item class="forget"> <el-button type="text" plain @click="open">忘记密码</el-button></el-form-item>
          </el-form>

        </div>
      </el-col>
    </el-row>
  </el-main>

</div>
</template>

<script>
import {setItem} from "../utils/storage";

export default {
  name: "Login",
  data() {
    return {
      form: {
        username: '',
        password: ''
      },
      loginRules: {
        username: [
          {required: true, message: "请输入用户名", trigger: "blur"},
          {min: 4, max: 16, message: "用户名为4~16字符", trigger: "blur"}
        ],
        password: [
          {required: true, message: "请输入密码", trigger: "blur"},
          {min: 4, max: 16, message: "密码为4~16字符", trigger: "blur"}]
      }
    }
  },
  methods: {
    // 重置
    reset() {
      // this.form.password=''
      // this.form.username=''
      this.$refs.form.resetFields()
      //element组件提供的方法
    },

    //登录
    login() {
      console.log('登录');
      this.$refs.form.validate(async (valid) => {
        // console.log(valid);
        if(!valid) return;
        let { data: res } = await this.$http.post("login", this.form);
        // console.log(res);
        if(res.meta.status!==200){
          this.$message({
            message:"用户名或密码错误",
            type:"error",
            center:true
          })
        }else{
          this.$message({
            message:"登录成功",
            type:"success",
            center:true
          })
          this.$store.commit('setUsername',res.data.username)
          setItem('username',res.data.username)
          // 存储token信息
          setItem("token",res.data.token)
          this.$router.push({path:"/Home"})
        }

      })
    },
    //忘记密码提示
    open() {
      this.$notify({
        title: '提示',
        message: '用户名：admin,密码：123456',
        offset: 30
      });
    }
  }
}
</script>

<style scoped>
.el-header{
  background-color: #001529;
  height: 60px;
}
/*.deng{*/
/*  width: 550px;*/
/*}*/
.form{
  width: 330px;
  box-shadow: 10px 10px 5px #888888;
  height: 400px;
}
.login-title{
  text-align: center;
  position: relative;
  top: 16px;
  margin-bottom: 30px;
}
.el-form-item{
  margin: 8px 20px;
}
.button{
  margin-top: 30px;
  margin-right: 20px;
  margin-left: 20px;
  width: 100px;
}
.forget{
  float: right;
}
.main{
  height:calc(100vh - 60px) ;
}
.img{
  margin: 70px 150px;
}
.deng{
  margin-top: 45px;
}
.title{
  transform: translateX(10px);
  color: white;
  height: 100%;
}
.title span{
  font-size: 20px;
}
.title i{
  transform: translate(-8px,10px);
  font-size: 40px;
}
</style>
<style>
.el-form--label-top .el-form-item__label {
  float: none;
  display: inline-block;
  text-align: left;
  padding: 0 !important;
}
</style>