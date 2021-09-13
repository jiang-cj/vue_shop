<template>
  <div class="users">
    <!--  面包屑导航-->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/users'  }">用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <br>
    <el-card>
      <el-row :gutter="25">
        <el-col :span="7">
          <el-input
              placeholder="请输入内容"
              v-model="queryInfo.query" @clear="getUserList">
            <!--slot="append"  就是一个UI摆放的位置,其实就是封装的样式布局,append：代表放在紧贴在依赖组件的后面-->
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="7">
          <el-button type="primary" @click="dialogVisible = true">添加用户</el-button>
        </el-col>
      </el-row>
      <br>
      <!--    表格-->
      <el-table :data="tableData"  border>
        <el-table-column label="编号" type="index" width="50"></el-table-column>
        <el-table-column label="姓名" prop="username"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="电话" prop="mobile"></el-table-column>
        <el-table-column label="角色" prop="role_name"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-switch
                v-model="scope.row.mg_state"
                active-color="#13ce66"
                inactive-color="#dcdfe6" @change="userStateChanged(scope.row)">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="editShow(scope.row.id)">编辑</el-button>
            <el-button type="text" size="small" @click="deleteUser(scope.row.id)">删除</el-button>
            <el-button type="text" size="small" @click="distributeShow(scope.row)">分配</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!--分页-->
      <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="queryInfo.pagenum"
          :page-sizes="[5, 10, 20]"
          :page-size="5"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
      </el-pagination>
    </el-card>

    <!--  对话框-->
    <!--  添加用户按钮-->
    <el-dialog
        title="添加用户"  @close="addDialogClose"
        :visible.sync="dialogVisible"
        :before-close="handleClose" width="550px">

      <el-form ref="addform" :model="addform" label-width="80px" :rules="addrules">
        <el-form-item label="用户名:" prop="username">
          <el-input v-model="addform.username" ></el-input>
        </el-form-item>
        <el-form-item label="密码:" prop="password">
          <el-input v-model="addform.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱:" prop="email">
          <el-input v-model="addform.email"></el-input>
        </el-form-item>
        <el-form-item label="手机:" prop="mobile">
          <el-input v-model="addform.mobile"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="addformUser()">确定</el-button>
          <el-button @click="dialogVisible =false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!--  编辑按钮-->
    <el-dialog
        title="修改用户信息"
        :visible.sync="dialogVisible1"
        :before-close="handleClose" width="550px">

      <el-form ref="editform" :model="editform" label-width="80px" :rules="addrules">
        <el-form-item label="用户名:" prop="username">
          <el-input v-model="editform.username" disabled></el-input>
        </el-form-item>

        <el-form-item label="邮箱:" prop="email">
          <el-input v-model="editform.email"></el-input>
        </el-form-item>
        <el-form-item label="手机:" prop="mobile">
          <el-input v-model="editform.mobile"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="editUser">确定</el-button>
          <el-button @click="dialogVisible1=false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

<!--      分配角色-->
      <el-dialog
          title="分配角色"
          :visible.sync="dialogVisible2"
          :before-close="handleClose" width="550px">
        <div>
          <div style="margin-bottom: 10px">当前用户：{{userInfo.username}}</div>
          <div style="margin-bottom: 10px">当前角色：{{userInfo.role_name}}</div>
          <div>
            分配角色：
            <el-select
                v-model="selectRoleId"
                filterable
                allow-create
                default-first-option
                placeholder="请选择文章标签"
                size="mini"
            >
              <el-option
                  v-for="item in roleList"
                  :key="item.id"
                  :label="item.roleName"
                  :value="item.id">
              </el-option>
            </el-select>
          </div>
        </div>
        <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible2 = false">取 消</el-button>
            <el-button type="primary" @click="saveDelete">确 定</el-button>
          </span>

      </el-dialog>
  </div>
</template>

<script>
import {checkMobile} from "@/utils/validators";

