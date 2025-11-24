<template>
  <button
    :class="buttonClasses"
    :type="type"
    @click="$emit('click')"
  >
    <slot />
  </button>
</template>

<script>
export default {
  name: 'AppButton',
  props: {
    variant: {
      type: String,
      default: 'primary',
      validator: (value) => ['primary', 'secondary', 'danger', 'create', 'edit'].includes(value)
    },
    type: {
      type: String,
      default: 'button'
    }
  },
  emits: ['click'],
  computed: {
    buttonClasses() {
      const baseClasses = 'btn'
      const variantClasses = {
        primary: 'btn-primary',
        secondary: 'btn-secondary',
        danger: 'btn-danger',
        create: 'btn-create',
        edit: 'btn-edit'
      }
      return `${baseClasses} ${variantClasses[this.variant]}`
    }
  }
}
</script>

<style scoped>
.btn {
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background-color 0.2s;
}

.btn-primary,
.btn-create {
  background: #42b983;
  color: white;
}

.btn-primary:hover,
.btn-create:hover {
  background: #3aa876;
}

.btn-secondary,
.btn-edit {
  background: #3498db;
  color: white;
}

.btn-secondary:hover,
.btn-edit:hover {
  background: #2980b9;
}

.btn-danger {
  background: #e74c3c;
  color: white;
}

.btn-danger:hover {
  background: #c0392b;
}
</style>