<template>
  <div>
    <div class="flex justify-end mb-4">
      <button
        @click="showModal = true"
        class="px-4 py-2 text-white bg-blue-600 rounded-md shadow-md hover:bg-blue-700 focus:outline-none"
      >
        View Payslip
      </button>
    </div>

    <!-- Modal -->
    <div v-if="showModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
      <div class="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h3 class="text-xl font-semibold">Payslip</h3>
        <p>Name: {{ payslip.name }}</p>
        <p>Email: {{ payslip.email }}</p>
        <p>Salary: {{ payslip.salary }}</p>
        <button
          @click="showModal = false"
          class="mt-4 px-4 py-2 text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none"
        >
          Close
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      payslip: {
        name: 'John Doe',
        email: 'john.doe@example.com',
        salary: '$2000.00',
      },
      showModal: false,
    };
  },
};
</script>