export default {
  name: "Users",
  data(){
    return{
      queryInfo: {
        query: '',
        // 当前页数
        pagenum: 1,
        // 每页显示多少数据
        pagesize: 5
      },
      tableData:[],
      dialogVisible: false,
      dialogVisible1:false,
      dialogVisible2:false,
      addform:{
        username:'',
        password:'',
        email:'',
        mobile:''
      },
      editform:{},
      userInfo:{},
      selectRoleId:'',
      roleList:{},
      addrules: {
        username: [
          {required: true, message: '请输入用户名', trigger: 'blur'},
          {min: 2, max: 16, message: '长度在 2 到 16 个字符', trigger: 'blur'}
        ],
        password: [
          {required: true, message: '请输入密码', trigger: 'blur'},
          {min: 2, max: 16, message: '长度在 2 到 16 个字符', trigger: 'blur'}
        ],
        email: [
          {type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change']}
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' },
        ],
      },
      total:0
    }
  },
  methods:{
    // 用户列表api请求
    async getUserList(){
      const{ data:res } =await this.$http.get('users',{ params : this.queryInfo})
      // console.log(res);
      if(res.meta.status!==200){
        this.$message({
          message:'获取管理员列表失败',
          type:"error",
          center:true
        })
      }else{
        this.tableData = res.data.users
        this.total = res.data.total
      }
    },
    // 状态变化
    async userStateChanged(userInfo){
      const {data:res} = await this.$http.put(`users/${userInfo.id}/state/${userInfo.mg_state}`)
      // console.log(res);
      if(res.meta.status!==200){
        userInfo.mg_state = !userInfo.mg_state
        this.$message({
          message:res.meta.msg,
          type:"error",
          center:true
        })
      }else{
        this.$message({
          message:res.meta.msg,
          type:"success",
          center:true
        })
      }
    },
    // 新建
    addformUser(){
      this.$refs.addform.validate(async valid => {
        if (!valid) {
          this.$message({
            message: '新建失败',
            type: "error",
            center: true
          })
        }else{
          const { data: res } = await this.$http.post('users', this.addform)
          console.log(this.addform);
          console.log(res);
          this.$message({
            message:'用户添加成功',
            type:"success",
            center:true
          })
          this.getUserList()
          this.dialogVisible = false
        }
      })
},
    // 编辑显示
    async editShow(id){
      const {data:res} = await this.$http.put('users/'+id)
      // console.log(res);
      this.editform = res.data
      this.dialogVisible1 = true
    },
    // 编辑内容修改
    editUser(){
      this.$refs.editform.validate(async valid=>{
        if(!valid){
          this.$message({
            message:'编辑用户信息出错',
            type:"error",
            center:true
          })
        }else{
          const {data:res} = await this.$http.put('users/'+this.editform.id,{
            email:this.editform.email,
            mobile:this.editform.mobile
          })
          // console.log(res);
          if(res.meta.status!==200){
            this.$message({
              message:res.meta.msg,
              type:"error",
              center:true
            })
          }else{
            this.getUserList()
            this.dialogVisible1 = false
            this.$message({
              message:'修改成功',
              type:"success",
              center:true
            })
          }

        }
      })
    },
    // 删除
    async deleteUser(id){
      const result = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err=>err);

      if(result!=="confirm"){
        return this.$message({
          message:'取消删除',
          type:"error",
          center:true
        })
      }else{
        const{data:res} = await this.$http.delete('users/'+id)
        if(res.meta.status!==200){
          this.$message({
            message:'删除失败',
            type:"error",
            center:true
          })
        }else{
          this.$message({
            message:'删除成功',
            type:'success',
            center:true
          })
          this.getUserList()
        }
      }
    },
    // 监听 pagesize改变的事件
    handleSizeChange(newSize){
      // console.log(newSize);
      this.queryInfo.pagesize = newSize
      this.getUserList()
    },
    // 监听 页码值 改变事件
    handleCurrentChange(newSize){
      // console.log(newSize);
      this.queryInfo.pagenum = newSize
      this.getUserList()
    },
    // 对话框叉掉
    handleClose(done) {
      this.$confirm('确认关闭？')
          .then(_ => {// eslint-disable-line no-unused-vars
            done();
          })
          .catch(_ => {});// eslint-disable-line no-unused-vars
    },
    // 分配显示
    async distributeShow(role){
      const {data:res} = await this.$http.get('roles')
      if(res.meta.status!==200){
        this.$message({
          message:'获取分配信息失败',
          type:"error",
          center:true
        })
      }else{
        this.userInfo = role
        this.roleList = res.data
        console.log(role);
        console.log(res);
        this.dialogVisible2 = true
      }

    },
    //分配修改
    async saveDelete(){
      if(!this.selectRoleId){
        this.$message({
          message:'请选择要分配的角色',
          type:"error",
          center:true
        })
      }
      const {data:res} = await this.$http.put(`users/${this.userInfo.id}/role`,{
        rid:this.selectRoleId
      })

      if(res.meta.status!==200){
        this.$message({
          message:res.meta.msg,
          type:"error",
          center:true
        })
      }else{
        this.getUserList()
        this.dialogVisible2 = false
        this.$message({
          message:'分配成功',
          type:"success",
          center:true
        })
      }
    },
    // 监听添加用户对话框的关闭事件
    addDialogClose() {
      // 重置表单
      this.$refs.addform.resetFields()
    },
  },
  created() {
    this.getUserList()
  }
}

</script>

<style>
.el-table__body, .el-table__footer, .el-table__header {
  table-layout: fixed;
  border-collapse: separate;
  font-size: 12px;
}
</style>

<style scoped>
.el-form-item .el-input{
  width: 400px;
}
</style>