<template>
<div class="params">
  <!--  面包屑导航-->
  <el-breadcrumb separator="/">
    <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>商品管理</el-breadcrumb-item>
    <el-breadcrumb-item :to="{ path: '/params'  }">分类参数</el-breadcrumb-item>
  </el-breadcrumb>
  <br>

  <el-card>
    <el-alert
        title="注意：只允许为第三级分类设置相关参数!"
        type="info"
        effect="dark"
        :show-icon="true">
    </el-alert>
    <br>
    <el-row>
      <el-col>
        <span>选择商品分类：</span>
        <!-- 选择商品分类的级联选择框 -->
<!--        value / v-model	选中项绑定值	-	—	—-->
<!--        options	可选项数据源，键名可通过 Props 属性配置	array	—	—-->
<!--        props	配置选项，具体见下表	object	—	—-->
        <el-cascader
            v-model="paramsL"
            :options="options"
            :props="goodsProp"
            @change="handleChange"></el-cascader>
      </el-col>
    </el-row>
    <br>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="动态参数" name="many">
        <el-button type="primary" size="mini" style="margin-bottom: 10px" @click="dialogVisible=true" :disabled="isdisabled"> 添加参数</el-button>
        <el-table :data="manyTableData" border>
          <el-table-column type="expand">
            <template slot-scope="scope">
              <el-tag
                  :key="index"
                  class="el-tag-params"
                  v-for="(item,index) in scope.row.attr_vals"
                  closable
                  :disable-transitions="false"
                  @close="closeTag(scope.row,index)">
                {{item}}
              </el-tag>
              <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
              >
              </el-input>
              <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
            </template>
          </el-table-column>
          <el-table-column label="编号" type="index" width="60">
          </el-table-column>
          <el-table-column label="参数名称" prop="attr_name">
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="editShow(scope.row.attr_id)">编辑</el-button>
              <el-button type="text" size="small" @click="deleteParams(scope.row.attr_id)">删除</el-button>
            </template>
        </el-table-column>
        </el-table>
      </el-tab-pane>


      <el-tab-pane label="静态属性" name="only">
        <el-button type="primary" size="mini" style="margin-bottom: 10px"  @click="dialogVisible=true" :disabled="isdisabled"> 添加属性</el-button>
        <el-table :data="onlyTableData" border>
          <el-table-column type="expand">
            <template>

            </template>
          </el-table-column>
          <el-table-column label="编号" type="index" width="60">
          </el-table-column>
          <el-table-column label="属性名称" prop="attr_name">
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="editShow(scope.row.attr_id)">编辑</el-button>
              <el-button type="text" size="small" @click="deleteParams(scope.row.attr_id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
  </el-card>

  <el-dialog :title="'添加'+ activeTitle" :visible.sync="dialogVisible"
             :before-close="handleClose" width="550px" @close="addDialogClose">
    <el-form label-width="100px" ref="addForm" :model="addForm" :rules="addFormRules">
      <el-form-item :label="activeTitle+':'" prop="attr_name">
        <el-input v-model="addForm.attr_name"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="addParams">确定</el-button>
        <el-button @click="dialogVisible=false">取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>

  <el-dialog :title="'编辑'+ activeTitle" :visible.sync="dialogVisible1" :before-close="handleClose" width="550px">
    <el-form label-width="100px" ref="editForm" :model="editForm" :rules="addFormRules">
      <el-form-item :label="activeTitle+':'" prop="attr_name">
        <el-input v-model="editForm.attr_name"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="editParams">确定</el-button>
        <el-button @click="dialogVisible1=false">取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</div>
</template>

