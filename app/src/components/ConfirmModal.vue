<template>
  <div v-if="show" class="modal-overlay">
    <div class="modal">
      <div class="modal-content">
        <h3>Подтверждение удаления</h3>
        <p class="modal-message" v-html="message"></p>
        <div class="modal-actions">
          <AppButton variant="danger" @click="confirm">Удалить</AppButton>
          <AppButton variant="secondary" @click="cancel">Отмена</AppButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import AppButton from './AppButton.vue'

defineProps<{
  show: boolean
  message: string
}>()

const emit = defineEmits<{
  confirm: []
  cancel: []
}>()

const confirm = () => emit('confirm')
const cancel = () => emit('cancel')
</script>

<style scoped>
.modal-message {
  word-break: break-word;
}

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

.modal-content {
  line-height: 1.5;
}

.modal-content h3 {
  text-align: center;
  margin: 0 0 15px 0;
  border-bottom: 2px solid #d8421c;
  padding-bottom: 0.5rem;
}

.modal-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 20px;
}
</style>
