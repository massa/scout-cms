<template lang="pug">
  div.box
    h3.title
      | Atualizar Solicitação
    form(v-on:submit.prevent="submitForm()" v-if="request && request._id")
      br
      h5.subtitle.is-5 Conferir Dados

      label.label Id
      p.control
        span {{request._id}}
      label.label Tipo
      p.control
        span {{typeFormated(request)}}
      label.label Recompensa
      p.control
        span {{request.reward}}
      label.label Justificativa
      p.control
        span {{request.resume}}

      br
      h5.subtitle.is-5 Dados do(a) Solicitante
      label.label Registro
      p.control
        span {{request.author.register}}
      label.label Nome
      p.control
        span {{request.author.name}}
      label.label Email
      p.control
        span {{request.author.email}}
      label.label Telefone
      p.control
        span {{request.author.phone}}
      label.label Celular
      p.control
        span {{request.author.cellphone}}
      label.label Função no Escotismo
      p.control
        span {{request.author.role}}
      label.label Grupo Escoteiro
      p.control
        span {{request.author.group.number}} - {{request.author.group.name}}

      br
      h5.subtitle.is-5 Dados do(a) Agraciado(a)
      label.label Registro
      p.control
        span {{request.gifted.register}}
      label.label Nome
      p.control
        span {{request.gifted.name}}
      label.label Grupo Escoteiro
      p.control
        span {{request.gifted.group.number}} - {{request.gifted.group.name}}

      br
      h5.subtitle.is-5 Parecer da Solicitação
      small.help Coloque aqui uma mensagem de resposta ao solicitante
      br
      p.control
        label.label Parecer
        textarea.textarea(v-model="request.reply" v-validate="'min:10|max:500'" v-bind:class="{'is-danger': errors.has('reply') }" name="reply")
        span.help.is-danger(v-show="errors.has('reply')") {{ errors.first('reply') }}

      br
      h5.subtitle.is-5 Atualizar Status
      label.label Status
      p.control
        select(name="status" v-model="request.status" v-validate="'required'" data-vv-as="Status da Solicitação" v-bind:class="{'is-danger': errors.has('status')}")
          option(default value="") Selecione...
          option(value="waiting") Aguardando
          option(value="analyzing") Analisando
          option(value="rejected") Rejeitado
          option(value="approved") Aprovado
          option(value="issued") Emitido
        span.help.is-danger(v-if="errors.has('status')") {{ errors.first('status') }}
        small.help.is-info(v-else) O status escolhido significa que: #[strong {{getStatusMessage(request)}}]

      p.control.submit-button
        button.button.is-medium.is-primary(type="submit" v-bind:disabled="errors.any()") Atualizar
</template>

<script>
  import Vue from 'vue'
  import rewardsService from '../../services/rewards'
  import Notification from 'vue-bulma-notification'
  // import router from '../../router'

  const NotificationComponent = Vue.extend(Notification)
  const openNotification = (propsData = {
    title: '',
    message: '',
    type: '',
    direction: '',
    duration: 4500,
    container: '.notifications'
  }) => {
    return new NotificationComponent({
      el: document.createElement('div'),
      propsData
    })
  }

  export default {
    beforeRouteEnter (to, from, next) {
      rewardsService.get(to.params.id).then((response) => {
        next(vm => {
          vm.request = response.body
        })
      }, (response) => {
        next(false)
      })
    },
    data () {
      return {
        request: {}
      }
    },
    methods: {
      statusFormated (request) {
        return rewardsService.statusFormated(request)
      },
      typeFormated (request) {
        return rewardsService.typeFormated(request)
      },
      getStatusMessage (request) {
        return rewardsService.getStatusMessage(request)
      },
      submitForm () {
        this.$validator.validateAll().then(success => {
          if (!success) return
          this.editRequest()
        })
      },
      editRequest () {
        rewardsService.update(this.request._id, {status: this.request.status, reply: this.request.reply})
        .then(response => {
          openNotification({
            message: 'Solicitação atualizada com sucesso!',
            type: 'success',
            duration: 3000
          })
          this.$router.push({name: 'Dashboard Distintivo Semeador'})
        }, response => {
          let message = 'Erro ao atualizar a solicitação!'

          openNotification({
            message: message,
            type: 'danger',
            duration: 3000
          })
        })
      }
    }
  }
</script>

<style lang="sass" scoped>
  .submit-button
    padding-top: 2rem
    text-align: center
</style>
