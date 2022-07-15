<template>
  <div class="login_container">
    <section>
      <div class="login_box">
        <h2>欢迎光临</h2>
        <!--        登录表单区-->
        <el-form :model="loginForm" :rules="loginFormRules" ref="loginFormRef">
          <!--          用户名-->
          <el-form-item prop="username">
            <el-input prefix-icon="el-icon-user" v-model="loginForm.username"></el-input>
          </el-form-item>
          <!--          密码-->
          <el-form-item prop="password">
            <el-input prefix-icon="el-icon-key" type="password" v-model="loginForm.password"></el-input>
          </el-form-item>
          <!--          按钮-->
          <el-form-item class="login_btn">
            <el-button type="primary" @click="login">登录</el-button>
          </el-form-item>
        </el-form>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  // eslint-disable-ne xt-line vue/multi-word-component-names
  name: 'Login',
  data () {
    return {
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      loginFormRules: {
        username: [
          {
            required: true,
            message: '请输入用户名',
            trigger: 'blur'
          },
          {
            min: 2,
            max: 10,
            message: '长度在 2 到 10 个字符',
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
            min: 6,
            max: 16,
            message: '长度在 6 到 16 个字符',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    login () {
      this.$refs.loginFormRef.validate(async (valid) => {
        if (!valid) return
        const { data: res } = await this.$http.post('login', this.loginForm)
        console.log(res)
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.$message.success(res.meta.msg)
        window.sessionStorage.setItem('token', res.data.token)
        await this.$router.push('/home')
      })
    }
  }
}
</script>

<style lang="less" scoped>
.login_container {
  height: 100%;

  section {
    /*  */
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    /*  */
    width: 100%;
    height: 100%;
    /*  */
    background-image: linear-gradient(94.3deg, rgba(26, 33, 64, 1) 10.9%, rgba(81, 84, 115, 1) 87.1%);
  }

  section::before {
    /*  */
    position: absolute;
    top: 50%;
    left: 50%;
    z-index: 2;
    content: "";
    /*  */
    width: 450px;
    height: 450px;
    /*  */
    background-color: #FFE53B;
    background-image: linear-gradient(147deg, #FFE53B 0%, #FF2525 74%);
    /*  */
    border-radius: 50%;
    box-shadow: 0 0 0 0 rgba(255, 255, 255, .2);
    /*  */
    transform: translate(-100%, -80%);
    /*  */
    animation: pulse 1.5s infinite;
  }

  section::after {
    /*  */
    position: absolute;
    top: 50%;
    left: 50%;
    z-index: 2;
    content: "";
    /*  */
    width: 300px;
    height: 300px;
    /*  */
    background-color: #FA8BFF;
    background-image: linear-gradient(45deg, #FA8BFF 0%, #2BD2FF 52%, #2BFF88 90%);
    /*  */
    border-radius: 50%;
    box-shadow: 0 0 0 0 rgba(255, 255, 255, .2);
    /*  */
    transform: translate(10%, 20%);
    /*  */
    animation: pulse 1.6s infinite;
  }

  h2 {
    text-align: center;
    margin: 25px 0px 30px;
  }
}

.login_box {
  z-index: 3;
  width: 320px;
  height: 300px;
  padding: 10px;
  background-color: rgba(255, 255, 255, 0.1);
  /*  */
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, .2);
  border-right: 1px solid rgba(255, 255, 255, 0.1);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  /*  */
  backdrop-filter: blur(20px);

  .login_btn {
    display: flex;
    align-items: center;
    justify-content: center;
  }
}

@keyframes pulse {
  50% {
    box-shadow: 0 0 0 50px rgba(255, 255, 255, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(255, 255, 255, 0);
  }
}
</style>
