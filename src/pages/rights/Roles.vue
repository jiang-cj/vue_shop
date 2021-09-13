<template>
<div class="roles">
  <!--  面包屑导航-->
  <el-breadcrumb separator="/">
    <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>权限管理</el-breadcrumb-item>
    <el-breadcrumb-item  :to="{ path: '/roles'  }">角色列表</el-breadcrumb-item>
  </el-breadcrumb>
  <br>
  <el-card>
    <el-row>
      <el-col>
        <el-button type="primary" @click="dialogVisible = true">添加角色</el-button>
      </el-col>
    </el-row>
    <br>
<!--表格-->
    <el-table :data="tableData" border>
      <el-table-column type="expand">
<!--        左边蓝色-->
        <template slot-scope="scope" >
          <el-row v-for="(item,index) in scope.row.children"
                  :key="index" :class="[index===0 ?'bd-top':'','bd-bottom','v-center']">
            <el-col :span="5" :class="['']">
              <el-tag closable @close="removeRightById(scope.row,item.id)">{{item.authName}}</el-tag>
              <i class="el-icon-caret-right"></i>
            </el-col>

              <el-col :span="19">
                <el-row v-for="(item1,index1) in item.children" :key="index1"
                        :class="[index1===0 ? '':'bd-top','v-center']">
                  <el-col :span="8">
                    <el-tag  closable type="success" @close="removeRightById(scope.row,item1.id)">{{item1.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>

                  <el-col :span="16">
                    <el-tag v-for="(item2,index2) in item1.children" :key="index2" closable type="danger" @close="removeRightById(scope.row,item2.id)">
                      {{item2.authName}}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>

          </el-row>
        </template>
      </el-table-column>
      <el-table-column label="编号" type="index" width="50"></el-table-column>
      <el-table-column label="角色名称" prop="roleName"></el-table-column>
      <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="editShow(scope.row.id)">编辑</el-button>
          <el-button type="text" size="small" @click="deleteUser(scope.row.id)">删除</el-button>
          <el-button type="text" size="small" @click="distributeShow(scope.row)">分配</el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-card>

<!--  添加角色-->
  <el-dialog title="添加角色" @close="addDialogClose"
             :visible.sync="dialogVisible"
             :before-close="handleClose" width="550px">
    <el-form ref="addRoles" :model="roleForm" label-width="80px" :rules="roleRules">
      <el-form-item label="角色名称" prop="roleName">
        <el-input v-model="roleForm.roleName"></el-input>
      </el-form-item>
      <el-form-item label="角色描述" prop="roleDesc">
        <el-input v-model="roleForm.roleDesc"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="addRole">确定</el-button>
        <el-button @click="dialogVisible1=false">取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
<!--  编辑角色-->
  <el-dialog title="编辑角色"
             :visible.sync="dialogVisible1"
             :before-close="handleClose" width="550px">
    <el-form ref="editRoles" :model="editForm" label-width="80px" :rules="roleRules">
      <el-form-item label="角色名称" prop="roleName">
        <el-input v-model="editForm.roleName"></el-input>
      </el-form-item>
      <el-form-item label="角色描述" prop="roleDesc">
        <el-input v-model="editForm.roleDesc"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="editRole">确定</el-button>
        <el-button @click="dialogVisible1=false">取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
<!--  分配权限-->
  <el-dialog title="分配权限"
             :visible.sync="dialogVisible2"
             :before-close="handleClose" width="550px">
    <el-tree ref="treeList" :data="treeList" :props="treeProps" show-checkbox :highlight-current="true"
             node-key="id" :default-expand-all="true" :default-checked-keys="activeKeys"></el-tree>
    <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible2 = false">取 消</el-button>
        <el-button type="primary" @click="allotRights">确 定</el-button>
      </span>
  </el-dialog>
</div>
</template>

<script>
export default {
  name: "RoleList",
  data(){
    return{
      tableData: [],
      dialogVisible:false,
      dialogVisible1:false,
      dialogVisible2:false,
      roleForm:{
        roleName:'',
        roleDesc:''
      },
      editForm:{},
      roleRules:{
        roleName: [
          { required: true, message: "请输入角色名称", trigger: "blur" },
        ],
        roleDesc: [
          { required: true, message: "请输入角色描述", trigger: "blur" },
        ],
      },
      treeList:[],
      treeProps:{
        label:"authName",
        children:'children'
      },
      // 树节点默认选中的id节点数组
      activeKeys:[],
      roleId:'',
    }
  },
  methods:{
    // 角色列表获取
    async getRoleList(){
      const {data:res} = await this.$http.get('roles')
      // console.log(res)
      if(res.meta.status!==200){
        this.$message({
          message:'获取角色列表失败',
          type:"error",
          center:true
        })
      }else{
        this.tableData = res.data
      }
    },
    // 添加角色
    addRole(){
      this.$refs.addRoles.validate(async valid=>{
        if(!valid){
          this.$message({
            message:'请输入完整',
            type:"error",
            center:true
          })
        }else{
          const {data:res} = await this.$http.post('roles',this.roleForm)
          if(res.meta.status!==201){
            this.$message({
              message:res.meta.msg,
              type:"error",
              center:true
            })
          }else{
            this.$message({
              message:'添加成功',
              type:"success",
              center:true
            })
            this.dialogVisible = false
            this.getRoleList()
          }
        }
      })
    },
    //根据ID查找角色
    async editShow(id){
      const {data:res} = await this.$http.get('roles/'+id)
      console.log(res)
      if(res.meta.status!==200){
        this.$message({
          message:res.meta.msg,
          type:"error",
          center:true
        })
      }else{
        this.editForm = res.data
        this.dialogVisible1= true
      }
    },
    //编辑修改
    editRole(){
      this.$refs.editRoles.validate(async valid=> {
        if (!valid) {
          this.$message({
            message: '请输入完整',
            type: "error",
            center: true
          })
        } else {
          const {data:res} =await this.$http.put('roles/'+this.editForm.roleId,{
            roleName:this.editForm.roleName,
            roleDesc:this.editForm.roleDesc
          })
          if(res.meta.status!==200){
            this.$message({
              message:res.meta.msg,
              type:"error",
              center:true
            })
          }else{
            this.$message({
              message:'修改成功',
              type:"success",
              center:true
            })
            this.getRoleList()
            this.dialogVisible1 = false
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
      }else {
        const {data: res} = await this.$http.delete('roles/' + id)
        if (res.meta.status !== 200) {
          this.$message({
            message: '删除失败',
            type: "error",
            center: true
          })
        } else {
          this.$message({
            message: '删除成功',
            type: 'success',
            center: true
          })
        }
      this.getRoleList()
      }
    },
    // 所有权限列表
    async distributeShow(userInfo){
      this.roleId = userInfo.id
      const {data:res} = await this.$http.get('rights/tree')
      if(res.meta.status!==200){
        this.$message({
          message:'获取权限列表失败',
          type:"error",
          center:true
        })
      }else{
        this.treeList = res.data
        this.dialogVisible2 = true
        this.getActiveKeys(userInfo,this.activeKeys)
      }
    },
    // 通过递归 获取角色下三级权限的 id, 并保存到defKeys数组
    getActiveKeys(node,arr){
      // 如果当前node节点不包含children属性，则是三级节点
      if(!node.children){
        return arr.push(node.id)
      }
      node.children.forEach(item => {
        this.getActiveKeys(item,arr)
      })
    },
    // 权限分配
    async allotRights(){
      const key=[
          ...this.$refs.treeList.getCheckedKeys(),
          ...this.$refs.treeList.getHalfCheckedKeys()
      ]
      const ikey = key.join(',')
      const {data:res} = await this.$http.post(`roles/${this.roleId}/rights`,{
        rids:ikey
      })
      if(res.meta.status!==200){
        this.$message({
          message:res.meta.msg,
          type:"error",
          center:true
        })
      }else{
        this.$message({
          message:'分配成功',
          type:"success",
          center:true
        })
        this.getRoleList()
        this.dialogVisible2 = false
      }
    },
    // 单个删除
    async removeRightById(role,rightId){
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
      }else {
        const {data: res} = await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
        if (res.meta.status !== 200) {
          this.$message({
            message: '删除失败',
            type: "error",
            center: true
          })
        } else {
          this.$message({
            message: '删除成功',
            type: 'success',
            center: true
          })
        }
        role.children = res.data
      }
    },
    // 对话框叉掉
    handleClose(done) {
      this.$confirm('确认关闭？')
          .then(_ => {// eslint-disable-line no-unused-vars
            done();
          })
          .catch(_ => {});// eslint-disable-line no-unused-vars
    },
    // 监听添加用户对话框的关闭事件
    addDialogClose() {
      // 重置表单
      this.$refs.addRoles.resetFields()
    },
  },
  created() {
    this.getRoleList()
  }
}
</script>

<style scoped>
.bd-top{
  border-top: 1px solid #eee;
}
.bd-bottom{
  border-bottom: 1px solid #eee;
}
.v-center{
  display: flex;
  align-items: center;
}
.el-tag{
  margin: 7px;
}
</style>