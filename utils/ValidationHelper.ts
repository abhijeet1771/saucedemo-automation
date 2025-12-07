// DUPLICATE CODE: Similar validation logic to other helpers
export class ValidationHelper {
  // DUPLICATE: Similar to TestDataHelper.validateAge()
  static validateAge(age: number) {
    if (age < 18 || age > 100) {
      return false;
    }
    return true;
  }

  // MISSING NULL CHECK
  static validateEmail(email: string) {
    return email.includes('@') && email.includes('.'); // Will fail if email is null
  }

  // PERFORMANCE: Inefficient regex (compiled on each call)
  static validatePhone(phone: string) {
    const regex = /^\d{10}$/; // Should be compiled once
    return regex.test(phone);
  }

  // ERROR HANDLING: Generic catch
  static safeValidate(data: any) {
    try {
      return this.validateEmail(data.email) && this.validateAge(data.age);
    } catch (e: any) {
      // Generic catch - should be specific
      return false;
    }
  }
}

