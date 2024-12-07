<template>
    <div class="max-w-2xl mx-auto p-6 space-y-4 bg-white shadow-md rounded-lg">
      <h2 class="text-2xl font-semibold">Payroll Form</h2>
  
      <form @submit.prevent="generatePayslip">
        <!-- Employee Name -->
        <div class="mb-4">
          <label for="name" class="block text-sm font-medium text-gray-700">Employee Name</label>
          <input
            v-model="employee.name"
            type="text"
            id="name"
            class="block w-full px-4 py-2 mt-1 text-sm border rounded-md focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
  
        <!-- Hours Worked -->
        <div class="mb-4">
          <label for="hoursWorked" class="block text-sm font-medium text-gray-700">Hours Worked</label>
          <input
            v-model="employee.hoursWorked"
            type="number"
            id="hoursWorked"
            class="block w-full px-4 py-2 mt-1 text-sm border rounded-md focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
  
        <!-- Hourly Rate -->
        <div class="mb-4">
          <label for="hourlyRate" class="block text-sm font-medium text-gray-700">Hourly Rate</label>
          <input
            v-model="employee.hourlyRate"
            type="number"
            id="hourlyRate"
            class="block w-full px-4 py-2 mt-1 text-sm border rounded-md focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
  
        <!-- Submit Button -->
        <button
          type="submit"
          class="w-full py-2 mt-4 text-white bg-blue-600 rounded-md shadow-md hover:bg-blue-700 focus:outline-none"
        >
          Generate Payslip
        </button>
      </form>
  
      <!-- Display Payslip -->
      <div v-if="payslip" class="mt-4 p-4 bg-gray-100 rounded-md shadow-sm">
        <h3 class="text-xl font-semibold">Payslip</h3>
        <p>Name: {{ payslip.name }}</p>
        <p>Email: {{ payslip.email }}</p>
        <p>Salary: {{ payslip.salary }}</p>
      </div>
    </div>
  </template>
  
  <script>
  import { calculateSalary, generatePayslip } from '@/utils/payrollCalculations';
  
  export default {
    data() {
      return {
        employee: {
          name: '',
          hoursWorked: 0,
          hourlyRate: 0,
        },
        payslip: null,
      };
    },
    methods: {
      generatePayslip() {
        // Calculate the salary based on hours worked and hourly rate
        const salary = calculateSalary(this.employee.hoursWorked, this.employee.hourlyRate);
        // Generate the payslip with the calculated salary
        this.payslip = generatePayslip(this.employee, salary);
      },
    },
  };
  </script>
  