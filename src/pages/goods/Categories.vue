<template>
<div class="categories">
  <!--  面包屑导航-->
  <el-breadcrumb separator="/">
    <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>商品管理</el-breadcrumb-item>
    <el-breadcrumb-item :to="{ path: '/categories'  }">商品分类</el-breadcrumb-item>
  </el-breadcrumb>
  <br>
  <el-card>
    <el-row>
      <el-col>
        <el-button type="primary" @click="addCate">添加分类</el-button>
      </el-col>
    </el-row>
    <br>
    <!-- 表格 -->
    <!-- columns 表格各列的配置 -->
    <!-- selection-type 是否为多选类型表格 -->
    <!-- expand-type 是否为展开行类型-->
    <tree-table :data="cateList" :columns="columns" :selection-type="false" :expand-type="false" show-index index-text="编号" :show-row-hover="false" border>
      <!-- 是否有效 -->
      <template slot="isOk" slot-scope="scope">
        <i v-if="scope.row.cat_deleted === false" class="el-icon-success" style="color: lightgreen; font-size: 22px"></i>
        <i v-else class="el-icon-error" style="color: red; font-size: 22px"></i>
      </template>
      <!-- 排序 -->
      <template slot="order" slot-scope="scope">
        <el-tag effect="dark" v-if="scope.row.cat_level === 0" type="primaruy" >一级</el-tag>
        <el-tag effect="dark" v-else-if="scope.row.cat_level === 1" type="success">二级</el-tag>
        <el-tag effect="dark" v-else type="warning">三级</el-tag>
      </template>

      <!-- 操作 -->
      <template slot="opt" slot-scope="scope">
        <el-button size="mini" type="primary" icon="el-icon-edit" @click="showEdit(scope.row.cat_id)">编辑</el-button>
        <el-button size="mini" type="danger" icon="el-icon-delete" @click="removeCate(scope.row.cat_id)">删除</el-button>
      </template>
    </tree-table>

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

  <el-dialog
      title="添加分类" @close="addDialogClose"
      :visible.sync="dialogVisible"
      :before-close="handleClose" width="550px">
    <el-form ref="addformr" :model="addform" label-width="80px" :rules="addrules">
      <el-form-item label="分类名称:" prop="cat_name">
        <el-input v-model="addform.cat_name" style="width: 400px"></el-input>
      </el-form-item>
      <el-form-item label="父级分类:">
        <!-- options 用来指定数据源 -->
        <!-- props 用来指定配置对象 -->
        <el-cascader placeholder="默认添加至一级分类"  change-on-select v-model="selectedKeys"
                     :options="ParentCateList" :props="cascaderProps" style="width: 400px"
                     clearable @change="cateParentChange"></el-cascader>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="addformUser()">确定</el-button>
        <el-button @click="dialogVisible =false">取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>

  <!-- 编辑分类对话框 -->
  <el-dialog title="编辑分类对话框" :visible.sync="dialogVisible1" width="550px" :before-close="handleClose">
    <el-form :model="editForm" :rules="editFormRules" ref="editForm" label-width="80px">
      <el-form-item label="分类名称:" prop="cat_name">
        <el-input v-model="editForm.cat_name"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible1 = false">取 消</el-button>
        <el-button type="primary" @click="edit">确 定</el-button>
      </span>
  </el-dialog>
</div>
</template>

