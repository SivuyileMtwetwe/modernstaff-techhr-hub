<template>
  <div>
    <h2>Payroll Dashboard</h2>
    <form @submit.prevent="processPayroll">
      <input v-model="hoursWorked" type="number" placeholder="Hours Worked" />
      <input v-model="hourlyRate" type="number" placeholder="Hourly Rate" />
      <button type="submit">Calculate Salary</button>
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
      hoursWorked: 0,
      hourlyRate: 0,
      employee: { name: 'John Doe', email: 'john.doe@example.com' },
      payslip: null,
    };
  },
  methods: {
    processPayroll() {
      const salary = calculateSalary(this.hoursWorked, this.hourlyRate);
      this.payslip = generatePayslip(this.employee, salary);
    },
  },
};
</script>
