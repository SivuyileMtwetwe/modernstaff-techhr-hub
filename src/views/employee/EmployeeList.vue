<template>
  <div class="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
    <h2 class="text-2xl font-semibold mb-4">Employee List</h2>
    <table class="min-w-full table-auto">
      <thead>
        <tr>
          <th class="px-4 py-2 text-left">Name</th>
          <th class="px-4 py-2 text-left">Role</th>
          <th class="px-4 py-2 text-left">Email</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="employee in employees" :key="employee.id">
          <td class="px-4 py-2">{{ employee.name }}</td>
          <td class="px-4 py-2">{{ employee.role }}</td>
          <td class="px-4 py-2">{{ employee.email }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      employees: [
        { id: 1, name: 'John Doe', role: 'Software Engineer', email: 'john.doe@example.com' },
        { id: 2, name: 'Jane Smith', role: 'HR Manager', email: 'jane.smith@example.com' },
        // More employees can be added
      ],
    };
  },
};
</script>
