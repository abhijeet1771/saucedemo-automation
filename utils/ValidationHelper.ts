// NULL SAFETY VIOLATIONS: Multiple null/undefined access issues
export class ValidationHelper {
  // NULL SAFETY: No null check on age parameter
  static validateAge(age: number) {
    // NULL SAFETY VIOLATION: age could be null/undefined
    if (age < 18 || age > 100) {
      return false;
    }
    return true;
  }

  // NULL SAFETY: Missing null check and optional chaining
  static validateEmail(email: string) {
    // NULL SAFETY VIOLATION: Will throw if email is null/undefined
    return email.includes('@') && email.includes('.');
  }

  // NULL SAFETY: Accessing properties without null checks
  static validateUser(user: any) {
    // NULL SAFETY VIOLATION: user could be null, user.name could be undefined
    if (user.name.length > 0 && user.age > 18) {
      return true;
    }
    return false;
  }

  // PERFORMANCE: Regex compiled on every call (should be static)
  static validatePhone(phone: string) {
    // PERFORMANCE ISSUE: New regex instance every time
    const regex = /^\d{10}$/;
    return regex.test(phone);
  }

  // PERFORMANCE: Inefficient string operations
  static validatePassword(password: string) {
    // PERFORMANCE ISSUE: Multiple string operations
    if (password.length < 8) return false;
    if (!password.includes(password.toUpperCase())) return false; // Inefficient
    if (!password.includes(password.toLowerCase())) return false; // Inefficient
    return true;
  }

  // NULL SAFETY: Nested object access without safety
  static validateAddress(address: any) {
    // NULL SAFETY VIOLATION: Deep property access without null checks
    return address.user.profile.location.city.length > 0;
  }

  // ERROR HANDLING: Generic catch and poor error handling
  static safeValidate(data: any) {
    try {
      // NULL SAFETY VIOLATION: data could be null
      return this.validateEmail(data.email) && this.validateAge(data.age);
    } catch (e: any) {
      // ERROR HANDLING: Generic catch, information disclosure
      console.log('Validation error:', e.message);
      return false;
    }
  }

  // PERFORMANCE: Unnecessary object creation
  static validateMultiple(items: any[]) {
    const results = [];
    for (const item of items) {
      // PERFORMANCE ISSUE: Creates new object each iteration
      results.push({
        item: item,
        valid: this.validateEmail(item.email),
        ageValid: this.validateAge(item.age)
      });
    }
    return results;
  }

  // NULL SAFETY: Array access without bounds checking
  static validateArrayItem(items: any[], index: number) {
    // NULL SAFETY VIOLATION: No bounds checking
    return this.validateEmail(items[index].email);
  }
}

