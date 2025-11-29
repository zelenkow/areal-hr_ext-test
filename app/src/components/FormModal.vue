<template>
  <div v-if="show" class="modal-overlay">
    <div class="modal">
      <h2>{{ title }}</h2>
      <form @submit.prevent="$emit('submit')">
        <div class="modal-content">
          <slot></slot>
        </div>

        <div class="form-actions">
          <AppButton variant="primary" type="submit">
            {{ submitText }}
          </AppButton>
          <AppButton variant="secondary" type="button" @click="$emit('cancel')"> Отмена </AppButton>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import AppButton from './AppButton.vue'

interface Props {
  show: boolean
  title: string
  submitText?: string
}

withDefaults(defineProps<Props>(), {
  submitText: 'Сохранить',
})

defineEmits<{
  submit: []
  cancel: []
}>()
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  min-width: 600px;
  max-width: 600px;
  max-height: 90vh;
}

.modal h2 {
  color: #2c3e50;
  border-bottom: 2px solid #42b983;
  padding-bottom: 0.5rem;
}

.modal-content {
  margin-bottom: 2rem;
}
.form-actions {
  display: flex;
  gap: 1rem;
}
</style>
