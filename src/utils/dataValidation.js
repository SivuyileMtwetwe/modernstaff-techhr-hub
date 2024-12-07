export function validateEmployeeData(employee) {
    if (!employee.name || !employee.email) {
      return false;
    }
    return true;
  }
  