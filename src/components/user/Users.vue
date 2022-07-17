<template>
  <div>
    <!--    面包屑-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--    内容-->
    <el-card>
      <!--      搜索添加-->
      <el-row :gutter="20">
        <el-col :span="7">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            clearable
            @clear="getUserList">
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button
            type="primary"
            @click="addDialogVisible = true">添加用户
          </el-button>
        </el-col>
      </el-row>
      <!--      用户列表-->
      <el-table :data="userList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="姓名" prop="username"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="电话" prop="mobile"></el-table-column>
        <el-table-column label="角色" prop="role_name"></el-table-column>
        <el-table-column label="状态" prop="mg_state">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.mg_state" @change="userStateChang(scope.row)">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="修改用户" placement="top" :enterable="false">
              <el-button type="primary" icon="el-icon-edit" size="mini"
                         @click="showEditDialog(scope.row.id)"></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="删除用户" placement="top" :enterable="false">
              <el-button type="danger" icon="el-icon-delete" size="mini"
                         @click="removeUserById(scope.row.id)"></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="用户权限" placement="top" :enterable="false">
              <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!--      分页-->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>
    <!--    添加用户dialog-->
    <el-dialog
      title="添加用户"
      :visible.sync="addDialogVisible"
      width="50%" @close="dialogClose(1)">
      <!--      主体-->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password" type="password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email" type="email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addForm.mobile" type="phone"></el-input>
        </el-form-item>
      </el-form>
      <!--      底部区域-->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>
    <!--    修改用户dialog-->
    <el-dialog
      title="修改用户"
      :visible.sync="editDialogVisible"
      width="50%" @close="dialogClose(2)">
      <!--      主体-->
      <el-form :model="editFrom" :rules="editFormRules" ref="editFormRef" label-width="70px">
        <el-form-item label="用户名">
          <el-input v-model="editFrom.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editFrom.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="editFrom.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!--      底部区域-->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateUser">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Users',
  data () {
    // 自定义邮箱验证规则
    const checkEmail = (rule, val, cb) => {
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
      if (regEmail.test(val)) {
        return cb()// 合法邮箱
      }
      cb(new Error('请输入合法邮箱'))
    }
    // 自定义手机号验证规则
    const checkPhone = (rule, val, cb) => {
      const regPhone = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
      if (regPhone.test(val)) {
        return cb()// 合法手机号
      }
      cb(new Error('请输入合法手机号'))
    }
    return {
      // 查询用户请求参数
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 2
      },
      // 用户列表
      userList: [],
      // 总条数
      total: 0,
      // 添加用户对话框可见属性
      addDialogVisible: false,
      // 修改用户对话框可见属性
      editDialogVisible: false,
      // 用户权限对话框可见属性
      roleDialogVisible: false,
      // 添加用户表单数据
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      // 验证规则
      addFormRules: {
        username: [
          {
            required: true,
            message: '请输入用户名',
            trigger: 'blur'
          },
          {
            min: 3,
            max: 10,
            message: '用户名的长度在3~10个字符',
            trigger: 'blur'
          }
        ],
        password: [
          {
            required: true,
            message: '请输入密码',
            trigger: 'blur'
          },
          {
            min: 3,
            max: 10,
            message: '密码的长度在6~16个字符',
            trigger: 'blur'
          }
        ],
        email: [
          {
            required: true,
            message: '请输入邮箱',
            trigger: 'blur'
          },
          {
            validator: checkEmail,
            trigger: 'blur'
          }
        ],
        mobile: [
          {
            required: true,
            message: '请输入手机',
            trigger: 'blur'
          },
          {
            validator: checkPhone,
            trigger: 'blur'
          }
        ]
      },
      // 编辑用户表单数据
      editFrom: {},
      // 验证规则
      editFormRules: {
        email: [
          {
            required: true,
            message: '请输入邮箱',
            trigger: 'blur'
          },
          {
            validator: checkEmail,
            trigger: 'blur'
          }
        ],
        mobile: [
          {
            required: true,
            message: '请输入手机',
            trigger: 'blur'
          },
          {
            validator: checkPhone,
            trigger: 'blur'
          }
        ]
      }
    }
  },
  created () {
    this.getUserList()
  },
  methods: {
    // 获取用户列表 axios 请求
    async getUserList () {
      const { data: res } = await this.$http.get('users', { params: this.queryInfo })
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      console.log('用户列表', res)
      this.userList = res.data.users
      this.total = res.data.total
    },
    // 处理数据页条数变更
    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
      this.getUserList()
      console.log(`每页 ${newSize} 条`)
    },
    // 处理当前数据页变更
    handleCurrentChange (newPage) {
      this.queryInfo.pagenum = newPage
      this.getUserList()
      console.log(`当前页: ${newPage}`)
    },
    // 监听switch开关状态，发起axios相应处理
    async userStateChang (userInfo) {
      console.log('用户信息', userInfo)
      const { data: res } = await this.$http.put(`users/${userInfo.id}/state/${userInfo.mg_state}`)
      console.log('响应信息', res)
      if (res.meta.status !== 200) {
        userInfo.mg_state = !userInfo.mg_state
        return this.$message.error(res.meta.msg)
      }
      this.$message.success(res.meta.msg)
    },
    // 监听 dialog 关闭事件
    dialogClose (id) {
      // 关闭dialog重置表单
      switch (id) {
        case 1:
          this.$refs.addFormRef.resetFields()
          break
        case 2:
          this.$refs.editFormRef.resetFields()
      }
    },
    // 确认添加用户按钮
    addUser () {
      this.$refs.addFormRef.validate(async (valid) => {
        // 预校验失败
        if (!valid) return
        // 发起添加用户请求
        const { data: res } = await this.$http.post('users', this.addForm)
        if (res.meta.status !== 201) { // 添加失败
          return this.$message.error(res.meta.msg)
        }
        this.$message.success(res.meta.msg) // 添加成功
        this.addDialogVisible = false // 关闭 dialog
        await this.getUserList() // 刷新用户列表
      })
    },
    // 展示编辑用户dialog
    async showEditDialog (uid) {
      // 根据uid查询相应用户
      const { data: res } = await this.$http.get(`users/${uid}`)
      if (res.meta.status !== 200) { // 请求失败
        return this.$message.error(res.meta.msg)
      }
      this.editFrom = res.data
      this.editDialogVisible = true // 显示编辑用户dialog
    },
    // 确认修改用户按钮
    updateUser () {
      this.$refs.editFormRef.validate(async (valid) => {
        // 预校验失败
        if (!valid) return
        // 发起修改用户请求
        const { data: res } = await this.$http.put(`users/${this.editFrom.id}`, {
          email: this.editFrom.email,
          mobile: this.editFrom.mobile
        })
        if (res.meta.status !== 200) { // 修改失败
          return this.$message.error(res.meta.msg)
        }
        this.$message.success(res.meta.msg) // 修改成功
        this.editDialogVisible = false // 关闭 dialog
        await this.getUserList() // 刷新用户列表
      })
    },
    // 根据id删除用户
    removeUserById (id) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const { data: res } = await this.$http.delete(`users/${id}`)
        if (res.meta.status !== 200) {
          return this.$message({
            type: 'error',
            message: '删除失败!'
          })
        }
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
        await this.getUserList()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    }
  }
}
</script>

<style lang="less" scoped>
.el-breadcrumb {
  margin-bottom: 15px;
  font-size: 15px;
}
</style>
