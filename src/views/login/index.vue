<template>
  <div class="login-container">
    <!-- 表头 -->
    <van-nav-bar
      class="app-nav-bar"
      title="登录"
      left-arrow
      @click-left="$router.back()"
    />
    <!-- 登录表单 -->
    <van-form
      :show-error="false"
      :show-error-message="false"
      validate-first
      ref="login-form"
      @submit="onLogin"
      @failed="onFailed"
    >
      <van-field
        v-model="user.mobile"
        icon-prefix="toutiao"
        left-icon="shouji"
        name="mobile"
        center
        placeholder="请输入手机号"
        :rules="formRules.mobile"
      />
      <van-field
        v-model="user.code"
        clearable
        icon-prefix="toutiao"
        left-icon="yanzhengma"
        name="code"
        center
        placeholder="请输入验证码"
        :rules="formRules.code"
      >
        <template #button>
          <van-count-down
            v-if="isCountDownShow"
            :time="1000 * 60"
            format="ss s"
            @finish="isCountDownShow = false"
          />
          <van-button
            v-else
            class="send-btn"
            size="mini"
            :loading="isSendSmsLoading"
            @click.prevent="onSendSms"
            round
          >获取验证码</van-button>
        </template>
      </van-field>
      <!-- 登录按钮 -->
      <div class="login-btn-wrap">
        <van-button class="login-btn" type="info" block>登录</van-button>
      </div>
    </van-form>
  </div>
</template>

<script>
import { login, sendSms } from '@/api/user'
import { Toast } from 'vant'
export default {
  name: 'Login',
  data () {
    return {
      user: {
        mobile: '', // 手机号
        code: '' // 验证码
      },
      formRules: {
        mobile: [
          { required: true, message: '请输入手机号' },
          { pattern: /^1[3|5|7|8|9]\d{9}$/, message: '请输入正确的手机号' }
        ],
        code: [
          { required: true, message: '请输入验证码' },
          { pattern: /\d{6}$/, message: '请输入正确的验证码' }
        ]
      },
      isCountDownShow: false, // 显示倒计时或发送验证码按钮
      isSendSmsLoading: false // 发送验证码按钮的loading
    }
  },
  methods: {
    async onLogin () {
      Toast.loading({
        message: '登录中...', // 提示文本
        forbidClick: true, // 禁止背景点击
        duration: 0 // 展示时长(ms)，值为 0 时，toast 不会消失，默认为2000
      })
      // 1、找到数据接口
      // 2、封装请求方法
      // 3、请求调用登录
      try {
        const { data } = await login(this.user)
        // 4、处理响应结果
        // console.log(res)
        Toast.success('登录成功')

        // 将后端返回的用户状态（token）放到vuex容器中
        this.$store.commit('setUser', data.data)
        // 登录成功，跳转回原来的页面
        this.$router.back() // 这种方式不太好
      } catch (err) {
        console.log(err)
        Toast.fail('登录失败，手机号或验证码错误')
      }
    },
    onFailed (error) {
      console.log(error)
      if (error.errors[0]) {
        Toast({
          message: error.errors[0].message,
          position: 'top'
        })
      }
    },
    // 点击发送验证码
    async onSendSms () {
      try {
        // 校验手机号码
        await this.$refs['login-form'].validate('mobile')

        // 验证通过，请求发送验证码
        this.isSendSmsLoading = true
        await sendSms(this.user.mobile)

        // 短信发出去了，隐藏按钮，显示倒计时
        this.isCountDownShow = true
        // 倒计时结束，隐藏显示器，显示按钮（监视倒计时的finish事件处理）
      } catch (err) {
        // console.log('验证失败', err)
        // try里任何代码的错误都会进入catch中
        // 不同的错误需要不同的提示，那就需要判断
        let message = ''
        if (err && err.response && err.response.status === 429) {
          // 发送短信失败的错误提示
          message = '发送太频繁，请稍后再试'
        } else if (err.name === 'mobile') {
          // 表单验证失败的错误提示
          message = err.message
        } else {
          // 未知错误
          message = '发送失败，请稍后重试'
        }

        // 提示用户
        Toast({
          message,
          position: 'top'
        })
      }
      // 无论验证码发送成功与否，都应该关闭loading
      this.isSendSmsLoading = false
    }
  }
}
</script>

<style scoped lang="less">
.login-container {
  .send-btn {
    width: 76px;
    height: 23px;
    background-color: #ededed;
    .van-button__text {
        font-size: 11px;
        color: #666666;
      }
  }
  .login-btn-wrap {
    padding: 26px 16px;
    .login-btn {
      background-color: #6db4fb;
      border: none;
      .van-button__text {
        font-size: 15px;
      }
    }
  }
}
</style>
