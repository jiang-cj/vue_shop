<template>
<div class="add">
  <!--  面包屑导航-->
  <el-breadcrumb separator="/">
    <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>商品管理</el-breadcrumb-item>
    <el-breadcrumb-item :to="{ path: '/goods'  }">商品列表</el-breadcrumb-item>
    <el-breadcrumb-item>添加商品</el-breadcrumb-item>
  </el-breadcrumb>
  <br>
  <el-card>
    <el-alert
        title="添加商品信息"
        type="info"
        center
        show-icon>
    </el-alert>

    <el-steps :active="active" finish-status="success" simple style="margin-top: 20px">
      <el-step title="基本信息"></el-step>
      <el-step title="商品参数"></el-step>
      <el-step title="商品属性"></el-step>
      <el-step title="商品图片"></el-step>
      <el-step title="商品内容"></el-step>
    </el-steps>
    <br>


    <el-form ref="goodsInfo" :model="goodsInfo" :rules="goodsRules">
<!--基本信息-->
      <div v-if="active==0">
        <el-form-item label="商品名称:" prop="goods_name">
          <el-input v-model="goodsInfo.goods_name" ></el-input>
        </el-form-item>
        <el-form-item label="商品价格:" prop="goods_price">
          <el-input v-model="goodsInfo.goods_price" ></el-input>
        </el-form-item>
        <el-form-item label="商品重量:" prop="goods_weight">
          <el-input v-model="goodsInfo.goods_weight" ></el-input>
        </el-form-item>
        <el-form-item label="商品数量:" prop="goods_number">
          <el-input v-model="goodsInfo.goods_number" ></el-input>
        </el-form-item>
        <el-form-item label="商品分类" prop="goods_cat">
          <el-cascader
              v-model="goodsInfo.goods_cat"
              :options="cartList"
              :props="cateProps"
              @change="handleChange"></el-cascader>
        </el-form-item>
        <el-form-item>
          <el-button style="margin-top: 12px;" @click="unext">上一步</el-button>
          <el-button style="margin-top: 12px;" @click="next">下一步</el-button>
        </el-form-item>
      </div>
<!--参数信息-->
      <div v-else-if="active==1">
        <el-form-item :label="item.attr_name" v-for="(item,index) in manyTableData" :key="index">
          <el-checkbox-group v-model="item.attr_vals">
            <el-checkbox :label="i" border v-for="(i,index1) in item.attr_vals" :key="index1"></el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item>
          <el-button style="margin-top: 12px;" @click="unext">上一步</el-button>
          <el-button style="margin-top: 12px;" @click="next1">下一步</el-button>
        </el-form-item>
      </div>
<!--商品参数-->
      <div v-else-if="active==2">
        <el-form-item :label="item.attr_name" v-for="(item,index) in onlyTableData" :key="index">
          <el-input v-model="item.attr_vals"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button style="margin-top: 12px;" @click="unext">上一步</el-button>
          <el-button style="margin-top: 12px;" @click="next2">下一步</el-button>
        </el-form-item>
      </div>
<!--商品图片-->
      <div v-else-if="active==3">
        <el-form-item label="上传商品图片">
          <el-upload
              action="http://47.97.115.63:8889/api/private/v1/upload"
              :headers="headerObj"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              list-type="picture-card"
              :on-success="uploadSuccess">
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>

        </el-form-item>
        <el-form-item>
          <el-button style="margin-top: 12px;" @click="unext">上一步</el-button>
          <el-button style="margin-top: 12px;" @click="next2">下一步</el-button>
        </el-form-item>
      </div>
<!--商品内容-->
      <div v-else-if="active==4">
        <el-input
            type="textarea"
            :rows="10"
            placeholder="请输入内容"
            v-model="goodsInfo.goods_introduce">
        </el-input>
        <el-form-item>
          <el-button style="margin-top: 12px;" @click="unext">上一步</el-button>
          <el-button style="margin-top: 12px;" @click="next3">确定添加</el-button>
        </el-form-item>
      </div>

    </el-form>
  </el-card>
</div>
</template>