<script>
export default {
  name: "categories",
  data(){
    return{
      cateList:[],
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name'
        },
        {
          label: '是否有效',
          // 当前列 自定义模板
          type: 'template',
          template: 'isOk'
        },
        {
          label: '排序',
          // 当前列 自定义模板
          type: 'template',
          template: 'order'
        },
        {
          label: '操作',
          // 当前列 自定义模板
          type: 'template',
          template: 'opt'
        }
      ],
      queryInfo:{
        type:3,
        pagenum:1,
        pagesize:5
      },
      total:0,
      addform:{
        cat_pid:0,
        cat_name:'',
        cat_level:0
      },
      addrules:{},
      // 父级分类的数据列表
      ParentCateList:[],
      // 指定级联选择器的配置对象
      cascaderProps:{
        expandTrigger: 'hover',
        value:'cat_id',//真实选中的是什么
        label:'cat_name', //看到的是什么
        children:'children' //父子嵌套的属性
      },
      // 级联选择器中选中的id值
      selectedKeys:[],
      dialogVisible:false,
      dialogVisible1:false,
      editForm:{},
      editFormRules:{}
    }
  },
  methods:{
    //获取列表
    async getCate(){
      const {data:res} = await this.$http.get('categories', {params: this.queryInfo})
      //console.log(res);
      if(res.meta.status!==200){
        this.$message.error({
          message:res.meta.msg,
          center:true
        })
      }else{
        this.cateList = res.data.result
        this.total = res.data.total
      }
    },
    // 监听 pagesize改变的事件
    handleSizeChange(newSize){
      // console.log(newSize);
      this.queryInfo.pagesize = newSize
      this.getCate()
    },
    // 监听 页码值 改变事件
    handleCurrentChange(newSize){
      // console.log(newSize);
      this.queryInfo.pagenum = newSize
      this.getCate()
    },
    // 对话框叉掉
    handleClose(done) {
      this.$confirm('确认关闭？')
          .then(_ => {// eslint-disable-line no-unused-vars
            done();
          })
          .catch(_ => {});// eslint-disable-line no-unused-vars
    },
    //分类父类列表数据获取
    async getParentCateList(){
      const {data:res} = await this.$http.get('categories', {params: {
        type:2
        }})
      //console.log(res);
      if(res.meta.status!==200){
        this.$message.error({
          message:res.meta.msg,
          center:true
        })
      }else{
        this.ParentCateList = res.data
      }
    },
    //添加分类
    addCate(){
      this.dialogVisible = true
      this.getParentCateList()
    },
    //实时判断此时选择的id，level
    cateParentChange(){
      if(this.selectedKeys.length>0){
        this.addform.cat_pid = this.selectedKeys[this.selectedKeys.length-1]
        this.addform.cat_level = this.selectedKeys.length
      }else{
        this.addform.cat_pid = 0
        this.addform.cat_level = 0
      }
    },
    // 确认添加
    addformUser(){
      this.$refs.addformr.validate(async valid=>{
        //console.log(this.addform);
        if(valid){
          const {data:res} = await this.$http.post('categories',this.addform)
          if(res.meta.status!==201){
            this.$message.error({
              message:res.meta.msg,
              center:true
            })
          }else{
            this.dialogVisible = false
            this.getCate()
            this.$message.success({
              message:'商品分类添加成功',
              center:true
            })
          }
        }
      })
    },
    //显示编辑
    async showEdit(id){
      this.dialogVisible1 = true
      const {data:res}= await this.$http.get('categories/'+id)
      if(res.meta.status!==200){
        this.$message.error({
          message:res.meta.msg,
          center:true
        })
      }else{
        this.editForm = res.data
      }
    },
    //确认编辑
    edit(){
      this.$refs.editForm.validate(async valid=>{
        if(valid){
          const {data:res} = await this.$http.put('categories/'+this.editForm.cat_id,{
            cat_name:this.editForm.cat_name
          })
          if(res.meta.status!==200){
            this.$message.error({
              message:res.meta.msg,
              center:true
            })
          }else{
            this.$message.success({
              message:'编辑成功',
              center:true
            })
            this.dialogVisible1 = false
            this.getCate()
          }
        }
      })
    },
    async removeCate(id){
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
        const{data:res} = await this.$http.delete('categories/'+id)
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
          this.getCate()
        }
      }
    },
    // 监听添加用户对话框的关闭事件
    addDialogClose() {
      // 重置表单
      this.$refs.addformr.resetFields()
    },
  },
  created() {
    this.getCate()
  }
}
</script>

<style scoped>

</style>