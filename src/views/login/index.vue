<template>
  <div class="container">
    <div class="center">
      <div class="ear ear--left"></div>
      <div class="ear ear--right"></div>
      <div class="face" ref="faceRef">
        <div class="eyes">
          <div class="eye eye--left">
            <div class="glow"></div>
          </div>
          <div class="eye eye--right">
            <div class="glow"></div>
          </div>
        </div>
        <div class="nose">
          <svg width="38.161" height="22.03">
            <path
              d="M2.017 10.987Q-.563 7.513.157 4.754C.877 1.994 2.976.135 6.164.093 16.4-.04 22.293-.022 32.048.093c3.501.042 5.48 2.081 6.02 4.661q.54 2.579-2.051 6.233-8.612 10.979-16.664 11.043-8.053.063-17.336-11.043z"
              fill="#243946"
            ></path>
          </svg>
          <div class="glow"></div>
        </div>
        <div class="mouth">
          <svg class="smile" viewBox="-2 -2 84 23" width="84" height="23">
            <path
              d="M0 0c3.76 9.279 9.69 18.98 26.712 19.238 17.022.258 10.72.258 28 0S75.959 9.182 79.987.161"
              fill="none"
              stroke-width="3"
              stroke-linecap="square"
              stroke-miterlimit="3"
            ></path>
          </svg>
          <div class="mouth-hole"></div>
          <div class="tongue breath" ref="tongueRef">
            <div class="tongue-top"></div>
            <div class="line"></div>
            <div class="median"></div>
          </div>
        </div>
      </div>
      <div class="hands">
        <div class="hand hand--left" :ref="setHandsRef">
          <div class="finger">
            <div class="bone"></div>
            <div class="nail"></div>
          </div>
          <div class="finger">
            <div class="bone"></div>
            <div class="nail"></div>
          </div>
          <div class="finger">
            <div class="bone"></div>
            <div class="nail"></div>
          </div>
        </div>
        <div class="hand hand--right" :ref="setHandsRef">
          <div class="finger">
            <div class="bone"></div>
            <div class="nail"></div>
          </div>
          <div class="finger">
            <div class="bone"></div>
            <div class="nail"></div>
          </div>
          <div class="finger">
            <div class="bone"></div>
            <div class="nail"></div>
          </div>
        </div>
      </div>
      <Motion v-if="currentStatus === Status.LOGIN">
        <div class="login">
          <label>
            <el-input
              size="large"
              placeholder="输入账号(字母、数字)"
              @focus="usernameFocus"
              @blur="usernameBlur"
              @input="usernameInput"
              v-model="userInfo.username"
              :input-style="{ borderRadius: '30px' }"
            >
            </el-input>
          </label>
          <label>
            <el-input
              size="large"
              placeholder="输入密码(字母、数字和下划线)"
              @focus="passwordFocus"
              @blur="passwordBlur"
              v-model="userInfo.password"
              type="password"
              show-password
              minlength="6"
              maxlength="16"
              :input-style="{ borderRadius: '30px' }"
            >
            </el-input>
          </label>
        </div>

        <div class="button-wrap">
          <el-button @click="login" class="login-button">登录</el-button>
          <el-button @click="handleChangeStatus(Status.REGISTER)" class="register-button"
            >注册</el-button
          >
        </div>
        <div class="social-buttons">
          <SvgIcon class="social" icon="fa:wechat" />
          <SvgIcon class="social" icon="mdi:qqchat" />
          <SvgIcon class="social" icon="ant-design:alipay-outlined" />
        </div>
        <div class="footer">CD - ADMIN</div>
      </Motion>
      <RegisterForm v-if="currentStatus === Status.REGISTER" @change="handleChangeStatus" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, unref, watch, computed } from "vue";
import { useThrottleFn, useDebounceFn } from "@vueuse/core";
import SvgIcon from "/@/modules/components/Icons/Icon.vue";
import RegisterForm from "./components/register-form.vue";
import { Status } from "./constant";
import Motion from "./utils/motion";

