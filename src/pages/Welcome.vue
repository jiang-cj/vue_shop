<template>
  <div>
    <el-row>
      <el-col :span="20"><div id="main" style="height: 600px ;width: 1000px"></div></el-col>
      <el-col :span="4">欢迎！</el-col>
    </el-row>
  </div>
</template>

<script>
import echarts from 'echarts'
export default {
  name: "Welcome",
  mounted() {
    var myChart = echarts.init(document.getElementById('main'));

    var option={
      title:{
        text: '中药',
        subtext: '销量(kg)',
        textStyle:{
          color:'teal',
          fontSize:'42',
        },
        padding:[20,50],
      },
      legend: {},

      tooltip: {
        trigger: 'axis',
      },

      dataset: {
        source: [
          ['product', '2016', '2017','2018','2019','2020','2021'],
          ['当归',  85, 90, 100, 110, 125, 135],
          ['牛大力',  73, 55, 39, 93, 83, 63],
          ['降香', 65, 25,24, 21, 17, 9],
          ['五味子', 83, 101, 111, 124, 134, 155],
          ['岗梅根', 22, 39, 40, 60, 70, 122],
          ['海金沙', 70, 58, 49, 44, 39, 22]
        ]
      },
      xAxis: { type: 'category' },
      yAxis: { gridIndex: 0 },
      grid: { top: '55%' },
      series: [
        { type: 'line', smooth: true, seriesLayoutBy: 'row' },
        { type: 'line', smooth: true, seriesLayoutBy: 'row' },
        { type: 'line', smooth: true, seriesLayoutBy: 'row' },
        { type: 'line', smooth: true, seriesLayoutBy: 'row' },
        { type: 'line', smooth: true, seriesLayoutBy: 'row' },
        { type: 'line', smooth: true, seriesLayoutBy: 'row' },
        {
          type: 'pie',
          id: 'pie',
          radius: '30%',
          center: ['50%', '25%'],
          label: {
            formatter: '{b}: {@2015} ({d}%)'
          },
          encode: {
            itemName: 'product',
            value: '2015',
            tooltip: '2015'
          }
        }
      ]
    }
    myChart.on('updateAxisPointer', function (event) {
      var xAxisInfo = event.axesInfo[0]
      if (xAxisInfo) {
        var dimension = xAxisInfo.value + 1
        myChart.setOption({
          series: {
            id: 'pie',
            label: {
              formatter: '{b}: {@[' + dimension + ']} ({d}%)'
            },
            encode: {
              value: dimension,
              tooltip: dimension
            }
          }
        })
      }
    })

    myChart.setOption(option)
  }
}
</script>

<style scoped>

</style>
<!--用echarts建立图标-->
<!--安装4.8.0，别点版本可能不能用init-->