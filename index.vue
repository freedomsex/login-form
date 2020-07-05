<script>
import RemindLogin from './dialogs/RemindLogin';
import CaptchaImage from '@freedomsex/captcha-image/SimpleCaptcha';

export default {
  props: [],
  data() {
    return {
      form: {
        login: '',
        password: '',
        error: false,
      },
      captcha: {
        enabled: false,
        code: '',
        token: null,
      },
      remind: false,
      hint: 'Введите данные',
    };
  },
  components: {
    RemindLogin,
    CaptchaImage,
  },
  mounted() {
    //
  },
  methods: {
    async send() {
      try {
        let data = await this.$service.run('login/send', {
          login: this.form.login,
          password: this.form.password,
          token: this.captcha.token,
          code: this.captcha.code,
        });
        this.onLogin(data);
      } catch (e) {
        this.onError(e);
      }
    },
    onLogin(data) {
      this.hint = 'Успешно. Подождите.';
      this.emit('success');
      // window.location.href = '/';
    },
    onError({response}) {
      this.captcha.enabled = false;
      let {status} = response;
      if (status == 428) {
        this.captcha.enabled = true;
        this.hint = 'Введите код.';
      }
      if (status == 424) {
        this.captcha.enabled = true;
        this.hint = 'Неверный код.';
        //
      }
      if (status == 423) {
        this.captcha.enabled = true;
        this.hint = 'Восстановите пароль.';
        //
      }
      if (status == 401) {
        this.hint = 'Неверный логин или пароль.';
      }
      if (this.form.error && this.$refs.captcha) {
        this.$refs.captcha.refresh();
      }
      this.form.error = true;
    },
    setToken(token) {
      this.captcha.token = token;
    },
    setCode(code) {
      this.captcha.code = code;
    },
  },
};
</script>

<template>
  <div>
    <div class="lofin-form">
      <div class="activity-section">
        <div class="activity-section__title">Ваш логин</div>
        <div class="field">
          <div class="control has-icons-left">
            <span class="icon is-small is-left">
              <i class="material-icons">person</i>
            </span>
            <input class="input" type="text" v-model="form.login" placeholder="Введите логин">
          </div>
        </div>
      </div>

      <div class="activity-section">
        <div class="activity-section__title">Пароль</div>
        <div class="control has-icons-left">
          <span class="icon is-small is-left">
            <i class="material-icons">vpn_key</i>
          </span>
          <input class="input" type="text" v-model="form.password" placeholder="Введите пароль">
        </div>
      </div>
      <div class="activity-section" v-if="form.error && captcha.enabled">
        <div class="activity-section__title">Код</div>
        <CaptchaImage ref="captcha" apiName="auth"
         @token="setToken"
         @input="setCode"/>
      </div>
    </div>

    <div class="activity-section">
      <div class="buttons">
        <button class="button is-primary" @click="send">
          Войти
        </button>
        <button class="button" @click="remind = true">
          Не помню
        </button>
      </div>
    </div>

    <div class="activity-section">
      {{hint}}
    </div>

    <slot name="extend"></slot>

    <RemindLogin v-if="remind" @close="remind = false"/>
  </div>
</template>

<style lang="less">

</style>
