<template>
  <div class="register">
    <el-form ref="ruleFormRef" :model="ruleForm" size="large">
      <Motion>
        <el-form-item
          :rules="[{ required: true, message: '请输入账号', trigger: 'blur' }]"
          prop="username"
        >
          <el-input clearable v-model="ruleForm.username" placeholder="账号" />
        </el-form-item>
      </Motion>

      <Motion :delay="100">
        <el-form-item prop="phone">
          <el-input clearable v-model="ruleForm.phone" placeholder="手机号码" />
        </el-form-item>
      </Motion>

      <Motion :delay="150">
        <el-form-item prop="verifyCode">
          <div class="w-full flex justify-between">
            <el-input clearable v-model="ruleForm.verifyCode" placeholder="短信验证码" />
            <el-button
              :disabled="isDisabled"
              class="ml-2"
              @click="useVerifyCode().start(ruleFormRef, 'phone')"
            >
              {{ text }}
            </el-button>
          </div>
        </el-form-item>
      </Motion>

      <Motion :delay="200">
        <el-form-item prop="password">
          <el-input clearable show-password v-model="ruleForm.password" placeholder="密码" />
        </el-form-item>
      </Motion>

      <Motion :delay="250">
        <el-form-item :rules="repeatPasswordRule" prop="repeatPassword">
          <el-input
            clearable
            show-password
            v-model="ruleForm.repeatPassword"
            placeholder="确认密码"
          />
        </el-form-item>
      </Motion>

      <!-- <Motion :delay="300">
        <el-form-item>
          <el-checkbox v-model="checked"> 我已仔细阅读并接受 </el-checkbox>
          <el-button type="text"> 《隐私政策》 </el-button>
        </el-form-item>
      </Motion> -->

      <Motion :delay="350">
        <div class="button-wrap">
          <el-button
            size="default"
            type="primary"
            :loading="loading"
            @click="onUpdate(ruleFormRef)"
          >
            确定
          </el-button>
          <el-button size="default" @click="onBack"> 返回 </el-button>
        </div>
      </Motion>
    </el-form>
  </div>
</template>
<script lang="ts" setup>
import { ref, reactive, unref, watch, defineEmits } from "vue";
import { Status } from "../constant";
import Motion from "../utils/motion";

import { updateRules } from "../utils/rule";
import { ElMessage } from "element-plus";
import { useVerifyCode } from "../utils/verifyCode";
const emit = defineEmits(["change"]);
const checked = ref(false);
const loading = ref(false);
const ruleForm = reactive({
  username: "",
  phone: "",
  verifyCode: "",
  password: "",
  repeatPassword: ""
});
const ruleFormRef = ref();
const { isDisabled, text } = useVerifyCode();
const repeatPasswordRule = [
  {
    validator: (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入确认密码"));
      } else if (ruleForm.password !== value) {
        callback(new Error("两次密码不一致!"));
      } else {
        callback();
      }
    },
    trigger: "blur"
  }
];

const onUpdate = async formEl => {
  loading.value = true;
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      if (checked.value) {
        // 模拟请求，需根据实际开发进行修改
        setTimeout(() => {
          ElMessage.success("注册成功");
          loading.value = false;
        }, 2000);
      } else {
        loading.value = false;
        ElMessage.warning("请勾选隐私政策");
      }
    } else {
      loading.value = false;
      return fields;
    }
  });
};

function onBack() {
  // useVerifyCode().end();
  emit("change", Status.LOGIN);
}
</script>

<style lang="scss" scoped>
.register {
  margin-top: -16px;
  width: 100%;
  padding: 20px 20px;
  // background: #fff;
}

.button-wrap {
  display: flex;

  button {
    width: 100%;
  }
}
</style>
