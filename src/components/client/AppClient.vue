<template>
  <table class="responsive-table highlight">
    <thead>
    <tr>
      <th>Почта</th>
      <th>Имя</th>
      <th>Оплата</th>
      <th>Телефон</th>
    </tr>
    </thead>

    <tbody>
    <tr v-for="(client, i) in clients" :key="i">
      <td>{{ client.email }}</td>
      <td>{{ client.name }}</td>
      <td>{{ client.payInfo }}</td>
      <td>{{ client.phone }}</td>
    </tr>

    </tbody>
  </table>
</template>

<script>

export default {
  props:['clients'],
  setup(){

  }
}
</script>

<style scoped>

</style>