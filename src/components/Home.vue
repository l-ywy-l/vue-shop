<template>
  <el-container class="home_container">
    <!--    // 头部区-->
    <el-header>
      <div>
        <img src="../assets/logo.png" alt="">
        <span>后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出登录</el-button>
    </el-header>
    <!--    // 主体区-->
    <el-container>
      <!--      // 左侧边栏区-->
      <el-aside width="auto">
        <!-- 菜单折叠按钮-->
        <div class="toggle_button" @click="isCollapse ? isCollapse=false : isCollapse=true">
          <i class="el-icon-s-unfold"></i>
        </div>
        <!--        菜单区-->
        <el-menu
          class="el-menu-vertical-demo"
          @open="handleOpen"
          @close="handleClose"
          :collapse="isCollapse"
          background-color="#313743"
          text-color="#fcfffc"
          active-text-color="#379aff"
          router
          :default-active="activePath">
          <!-- 一级菜单-->
          <el-submenu :index="item.id+''" v-for="item in menuList" :key="item.id">
            <template slot="title">
              <i class="el-icon-s-grid"></i>
              <span slot="title">{{ item.authName }}</span>
            </template>
            <!-- 二级菜单-->
            <el-menu-item
              :index="'/'+subItem.path"
              v-for="subItem in item.children"
              :key="subItem.id"
              @click="saveActive('/'+subItem.path)">
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span slot="title">{{ subItem.authName }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!--      // 内容区-->
      <el-main>
        <router-view/>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Home',
  data () {
    return {
      isCollapse: false,
      menuList: [],
      activePath: ''
    }
  },
  created () {
    this.getMenuList()
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  methods: {
    logout () {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    handleOpen (key, keyPath) {
      console.log(key, keyPath)
    },
    handleClose (key, keyPath) {
      console.log(key, keyPath)
    },
    saveActive (activePath) {
      // console.log('当前path', this.$route.path)
      window.sessionStorage.setItem('activePath', activePath)
      this.activePath = activePath
    },
    // 获取菜单
    async getMenuList () {
      const { data: res } = await this.$http.get('menus')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.menuList = res.data
      console.log('菜单列表', res)
    }
  }
}
</script>

<style lang="less" scoped>
.home_container {
  height: 100%;
}

.el-header {
  background-color: #363d40;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0px 10px;
  color: #2BFF88;
  font-size: 20px;

  > div {
    height: 100%;
    display: flex;
    align-items: center;

    span {
      margin-left: 5px;
    }
  }

  img {
    margin: 5px;
    width: 50px;
    height: 50px;
  }
}

.el-aside {
  background-color: #313743;
  overflow-y: hidden;

  .el-menu {
    border-right: none;
  }
}

.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 201px;
  min-height: 400px;
}

.toggle_button {
  line-height: 24px;
  text-align: center;
  color: #e9edf1;
  cursor: pointer;
}

.el-main {
  background-color: #e9edf1;
}
</style>
