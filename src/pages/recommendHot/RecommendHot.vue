<template>
<div class="recommend-hot">
<!--  左边部分-->
  <div class="content">
<!--    热门搜索头部-->
    <div class="text">
      <div class="hot">
        <p>热门推荐</p>
      </div>
      <ul>
        <li><a>华语</a><span>|</span></li>
        <li><a>流行</a><span>|</span></li>
        <li><a>摇滚</a><span>|</span></li>
        <li><a>民谣</a><span>|</span></li>
        <li><a>电子</a><span>|</span></li>
      </ul>
      <div class="more">
        <a> 更多</a>
        <i>&nbsp;</i>
      </div>
    </div>
<!--    热门搜索内容-->
    <div class="pri">

      <div v-for="item in recommendList" :key="item.id">
        <router-link :to="'/playlist'+ item.id">
          <img :src="item.picUrl" alt="" style="width: 140px;height: 140px">
        </router-link>

        <div class="bottom">
          <span class="emai"></span>
          <span class="listener">{{item.trackCount}}万</span>
          <a></a>
        </div>
        <router-link :to="'/playlist'+ item.id" class="ww">
          <div class="rname">{{item.name}}</div>
        </router-link>
      </div>
    </div>

    <div class="bangdan">
      <div class="top">
        <div class="logo">
          <div class="left">
              <img :src="bangdanlist1.coverImgUrl" alt="" style="width: 80px;height: 80px"/>
          </div>
          <div class="right">
              {{bangdanlist1.name}}
            <div class="btn">
              <a href="javascript:;"></a>
              <a href="javascript:;"></a>
            </div>
          </div>
        </div>
        <ol class="song">
          <li v-for="(item, index) in trancks1" :key="item.id" style="list-style-type: none">
            <span>{{ index + 1 }}</span>
            <div>
              <a href="javascript:;">{{item.name}}</a>
            </div>
          </li>
        </ol>
        <div class="lookAll">查看全部 →</div>
      </div>

      <!-- 新歌榜 -->
      <div class="new" v-for="item in bangdanlist2" :key="item.id">
        <div class="logo">
          <div class="left">
            <router-link :to="'/songlist/' + item.id">
              <img :src="item.coverImgUrl" alt="" />
            </router-link>
          </div>
          <div class="right">
            <router-link :to="'/songlist/' + item.id">
              {{ item.name }}
            </router-link>
            <div class="btn">
              <a href=""></a>
              <a href=""></a>
            </div>
          </div>
        </div>
        <ol class="song">
          <li v-for="(item, index) in trancks2" :key="item.id">
            <span>{{ index + 1 }}</span>
            <div @click="geturl2(trancks2[index].id, index, item)">
              <a href="">{{ item.name }}</a>
            </div>
          </li>
        </ol>
        <div class="lookAll">查看全部 →</div>

      </div>
      <!-- 原创榜 -->
      <div class="original" v-for="item in bangdanlist3" :key="item.id">
        <div class="logo">
          <div class="left">
            <router-link :to="'/songlist/' + item.id">
              <img :src="item.coverImgUrl" alt="" />
            </router-link>
          </div>
          <div class="right">
            <router-link :to="'/songlist/' + item.id">
              {{ item.name }}
            </router-link>

            <div class="btn">
              <a href=""></a>
              <a href=""></a>
            </div>
          </div>
        </div>
        <ol class="song">
          <li v-for="(item, index) in trancks3" :key="item.id">
            <span>{{ index + 1 }}</span>
            <div @click="geturl3(trancks3[index].id, index, item)">
              <a href="javascript:;">{{ item.name }}</a>
            </div>
          </li>
        </ol>
        <div class="lookAll">查看全部 →</div>

      </div>
    </div>


  </div>

