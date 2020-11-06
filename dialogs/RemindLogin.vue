<script>
import StandartDialog from '@freedomsex/modal-dialogs/StandartDialog';
import CaptchaImage from '@freedomsex/captcha-image/SimpleCaptcha';
import EmailSended from './EmailSended';

export default {
  data() {
    return {
      email: '',
      hint: 'Введите ваш емайл',
      confirm: false,
      error: false,

      captcha: {
        need: false,
        code: '',
        token: null,
      },
    };
  },
  components: {
    StandartDialog,
    EmailSended,
    CaptchaImage,
  },
  computed: {},
  methods: {
    close() {
      this.$emit('close');
    },
    send() {
      if (!this.email) {
        return;
      }
      const params = {
        email: this.email,
        token: this.captcha.token,
        code: this.captcha.code,
      };
      this.hint = 'Отправляю...';
      this.$api.res('remind', 'auth').post(params).then(({data}) => {
        this.hint = data.say;
        this.error = data.error;
        this.sended(data);
      }).catch((error) => {
        this.hint = 'Ошибка отправки.';
        this.onError(error);
      });
    },
    sended(data) {
      if (!data.error) {
        this.hint = 'Успешно. Подождите.';
        this.confirm = true;
      }
      if (data.error == 'strict') {
        this.captcha.need = true;
      }
    },
    onError(error) {
      if (error.response) {
        const {status} = error.response;
        if (status == '404') {
          //
        }
      }
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
  <div class="">
    <StandartDialog @close="close" v-if="!confirm">
      <template #title>
        Восстановить пароль
      </template>

      <template #default>
        <div class="modal__section">
          Напоминание возможно только по подтвержденному вами
          ранее адресу электронной почты.
        </div>
        <div class="modal__section">
          <div class="field" style="max-width: 350px;">
            <div class="control has-icons-left">
              <input class="input" type="email" name="email" v-model="email" placeholder="Ваш емайл адрес">
              <span class="icon is-small is-left">
                <i class="material-icons">email</i>
              </span>
            </div>
          </div>
        </div>

        <div class="activity-section" v-show="error && captcha.need" style="max-width: 270px;">
          <div class="activity-section__title">Код</div>
          <CaptchaImage ref="captcha" apiName="auth" @token="setToken" @input="setCode"/>
        </div>

        <div class="modal__section">
          {{hint}}
        </div>
      </template>

      <template #footer>
        <button class="button is-primary" @click="send">
          Отправить
        </button>
      </template>

    </StandartDialog>

    <EmailSended @close="$emit('close')" v-else/>
  </div>
</template>