<script>
export default {
  name: "params",
  data(){
    return{
      goodsProp:{
        expandTrigger:'click',
        value:'cat_id',//指定真实选中的值
        label:'cat_name',//指定看见的值
        children:'children'//父子节点的嵌套属性
      },
      options:[],
      paramsL:'',
      manyTableData:[],
      onlyTableData:[],
      activeName:'many',
      dialogVisible:false,
      dialogVisible1:false,
      addForm: {
        attr_name:''
      },
      editForm:{},
      addFormRules:{
        attr_name:[
          {required:true,message:'请输入',trigger:'blur'}
        ]
      }
    }
  },
  methods:{
    //获取商品分类列表
    async getParamsList(){
      const {data:res} = await this.$http.get('categories')
      if(res.meta.status!==200){
        this.$message.error({
          message:res.meta.msg,
          center:true
        })
      }else{
        // console.log(res);
        this.options = res.data
        console.log(this.options);
      }
    },
    //选择商品分类列表变化时的判定
    handleChange(){
      if(this.paramsL.length!==3){
        this.$message.warning({
          message:'只能设置三级分类！',
          center:true
        })
        this.onlyTableData=[]
        this.manyTableData=[]
        this.paramsL=[]
        return
      }else{
        this.getParamsData()
      }
    },
    //根据选中获取数据
    async getParamsData(){
      const {data:res} = await this.$http.get(`categories/${this.cateId}/attributes`,{params:{sel:this.activeName}})
      if(res.meta.status!==200){
        this.$message.error({
          message:res.meta.msg,
          center:true
        })
      }else{
        console.log(res);
        res.data.forEach(item => {
          if(item.attr_vals){
            item.attr_vals = item.attr_vals.split(',')
            // 新增一个属性，控制文本框(New Tag)的显示与隐藏
            item.inputVisible = false
            // 文本框中输入的值
            item.inputValue = ''
          }else{
            // 新增一个属性，控制文本框(New Tag)的显示与隐藏
            item.inputVisible = false
            // 文本框中输入的值
            item.inputValue = ''
            item.attr_vals = []
          }
        });
        if(this.activeName ==='many'){
          this.manyTableData = res.data
        }else{
          this.onlyTableData = res.data
        }
      }
    },
    // 标签页切换
    handleClick(){
      if(this.paramsL.length===0){
        this.$message.warning({
          message:'请选择商品',
          center:true
        })
        return this.paramsL=[]
      }else{
        this.getParamsData()
      }
    },
    //添加
    addParams(){
      this.$refs.addForm.validate(async valid=>{
        if(!valid){
          this.$message.error({
            message:'请输入',
            center:true
          })
        }
        else {
          const {data:res}= await this.$http.post(`categories/${this.cateId}/attributes`,{
              attr_name:this.addForm.attr_name,
              attr_sel:this.activeName
            })
          if(res.meta.status!==201){
            this.$message.error({
              message:res.meta.msg,
              center:true
            })
          }else{
            this.$message.success({
              message:'添加成功',
              center:true
            })
            this.getParamsData()
            this.dialogVisible = false
          }
        }
      })
    },
    // 对话框叉掉
    handleClose(done) {
      this.$confirm('确认关闭？')
          .then(_ => {// eslint-disable-line no-unused-vars
            done();
          })
          .catch(_ => {});// eslint-disable-line no-unused-vars
    },
    //根据 ID 查询参数
    async editShow(attr_id){
      const {data:res} = await this.$http.get(`categories/${this.cateId}/attributes/${attr_id}`, {params:{
          attr_sel:this.activeName
        }})
      if(res.meta.status!==200){
        this.$message.error({
          message:res.meta.msg,
          center:true
        })
      }else{
        this.editForm = res.data
        // console.log(this.addForm);
        this.dialogVisible1 = true
      }
    },
    //确认编辑
    editParams(){
      this.$refs.editForm.validate(async valid=>{
        if(valid){
          const {data:res} = await this.$http.put(`categories/${this.cateId}/attributes/${this.editForm.attr_id}`,{
            attr_name:this.editForm.attr_name,
            attr_sel:this.activeName
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
            this.getParamsData()
            this.dialogVisible1=false
          }
        }
      })
    },
    //删除
    async deleteParams(id){
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
        const{data:res} = await this.$http.delete(`categories/${this.cateId}/attributes/${id}`)
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
          this.getParamsData()
        }
      }
    },
    //点击变为输入框
    showInput(info){
      info.inputVisible = true
      // 让文本框自动获得焦点
      // $nextTick 就是当页面上元素被重新渲染之后，才会执行回调函数中的代码
      this.$nextTick(item => {
        this.$refs.saveTagInput.$refs.input.focus()
        console.log(item);
      })
    },
    //确定添加
    handleInputConfirm(info){
      if(info.inputValue.length===0){
        info.inputVisible = false
        info.inputValue = ''
        return
      }else{
        info.attr_vals.push(info.inputValue)
        info.inputValue = ''
        info.inputVisible = false
        this.saveTag(info)
      }
    },
    async saveTag(info){
      const {data:res} = await this.$http.put(`categories/${this.cateId}/attributes/${info.attr_id}`,{
        attr_name:info.attr_name,
        attr_sel:info.attr_sel,
        attr_vals:info.attr_vals.join(',')
      })
      console.log(res);
      if(res.meta.status!==200){
        this.$message.error({
          message:res.meta.msg,
          center:true
        })
      }else{
        this.$message.success({
          message:res.meta.msg,
          center:true
        })
      }
    },
    //关闭删除
    async closeTag(info,index){
      const result =await this.$confirm(`此操作将永久删除该 <strong style="color:red;">${info.attr_vals[index]}</strong> 属性, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        dangerouslyUseHTMLString: true,
        type: 'warning'
      }).catch(res => res)

      // 取消删除
      if(result!=="confirm"){
        this.$message.error({
          message:'取消删除',
          center:true
        })
      }else{
        info.attr_vals.splice(index,1)
        this.saveTag(info)
      }
    },
    // 监听添加用户对话框的关闭事件
    addDialogClose() {
      // 重置表单
      this.$refs.addForm.resetFields()
    },

  },
  computed:{
    cateId(){
      if (this.paramsL.length === 3){
        return this.paramsL[2]
      }else{
        return null
      }
    },
    activeTitle(){
      if(this.activeName ==='many'){
        return "动态参数"
      }else{
        return '静态属性'
      }
    },
    isdisabled(){
      if (this.paramsL.length ===0){
        return true
      }else {
        return false
      }
    },

  },
  updated() {
    console.log(this.paramsL);
  },
  created() {
    this.getParamsList()
  }
}
</script>

<style scoped>
.el-tag-params{
  margin-right: 15px;
  margin-bottom: 10px;
}
.input-new-tag{
  width:120px
}
</style>