<!--右边部分  -->
  <div class="right">
    <div class="main">
      <div class="maincontent" v-if="this.$store.state.user.show">
        <div class="fell">
          <div class="contentleft">
            <img width="80" height="80" :src="this.$store.state.user.avatarUrl">
          </div>
          <div class="contentright">
            <h4 class="username">
              <a href="">{{this.$store.state.user.username}}</a>
            </h4>
            <p>
              <a href="" class="u-lv">
                LV.1
              </a>
            </p>
            <div class="btn">
              <a href="">
                <i>签到</i>
              </a>
            </div>
          </div>
        </div>
        <ul class="contentfooter">
          <li class="fst">
            <a href="">
              <strong v-if="followeds">0</strong>
              <strong v-else>{{ this.$store.state.user.followeds }}</strong>
              <span>动态</span>
            </a>
          </li>
          <li>
            <a href="">
              <strong v-if="follows">0</strong>
              <strong v-else>{{ this.$store.state.user.follows }}</strong>
              <span>关注</span>
            </a>
          </li>

          <li class="lst">
            <a href="">
              <strong v-if="gender">0</strong>
              <strong v-else>{{ this.$store.state.user.gender }}</strong>
              <span>粉丝</span>
            </a>
          </li>
        </ul>
      </div>
      <div class="maincontent2" v-else>
        <p>登录网易云音乐，可以享受无限收藏的乐趣，并且无限同步到手机</p>
        <button >用户登录</button>
      </div>
    </div>
    <div class="songer">
      <div class="title">
        <p>入驻歌手</p>
        <a>查看全部</a>
      </div>
      <ul class="list">
        <li v-for="(item,index) in songerList" :key="index">
          <a>
            <span class="left"><img :src="item.picUrl" style="width: 62px;height: 62px"></span>
            <span class="righ">
              <h4>{{item.name}}</h4>
              <p>{{item.alias[0]}}</p>
            </span>
          </a>
        </li>
      </ul>
      <div class="beto">
        <a>
          <i>申请成为网易音乐人</i>
        </a>
      </div>
    </div>
    <div class="songer">
      <div class="title">
        <p>热门主播</p>
      </div>
      <ul class="anchor">
        <li v-for="(item,index) in djList" :key="index">
          <a>
            <span><img :src="item.avatarUrl" style="width: 40px;height: 40px"></span>
            <span class="info">
              <p>{{item.nickName}}</p>
            </span>
          </a>
        </li>
      </ul>
    </div>
  </div>
</div>
</template>

<script>
import {getRecommendList,getArtist,getdj,getBillBoard} from "../../../../vue_music/src/api/discover";

export default {
  name: "RecommendHot",
  data(){
    return{
      recommendList:[],
      songerList:[],
      djList:[],

      bangdanlist1: [],
      bangdanlist2: [],
      bangdanlist3: [],
      //榜单歌曲
      trancks1: [],
      trancks2: [],
      trancks3: [],
    }
  },
  created() {
    //热门推荐
    getRecommendList().then(res=>{
      // console.log(res);
      this.recommendList = res.data.result
      // console.log(this.recommendList);
    })
    //入驻歌手
    getArtist().then(res=>{
      // console.log(res);
      this.songerList = res.data.artists
      // console.log(this.songerList);
    })
    //热门电台
    getdj(5).then(res=>{
      // console.log(res);
      this.djList = res.data.data.list
      // console.log(this.djList);
    })
    //飙升榜
    getBillBoard(19723756).then(res=>{
      // console.log(res);
      this.bangdanlist1 =res.data.playlist
      this.trancks1 = this.bangdanlist1.tracks.slice(0,10)
    })
    getBillBoard(3779629).then(res=>{
      console.log(res);
      this.bangdanlist2 =res.data.playlist
      this.trancks2 = this.bangdanlist2.tracks.slice(0,10)
    })
    getBillBoard(2884035).then(res=>{
      console.log(res);
      this.bangdanlist3 =res.data.playlist
      this.trancks3 = this.bangdanlist3.tracks.slice(0,10)
    })
  }
}
</script>

