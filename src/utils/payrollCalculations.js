export function calculateSalary(hoursWorked, hourlyRate) {
    return hoursWorked * hourlyRate;
  }
  
  export function generatePayslip(employee, salary) {
    return {
      name: employee.name,
      email: employee.email || 'Not Provided',
      salary: `$${salary.toFixed(2)}`,
    };
  }
  