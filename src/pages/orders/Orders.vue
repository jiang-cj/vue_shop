<template>
<div class="orders">
  <!--  面包屑导航-->
  <el-breadcrumb separator="/">
    <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>订单管理</el-breadcrumb-item>
    <el-breadcrumb-item :to="{ path: '/orders'  }">订单列表(修改地址未传至后端/无接口，物流状态写死)</el-breadcrumb-item>
  </el-breadcrumb>
  <br>
  <el-card>
    <el-row>
      <el-col :span="8">
        <el-input
            placeholder="输入0(未付款)或1(已付款)查询支付状态"
            v-model="queryInfo.pay_status" @clear="getOrderList">
          <!--slot="append"  就是一个UI摆放的位置,其实就是封装的样式布局,append：代表放在紧贴在依赖组件的后面-->
          <el-button slot="append" icon="el-icon-search" @click="getOrderList()"></el-button>
        </el-input>
      </el-col>
    </el-row>
    <br>
    <!--    表格-->
    <el-table :data="tableData"  border stripe>
      <el-table-column label="编号" type="index" width="50"></el-table-column>
      <el-table-column label="订单编号" prop="order_number"></el-table-column>
      <el-table-column label="订单价格" prop="order_price"></el-table-column>
      <el-table-column label="是否付款" prop="pay_status">
        <template slot-scope="scope">
          <el-tag type="warning" v-if="scope.row.pay_status ==='0'">未付款</el-tag>
          <el-tag type="success" v-else-if="scope.row.pay_status ==='1'">已付款</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="是否发货" prop="is_send"></el-table-column>
      <el-table-column label="下单时间" prop="create_time">
        <template slot-scope="scope">{{scope.row.create_time | dateFormat}}</template>
      </el-table-column>
      <el-table-column label="操作" widtd="180">
        <template>
          <el-button type="text" size="small" @click="editShow()">修改地址</el-button>
          <el-button type="text" size="small" @click="wuliu()">物流状态</el-button>
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

  <el-dialog title="修改地址" :visible.sync="dialogVisible" :before-close="handleClose" width="550px">
    <el-form ref="editForm" :model="editForm" label-width="80px" :rules="editRules">
      <el-form-item label="省市区县:" prop="address1">
        <el-cascader style="width: 400px"
            :options="cityOptions"
            :props="{expandTrigger: 'hover'}"
            v-model="editForm.address1"
        >
        </el-cascader>
      </el-form-item>
      <el-form-item label="详细地址:" prop="address2">
        <el-input v-model="editForm.address2" style="width: 400px"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="edit()">确定</el-button>
        <el-button @click="dialogVisible =false">取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>

  <el-dialog title="物流进度" :visible.sync="dialogVisible1" width="550px">
    <el-timeline>
      <el-timeline-item v-for="(activity, index) in progressInfo" :key="index" :timestamp="activity.time">
      {{activity.context}}
      </el-timeline-item>
    </el-timeline>
  </el-dialog>

</div>
</template>

<script>
import cityOptions from '@/pages/orders/city_data2017_element.js'
import kuaidi from '@/pages/orders/kuaidi.json'
export default {
  name: "orders",
  data(){
    return{
      queryInfo:{
        query:'',
        pagenum:1,
        pagesize:5,
        pay_status:''
      },
      tableData:[],
      total:0,
      editForm:{
        address1:'',
        address2:''
      },
      editRules:{},
      cityOptions:cityOptions,
      dialogVisible:false,
      dialogVisible1:false,
      progressInfo:[]
    }
  },
  methods:{
    //获取订单列表
    async getOrderList(){
      const {data:res} = await this.$http.get('orders',{params:this.queryInfo})
      // console.log(res);
      if(res.meta.status!==200){
        this.$message.error({
          message:res.meta.msg,
          center:true
        })
      }else{
        this.tableData = res.data.goods
        console.log(this.tableData);
        this.total = res.data.total
      }

    },
    //pagesize发生变化
    handleSizeChange(newSize){
      this.queryInfo.pagesize = newSize
      this.getOrderList()
    },
    //pageNum发生变化
    handleCurrentChange(newSize){
      this.queryInfo.pagenum = newSize
      this.getOrderList()
    },
    // 对话框叉掉
    handleClose(done) {
      this.$confirm('确认关闭？')
          .then(_ => {// eslint-disable-line no-unused-vars
            done();
          })
          .catch(_ => {});// eslint-disable-line no-unused-vars
    },
    //修改地址显示
    editShow(){
      this.dialogVisible = true
    },
    //修改地址确定
    edit(){
      this.$refs.editForm.validate(valid=>{
        if(valid){
          this.$message.success({
            message:'地址修改成功',
            center:true
          })
          this.dialogVisible = false
        }
      })

    },
    async getKuaidi(){
      this.progressInfo = kuaidi.data
      console.log(this.progressInfo);
    },
    wuliu(){
      this.dialogVisible1 = true
      this.getKuaidi()
    }
  },
  created() {
    this.getOrderList()
  }
}
</script>

<style scoped>

</style>