<script>
import _ from 'lodash'
export default {
  name: "Add",
  data(){
    return{
      active:0,
      goodsInfo:{},
      goodsRules:{
        goods_name:[
          { required:true,message:'请输入商品名称',trigger:'blur'}
        ],
        goods_price:[
          { required:true,message:'请输入商品价格',trigger:'blur'}
        ],
        goods_weight:[
          { required:true,message:'请输入商品重量',trigger:'blur'}
        ],
        goods_number:[
          { required:true,message:'请输入商品数量',trigger:'blur'}
        ],
        goods_cat:[
          { required:true,message:'请选择商品分类',trigger:['change','blur']}
        ]
      },
      option:[],
      dialogImageUrl: '',
      dialogVisible: false,
      cartList:[],
      cateProps :{
        label:'cat_name',//表示看到的是那个属性
        value:'cat_id',//代表选中的是那个值
        children:'children'
      },
      manyTableData:[],
      onlyTableData:[],
      // 图片上传的请求头
      headerObj:{
        Authorization:window.sessionStorage.getItem('token')
      },
      // 预览图片的地址
      previewPath:'',
      // 控制预览窗口是否显示
      previewVisible:false,
      pics:[],

    }
  },
  methods:{
    //基本信息下一步
    next() {
      this.active++
      this.getMangTableData()
    },
    //获取动态商品参数
    async getMangTableData(){
      const {data:res} = await this.$http.get(`categories/${this.cateId}/attributes`, {params: {sel:'many'}})
      // console.log(res);
      if(res.meta.status!==200){
        this.$message({
          message:res.meta.msg,
          type:"error",
          center:true
        })
      }else{
        res.data.forEach(item=>{
          item.attr_vals = item.attr_vals.length===0 ? [] : item.attr_vals.split(',')
        })
        this.manyTableData = res.data
        // console.log(this.manyTableData);
      }
    },
    //参数下一步
    next1(){
      this.active++
      this.getOnlyTableData()
    },
    // 静态参数获取
    async getOnlyTableData(){
      const {data:res} = await this.$http.get(`categories/${this.cateId}/attributes`, {params: {sel:'only'}})
       console.log(res);
      if(res.meta.status!==200){
        this.$message({
          message:res.meta.msg,
          type:"error",
          center:true
        })
      }else{
        this.onlyTableData = res.data
        console.log(this.onlyTableData);
      }

    },
    next2(){
      this.active++
    },
    unext(){
      this.active--
    },
    //获取分类列表
    async getCateList(){
      const {data:res} = await this.$http.get('categories')
      // console.log(res);
      if(res.meta.status!==200){
        this.$message({
          message:res.meta.msg,
          type:"error",
          center:true
        })
      }else{
        // console.log(res);
        this.cartList = res.data
        // console.log(this.cartList);

      }
    },
    // 处理移除图片的操作
    handleRemove(file){
      console.log(file);

      // 1.获取将要删除的图片的临时路径
      const filePath = file.response.data.tmp_path
      // 2.从pics数组中，找到这个图片对应的索引值
      //  2.1 findIndex() 方法返回传入一个测试条件（函数）符合条件的数组第一个元素位置。 true停止 没找到返回-1
      const i = this.goodsInfo.pics.findIndex(x => {
        return x.pic === filePath
      })
      // 3.调用数组的splic方法，把图片信息对象，从pics数组中移除
      this.goodsInfo.pics.splice(i,1)

    },
    // 图片上传成功
    uploadSuccess(response){
      // console.log(response);
      // 1.拼接得到一个图片信息对象
      const picInfo = { pic:response.data.tmp_path}
      // 2.将图片信息push到 Pics数组中
      this.goodsInfo.pics.push(picInfo)
      // console.log(this.goodsInfo);
    },
    // 处理图片预览效果 未做
    handlePreview(){
      // console.log(file);
      this.previewPath = ''
    },
    //确定添加商品
    next3(){
      this.$refs.goodsInfo.validate(async valid=>{
        if(!valid){
          this.$message.error({
            message:'添加失败',
            center:true
          })
        }else{
            // 处理静态属性
          this.onlyTableData.forEach( item => {
          const newInfo = {
            attr_id : item.attr_id,
            attr_value : item.attr_vals
          }
          this.goodsInfo.attrs.push(newInfo)
        })

        // 处理goods_cat格式问题 使用 lodash函数库 cloneDeep(obj)  深拷贝解决冲突
        const formn = _.cloneDeep(this.goodsInfo)
          if(!formn.goods_cat){
            // this.$message.error({
            //   message:'添加出错',
            //   center:true
            // })
          }else{
            formn.goods_cat = formn.goods_cat.join(',')
          }

        // console.log(nform);

        // 发起请求添加商品
        // 商品的名称，必须时唯一的
        const {data:res} = await this.$http.post('goods',formn)

        if(res.meta.status !== 201){
          return this.$message.error({
            message:'添加商品失败：'+res.meta.msg,
            center:true
          })
        }else{
          this.$message.success('添加商品成功!')
          this.$router.push('/goods')
        }
        }
      })
    },
    // 级联选择器选中项变化 触发该函数
    handleChange(){
      console.log(this.goodsInfo.goods_cat);
      if(this.goodsInfo.goods_cat.length === 1 || this.goodsInfo.goods_cat.length === 2){
        this.goodsInfo.goods_cat= []
        return this.$message('只允许设置三级分类')
      }
    },
  },
  created() {
    this.getCateList()
  },
  computed: {
    cateId(){
      if(this.goodsInfo.goods_cat.length === 3){
        return this.goodsInfo.goods_cat[2]
      }else{
        return null
      }
    }
  },

}
</script>

<style scoped>

</style>