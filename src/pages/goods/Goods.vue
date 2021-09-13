<template>
  <div class="goods">
    <!--  面包屑导航-->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/goods'  }">商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <br>
    <el-card>
      <el-row :gutter="25">
        <el-col :span="7">
          <el-input
              placeholder="请输入内容"
              v-model="queryInfo.query" @clear="getGoodsList">
            <!--slot="append"  就是一个UI摆放的位置,其实就是封装的样式布局,append：代表放在紧贴在依赖组件的后面-->
            <el-button slot="append" icon="el-icon-search" @click="getGoodsList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="7">
          <el-button type="primary" @click="addGoods">添加商品</el-button>
        </el-col>
      </el-row>
      <br>
      <!--    表格-->
      <el-table :data="tableData"  border>
        <el-table-column type="expand">
          <!--        左边蓝色-->
          <template slot-scope="props" >
            <el-form label-position="left" inline class="demo-table-expand">
              <el-form-item label="商品名称">
                <span>{{props.row.goods_name}}</span>
              </el-form-item>
              <el-form-item label="商品价格">
                <span>{{ props.row.goods_price }}</span>
              </el-form-item>
              <el-form-item label="库存">
                <span>{{ props.row.goods_number }}</span>
              </el-form-item>
              <el-form-item label="重量">
                <span>{{ props.row.goods_weight }}</span>
              </el-form-item>
              <el-form-item label="商品状态">
                <span>{{ props.row.goods_state }}</span>
              </el-form-item>
              <el-form-item label="添加时间">
                <span>{{ props.row.add_time |dateFormat}}</span>
              </el-form-item>
              <el-form-item label="更新时间">
                <span>{{ props.row.upd_time |dateFormat }}</span>
              </el-form-item>
              <el-form-item label="是否为热销品">
                <i style="color:green;font-size:18px;" v-if="props.row.is_promote" class="el-icon-success"></i>
                <i style="color:red;font-size:18px;" v-else class="el-icon-error"></i>
              </el-form-item>
              <el-form-item label="热销品数量">
                <span>{{ props.row.hot_mumber }}</span>
              </el-form-item>

            </el-form>
          </template>
        </el-table-column>
        <el-table-column label="编号" type="index" width="50"></el-table-column>
        <el-table-column label="商品名称" prop="goods_name"></el-table-column>
        <el-table-column label="商品价格" prop="goods_price"></el-table-column>
        <el-table-column label="商品重量" prop="goods_weight"></el-table-column>
        <el-table-column label="创建时间" prop="add_time">
          <template slot-scope="scope">
            {{scope.row.add_time |dateFormat}}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="editShow(scope.row.goods_id)">编辑</el-button>
            <el-button type="text" size="small" @click="deleteUser(scope.row.goods_id)">删除</el-button>
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

    <el-dialog
        title="编辑商品信息"
        :visible.sync="dialogVisible"
        :before-close="handleClose" width="550px">

      <el-form ref="editGoods" :model="editGoods" label-width="90px" :rules="editGoodsRule">
        <el-form-item label="商品名称:" prop="goods_name">
          <el-input v-model="editGoods.goods_name" style="width: 400px"></el-input>
        </el-form-item>
        <el-form-item label="商品价格:" prop="goods_price">
          <el-input v-model="editGoods.goods_price" style="width: 400px"></el-input>
        </el-form-item>
        <el-form-item label="库存:" prop="goods_number">
          <el-input v-model="editGoods.goods_number" style="width: 400px" ></el-input>
        </el-form-item>
        <el-form-item label="商品重量:" prop="goods_weight">
          <el-input v-model="editGoods.goods_weight" style="width: 400px"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="editCon">确定</el-button>
          <el-button @click="dialogVisible =false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "goods",
  data(){
    return{
      queryInfo:{
        type:'',
        pagenum:1,
        pagesize:5
      },
      dialogVisible:false,
      total:0,
      tableData:[],
      editGoods:[],
      editGoodsRule:{
        goods_name:[
          { required: true, message: '请输入商品名称', trigger: 'blur' },
        ],
        goods_price:[
          { required: true, message: '请输入商品价格', trigger: 'blur' },
        ],
        goods_number:[
          { required: true, message: '请输入库存', trigger: 'blur' },
        ],
        goods_weight:[
          { required: true, message: '请输入商品重量', trigger: 'blur' },
        ]
      }
    }
  },
  methods:{
    //商品列表获取
    async getGoodsList() {
      const {data: res} = await this.$http.get('goods',{
        params:this.queryInfo
      })
      if (res.meta.status !== 200) {
        this.$message({
          message: res.meta.msg,
          type: "error",
          center: true
        })
      } else {
        this.tableData = res.data.goods
        // console.log(res);
        this.total = res.data.total
      }
    },
    // 监听 pagesize改变的事件
    handleSizeChange(newSize){
      // console.log(newSize);
      this.queryInfo.pagesize = newSize
      this.getGoodsList()
    },
    // 监听 页码值 改变事件
    handleCurrentChange(newSize){
      // console.log(newSize);
      this.queryInfo.pagenum = newSize
      this.getGoodsList()
    },
    // 根据 ID 查询商品
    async editShow(id){
      const {data:res} = await this.$http.get('goods/'+id)
      console.log(res);
      if (res.meta.status!==200){
        this.$message({
          message:res.meta.msg,
          type:"error",
          center:true
        })
      }else{
        this.editGoods = res.data
        this.dialogVisible =true
      }
    },
    // 编辑修改
    editCon(){
      this.$refs.editGoods.validate(async valid=>{
        if(!valid){
          this.$message({
            message:'请输入完整',
            type:"info",
            center:true
          })
        }else{
          const {data:res} = await this.$http.put('goods/'+ this.editGoods.goods_id,this.editGoods)
          if (res.meta.status!==200){
            this.$message({
              message:res.meta.msg,
              type:"error",
              center:true
            })
          }else{
            this.$message.success({
              message:'编辑成功',
              center:true
            })
            this.getGoodsList()
            this.dialogVisible = false
            }
        }
      })
    },
    //删除
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
        const {data:res} = await this.$http.delete('goods/'+id)
        if (res.meta.status!==200){
          this.$message({
            message:res.meta.msg,
            type:"error",
            center:true
          })
        }else{
            this.$message({
              message: res.meta.msg,
              type: "success",
              center: true
            })
            this.getGoodsList()
          }
        }
    },
    // 跳转至添加页面
    addGoods(){
      this.$router.push('/goods/add')
    },
    // 对话框叉掉
    handleClose(done) {
      this.$confirm('确认关闭？')
          .then(_ => {// eslint-disable-line no-unused-vars
            done();
          })
          .catch(_ => {});// eslint-disable-line no-unused-vars
    },
  },
  created() {
    this.getGoodsList()
  }
}
</script>

<style scoped>
.demo-table-expand {
  font-size: 0;
}
.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
</style>