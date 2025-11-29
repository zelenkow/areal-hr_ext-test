<template>
  <table class="data-table">
    <thead>
      <tr>
        <slot name="headers"></slot>
      </tr>
    </thead>
    <tbody>
      <slot name="rows"></slot>
    </tbody>
  </table>
</template>

<style scoped>
.data-table {
  width: 100%;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border-collapse: collapse;
  table-layout: fixed;
}

:deep(th) {
  background: #f8f9fa;
  font-weight: 600;
  color: #2c3e50;
  border-bottom: 2px solid #e9ecef;
  text-align: center;
  padding: 16px;
}

:deep(td) {
  text-align: center;
  border-bottom: 1px solid #e9ecef;
  padding: 8px 8px;
}

:deep(tbody tr:hover) {
  background: #f8f9fa;
}

:deep(.actions) {
  white-space: nowrap;
}

:deep(.actions .btn) {
  margin-right: 0.5rem;
}
</style>
