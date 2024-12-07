<template>
  <nav>
    <ul>
      <li><router-link to="/dashboard">Dashboard</router-link></li>
      <li><router-link to="/employees">Employees</router-link></li>
      <li><router-link to="/payroll">Payroll</router-link></li>
      <li><router-link to="/">Login</router-link></li> <!-- Add this -->
    </ul>
  </nav>
</template>


<script>
export default {
  name: 'AppSidebar',
};
</script>

<style scoped>
nav ul {
  list-style: none;
  padding: 0;
}
nav ul li {
  margin: 1em 0;
}
</style>