const currentStatus = ref<Status>(Status.LOGIN);
const handleChangeStatus = (status: Status) => {
  currentStatus.value = status;
};
/* 小狗脸ref */
const faceRef = ref(null);
const tongueRef = ref(null);
/* 小狗手臂ref */
const handsRef = ref([]);
const setHandsRef = el => {
  handsRef.value.push(el);
};

/* 用户名事件 */
const usernameFocus = () => {
  const length = Math.min(userInfo.username.length - 16, 19);
  unref(handsRef).forEach(hand => {
    hand.classList.remove("hide");
    hand.classList.remove("peek");
  });
  unref(faceRef).style.setProperty("--rotate-head", `${-length}deg`);
};
const usernameBlur = () => {
  unref(faceRef).style.setProperty("--rotate-head", `0deg`);
};
const usernameInput = useThrottleFn(value => {
  const length = Math.min(value.length - 16, 19);
  unref(faceRef).style.setProperty("--rotate-head", `${-length}deg`);
}, 100);

/* 密码事件 */
const passwordFocus = () => {
  unref(handsRef).forEach(hand => {
    hand.classList.add("hide");
  });
  unref(tongueRef).classList.remove("breath");
};
const passwordBlur = () => {
  unref(handsRef).forEach(hand => {
    hand.classList.remove("hide");
    hand.classList.remove("peek");
  });
  unref(tongueRef).classList.add("breath");
};

const userInfo = reactive({
  username: "",
  password: ""
});
const login = useDebounceFn(() => {
  const { username, password } = unref(userInfo);
  console.log("denglu", username, password);
});
</script>

<style lang="scss" scoped>
.username {
  .el-input__inner {
    border-radius: 50%;
  }
}
</style>
<style scoped>
.container {
  width: 100vw;
  max-width: 100vw;
  height: 100vh;
  background-color: #243946;
}