<style scoped>
.right{
  width: 250px;
}
.recommend-hot{
  margin-top: 10px;
  width: 955px;
  transform: translateX(190px);
  display: flex;
  font-size: 12px;
  box-sizing: border-box;
}
.content{
  width: 689px;
}
.text{
  width: 100%;
  display: flex;
  border-bottom: 2px solid #c10d0c;
  background: url('~@/assets/images/index.png') -225px -156px no-repeat;
}
.text ul{
  display: flex;
  margin-left: 20px;
  align-items: center;
}
.text ul li{
  list-style-type:none
}
.hot p {
  font-size: 20px;
  font-weight: normal;
  line-height: 28px;
  text-indent: 2rem;
  margin-bottom: 10px;
}
.text ul li span {
  margin: 0 10px;
}
.text .more {
  margin-left: auto;
  margin-right: 20px;
  display: flex;
  align-items: center;
}
.more i{
  background: url("~@/assets/images/index.png") 0 -237px no-repeat;
  width: 12px;
  height: 12px;
}
.pri{
  display: flex;
  width: 100%;
  margin: 20px 0 0 0;
  justify-content: space-between;
  flex-wrap: wrap;
  overflow: hidden;
}
.pic img {
  overflow: hidden;
}
.rname{
  width: 140px;
  margin: 0;
  transform: translateY(-20px);
  font-size: 14px;
  overflow: hidden;
  /*多余变成...*/
  text-overflow:ellipsis;
  white-space:nowrap ;
}
.bottom {
  position: relative;
  bottom: 30px;
  left: 0;
  width: 100%;
  height: 27px;
  color: #ccc;
  display: flex;
  background: url('~@/assets/images/coverall.png') 0 -537px no-repeat;
}
.bottom .emai {
  float: left;
  width: 14px;
  height: 11px;
  margin: 9px 5px 9px 10px;
  background: url('~@/assets/images/iconall.png') no-repeat 0 -24px;
}
.bottom .listener {
  float: left;
  margin: 6px 0 0 0;
}
.bottom a {
  position: absolute;
  background: url('~@/assets/images/iconall.png');
  right: 10px;
  bottom: 4px;
  width: 16px;
  height: 17px;
}
.ww{
  text-decoration: none;
  color: black;
}
.ww:hover{
  text-decoration:underline
}
</style>
<style scoped>
.right{
  transform: translate(40px, -10px);
}
.main {
  width: 250px;
  border-left: 1px solid #eee;
  border-right: 1px solid #eee;
  background: url('~@/assets/images/index.png') -39px 0 no-repeat;
  background-size: 10000px 1000px;
  height: 126px;
  padding-top: 0;
}
.fell{
  display: flex;
  height: 90px;
  width: 250px;
}
.maincontent {
  width: 250px;
  height: 165px;
  padding-top: 20px;
  background: url('~@/assets/images/index.png') 0 -270px no-repeat;
}
.contentleft{
  float: left;
  width: 80px;
  height: 80px;
  margin-left: 20px;
  padding: 2px;
  background: #fff;
  border: 1px solid #dadada;
}
.contentright{
  float: left;
  width: 115px;
  margin-left: 18px;
  padding-top: 3px;
}
.username a{
  text-decoration: none;
  color: #333333;
  font-size: 14px;
}
.u-lv{
  font-style: oblique;
  text-decoration: none;
  color: black;

}
.btn {
  margin-top: 15px;
}

.btn a {
  color: #fff;
  text-decoration: none;
  padding: 0 5px 0 0;
  white-space: nowrap;
  display: inline-block;
  *display: inline;
  *zoom: 1;
  height: 31px;
  line-height: 31px;
  overflow: hidden;
  *line-height: 32px;
  vertical-align: top;
  text-align: center;
  cursor: pointer;
  background: url('~@/assets/images/button2.png') right -428px no-repeat;
}

.btn a i {
  width: 60px;
  color: #fff;
  background-position: 0 -387px !important;
  padding: 0 15px 0 20px;
  pointer-events: none;
  display: inline-block;
  *display: inline;
  *zoom: 1;
  height: 31px;
  line-height: 31px;
  overflow: hidden;
  *line-height: 32px;
  vertical-align: top;
  text-align: center;
  cursor: pointer;
  background: url("~@/assets/images/button2.png") no-repeat;
}
.contentfooter {
  margin: 22px 0 0 20px;
}

.contentfooter li.fst {
  padding-left: 0;
}

.contentfooter li {
  list-style-type: none;
  float: left;
  height: 40px;
  padding: 0 18px;
  border-right: 1px solid #e4e4e4;
}

.contentfooter li a {
  text-decoration: none;
  display: block;
  color: #666;
}

.contentfooter li strong {
  display: block;
  font-size: 20px;
  font-weight: normal;
}
.maincontent2 > p {
  width: 205px;
  margin: 0 auto;
  padding: 16px 0;
  line-height: 22px;
  color: #666;
  font-size: 12px;
}

.maincontent2 > button {
  display: block;
  width: 100px;
  height: 31px;
  line-height: 31px;
  text-align: center;
  color: #fff;
  text-shadow: 0 1px 0 #8a060b;
  margin: 0 auto;
  background: url('~@/assets/images/index.png') 0 -195px no-repeat;
  border: none;
  outline: none;
  cursor: pointer;
}

</style>
<style scoped>
.songer {
  margin-top: 30px;
}

