<template>
    <div>
      <h2>Payroll Form</h2>
      <form @submit.prevent="generatePayslip">
        <input v-model="employee.name" type="text" placeholder="Employee Name" required />
        <input v-model="employee.hoursWorked" type="number" placeholder="Hours Worked" required />
        <input v-model="employee.hourlyRate" type="number" placeholder="Hourly Rate" required />
        <button type="submit">Generate Payslip</button>
      </form>
  
      <div v-if="payslip">
        <h3>Payslip</h3>
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
        const salary = calculateSalary(this.employee.hoursWorked, this.employee.hourlyRate);
        this.payslip = generatePayslip(this.employee, salary);
      },
    },
  };
  </script>
  