.center {
  position: relative;
  top: 50%;
  left: 50%;
  display: inline-block;
  width: 400px;
  border-radius: 3px;
  transform: translate(-50%, -50%);

  /* overflow: hidden; */
  background-image: linear-gradient(to top right, #f9a743, #f9db5f);
}

@media screen and (max-height: 500px) {
  .center {
    transition: transform 0.5s;
    transform: translate(-50%, -50%) scale(0.8);
  }
}

.center .ear {
  position: absolute;
  top: -110px;
  width: 200px;
  height: 200px;
  border-radius: 50%;
  background-color: #243946;
}

.center .ear.ear--left {
  left: -135px;
}

.center .ear.ear--right {
  right: -135px;
}

.center .face {
  --rotate-head: 0deg;

  display: flex;
  flex-direction: column;
  align-items: center;
  width: 200px;
  height: 150px;
  margin: 80px auto 10px;
  transform: rotate(var(--rotate-head));
  transition: transform 0.2s;
  transform-origin: center 20px;
}

.center .eye {
  display: inline-block;
  width: 25px;
  height: 25px;
  border-radius: 50%;
  background-color: #243946;
}

.center .eye.eye--left {
  margin-right: 40px;
}

.center .eye.eye--right {
  margin-left: 40px;
}

.center .eye .glow {
  position: relative;
  top: 3px;
  right: -12px;
  width: 12px;
  height: 6px;
  border-radius: 50%;
  background-color: #fff;
  transform: rotate(38deg);
}

.center .nose {
  position: relative;
  top: 30px;
  transform: scale(1.1);
}

.center .nose .glow {
  position: absolute;
  top: 3px;
  left: 32%;
  width: 15px;
  height: 8px;
  border-radius: 50%;
  background-color: #476375;
}

.center .mouth {
  position: relative;
  margin-top: 45px;
}

.center svg.smile {
  position: absolute;
  left: -28px;
  top: -19px;
  transform: scaleX(1.1);
  stroke: #243946;
}

.center .mouth-hole {
  position: absolute;
  top: 0;
  left: -50%;
  width: 60px;
  height: 15px;
  border-radius: 50%/100% 100% 0% 0;
  transform: rotate(180deg);
  background-color: #243946;
  z-index: -1;
}

.center .tongue {
  position: relative;
  top: 5px;
  width: 30px;
  height: 20px;
  background-color: #ffd7dd;
  transform-origin: top;
  transform: rotateX(60deg);
}

.center .tongue.breath {
  animation: breath 0.3s infinite linear;
}

.center .tongue-top {
  position: absolute;
  bottom: -15px;
  width: 30px;
  height: 30px;
  border-radius: 15px;
  background-color: #ffd7dd;
}

.center .line {
  position: absolute;
  top: 0;
  width: 30px;
  height: 5px;
  background-color: #fcb7bf;
}

.center .median {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 4px;
  height: 25px;
  border-radius: 5px;
  background-color: #fcb7bf;
}

.center .hands {
  position: relative;
}

.center .hands .hand {
  position: absolute;
  top: -6px;
  display: flex;
  transition: transform 0.5s ease-in-out;
  z-index: 1;
}

.center .hands .hand--left {
  left: 50px;
}

.center .hands .hand--left.hide {
  transform: translate(68px, -152px) rotate(-160deg);
}

.center .hands .hand--left.peek {
  transform: translate(0, -120px) rotate(-160deg);
}

.center .hands .hand--right {
  left: 295px;
}

.center .hands .hand--right.hide {
  transform: translate(-72px, -152px) rotate(160deg);
}

.center .hands .hand--right.peek {
  transform: translate(-4px, -120px) rotate(160deg);
}

.center .hands .finger {
  position: relative;
  z-index: 0;
}

.center .hands .finger .bone {
  width: 20px;
  height: 20px;
  border: 2px solid #243946;
  border-bottom: none;
  border-top: none;
  background-color: #fac555;
}

.center .hands .finger .nail {
  position: absolute;
  left: 0;
  top: 10px;
  width: 20px;
  height: 18px;
  border-radius: 50%;
  border: 2px solid #243946;
  background-color: #fac555;
  z-index: -1;
}

.center .hands .finger:nth-child(1),
.center .hands .finger:nth-child(3) {
  left: 4px;
  z-index: 1;
}

.center .hands .finger:nth-child(1) .bone,
.center .hands .finger:nth-child(3) .bone {
  height: 10px;
}

.center .hands .finger:nth-child(3) {
  left: -4px;
}

.center .hands .finger:nth-child(2) {
  top: -5px;
  z-index: 2;
}

.center .hands .finger:nth-child(1) .nail,
.center .hands .finger:nth-child(3) .nail {
  top: 0;
}

.center .login {
  margin-top: 2px;
  position: relative;
  display: flex;
  flex-direction: column;
}

.center .login label {
  position: relative;
  padding: 5px 20px 0;
}

.button-wrap {
  display: flex;
  margin: 20px 20px 0;
}

.center .login-button,
.register-button {
  width: 100%;
  height: 35px;
  border: none;
  border-radius: 30px;
}

.center .login .password-button {
  position: absolute;
  top: 9px;
  right: 25px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 80px;
  height: 27px;
  border-radius: 30px;
  border: none;
  outline: none;
  background-color: #243946;
  color: #fff;
}

.center .password-button:active {
  transform: scale(0.95);
}

.login-button {
  width: 100%;
  outline: none;
  background-color: #243946;
  color: #fff;
  transition: transform 0.1s;
}

.register-button {
  background-color: #f4f1f5;
  color: rgb(46 43 43);
  width: 100%;
  outline: none;
  transition: transform 0.1s;
}

.button-wrap button:active {
  transform: scale(0.95);
}

.center .social-buttons {
  display: flex;
  justify-content: center;
  margin-top: 25px;
}

.center .social-buttons .social {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 35px;
  height: 35px;
  margin: 0 10px;
  border-radius: 50%;
  background-color: #243946;
  color: #fff;
  font-size: 18px;
  cursor: pointer;
}

.center .social-buttons .social:active {
  transform: scale(0.95);
}

.center .footer {
  text-align: center;
  margin-top: 15px;
  color: #05121a;
}

@keyframes breath {
  0%,
  100% {
    transform: rotateX(0deg);
  }

  50% {
    transform: rotateX(60deg);
  }
}

@keyframes breath {
  0%,
  100% {
    transform: rotateX(0deg);
  }

  50% {
    transform: rotateX(60deg);
  }
}
</style>