.songer .title {
  display: flex;
  justify-content: space-between;
  height: 23px;
  margin: 0 20px;
  border-bottom: 1px solid #ccc;
  color: #333;
}

.songer .title a {
  display: block;
  font-weight: normal;
  color: #666;
}

.songer .title a:hover {
  text-decoration: underline;
}

.list {
  margin: 6px 0 14px 20px;
  height: 380px;
}

.list li {
  list-style-type: none;
  margin-top: 14px;
  float: left;
  width: 210px;
  height: 62px;
  background: #fafafa;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.list .left {
  float: left;
  width: 62px;
  height: 62px;
  overflow: hidden;
}

.list .righ {
  float: left;
  width: 133px;
  height: 60px;
  padding-left: 14px;
  border: 1px solid #e9e9e9;
  border-left: none;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
}

.list .righ p {
  color: #666;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.list .left {
}

.list .left img:hover {
  transform: scale(1.5);
  transition: all 0.3s linear;
}
.beto {
  width: 250px;
  height: 31px;
}

.beto a {
  width: 210px;
  margin: 0 auto;
  height: 31px;
  display: block;
  text-align: center;
  line-height: 31px;
  outline: none;
  cursor: pointer;
  border-radius: 4px;
  background: url('~@/assets/images/button2.png') right -100px;
}

.beto a i {
  font-weight:bold;
  width: 98%;
  height: 100%;
  background: url('~@/assets/images/button2.png') 0 -59px;
  display: block;
  font-style: normal;
}

.anchor {
  margin: 20px 0 0 20px;
}

.anchor li {
  list-style-type: none;
  float: left;
  width: 210px;
  height: 50px;
}

.anchor li > a span img{
  float: left;
  width: 40px;
  margin-right: 10px;
  cursor: pointer;
}

.anchor .info {
  float: left;
  right: 0;
  width: 160px;
  line-height: 21px;
  display: flex;
  flex-direction: column;
}

.anchor .info p {
  text-overflow: ellipsis;
  white-space: nowrap;
  color: #666;
}
.logo .right > a:hover {
  text-decoration: underline;
  color: black;
}

.logo .right .btn {
  margin-top: 10px;
}
.logo .right .btn a:nth-child(1) {
  display: block;
  float: left;
  width: 22px;
  height: 22px;
  margin-right: 10px;
  text-indent: -9999px;
  background: url('~@/assets/images/index.png') -267px -205px no-repeat;
}

.logo .right .btn a:nth-child(2) {
  display: block;
  float: left;
  width: 22px;
  height: 22px;
  margin-right: 10px;
  text-indent: -9999px;
  background: url('~@/assets/images/index.png') -300px -205px no-repeat;
}
/*榜单*/
.bangdan {
  height: 472px;
  margin-top: 20px;
  padding-left: 1px;
  display: flex;
  background: url('~@/assets/images/index_bill.png');
  justify-content: space-around;
}

.bangdan .top {
  height: 100%;
  width: 230px;
}

.bangdan .new {
  height: 100%;
  width: 230px;
}

.bangdan .original {
  height: 100%;
  width: 228px;
}

.bangdan .logo {
  height: 100px;
  padding: 20px 0 0 19px;
}

.logo .left img {
  width: 100%;
  height: 100%;
}

.logo .left {
  float: left;
  display: inline;
  width: 80px;
  height: 80px;
  position: relative;
}

.logo .right {
  float: left;
  width: 116px;
  margin: 6px 0 0 10px;
}

.logo .right > a {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: block;
  background-color: #f4f4f4;
  font-size: 14px;
  cursor: pointer;
  font-weight: bold;
}
.song {
  height: 319px;
  margin-left: 50px;
  line-height: 32px;
  display: flex;
  flex-direction: column;
}

.song li {
  height: 32px;
  list-style-type: none;
}

.song li:nth-child(1) span {
  color: #c10d0c;
}

.song li:nth-child(2) span {
  color: #c10d0c;
}

.song li:nth-child(3) span {
  color: #c10d0c;
}

.song span {
  float: left;
  position: relative;
  width: 35px;
  height: 32px;
  margin-left: -35px;
  text-align: center;
  color: #666;
  font-size: 16px;
}

ol li a {
  color: #000;
}
/* 查看全部*/
.lookAll{
  display: flex;
  align-items: center;
  height: 32px;
  justify-content: flex-end;
  margin-right: 20px;
}
</style>