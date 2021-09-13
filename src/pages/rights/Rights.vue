<template>
<div class="right">
  <!--  面包屑导航-->
  <el-breadcrumb separator="/">
    <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>权限管理</el-breadcrumb-item>
    <el-breadcrumb-item :to="{ path: '/users'  }">权限列表</el-breadcrumb-item>
  </el-breadcrumb>
  <br>
  <el-card>
    <el-table border :data="tableData">
      <el-table-column label="编号" type="index" width="50"></el-table-column>
      <el-table-column label="权限名称" prop="authName"></el-table-column>
      <el-table-column label="路径" prop="path"></el-table-column>
      <el-table-column label="权限等级" prop="level">
        <template slot-scope="scope">
          <el-tag type="warning" v-if="scope.row.level === '0'">一级权限</el-tag>
          <el-tag type="info" v-if="scope.row.level === '1'">二级权限</el-tag>
          <el-tag type="success" v-if="scope.row.level === '2'">三级权限</el-tag>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
  <br>
</div>
</template>

<script>
export default {
  name: "Rights",
  data(){
    return{
      tableData:[]
    }
  },
  methods:{
    async getRightList() {
      const {data: res} = await this.$http.get('rights/list')
      if (res.meta.status !== 200) {
        this.$message({
          message: res.meta.msg,
          type: "error",
          center: true
        })
      } else {
        // this.$message({
        //   message: res.meta.msg,
        //   type: "success",
        //   center: true
        // })
        // console.log(res);
        this.tableData = res.data
      }
    }
  },
  created() {
    this.getRightList()
  }
}
</script>

<style scoped>

</style>